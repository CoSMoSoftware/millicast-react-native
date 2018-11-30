import React from 'react'

import {
  Button
} from 'react-native'

const connectPressed = async (setState, streamId, token, args) => {
  const {
    logger,
    mediaStream,
    millicastClient
  } = args

  logger.log('connecting milliast')

  setState({
    status: 'connecting'
  })

  const iceServers = await millicastClient.getIceServers()
  logger.log('ice servers:', ...iceServers)

  const connection = await millicastClient.publishStream(
    streamId, token, iceServers, mediaStream)

  logger.log('broadcast stream connected:', connection)

  setState({
    status: 'connected',
    connection
  })
}

const stopVideo = (connection, setState) => {
  if (connection) {
    connection.pc.close()
    connection.ws.close()
  }

  setState({
    status: 'disconnected',
    connetion: null
  })
}

export const renderButton = (state, setState, args) => {
  const status = state.get('status')

  if (status === 'disconnected') {
    const token = state.get('publisherToken')
    const streamId = state.get('publisherStreamId')
    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(setState, streamId, token, args) } />
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
