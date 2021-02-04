import { makeViewerClient } from './viewer'
import { makePublisherClient } from './publish'
import { fetchIceServers } from './ice-server'
import { fetchDirector } from './director'

export const makeMillicastClient = (RTCPeerConnection, RTCSessionDescription, AudioSession) => {
  const publisherClient = makePublisherClient(RTCPeerConnection, RTCSessionDescription, AudioSession)
  const viewerClient = makeViewerClient(RTCPeerConnection, RTCSessionDescription, AudioSession)

  return config => {
    const {
      logger,
      turnApiUrl,
      directorUrl
    } = config

    const viewDirector = async (streamAccountId, streamName, unauthorizedSubscribe = true) => {
      let payload = {
        streamAccountId, streamName, unauthorizedSubscribe
      }
      return fetchDirector(directorUrl, 'subscribe', payload)
    }

    const publishDirector = async (streamName, token) => {
      let payload = {
        streamName
      }
      return fetchDirector(directorUrl, 'publish', payload, token)
    }

    const getIceServers = async () => {
      return fetchIceServers(turnApiUrl)
    }

    const viewStream = async (wsUrl, streamId, iceServers) => {
      return viewerClient(logger, wsUrl, streamId, iceServers)
    }

    const publishStream = async (wsUrl, streamId, iceServers, mediaStream) => {
      return publisherClient(logger, wsUrl, streamId, iceServers, mediaStream)
    }

    return {
      viewDirector,
      publishDirector,
      viewStream,
      publishStream,
      getIceServers,
      AudioSession
    }
  }
}
