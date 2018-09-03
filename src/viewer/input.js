import React from 'react'

import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native'

const styles = StyleSheet.create({
  milliLabel: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  milliInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 10
  }
})

export const renderMilliIdInput = (state, setMilliId) => {
  return (
    <View>
      <Text style={ styles.milliLabel }>
        Enter Millicast ID:
      </Text>
      <TextInput
        style = { styles.milliInput }
        value = { state.get('milliId') }
        onChangeText = { milliId => setMilliId(milliId) }
      />
    </View>
  )
}
