import { makeViewerClient } from './viewer'
import { makePublisherClient } from './publish'
import { fetchIceServers } from './ice-server'

export const makeMillicastClient = (RTCPeerConnection, RTCSessionDescription) => {
  const publisherClient = makePublisherClient(RTCPeerConnection, RTCSessionDescription)
  const viewerClient = makeViewerClient(RTCPeerConnection, RTCSessionDescription)

  return config => {
    const {
      logger,
      viewerUrl,
      turnApiUrl,
      publisherUrl
    } = config

    const getIceServers = async () => {
      return fetchIceServers(turnApiUrl)
    }

    const viewStream = async (streamId, iceServers) => {
      return viewerClient(logger, viewerUrl, streamId, iceServers)
    }

    const publishStream = async (streamId, token, iceServers, mediaStream) => {
      const fullPublisherUrl = `${publisherUrl}?token=${token}`
      return publisherClient(logger, fullPublisherUrl, streamId, iceServers, mediaStream)
    }

    return {
      viewStream,
      publishStream,
      getIceServers
    }
  }
}
