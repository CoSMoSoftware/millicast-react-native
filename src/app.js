import { renderApp } from './view/app'
import { stateRenderer } from './util'

export const App = stateRenderer(
  {
    videoUrl: null,
    status: 'disconnected'
  },
  renderApp)
