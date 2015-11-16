import React from 'react'
import {bindAll} from 'lodash'
import request from 'http-as-promised'
import MessageList from './messageList'
import MessageForm from './messageForm'

const url = 'http://localhost:3000/contacts'

const getInitialState = () => {
  return {data: []}
}

export default class MessageBox extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = getInitialState()
    bindAll(this, 'loadMessagesFromServer', 'handleMessageSubmit')
  }

  loadMessagesFromServer () {
    request({
      url: url,
      json: true,
      resolve: 'body'
    })
    .bind(this)
    .then(function (data) {
      this.setState({data: data})
    })
  }

  componentDidMount () {
    this.loadMessagesFromServer()
    // setInterval(this.loadMessagesFromServer, this.props.pollInterval)
  }

  handleMessageSubmit (message) {
    var messages = this.state.data
    var newMessage = messages.concat([message])
    this.setState({data: newMessage})

    request({
      url: url,
      json: message,
      method: 'POST'
    })
    .then(function (data) {
      this.setState({data: data})
    })
  }

  render () {
    return (
      <div className='messageBox'>
        <h1>Messages</h1>
        <MessageList data={this.state.data} />
        <MessageForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    )
  }
}
