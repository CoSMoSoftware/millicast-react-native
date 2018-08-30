import { Component } from 'react'

import { renderApp } from './view/app'

export class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      videoUrl: null,
      status: 'disconnected'
    }
  }

  render () {
    return renderApp(this)
  }
}
