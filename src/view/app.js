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

import {
  getState,
  stateSetter
} from '../util'

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
  const state = getState(component)
  const videoUrl = state.get('videoUrl')
  const setState = stateSetter(component)

  return (
    <View style={styles.container}>
      { renderRemoteStream(videoUrl) }
      <Text style={styles.welcome}>Millicast Mobile Demo</Text>
      <Text style={styles.instructions}>
        Broadcast a stream with Millicast ID { milliId }
        and see it from here.
      </Text>
      { renderButton(state, setState) }
    </View>
  )
}
