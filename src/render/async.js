import { stateRenderer } from './state'

export const asyncRenderer = (rendererPromise, placeholderRender, errorRenderer) => {
  let setStateCalled = false

  return stateRenderer({
    render: placeholderRender
  }, (state, setState, args) => {
    if (!setStateCalled) {
      setStateCalled = true

      rendererPromise.then(
        render => {
          setState({ render })
        }, err => {
          const render = errorRenderer(err)
          setState({ render })
        })
    }

    return state.get('render')(args)
  })
}
