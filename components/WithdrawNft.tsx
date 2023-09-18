import { Button} from '../components';
import { ScrollView, View } from "react-native";
import { useCurrentAddress, useCurrentNetworkId, useI18n, useLockState, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import { Feather } from '@expo/vector-icons';
import AssetNftInput from '../components/AssetNftInput';
import { askReview, hideSpinner, lock, logError, showSpinner, showToast, withdrawNft, withdrawNftConfirm } from '../actions';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WithdrawAssetNavigationProp } from '../types/navigation';

export default (props: {
    nft?: {
        contractId: string,
        tokenId: string
    }
}) => {
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    const currentAddress = useCurrentAddress();
    const currentNetworkId = useCurrentNetworkId();
    const i18n = useI18n();
    const theme = useTheme();
    const [to, setTo] = useState<string|undefined>();
    const [nft, setNft] = useState(props.nft);
    const lockState = useLockState();
    const [sendRequest, setSendRequest] = useState(false);

    useEffect(() => {
        _reset();
    }, [currentAddress, currentNetworkId]);

    useEffect(() => {
        if (lockState.get() === false && sendRequest === true) {
            _send();
        }
    }, [lockState]);

    const _reset = () => {
        setTo(undefined);
        setNft(undefined);
    }

    const _confirm = () => {
        lock();
        setSendRequest(true);
    };

    const _send = () => {
        if (!to || !nft?.contractId || !nft?.tokenId) {
            return;
        }

        showSpinner();

        withdrawNft({
            contractId: nft.contractId,
            tokenId: nft.tokenId,
            to
        })
        .then(() => {
            //withdraw confirmation
            withdrawNftConfirm({
                contractId: nft.contractId,
                tokenId: nft.tokenId,
                to
            }).then(() => {
                hideSpinner();
                navigation.goBack();

                showToast({
                    type: 'success',
                    text1: i18n.t('transaction_confirmed'),
                });
                askReview();
            })
            .catch(e => {
                hideSpinner();
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('nft_transfer_failed'),
                    text2: i18n.t('check_logs')
                });
            });
        })
        .catch(e => {
            hideSpinner();
            logError(e);
            showToast({
                type: 'error',
                text1: i18n.t('nft_transfer_failed'),
                text2: i18n.t('check_logs')
            });  
        });
    }

    
    return (
        <View style={{ flex: 1, ...theme.styles.paddingBase }}>
            <ScrollView contentContainerStyle={theme.styles.rowGapBase}>
                <RecipientInput
                    value={to}
                    onChange={(address: string) => setTo(address)}
                />
         

                    <AssetNftInput
                        value={nft}
                        onChange={(value: any) => setNft({
                            tokenId: value.tokenId,
                            contractId: value.contractId
                        })}
                        opened={to !== undefined}
                    />
                
            </ScrollView>

            {
                to && nft &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }
        </View>
    );
}