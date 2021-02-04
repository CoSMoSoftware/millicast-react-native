import {
  RTCPeerConnection, // eslint-disable-line import/named
  RTCSessionDescription, // eslint-disable-line import/named
  AudioSession // eslint-disable-line import/named
} from 'react-native-webrtc'

import { makeMillicastClient } from './millicast'

export const createMillicastClient = makeMillicastClient(
  RTCPeerConnection, RTCSessionDescription, AudioSession)
