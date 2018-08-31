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
  renderMilliIdInput
} from './input'

import {
  stateFieldSetter,
  stateFieldsSetter
} from '../state'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  description: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 5,
    marginBottom: 15
  },
  video: {
    width: 480,
    height: 320
  }
})

export const renderApp = (state, setState) => {
  return (
    <View style={ styles.container }>
      { renderRemoteStream(state) }
      <Text style={ styles.title }>
        Millicast Mobile Demo
      </Text>
      {
        renderMilliIdInput(state,
          stateFieldSetter(setState, 'milliId'))
      }
      <Text style={ styles.description }>
        Broadcast a stream with the specified Millicast ID
        and see it from here.
      </Text>
      {
        renderButton(state,
          stateFieldsSetter(setState,
            ['status', 'videoUrl', 'connection']))
      }
    </View>
  )
}
