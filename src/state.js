import { Component } from 'react'
import { Map as IMap } from 'immutable'

export const setState = (component, entries) => {
  component.setState(({ state }) => ({
    state: state.merge(entries)
  }))
}

export const stateSetter = component => entries =>
  setState(component, entries)

export const stateFieldSetter = (setState, key) => value =>
  setState({
    [key]: value
  })

export const stateFieldsSetter = (setState, keys) => state => {
  const inState = {}
  for (const key of keys) {
    inState[key] = state[key]
  }
  setState(inState)
}

export const getState = component =>
  component.state.state

// Renderer :: State -> (PartialState -> ()) -> Element
// stateRenderer :: State -> Renderer -> Class Component
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
      const state = getState(this)
      const setState = stateSetter(this)

      return renderer(state, setState)
    }
  }
}
