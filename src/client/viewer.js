import { rejectionForwarder } from './util'

/* global WebSocket */

const enableMultiOpus = true
const enableStereo = true

// support for multiopus
function setMultiopus (offer) {
  // Find the audio m-line
  const res = /m=audio 9 UDP\/TLS\/RTP\/SAVPF (.*)\r\n/.exec(offer.sdp)
  // Get audio line
  const audio = res[0]
  // Get free payload number for multiopus
  const pt = Math.max(...res[1].split(' ').map(Number)) + 1
  // Add multiopus
  const multiopus = audio.replace('\r\n', ' ') + pt + '\r\n' +
    `a=rtpmap:${pt} multiopus/48000/6\r\n` +
    `a=fmtp:${pt} channel_mapping=0,4,1,2,3,5;coupled_streams=2;minptime=10;num_streams=4;useinbandfec=1\r\n`
  // Change sdp
  offer.sdp = offer.sdp.replace(audio, multiopus)
  return offer.sdp
}

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

        if (enableStereo) {
          offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1')
        }

        // try for multiopus (surround sound) support
        if (enableMultiOpus) {
          try {
            offer.sdp = setMultiopus(offer)
          } catch (e) {
            logger.log('create offer surround sound', offer)
          }
        }

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
