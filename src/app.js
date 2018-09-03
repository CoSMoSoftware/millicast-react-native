import { renderApp } from './view/app'
import { stateRendererClass } from './state'

import {
  milliId
} from './config'

export const App = stateRendererClass(
  {
    videoUrl: null,
    status: 'disconnected',
    milliId
  },
  renderApp)
