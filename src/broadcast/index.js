import React from 'react'

import {
  Text,
  View
} from 'react-native'

import {
  RTCView, // eslint-disable-line import/named
  getUserMedia // eslint-disable-line import/named
} from 'react-native-webrtc'

import { styles } from './styles'

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

import { asyncRenderer } from '../render/async'

export const renderBroadcast = (state, setState, mediaStream) => {
  console.log('rendering broadcast')
  return (
    <View style={ styles.container }>
      <RTCView streamURL={ mediaStream.toURL() } style={ styles.video } />
      <Text style={ styles.title }>
        Millicast Mobile Broadcast Demo
      </Text>
      {
        renderMilliIdInput(state,
          stateFieldSetter(setState, 'milliId'))
      }
      <Text style={ styles.description }>
        Broadcast a stream to the specified Millicast ID.
      </Text>
      {
        renderButton(state,
          stateFieldsSetter(setState,
            ['status', 'connection']),
          mediaStream)
      }
    </View>
  )
}

export const broadcastRenderer = config => {
  const { milliId } = config

  const rendererPromise = (async () => {
    const mediaStream = await getUserMedia({
      audio: true,
      video: {
        facingMode: {
          exact: 'user'
        }
      }
    })

    console.log('got media stream:', mediaStream, mediaStream.getTracks)

    return stateRenderer(
      {
        status: 'disconnected',
        milliId,
        connection: null
      },
      (state, setState) => {
        return renderBroadcast(state, setState, mediaStream)
      })
  })()

  return asyncRenderer(rendererPromise,
    () => (<Text>Getting media stream..</Text>),
    err => () => (<Text>Error getting media stream: { err }</Text>))
}
