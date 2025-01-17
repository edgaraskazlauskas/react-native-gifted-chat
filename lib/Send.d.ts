import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
export interface SendProps {
    text?: string;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    alwaysShowSend?: boolean;
    disabled?: boolean;
    sendButtonProps?: Partial<TouchableOpacityProps>;
    onSend?(): void;
}
export default class Send extends Component<SendProps> {
    static defaultProps: {
        text: string;
        onSend: () => void;
        label: string;
        containerStyle: {};
        textStyle: {};
        children: null;
        alwaysShowSend: boolean;
        disabled: boolean;
        sendButtonProps: null;
    };
    static propTypes: {
        text: PropTypes.Requireable<string>;
        onSend: PropTypes.Requireable<(...args: any[]) => any>;
        label: PropTypes.Requireable<string>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        textStyle: PropTypes.Requireable<any>;
        children: PropTypes.Requireable<PropTypes.ReactElementLike>;
        alwaysShowSend: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        sendButtonProps: PropTypes.Requireable<object>;
    };
    render(): JSX.Element;
}
