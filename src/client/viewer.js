import { rejectionForwarder } from './util'

/* global WebSocket */

export const makeViewerClient = (RTCPeerConnection, RTCSessionDescription) =>
  async (logger, websocketUrl, streamId, iceServers) => {
    logger.log('connecting to:', websocketUrl)

    const pc = new RTCPeerConnection({
      iceServers,
      rtcpMuxPolicy: 'require'
    })

    const ws = new WebSocket(websocketUrl)

    return new Promise((resolve, reject) => {
      const forwardReject = rejectionForwarder(reject)

      ws.addEventListener('error', reject)
      ws.addEventListener('close', () => {
        reject(new Error('WebSocket connection closed unexpectedly'))
      })

      pc.addEventListener('addstream', ev => {
        logger.log('addstream event:', ev)
        const { stream } = ev
        resolve({
          pc,
          ws,
          stream
        })
      })

      ws.addEventListener('open', forwardReject(async () => {
        logger.log('ws::onopen')

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        })

        logger.log('offer:', offer)
        await pc.setLocalDescription(offer)

        const data = {
          streamId,
          sdp: offer.sdp
        }

        const payload = {
          type: 'cmd',
          transId: 0,
          name: 'view',
          data
        }

        logger.log('sending payload:', payload)
        ws.send(JSON.stringify(payload))
      }))

      ws.addEventListener('message', forwardReject(async ev => {
        const message = JSON.parse(ev.data)
        const { type } = message

        if (type === 'response') {
          const { sdp } = message.data
          logger.log('sdp answer:', sdp)
          logger.log('setting remote description')

          await pc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: sdp
          }))

          logger.log('done setting remote description')
        }
      }))
    })
  }
