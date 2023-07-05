import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { AccountStackParamList } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import Account from '../screens/Account';
import NewCoin from '../screens/NewCoin';
import Coin from '../screens/Coin';

const Stack = createStackNavigator<AccountStackParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { FontFamily, Color, Border } = theme.vars;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.base,
          borderBottomColor: Border.color,
          borderBottomWidth: Border.width
        },
        headerTitleStyle: {
          fontFamily: FontFamily.sans,
          color: Color.baseContrast
        },
        headerTintColor: Color.primary
      }}>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          header: () => (<View />),
          title: i18n.t('wallet')
        }}
      />
      <Stack.Screen
        name="NewCoin"
        component={NewCoin}
        options={{
          title: i18n.t('add_coin')
        }}
      />
      <Stack.Screen
        name="Coin"
        component={Coin}
        options={() => {
          return {
            title: i18n.t('coin')
          }
        }}
      />
    </Stack.Navigator>
  );
}
