import { Component } from 'react'
import * as config from './config'
// import { viewerRenderer } from './viewer'
// import { broadcastRenderer } from './broadcast'
import { mainRenderer } from './main'

export class App extends Component {
  constructor (props) {
    super(props)

    this.render = mainRenderer(config)
    // this.render = viewerRenderer(config)
    // this.render = broadcastRenderer(config)
  }
}
