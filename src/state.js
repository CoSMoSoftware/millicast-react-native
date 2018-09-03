import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
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
export const stateRendererClass = (initState, renderer) => {
  const initIState = IMap(initState)

  return class StateRenderer extends Component {
    static get propTypes () {
      return {
        args: PropTypes.any
      }
    }

    constructor (props) {
      super(props)

      this.state = {
        state: initIState
      }
    }

    render () {
      const state = getState(this)
      const setState = stateSetter(this)

      const { args = {} } = this.props

      return renderer(state, setState, args)
    }
  }
}

export const stateRenderer = (initState, renderer) => {
  const StateRenderer = stateRendererClass(initState, renderer)

  return args => { // eslint-disable-line react/display-name
    console.log('stateRenderer called', args)
    return <StateRenderer args={args} />
  }
}
