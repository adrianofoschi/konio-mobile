import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentAccount, showToast, logError, importAccount } from '../actions';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen, TextInputActionPaste } from '../components';
import { useI18n, useTheme } from '../hooks';
import { View } from 'react-native';
import { EncryptedStore } from '../stores';
import { MAX_ACCOUNT } from '../lib/Constants';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const name = useHookstate('');
    const privateKey = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const accounts = EncryptedStore.accounts;

    const _import = () => {
        if (Object.keys(accounts).length >= MAX_ACCOUNT) {
            showToast({
                type: 'error',
                text1: i18n.t('max_accounts_reached', {max: MAX_ACCOUNT})
            });
            return;
        }

        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name')
            });
            return;
        }

        importAccount({
            name: name.get().trim(),
            privateKey: privateKey.get().trim()
        })
            .then(address => {
                setCurrentAccount(address);
                navigation.goBack();
            })
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('unable_to_add_account'),
                    text2: i18n.t('check_logs')
                });
            });

    };

    return (
        <Screen>
            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => name.set(text)}
                />
                 <TextInput
                    multiline={true}
                    value={privateKey.get()}
                    numberOfLines={4}
                    placeholder={i18n.t('private_key')}
                    onChangeText={(text: string) => privateKey.set(text)}
                    actions={(
                        <TextInputActionPaste state={privateKey} />
                    )}
                />
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('import_account')}
                    onPress={() => _import()}
                    icon={<Feather name="download" />}
                />
            </View>
        </Screen>
    );
}