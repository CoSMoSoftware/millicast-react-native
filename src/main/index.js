import React from 'react'

import { viewerRenderer } from '../viewer'
import { broadcastRenderer } from '../broadcast'
import { stateRenderer } from '../render/state'

import {
  getUserMedia // eslint-disable-line import/named
} from 'react-native-webrtc'

import {
  Text,
  View,
  TouchableHighlight
} from 'react-native'

import { styles } from './styles'

export const mainRenderer = config => {
  const renderViewer = viewerRenderer(config)

  const renderMain = (state, setState) => {
    const renderer = state.get('renderer')
    if (renderer) return renderer()

    const buttonDisabled = state.get('loading')

    const publishPressed = async () => {
      setState({ loading: true })

      const mediaStream = await getUserMedia({
        audio: true,
        video: {
          facingMode: {
            exact: 'user'
          }
        }
      })

      const renderBroadcast = broadcastRenderer(config, mediaStream)

      setState({ renderer: renderBroadcast })
    }

    return (
      <View style={ styles.container }>
        <Text style={ styles.title }>
          Millicast Mobile Demo
        </Text>
        <Text style={ styles.description }>
          Select demo mode:
        </Text>
        <View style={ styles.selections }>
          <TouchableHighlight
            disabled = { buttonDisabled }
            style = { styles.button }
            onPress={ publishPressed }>
            <Text style={ styles.buttonText }>Publish</Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled = { buttonDisabled }
            style = { styles.button }
            onPress={ () => setState({ renderer: renderViewer }) }>
            <Text style={ styles.buttonText }>Viewer</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  return stateRenderer({
    loading: false,
    renderer: null
  }, renderMain)
}
