/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import {
  RTCView,
  getUserMedia,
  RTCPeerConnection,
  RTCSessionDescription
} from 'react-native-webrtc'

const milliId = 'cosmo_stream1_XLgh7B'
const websocketUrl = "wss://cdn.millicast.com/ws/alpha1/sub"
const iceServers = []

const connectMillicast = async (websocketUrl, milliId, iceServers, videoElem) => {
  console.log('connecting to:', websocketUrl)

  const pc = new RTCPeerConnection({
      iceServers,
      rtcpMuxPolicy : "require"
  })

  pc.addEventListener('track', ev => {
    console.debug('ontrack event:', event)

    if (videoElem) {
      videoElem.srcObject = event.streams[0]
      videoElem.controls = true
    }
  })

  const ws = new WebSocket(websocketUrl)

  const streamPromise = new Promise(resolve => {
    pc.addEventListener('addstream', ev => {
      console.log('addstream event:', ev)
      const { stream } = ev
      resolve({
        pc,
        ws,
        stream
      })
    })
  })

  ws.onopen = async () => {
    console.log('ws::onopen')

    if (pc.addTransceiver) {
      console.log('transceiver!')
      const stream = new MediaStream()
      //Create all the receiver tracks
      pc.addTransceiver("audio",{
        direction       : "recvonly",
        streams         : [stream]
      })
      pc.addTransceiver("video",{
        direction       : "recvonly",
        streams         : [stream]
      })
    }

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })

    console.log('offer:', offer)
    await pc.setLocalDescription(offer)

    const data = {
      milliId : milliId,
      feedId	: milliId,
      sdp		: offer.sdp
    }

    //create payload
    const payload = {
      type	: "cmd",
      transId	: 0,
      name	: 'view',
      data	: data
    }

    console.log('sending payload:',payload)
    ws.send(JSON.stringify(payload))
  }

  ws.addEventListener('message', async ev => {
    // console.log('ws::message',evt)
    const message = JSON.parse(ev.data)
    const { type } = message

    if (type === 'response') {
      const { sdp } = message.data
      console.log('sdp answer:', sdp)
      console.log('setting remote description')
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp : sdp
      }))
      console.log('done setting remote description')
    }
  })

  return streamPromise
}

const setState = (component, entries) => {
  component.setState(state =>
    Object.assign({}, state, entries))
}

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

const renderStatus = (component, status) => {
  if (status === 'disconnected') {
    return (
      <Button
        title="Connect"
        onPress={ () => connectPressed(component) } />
    )
  } else if (status === 'connecting') {
    return (
      <Button
        disabled={ true }
        onPress={ () => {} }
        title="Connecting.." />
    )
  } else if (status === 'connected') {
    return (
      <Button
        title="Stop"
        onPress={ () => stopVideo(component) } />
    )
  }

  return null
}

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = {
      status: 'disconnected',
      videoUrl: null,
    }
  }

  render() {
    const { status, videoUrl } = this.state
    console.log('rendering with status', status, 'and video url:', videoUrl)

    const statusView = renderStatus(this, status)

    return (
      <View style={styles.container}>
        <RTCView streamURL={ videoUrl } style={ styles.video } />
        <Text style={styles.welcome}>Millicast Mobile Demo</Text>
        <Text style={styles.instructions}>
          Broadcast a stream with Millicast ID { milliId }
          and see it from here.
        </Text>
        { statusView }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  video: {
    width: 480,
    height: 320
  }
});
