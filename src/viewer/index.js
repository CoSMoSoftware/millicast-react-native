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
  stateRenderer
} from '../render/state'

import {
  createMillicastClient
} from '../client'

import { styles } from './styles'

export const viewerRenderer = config => {
  const { logger, milliId } = config

  const millicastClient = createMillicastClient(config)

  const args = {
    logger,
    millicastClient
  }

  const renderViewer = (state, setState) => {
    return (
      <View style={ styles.container }>
        { renderRemoteStream(state) }
        <Text style={ styles.title }>
          Millicast Mobile Demo
        </Text>
        {
          renderMilliIdInput(state, setState)
        }
        <Text style={ styles.description }>
          Broadcast a stream with the specified Millicast ID
          and see it from here.
        </Text>
        {
          renderButton(state, setState, args)
        }
      </View>
    )
  }

  return stateRenderer(
    {
      videoUrl: null,
      status: 'disconnected',
      milliId
    },
    renderViewer)
}
