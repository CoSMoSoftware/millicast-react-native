import React from 'react'

import {
  Button
} from 'react-native'

import {
  iceServers,
  publisherUrl
} from '../config'

import { connectBroadcast } from './client'

const connectPressed = async (setState, milliId, mediaStream) => {
  console.log('connecting milliast')

  setState({
    status: 'connecting'
  })

  const connection = await connectBroadcast(
    publisherUrl, milliId, iceServers, mediaStream)

  console.log('broadcast stream connected:', connection)

  setState({
    status: 'connected',
    connection
  })
}

const stopVideo = (connection, setState) => {
  if (connection) {
    connection.get('pc').close()
    connection.get('ws').close()
  }

  setState({
    status: 'disconnected',
    connetion: null
  })
}

export const renderButton = (state, setState, mediaStream) => {
  const status = state.get('status')

  if (status === 'disconnected') {
    const milliId = state.get('milliId')
    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(setState, milliId, mediaStream) } />
    )
  } else if (status === 'connecting') {
    return (
      <Button
        disabled={ true }
        onPress={ () => {} }
        title='Connecting..' />
    )
  } else if (status === 'connected') {
    const connection = state.get('connection')
    return (
      <Button
        title='Stop'
        onPress={ () => stopVideo(connection, setState) } />
    )
  }

  return null
}
