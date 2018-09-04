import { Component } from 'react'
import * as config from './config'
import { mainRenderer } from './ui'

export class App extends Component {
  constructor (props) {
    super(props)

    this.render = mainRenderer(config)
  }
}
