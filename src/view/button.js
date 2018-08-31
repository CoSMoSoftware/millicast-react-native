import React from 'react'

import {
  Button
} from 'react-native'

import {
  milliId,
  iceServers,
  websocketUrl
} from '../config'

import { connectMillicast } from '../client'

const connectPressed = async (setState) => {
  console.log('connecting milliast')

  setState({
    status: 'connecting'
  })

  const connection = await connectMillicast(websocketUrl, milliId, iceServers)
  const { stream } = connection
  console.log('got remote stream:', stream)

  setState({
    status: 'connected',
    videoUrl: stream.toURL(),
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
    videoUrl: null,
    connetion: null
  })
}

export const renderButton = (state, setState) => {
  const status = state.get('status')

  if (status === 'disconnected') {
    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(setState) } />
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
