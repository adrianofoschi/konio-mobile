import { Text, TextInput, Button, Wrapper, Screen, Switch } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useBiometric, useI18n, useTheme } from '../hooks';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from "expo-local-authentication";
import Toast from 'react-native-toast-message';
import { useStore } from '../stores';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const [password, setPwd] = useState('');
    const [passwordConfirm, setPwdConfirm] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const biometric = useBiometric();

    const [biometricSupport, setBiometricSupport] = useState(false);
    const [fingerprint, setFingerprint] = useState(false);
    const { Secure, Setting } = useStore();

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setBiometricSupport(compatible);
            const enroll = await LocalAuthentication.isEnrolledAsync();
            if (enroll) {
                setFingerprint(true);
            }
        })();
    }, []);

    const savePassword = () => {
        if (!password) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_password'),
            });
            return;
        }

        if ((password !== passwordConfirm)) {
            Toast.show({
                type: 'error',
                text1: i18n.t('password_not_match'),
            });
            return;
        }

        Secure.actions.setPassword(password);
        navigation.navigate("NewWallet");
    }

    return (
        <Screen keyboardDismiss={true}>

            <Wrapper>
                <Text>{i18n.t('choose_password_desc')}</Text>

                <TextInput
                    autoFocus={true}
                    value={password}
                    onChangeText={(v: string) => setPwd(v.trim())}
                    placeholder={i18n.t('password')}
                    secureTextEntry={true}
                />

                <TextInput
                    value={passwordConfirm}
                    onChangeText={(v: string) => setPwdConfirm(v.trim())}
                    placeholder={i18n.t('confirm_password')}
                    secureTextEntry={true}
                />

                {biometricSupport === true && fingerprint === true &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                        <View style={{ flexGrow: 1 }}>
                            <Text>{i18n.t('biometric_unlock')}</Text>
                            <Text style={styles.textSmall}>{i18n.t('enable_biometric_unlock')}</Text>
                        </View>


                        <Switch
                            onValueChange={() => Setting.actions.setBiometric(!biometric)}
                            value={biometric}
                        />

                    </View>
                }
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('set_password')}
                    icon={<Feather name="arrow-right" />}
                    onPress={savePassword}
                />
            </View>

        </Screen>
    )
}