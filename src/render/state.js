import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Map as IMap } from 'immutable'

/*
  Args = { ... }
  State = { ... }

  StateSetter :: (PartialState -> ())
  Renderer :: (State, StateSetter, Args) -> Element
  stateRenderer :: (State, Renderer) -> (Args -> Element)

  stateRenderer is a simple helper function to create stateful React element
  renderer in a functional way. It takes in an initial state object, and
  a renderer function, and return a function that accepts an argument object
  and return a React element.

  The inner renderer function is given 3 arguments. The first one is the
  current state object, frozen as immutable map using Immutable.js. The
  second argument is a set state function, which takes in a map representing
  partial state with updated fields. When setState is called, the new partial
  state is merged with the current state, and the inner renderer function
  will be called again with the new state.

  The inner renderer function is called whenever the state changes, or
  when the returned wrapped renderer is called with new arguments.

  The result renderer returned from stateRenderer should be used only
  at a single place inside your application. If the renderer is called
  at multiple places, React may not recognize them as the same element,
  and may initialize them separately with the initial state again.
 */

export const setState = (component, entries) => {
  component.setState(({ state }) => ({
    state: state.merge(entries)
  }))
}

export const stateSetter = component => entries =>
  setState(component, entries)

export const getState = component =>
  component.state.state

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

// StateSetter :: (PartialState -> ())
// Renderer :: (State, StateSetter, Args) -> Element
// stateRenderer :: (State, Renderer) -> (Args -> Element)
export const stateRenderer = (initState, renderer) => {
  const StateRenderer = stateRendererClass(initState, renderer)

  return args => {
    return <StateRenderer args={args} />
  }
}
