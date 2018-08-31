import {
  MediaStream, // eslint-disable-line import/named
  RTCPeerConnection, // eslint-disable-line import/named
  RTCSessionDescription // eslint-disable-line import/named
} from 'react-native-webrtc'

/* global WebSocket */

export const connectMillicast = async (websocketUrl, milliId, iceServers) => {
  console.log('connecting to:', websocketUrl)

  const pc = new RTCPeerConnection({
    iceServers,
    rtcpMuxPolicy: 'require'
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

      pc.addTransceiver('audio', {
        direction: 'recvonly',
        streams: [stream]
      })

      pc.addTransceiver('video', {
        direction: 'recvonly',
        streams: [stream]
      })
    }

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })

    console.log('offer:', offer)
    await pc.setLocalDescription(offer)

    const data = {
      milliId: milliId,
      feedId: milliId,
      sdp: offer.sdp
    }

    const payload = {
      type: 'cmd',
      transId: 0,
      name: 'view',
      data: data
    }

    console.log('sending payload:', payload)
    ws.send(JSON.stringify(payload))
  }

  ws.addEventListener('message', async ev => {
    const message = JSON.parse(ev.data)
    const { type } = message

    if (type === 'response') {
      const { sdp } = message.data
      console.log('sdp answer:', sdp)
      console.log('setting remote description')

      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      }))

      console.log('done setting remote description')
    }
  })

  return streamPromise
}
