import * as Clipboard from 'expo-clipboard';
import { ReactElement } from 'react';
import { Pressable } from 'react-native';
import { showToast } from '../actions';
import { useI18n } from '../hooks';

export default (props: {
    copy: string
    children: ReactElement
}) => {
    const i18n = useI18n();
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.copy);
        showToast({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    };

    return (
        <Pressable onPress={copyToClipboard}>
            {props.children}
        </Pressable>
    )
}