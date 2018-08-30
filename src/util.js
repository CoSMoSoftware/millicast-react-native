export const setState = (component, entries) => {
  component.setState(state =>
    Object.assign({}, state, entries))
}
