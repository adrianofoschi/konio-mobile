import { useHookstate } from '@hookstate/core';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NewContactNavigationProp, NewContactRouteProp } from '../types/navigation';
import { addContact, refreshKap, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n, useKapAddress, useKapName } from '../hooks';
import { Alert, View } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';
import { isASCIIString } from '../lib/utils';

export default () => {
    const navigation = useNavigation<NewContactNavigationProp>();
    const route = useRoute<NewContactRouteProp>();
    const address = useHookstate(route.params.address ?? '');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const addressLoading = useHookstate(false);
    const kapAddress = useKapName(address.get());
    const kapName = useKapAddress(address.get());

    const add = () => {
        const addr = address.get().includes('.') ? 
            kapAddress :
            address;

        if (!addr.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_address')
            });
            return;
        }

        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_name')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(addr.get());
            if (!check) {
                throw "Invalid address";
            }
        } catch (e) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_address')
            });
            return;
        }

        addContact({
            address: addr.get(),
            name: name.get()
        });

        navigation.navigate("WithdrawAsset", {
            to: addr.get()
        })
    };

    const onAddressStopWriting = () => {
        if (address.get()) {
            if (!isASCIIString(address.get())) {
                Alert.alert(i18n.t('warning'), i18n.t('homograph_attack_warning'), [
                    { text: i18n.t('ok'), onPress: loadKap },
                ]);
            } else {
                loadKap();
            }
        }
    };

    const loadKap = async () => {
        addressLoading.set(true);
        try {
            await refreshKap(address.get());
            addressLoading.set(false);
        } catch (e) {
            addressLoading.set(false);
        }
    };

    return (
        <Screen keyboardDismiss={true}>
            <View style={{ ...styles.flex1, ...styles.paddingBase, ...styles.rowGapMedium }}>

                <View style={styles.rowGapSmall}>
                    <TextInput
                        autoFocus={true}
                        value={name.get()}
                        onChangeText={(v: string) => name.set(v.trim())}
                        placeholder={i18n.t('name')}
                    />
                </View>
                <View style={styles.rowGapSmall}>
                    <TextInput
                        value={address.get()}
                        onChangeText={(v: string) => address.set(v.trim())}
                        placeholder={i18n.t('address')}
                        loading={addressLoading.get()}
                        onStopWriting={onAddressStopWriting}
                        note={kapName.get() || kapAddress.get()}
                    />
                </View>

            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('add_contact')}
                    onPress={() => add()}
                    icon={<Feather name="plus" />}
                />
            </View>
        </Screen>
    );
}