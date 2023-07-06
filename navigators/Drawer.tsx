import * as React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import { useCurrentAddress, useI18n, useLocker, useTheme, useWallets } from '../hooks';
import { AccountAvatar, Logo, Separator, Link, Button, Address } from '../components';
import { setCurrentWallet } from '../actions';
import Root from './Root';
import { AntDesign, Feather } from '@expo/vector-icons';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';
import { DONATION_ADDRESS } from '../lib/Constants';
import { State } from '@hookstate/core';
import Loading from '../screens/Loading';

function DrawerContent(props: any) {
    const { navigation } = props;
    const wallets = useWallets().get();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;

    if (!currentAddressOrNull) {
        return <Loading/>;
    }

    const currentWallet = wallets[currentAddressOrNull.get()];

    return (
        <DrawerContentScrollView contentContainerStyle={styles.drawerContentContainer}>

            <View>

                <View style={styles.currentWalletContainer}>
                    <AccountAvatar size={48} address={currentWallet.address} />
                    <View>
                        <Text style={styles.textTitle}>{currentWallet.name}</Text>
                        <Address address={currentWallet.address} compress={true} copiable={true} />
                    </View>
                </View>


                <Separator />

                {Object.values(wallets).map(wallet => wallet.address !== currentAddress.get() &&
                    <DrawerItem
                        key={wallet.address}
                        label={wallet.name}
                        icon={() => <AccountAvatar size={28} address={wallet.address} />}
                        onPress={() => {
                            setCurrentWallet(wallet.address);
                            navigation.navigate('Root', {
                                screen: 'Account'
                            });
                        }}
                    />
                )}

                <DrawerItem
                    label={i18n.t('add_account')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="plus" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'NewAccount'
                        });
                    }}
                />

                <Separator />

                <DrawerItem
                    label={i18n.t('settings')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="setting" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'Settings'
                        });
                    }}
                />
            </View>

            <View style={styles.drawerFooterContainer}>
                <Logo width={150} height={34} />

                <View style={styles.authorContainer}>
                    <Text style={styles.textVersion}>v{Constants.manifest?.version}</Text>
                    <Link text="https://konio.io" onPress={() => Linking.openURL('https://konio.io')} />
                </View>

                <View style={styles.donateContainer}>
                    <Button
                        title={i18n.t('donate')}
                        icon={<Feather name="heart" />}
                        onPress={() => {
                            navigation.navigate('Root', {
                                screen: 'Account',
                                params: {
                                    screen: 'Withdraw',
                                    params: {
                                        screen: 'WithdrawAmount',
                                        params: {
                                            to: DONATION_ADDRESS
                                        }
                                    }
                                }
                            });
                        }}
                    />
                </View>
            </View>

        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

export default () => {
    useLocker({ key: 'app', initialValue: true });

    return (
        <Drawer.Navigator
            useLegacyImplementation
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false

            }}
        >
            <Drawer.Screen name="Root" component={Root} />
        </Drawer.Navigator>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        drawerContentContainer: {
            flex: 1,
            justifyContent: 'space-between'
        },
        drawerFooterContainer: {
            marginBottom: Spacing.base,
            alignItems: 'center',
            rowGap: Spacing.base
        },
        authorContainer: {
            rowGap: Spacing.small,
            justifyContent: 'center'
        },
        textVersion: {
            ...theme.styles.textCenter,
            ...theme.styles.text,
            fontWeight: 'bold'
        },
        donateContainer: {
            width: '100%',
            padding: Spacing.base
        },
        drawerIconContainer: {
            alignItems: 'center',
            width: 28
        },
        currentWalletContainer: {
            padding: Spacing.base,
            flexDirection: 'row',
            columnGap: Spacing.base,
            alignItems: 'center'
        }
    });
};