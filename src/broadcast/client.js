import {
  RTCPeerConnection, // eslint-disable-line import/named
  RTCSessionDescription // eslint-disable-line import/named
} from 'react-native-webrtc'

/* global WebSocket */

export const connectBroadcast = async (websocketUrl, milliId, iceServers, mediaStream) => {
  console.log('connecting to:', websocketUrl)
  console.log('ice servers:', iceServers)

  const pc = new RTCPeerConnection({ iceServers })

  pc.addStream(mediaStream)

  const ws = new WebSocket(websocketUrl)

  ws.addEventListener('open', async () => {
    console.log('ws::onopen')
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })

    console.log('offer:', offer.sdp)
    await pc.setLocalDescription(offer)

    const data = {
      milliId,
      name: milliId,
      sdp: offer.sdp,
      codec: 'h264'
    }

    const payload = {
      type: 'cmd',
      transId: Math.random() * 10000,
      name: 'publish',
      data: data
    }

    ws.send(JSON.stringify(payload))
  })

  return new Promise(resolve => {
    ws.addEventListener('message', async ev => {
      const message = JSON.parse(ev.data)
      console.log('received message:', message)

      if (message.type === 'response') {
        const { data } = message

        // react-native-webrtc would crash if the codec is spelled lowercase
        const sdp = data.sdp.replace('h264', 'H264')

        console.log('setting remote session description', sdp)
        await pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp
        }))
        console.log('done setting session description')

        resolve({
          pc,
          ws
        })
      }
    })
  })
}
