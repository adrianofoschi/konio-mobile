import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useI18n, useTheme } from "../hooks";
import NftListItem from "./NftListItem";
import { SettingStore, NftCollectionStore, NftStore } from "../stores";
import { Nft, NftCollection } from "../types/store";
import { useState } from "react";

export default (props: SheetProps<{ 
    nftId?: string 
}>) => {
    const [nftId, setNftId] = useState(props.payload?.nftId ?? '');
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;

    const currentAccountId = SettingStore.state.currentAccountId.get();
    const currentNetworkId = SettingStore.state.currentNetworkId.get();
    const nftCollections = NftCollectionStore.state.get();

    const data = Object.values(nftCollections).filter(nft => 
        nft.networkId === currentNetworkId &&
        nft.accountId === currentAccountId
    );

    const _select = (data: any) => {
        setNftId(data.nftId);
    }

    const _confirm = () => {
        if (nftId) {
            const payload = { nftId };
            SheetManager.hide(props.sheetId, { payload });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
            closable={true}
            closeOnTouchBackdrop={true}
            containerStyle={{ ...theme.styles.paddingBase, ...theme.styles.rowGapMedium }}
        >
            {
                (data.length === 0) &&

                <View style={styles.alignCenterColumn}>
                    <Text>{i18n.t('no_assets')}</Text>
                </View>
            }

            {
                data.length > 0 &&
                <ScrollView>
                    {
                        data.map(collection =>

                            <NftCollectionListItem
                                key={collection.id}
                                nftCollection={collection}
                                renderItem={
                                    (item: Nft) =>
                                        <TouchableOpacity key={item.id} onPress={() => _select({ nftId: item.id })}>
                                            <NftListItem
                                                nft={item}
                                                selected={item.id === nftId}
                                            />
                                        </TouchableOpacity>
                                }
                            />
                        )
                    }
                </ScrollView>
            }

            {
                data.length > 0 &&
                <Button title={i18n.t('confirm')} onPress={() => _confirm()} />
            }

        </ActionSheet>
    );
}

const NftCollectionListItem = (props: {
    nftCollection: NftCollection,
    renderItem: Function
  }) => {
    const { styles } = useTheme();
    const nfts = NftStore.state.get();
    const data = Object.values(nfts).filter(nft => nft.nftCollectionId === props.nftCollection.id);
  
    return (
      <View style={{
        width: 330,
        ...styles.rowGapSmall
      }}>
        <Text style={{ ...styles.textMedium, ...styles.textBold }}>
          {props.nftCollection.name}
        </Text>
  
        <View style={{
          ...styles.directionRow,
          ...styles.columnGapBase,
          ...styles.rowGapBase,
          flexWrap: 'wrap'
        }}>
          {
            data.map(nft => props.renderItem(nft))
          }
        </View>
      </View>
    )
  }