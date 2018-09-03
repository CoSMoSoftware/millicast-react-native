import React from 'react'

import {
  Text,
  View
} from 'react-native'

import {
  renderRemoteStream
} from './video'

import {
  renderButton
} from './button'

import {
  renderMilliIdInput
} from './input'

import {
  stateRenderer,
  stateFieldSetter,
  stateFieldsSetter
} from '../render/state'

import { styles } from './styles'

export const renderViewer = (state, setState) => {
  return (
    <View style={ styles.container }>
      { renderRemoteStream(state) }
      <Text style={ styles.title }>
        Millicast Mobile Demo
      </Text>
      {
        renderMilliIdInput(state,
          stateFieldSetter(setState, 'milliId'))
      }
      <Text style={ styles.description }>
        Broadcast a stream with the specified Millicast ID
        and see it from here.
      </Text>
      {
        renderButton(state,
          stateFieldsSetter(setState,
            ['status', 'videoUrl', 'connection']))
      }
    </View>
  )
}

export const viewerRenderer = config => {
  const { milliId } = config

  return stateRenderer(
    {
      videoUrl: null,
      status: 'disconnected',
      milliId
    },
    renderViewer)
}
