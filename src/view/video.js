import React from 'react'

import {
  StyleSheet
} from 'react-native'

import {
  RTCView // eslint-disable-line import/named
} from 'react-native-webrtc'

const styles = StyleSheet.create({
  video: {
    width: 480,
    height: 320
  }
})

export const renderRemoteStream = state => {
  const videoUrl = state.get('videoUrl')
  if (!videoUrl) return null

  return <RTCView streamURL={ videoUrl } style={ styles.video } />
}
