import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  ViewPropTypes,
  EmitterSubscription,
  StyleProp,
  ViewStyle,
} from 'react-native'

import Composer from './Composer'
import Send from './Send'
import Actions from './Actions'
import Color from './Color'
import { IMessage } from './types'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
})

export interface InputToolbarProps<TMessage extends IMessage> {
  text?: string
  onSend?: (message: Partial<TMessage>, resetInputToolbar?: boolean) => void
  sendOnEnter?: boolean
  options?: { [key: string]: any }
  optionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  renderActions?(props: Actions['props']): React.ReactNode
  renderSend?(props: Send['props']): React.ReactNode
  renderComposer?(props: Composer['props']): React.ReactNode
  onPressActionButton?(): void
}

export default class InputToolbar<
  TMessage extends IMessage = IMessage
> extends React.Component<InputToolbarProps<TMessage>, { position: string }> {
  static defaultProps = {
    renderAccessory: null,
    renderActions: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    onPressActionButton: () => {},
  }

  static propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    primaryStyle: ViewPropTypes.style,
    accessoryStyle: ViewPropTypes.style,
  }

  state = {
    position: 'absolute',
  }

  keyboardWillShowListener?: EmitterSubscription = undefined
  keyboardWillHideListener?: EmitterSubscription = undefined

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    )
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    )
  }

  componentWillUnmount() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove()
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove()
    }
  }

  keyboardWillShow = () => {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      })
    }
  }

  keyboardWillHide = () => {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      })
    }
  }

  renderActions() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderActions) {
      return this.props.renderActions(props)
    } else if (this.props.onPressActionButton) {
      return <Actions {...props} />
    }
    return null
  }

  handleSendRequested = () => {
    const { text, onSend } = this.props
    if (text && onSend) {
      const message = { text: text.trim() }
      onSend(message as TMessage, true)
    }
  }

  renderSend() {
    const props = {
      ...this.props,
      onSend: this.handleSendRequested,
    }
    if (this.props.renderSend) {
      return this.props.renderSend(props)
    }
    return <Send {...props} />
  }

  renderComposer() {
    const props = {
      ...this.props,
      onSend: this.handleSendRequested,
    }
    if (this.props.renderComposer) {
      return this.props.renderComposer(props)
    }

    return <Composer {...props} />
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View
        style={
          [
            styles.container,
            { position: this.state.position },
            this.props.containerStyle,
          ] as ViewStyle
        }
      >
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    )
  }
}
