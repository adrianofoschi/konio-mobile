import { View, Share, ScrollView } from "react-native";
import { Button, Screen, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useStore } from "../stores";
import { useHookstate } from "@hookstate/core";

export default () => {
    const { Log } = useStore();
    const logs = useHookstate(Log.state).get();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const share = async () => {
        await Share.share({
            message: logs.join('\n')
        });
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={{...styles.paddingBase, ...styles.rowGapSmall}}>
            {
                logs.map(item => 
                    <View key={item.split('|')[0]}>
                    <Text>{item}</Text>
                    </View>
                )
            }
            </ScrollView>

            <View style={{...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase}}>
                <Button style={styles.flex1} type="secondary" title={i18n.t('share')} onPress={share}/>
                <Button style={styles.flex1} title={i18n.t('reset')} onPress={Log.actions.logReset}/>
            </View>
        </Screen>
    );
}