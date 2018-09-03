import React from 'react'

import { viewerRenderer } from '../viewer'
import { broadcastRenderer } from '../broadcast'
import { stateRenderer } from '../render/state'

import {
  Text,
  View,
  Button,
  TouchableHighlight
} from 'react-native'

import { styles } from './styles'

export const mainRenderer = config => {
  const renderViewer = viewerRenderer(config)
  const renderBroadcast = broadcastRenderer(config)

  const renderMain = (state, setState) => {
    const mode = state.get('mode')

    if (mode === 'viewer') {
      return renderViewer()
    } else if (mode === 'broadcast') {
      return renderBroadcast()
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
            style = { styles.button }
            onPress={ () => setState({ mode: 'broadcast' }) }>
            <Text style={ styles.buttonText }>Broadcast</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style = { styles.button }
            onPress={ () => setState({ mode: 'viewer' }) }>
            <Text style={ styles.buttonText }>Viewer</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  return stateRenderer({
    mode: null
  }, renderMain)
}
