import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewNetworkNavigationProp } from '../types/navigation';
import { addNetwork, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, Wrapper } from '../components';
import { useI18n } from '../hooks';
import { View, Alert } from 'react-native';
import { UserStore } from '../stores';
import { useTheme } from '../hooks';
import type { Network } from '../types/store';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import { ScrollView } from 'react-native-gesture-handler';

export default () => {
  const DEFAULT_NETWORK = Object.values(DEFAULT_NETWORKS)[0];
  const navigation = useNavigation<NewNetworkNavigationProp>();
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const name = useHookstate('');
  const chainId = useHookstate('');
  const rpcNode = useHookstate('');
  const explorer = useHookstate('');
  const KOIN = useHookstate('');
  const MANA = useHookstate('');
  const VHP = useHookstate('');

  const showAlert = () => {
    return Alert.alert(
      i18n.t('are_you_sure'),
      i18n.t('are_you_sure_replace_network'),
      [
        {
          text: i18n.t('yes'),
          onPress: () => add(true)
        },
        {
          text: i18n.t('no'),
        },
      ]
    );
  };

  const add = (replace = false) => {
    if (!name.get() || !chainId.get() || !rpcNode.get() || !explorer.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_data')
      });
      return;
    }

    if (UserStore.networks[chainId.get()].get() && replace === false) {
      showAlert();
      return;
    }

    const network: Network = {
      name: name.get(),
      chainId: chainId.get(),
      rpcNodes: [rpcNode.get()],
      coins: { //ToDo fetch from blockchain
        KOIN: { ...DEFAULT_NETWORK.coins.KOIN, contractId: KOIN.get() },
        MANA: { ...DEFAULT_NETWORK.coins.MANA, contractId: MANA.get() },
        VHP: { ...DEFAULT_NETWORK.coins.VHP, contractId: VHP.get() }
      },
      explorer: explorer.get()
    };

    addNetwork(network);
    navigation.navigate('ChangeNetwork')
  };

  const reset = () => {
    name.set(DEFAULT_NETWORK.name);
    chainId.set(DEFAULT_NETWORK.chainId);
    rpcNode.set(DEFAULT_NETWORK.rpcNodes[0]);
    explorer.set(DEFAULT_NETWORK.explorer);
    KOIN.set(DEFAULT_NETWORK.coins.KOIN.contractId);
    MANA.set(DEFAULT_NETWORK.coins.MANA.contractId);
    VHP.set(DEFAULT_NETWORK.coins.VHP.contractId);
  };

  return (
    <Screen>
      
        <ScrollView contentContainerStyle={{...styles.paddingBase, ...styles.rowGapBase}}>
          
            <TextInput
              autoFocus={true}
              value={name.get()}
              onChangeText={(v: string) => name.set(v)}
              placeholder={i18n.t('name')}
              note={`Ex: ${DEFAULT_NETWORK.name}`}
            />
          
            <TextInput
              value={chainId.get()}
              onChangeText={(v: string) => chainId.set(v)}
              placeholder={'chain id'}
              note={`Ex: ${DEFAULT_NETWORK.chainId}`}
            />
          
            <TextInput
              value={rpcNode.get()}
              onChangeText={(v: string) => rpcNode.set(v)}
              placeholder={'rpc node'}
              note={`Ex: ${DEFAULT_NETWORK.rpcNodes[0]}`}
            />

            <TextInput
              value={explorer.get()}
              onChangeText={(v: string) => explorer.set(v)}
              placeholder={'explorer'}
              note={`Ex: ${DEFAULT_NETWORK.explorer}`}
            />

            <TextInput
              value={KOIN.get()}
              onChangeText={(v: string) => KOIN.set(v)}
              placeholder={'KOIN contract ID'}
              note={`Ex: ${DEFAULT_NETWORK.coins.KOIN.contractId}`}
            />

            <TextInput
              value={MANA.get()}
              onChangeText={(v: string) => MANA.set(v)}
              placeholder={'MANA contract ID'}
              note={`Ex: ${DEFAULT_NETWORK.coins.MANA.contractId}`}
            />

            <TextInput
              value={VHP.get()}
              onChangeText={(v: string) => VHP.set(v)}
              placeholder={'VHP contract ID'}
              note={`Ex: ${DEFAULT_NETWORK.coins.VHP.contractId}`}
            />

        </ScrollView>
        
        <View style={{...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase}}>
          <Button
            type='secondary'
            style={{ flex: 1 }}
            title={i18n.t('default')}
            onPress={() => reset()}
            icon={<Feather name="refresh-cw" />}
          />
          <Button
            style={{ flex: 1 }}
            title={i18n.t('add_network')}
            onPress={() => add()}
            icon={<Feather name="plus" />}
          />
        </View>

    </Screen>
  );
}