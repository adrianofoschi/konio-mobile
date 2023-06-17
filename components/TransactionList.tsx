import { FlatList, TouchableHighlight, Linking, View, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';; 
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS } from '../lib/Constants';
import { useCoinTransactions, useCurrentNetworkId, useTransaction, useTheme, useNetwork } from '../hooks';
import { UserStore } from '../stores';
import ActivityIndicator from './ActivityIndicator';
import Text from './Text';
import type { Theme } from '../types/store';
import i18n from '../locales';

export default (props: {
    contractId: string
}) => {

    const transactions = useCoinTransactions(props.contractId);
    const theme = useTheme().get();
    const styles = theme.styles;

    return (
        <FlatList
            data={transactions.get().map(t => t.transactionId)}
            renderItem={({ item }) => <TransactionListItem transactionId={item}/>}
            ItemSeparatorComponent={() => {
                return <View style={styles.separator}/>
            }}
        />
    );
}

export const TransactionListItem = (props: {
    transactionId: string,
}) => {

    const transaction = useTransaction(props.transactionId).get();
    const coin = UserStore.coins[transaction.contractId].get();
    const currentNetworkId = useCurrentNetworkId().get();
    const network = useNetwork(currentNetworkId).get();
    
    const date = new Date(transaction.timestamp).toLocaleDateString();
    const time = new Date(transaction.timestamp).toLocaleTimeString();
    const openTransactionLink = () => {
        Linking.openURL(`${network.explorer}/tx/${props.transactionId}`);
    };

    const theme = useTheme().get();
    const { Color, Spacing } = theme.vars;
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={openTransactionLink}>
            <View style={styles.transactionItemContainer}>
                <Text style={styles.textSmall}>{date} {time}</Text>
                <View style={styles.transactionItemContainerInternal}>

                    <View style={{flexDirection: 'row', columnGap: Spacing.small}}>
                        { transaction.status === TRANSACTION_STATUS_PENDING && 
                            <ActivityIndicator/> 
                        }
                        { transaction.status === TRANSACTION_STATUS_SUCCESS && 
                            <TypeIcon type={transaction.type}/> 
                        }
                        { transaction.status === TRANSACTION_STATUS_ERROR && 
                            <AntDesign name="warning" size={24} color={Color.warning}/>
                        }

                        <View>
                        <Text>{i18n.t(transaction.type.toLowerCase())}</Text>
                        <Text style={{...styles.textSmall}}>{transaction.note}</Text>
                        </View>
                        
                    </View>
                    
                    <Text>{transaction.value} {coin.symbol}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const TypeIcon = (props: {
    type: string
}) => {

    const theme = useTheme().get();
    const { Color } = theme.vars;

    switch (props.type) {
        case 'SWAP':
            return <AntDesign name="swap" size={24} color={Color.baseContrast} />
        case 'DEPOSIT':
            return <Feather name="arrow-down-right" size={24} color={Color.baseContrast} />
        case 'WITHDRAW':
            return <Feather name="arrow-up-right" size={24} color={Color.baseContrast} />
        default:
            return <AntDesign name="question" size={24} color={Color.baseContrast} />
    }
}

const createStyles = (theme : Theme) => {
    const { Spacing, Color } = theme.vars;
    
    return StyleSheet.create({
        ...theme.styles,
        transactionItemContainer: {
            padding: Spacing.base,
            backgroundColor: Color.base,
            rowGap: Spacing.small
        },
        transactionItemContainerInternal: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        addMoreContainer: {
            alignItems: 'center',
            padding: Spacing.base
        },
    })
}