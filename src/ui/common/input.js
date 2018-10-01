import React from 'react'

import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native'

const styles = StyleSheet.create({
  inputLabel: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  textInput: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 10
  }
})

export const renderStreamIdInput = (fieldName, description, state, setState) => {
  return (
    <View>
      <Text style={ styles.inputLabel }>
        { description }
      </Text>
      <TextInput
        style = { styles.textInput }
        value = { state.get(fieldName) }
        onChangeText = {
          streamId =>
            setState({
              [fieldName]: streamId
            })
        }
      />
    </View>
  )
}
