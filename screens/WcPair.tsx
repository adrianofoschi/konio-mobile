import { useI18n, useW3W } from "../hooks";
import Loading from "./Loading";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import { WcPairNavigationProp, WcPairRouteProp } from "../types/navigation";
import { pair, showToast } from "../actions";
import { useEffect } from "react";

export default () => {
    const navigation = useNavigation<WcPairNavigationProp>();
    const route = useRoute<WcPairRouteProp>();
    const i18n = useI18n();
    const W3W = useW3W();

    const doPair = async (uri: string) => {
        try {
            await pair(uri);
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'Root',
                            state: {
                                routes: [
                                    {
                                        name: "Account"
                                    },
                                    {
                                        name: "WalletConnect",
                                        state: {
                                            routes: [
                                                {
                                                    name: 'WcSessions'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                })
            );
        } catch (e) {
            console.log(e);
            showToast({
                type: 'error',
                text1: i18n.t('pairing_error')
            });
            navigation.goBack();
        }
    }

    useEffect(() => {
        if (W3W.get() && route.params && route.params.uri) {
            const uri = route.params.uri.replace('$','?');
            doPair(uri);
        }
    }, [W3W, route])

    return <Loading/>
}
