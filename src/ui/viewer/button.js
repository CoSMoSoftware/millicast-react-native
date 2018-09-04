import React from 'react'

import {
  Button
} from 'react-native'

const connectPressed = async (setState, milliId, args) => {
  const { logger, millicastClient } = args

  logger.log('connecting milliast')

  setState({
    status: 'connecting'
  })

  const iceServers = await millicastClient.getIceServers()
  logger.log('ice servers:', ...iceServers)

  const connection = await millicastClient.viewStream(milliId, iceServers)
  const { stream } = connection
  logger.log('got remote stream:', stream)

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

export const renderButton = (state, setState, args) => {
  const status = state.get('status')

  if (status === 'disconnected') {
    const milliId = state.get('milliId')
    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(setState, milliId, args) } />
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
