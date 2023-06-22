import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinNavigationProp, CoinRouteProp } from '../types/navigation';
import type { Theme } from '../types/store';
import { Button, TransactionList, Address } from '../components';
import { useCoin, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { setWithdrawContractId } from '../actions';

export default () => {
    const navigation = useNavigation<CoinNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const walletCoin = useCoin(route.params.contractId);
    const coin = walletCoin.get();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>

                <View style={styles.headerContent}>
                    <View>
                        <Text style={{ ...styles.textTitle, ...styles.textCenter }}>{coin.symbol}</Text>
                        <Address address={coin.contractId} />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Button
                            style={{ flex: 1 }}
                            title="Send"
                            onPress={() => {
                                setWithdrawContractId(route.params.contractId);
                                navigation.navigate('Withdraw', {
                                    screen: 'SelectRecipient'
                                });
                            }}
                            icon={<Feather name="arrow-up-right" />}
                        />
                        <Button
                            style={{ flex: 1 }}
                            title="Receive"
                            onPress={() => navigation.push('Deposit')}
                            icon={<Feather name="arrow-down-right" />}
                            type='secondary'
                        />
                    </View>
                </View>

            </View>

            <TransactionList contractId={route.params.contractId} />

        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        wrapper: {
            flex: 1,
            backgroundColor: Color.base
        },
        header: {
            height: 170,
            borderBottomWidth: Border.width,
            borderBottomColor: Border.color,
            backgroundColor: Color.base,
            alignItems: 'center',
            justifyContent: 'center',

        },
        headerContent: {
            width: 300,
            rowGap: Spacing.base
        },
        buttonsContainer: {
            height: 40,
            flexDirection: 'row',
            columnGap: Spacing.base
        }
    });
}