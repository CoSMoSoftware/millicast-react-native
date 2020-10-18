import { rejectionForwarder } from './util'

/* global WebSocket */

const enableStereo = true
const enableSimulcast = false

function setSimulcast (offer) {
  // temporary patch for now

  try {
    // Get sdp
    let sdp = offer.sdp
    // OK, chrome way
    const reg1 = RegExp('m=video.*?a=ssrc:(\\d*) cname:(.+?)\\r\\n', 's')
    const reg2 = RegExp('m=video.*?a=ssrc:(\\d*) mslabel:(.+?)\\r\\n', 's')
    const reg3 = RegExp('m=video.*?a=ssrc:(\\d*) msid:(.+?)\\r\\n', 's')
    const reg4 = RegExp('m=video.*?a=ssrc:(\\d*) label:(.+?)\\r\\n', 's')
    // Get ssrc and cname
    let res = reg1.exec(sdp)
    const ssrc = res[1]
    const cname = res[2]
    // Get other params
    const mslabel = reg2.exec(sdp)[2]
    const msid = reg3.exec(sdp)[2]
    const label = reg4.exec(sdp)[2]
    // Add simulcasts ssrcs
    const num = 2
    const ssrcs = [ssrc]
    for (let i = 0; i < num; ++i) {
      // Create new ssrcs
      const ssrc = 100 + i * 2
      const rtx = ssrc + 1
      // Add to ssrc list
      ssrcs.push(ssrc)
      // Add sdp stuff
      sdp += `a=ssrc-group:FID ${ssrc} ${rtx}\r\n` +
        `a=ssrc:${ssrc} cname:${cname}\r\n` +
        `a=ssrc:${ssrc} msid:${msid}\r\n` +
        `a=ssrc:${ssrc} mslabel:${mslabel}\r\n` +
        `a=ssrc:${ssrc} label:${label}\r\n` +
        `a=ssrc:${rtx} cname:${cname}\r\n` +
        `a=ssrc:${rtx} msid:${msid}\r\n` +
        `a=ssrc:${rtx} mslabel:${mslabel}\r\n` +
        `a=ssrc:${rtx} label:${label}\r\n`
    }
    // Conference flag
    sdp += 'a=x-google-flag:conference\r\n'
    // Add SIM group
    sdp += `a=ssrc-group:SIM ${ssrcs.join(' ')}\r\n`
    // Update sdp in offer without the rid stuff
    offer.sdp = sdp
    // Add RID equivalent to send it to the sfu
    sdp += `a=simulcast:send a;b;c\r\n`
    sdp += `a=rid:a send ssrc=${ssrcs[2]}\r\n`
    sdp += `a=rid:b send ssrc=${ssrcs[1]}\r\n`
    sdp += `a=rid:c send ssrc=${ssrcs[0]}\r\n`
    // Set it back
    // offer.sdp = sdp;
  } catch (e) {
    console.error(e)
  }
  return offer.sdp
}

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

        if (enableSimulcast === true) {
          offer.sdp = setSimulcast(offer)
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
          let sdp = data.sdp.replace('h264', 'H264')
          /* handle older versions of Safari */
          if (sdp && sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
            sdp = sdp.split('\n').filter((line) => {
              return line.trim() !== 'a=extmap-allow-mixed'
            }).join('\n')
          }

          sdp = `${sdp}a=x-google-flag:conference\r\n`

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
