import { renderApp } from './view/app'
import { stateRenderer } from './state'

import {
  milliId
} from './config'

export const App = stateRenderer(
  {
    videoUrl: null,
    status: 'disconnected',
    milliId
  },
  renderApp)
