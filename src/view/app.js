import React from 'react'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import {
  renderRemoteStream
} from './video'

import {
  renderButton
} from './button'

import {
  milliId
} from '../config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  video: {
    width: 480,
    height: 320
  }
})

export const renderApp = component => {
  const { status, videoUrl } = component.state
  console.log('rendering with status', status, 'and video url:', videoUrl)

  return (
    <View style={styles.container}>
      { renderRemoteStream(videoUrl) }
      <Text style={styles.welcome}>Millicast Mobile Demo</Text>
      <Text style={styles.instructions}>
        Broadcast a stream with Millicast ID { milliId }
        and see it from here.
      </Text>
      { renderButton(component, status) }
    </View>
  )
}
