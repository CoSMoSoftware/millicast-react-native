import { Component } from 'react'
import { Map as IMap } from 'immutable'

export const setState = (component, entries) => {
  component.setState(({ state }) => ({
    state: state.merge(entries)
  }))
}

export const stateSetter = component => entries =>
  setState(component, entries)

export const stateFieldSetter = (component, key) => value =>
  setState(component, [[key, value]])

export const getState = component =>
  component.state.state

// stateRenderer :: Map -> (Component -> Element) -> Class Component
export const stateRenderer = (initState, renderer) => {
  const initIState = IMap(initState)

  return class StateRenderer extends Component {
    constructor (props) {
      super(props)

      this.state = {
        state: initIState
      }
    }

    render () {
      return renderer(this)
    }
  }
}
