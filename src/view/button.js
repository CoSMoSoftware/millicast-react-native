import React from 'react'

import {
  Button
} from 'react-native'

import {
  milliId,
  iceServers,
  websocketUrl
} from '../config'

import { setState } from '../util'

import { connectMillicast } from '../client'

const connectPressed = async (component) => {
  console.log('connecting milliast')

  setState(component, {
    status: 'connecting'
  })

  const connection = await connectMillicast(websocketUrl, milliId, iceServers)
  const { stream } = connection
  console.log('got remote stream:', stream)

  setState(component, {
    status: 'connected',
    videoUrl: stream.toURL(),
    connection
  })
}

const stopVideo = (component) => {
  const { connection } = component.state

  if (connection) {
    connection.pc.close()
    connection.ws.close()
  }

  setState(component, {
    status: 'disconnected',
    videoUrl: null,
    connetion: null
  })
}

export const renderButton = (component, status) => {
  if (status === 'disconnected') {
    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(component) } />
    )
  } else if (status === 'connecting') {
    return (
      <Button
        disabled={ true }
        onPress={ () => {} }
        title='Connecting..' />
    )
  } else if (status === 'connected') {
    return (
      <Button
        title='Stop'
        onPress={ () => stopVideo(component) } />
    )
  }

  return null
}
