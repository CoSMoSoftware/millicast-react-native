import { rejectionForwarder } from './util'

/* global WebSocket */

const enableStereo = true

export const makePublisherClient = (RTCPeerConnection, RTCSessionDescription) =>
  async (logger, websocketUrl, streamId, iceServers, mediaStream) => {
    logger.log('connecting to:', websocketUrl)
    logger.log('ice servers:', iceServers)

    const pc = new RTCPeerConnection({ iceServers })

    pc.addStream(mediaStream)

    const ws = new WebSocket(websocketUrl)

    return new Promise((resolve, reject) => {
      const forwardReject = rejectionForwarder(reject)

      ws.addEventListener('error', reject)
      ws.addEventListener('close', () => {
        reject(new Error('WebSocket connection closed unexpectedly'))
      })

      ws.addEventListener('open', forwardReject(async () => {
        logger.log('ws::onopen')
        let offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        })

        logger.log('offer:', offer.sdp)

        if (enableStereo) {
          offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1')
        }

        await pc.setLocalDescription(offer)

        const data = {
          name: streamId,
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
      }))

      ws.addEventListener('message', forwardReject(async ev => {
        const message = JSON.parse(ev.data)
        logger.log('received message:', message)

        if (message.type === 'response') {
          const { data } = message

          // react-native-webrtc would crash if the codec is spelled lowercase
          const sdp = data.sdp.replace('h264', 'H264')

          logger.log('setting remote session description', sdp)
          await pc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp
          }))
          logger.log('done setting session description')

          resolve({
            pc,
            ws
          })
        }
      }))
    })
  }
