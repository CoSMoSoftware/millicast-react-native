import React from 'react'

import {
  Button
} from 'react-native'

const connectPressed = async (setState, streamAccountId, streamId, args) => {
  const { logger, millicastClient } = args

  logger.log('connecting milliast')

  setState({
    status: 'connecting'
  })

  const wsUrl = await millicastClient.viewDirector(streamAccountId, streamId)
  logger.log('director url:', ...wsUrl)

  const iceServers = await millicastClient.getIceServers()
  logger.log('ice servers:', ...iceServers)

  const connection = await millicastClient.viewStream(wsUrl, streamId, iceServers)
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
    connection.pc.close()
    connection.ws.close()
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
    const streamAccountId = state.get('viewerStreamAccountId')
    const streamId = state.get('viewerStreamId')

    return (
      <Button
        title='Connect'
        onPress={ () => connectPressed(setState, streamAccountId, streamId, args) } />
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
