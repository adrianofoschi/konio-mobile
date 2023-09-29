import { State, hookstate } from "@hookstate/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { DEFAULT_NETWORK, OS_LOCALE, OS_THEME } from "../lib/Constants";
import * as StoreReview from 'expo-store-review';
import type { SettingState, ISettingActions } from "../types/store";
import { getStore } from "./registry";

export const SETTING_STORE_DEFAULT = {
    currentNetworkId: DEFAULT_NETWORK,
    currentAccountId: '',
    locale: OS_LOCALE,
    theme: OS_THEME,
    biometric: false,
    autolock: -1,
    rcLimit: '95',
    version: '20230908',
    askReview: false
};

const state : State<SettingState> = hookstate<SettingState>(
    SETTING_STORE_DEFAULT,
    localstored({
        key: 'setting',
        engine: AsyncStorage
    })
);

const actions : ISettingActions = {
    setCurrentAccount: (accountId: string) => {
        state.currentAccountId.set(accountId);
        getStore('Coin').actions.refreshCoins({balance: true, price: true});
        getStore('Mana').actions.refreshMana();
    },
    
    setCurrentNetwork: (networkId: string) => {
        state.currentNetworkId.set(networkId);
        getStore('Coin').actions.refreshCoins({balance: true, price: true});
        getStore('Mana').actions.refreshMana();
    },
    
    setLocale: (locale: string) => {
        state.locale.set(locale);
    },
    
    setTheme: (theme: string) => {
        state.theme.set(theme);
    },
    
    setBiometric: (value: boolean) => {
        state.biometric.set(value);
    },
    
    setAutolock: (autolock: number) => {
        state.autolock.set(autolock);
    },
    
    showAskReview: async () => {
        if (state.askReview.get() === false) {
            if (await StoreReview.hasAction()) {
                StoreReview.requestReview()
                .then(() => state.askReview.set(true))
                .catch(e => {
                    getStore('Log').actions.logError(e);
                    state.askReview.set(true)
                });
            }
        }
    },
    
    setRcLimit: (value: string) => {
        state.rcLimit.set(value);
    },
}

export default {
    state,
    actions
};