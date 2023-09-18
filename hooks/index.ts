import { useHookstate } from "@hookstate/core";
import { UserStore, EncryptedStore, LockStore, WCStore, KapStore, SpinnerStore, ManaStore } from "../stores";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { useEffect, useState } from "react";
import { selectAccount, selectAccounts, selectAddressBook, selectCoin, selectCoinTransaction, selectCoinTransactions, selectCoins, selectContact, selectCurrentAddress, selectCurrentNetworkId, selectKap, selectNetwork, selectNetworks, selectNft, selectNftCollection, selectNfts } from "../selectors";
import { NFT } from "../types/store";


export const useCurrentNetworkIdState = () => {
    return useHookstate( selectCurrentNetworkId() );
}

export const useCurrentAddressState = () => {
    return useHookstate( selectCurrentAddress() );
}

export const useCurrentNetworkId = () => {
    return useHookstate( selectCurrentNetworkId() ).get();
}

export const useCurrentAddress = () => {
    return useHookstate( selectCurrentAddress() ).get();
}

/**
 * Networks
 */
export const useNetworks = () => {
    const networks = useHookstate( selectNetworks() );
    return networks?.ornull ? Object.values(networks.get()) : [];
}

export const useNetwork = (networkId: string) => {
    const network = useHookstate( selectNetwork(networkId) );
    return network?.ornull ? network.get() : undefined;
}

/**
 * Accounts
 */
export const useAccounts = () => {
    const accounts = useHookstate( selectAccounts() );
    return accounts?.ornull ? Object.values(accounts.get()) : [];
}

export const useAccount = (address: string) => {
    const account = useHookstate( selectAccount(address) );
    return account?.ornull ? account.get() : undefined;
}

/**
 * Current account coins
 * @returns 
 */
export const useCoins = () => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const coins = useHookstate(
        selectCoins({
            address: currentAddress.get(),
            networkId: currentNetworkId.get()
        })
    );

    return coins?.ornull ? Object.values(coins.get()) : [];
}

export const useCoin = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const coin = useHookstate(
        selectCoin({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return coin?.ornull ? coin.get() : undefined;
}

export const useCoinBalance = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const balance = useHookstate(
        selectCoin({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        }).balance
    );

    return balance?.ornull ? balance.get() : undefined;
}

/**
 * Current account/network/coin transactions
 * @param contractId 
 * @returns 
 */
export const useTransactions = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const transactions = useHookstate(
        selectCoinTransactions({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return transactions?.ornull ? Object.values(transactions.get()) : [];
}

export const useTransaction = (args: {contractId: string, transactionId: string}) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const transaction = useHookstate(
        selectCoinTransaction({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId: args.contractId,
            transactionId: args.transactionId
        })
    );

    return transaction?.ornull ? transaction.get() : undefined;
}

/**
 * Current account nfts
 * @returns 
 */
export const useNftCollections = () => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nftCollections = useHookstate(
        selectNfts({
            address: currentAddress.get(),
            networkId: currentNetworkId.get()
        })
    );

    return nftCollections?.ornull ? Object.values(nftCollections.get()) : [];
}

export const useNftCollection = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nftCollection = useHookstate(
        selectNftCollection({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return nftCollection?.ornull ? nftCollection.get() : undefined;
}

export const useNft = (args: {contractId: string, tokenId: string}) => {
    const { contractId, tokenId } = args;
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nft = 
        selectNft({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId,
            tokenId
        })
    

    const [value, setValue] = useState<NFT|undefined>(undefined);

    useEffect(() => {
        if (nft) {
            setValue(nft.get())
        } else {
            setValue(undefined);
        }
    }, [currentAddress, currentNetworkId, nft])

    return value;
}

export const useAddressbook = () => {
    const addressbook = useHookstate( selectAddressBook() );
    return addressbook?.ornull ? Object.values(addressbook.get()) : [];
}

export const useContact = (address: string) => {
    const contact = useHookstate( selectContact(address) );
    return contact?.ornull ? contact.get() : undefined;
}

export const useTheme = () => {
    const storeTheme = useHookstate(UserStore.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

export const useCurrentSeed = () => {
    return Object.values(EncryptedStore.accounts).filter(w => w.seed.get() !== undefined)[0].seed.get();
}

const i18n = new I18n(Locales);
export const useI18n = () => {
    let currentLocale = useHookstate(UserStore.locale).get();
    if (currentLocale === OS_LOCALE) {
        const systemLocale = getLocales()[0].languageCode;
        currentLocale = Object.keys(Locales).includes(systemLocale) ?
            systemLocale :
            FALLBACK_LOCALE;
    }

    if (i18n.locale !== currentLocale) {
        i18n.locale = currentLocale;
    }

    return i18n;
}

export const useBiometric = () => {
    return useHookstate(UserStore.biometric).get();
}

export const useCurrentKoin = () => {
    const currentNetwork = useHookstate(UserStore.currentNetworkId);
    return UserStore.networks[currentNetwork.get()].koinContractId.get();
}

export const useAutolock = () => {
    return useHookstate(UserStore.autolock).get();
}

export const useRcLimit = () => {
    return useHookstate(UserStore.rcLimit).get();
}

export const useAppState = () => {
    const appState = useHookstate('active');

    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                appState.set(nextAppState);
            },
        );

        return () => {
            appStateListener?.remove();
        };
    }, []);

    return appState.get();
}

export const useWC = () => {
    return useHookstate(WCStore).get({noproxy: true});
}

export const useLogs = () => {
    return useHookstate(UserStore.logs).get();
}

export const useLockState = () => {
    return useHookstate(LockStore);
}

export const useKapAddress = (address: string) => {
    const name = useHookstate(selectKap(address));
    return name?.ornull ? name.get() : undefined;
}

export const useKapName = (name: string) => {
    const store = useHookstate(KapStore);
    const address = useHookstate('');
    let foundAddress = '';

    for (const addr in store.get()) {
        if (store[addr].get() === name) {
            foundAddress = addr;
            break;
        }
    }
    address.set(foundAddress);

    return address?.ornull ? address.get() : undefined;
}


export const useAccountValue = () => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    const coins = useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].coins);
    const total = useHookstate(0);

    useEffect(() => {
        total.set(0);
        if (coins.get()) {
            for (const contractId in coins) {
                const balance = coins[contractId].balance.get();
                const price = coins[contractId].price.get();
    
                if (balance && price) {
                    total.set(total.get() + balance * price);
                }
            }
        }
    }, [currentAddress, currentNetworkId, coins]);

    return total.get();
}

export const useSpinner = () => {
    return useHookstate(SpinnerStore).get();
}

export const useLocale = () => {
    return useHookstate(UserStore.locale).get();
}

export const useMana = () => {
    return useHookstate(ManaStore).get();
}