import React from 'react'
import ReactDOM from 'react-dom'
import {bindAll} from 'lodash'
import request from 'http-as-promised'
// import MessageBox from './messageBox'

const url = 'http://localhost:3000/contacts'

const getInitialState = () => {
  return {data: []}
}

class MessageBox extends React.Component {
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

class MessageList extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    const messageNodes = this.props.data.map((message, index) => {
      return (
        <Message author={message.author} key={index}>
          {message.text}
        </Message>
      )
    })
    return (
    <div className='messageList'>
        { messageNodes }
      </div>
    )
  }
}

MessageList.propTypes = {
  data: React.PropTypes.array
}

MessageList.defaultProps = {
  data: []
}

class MessageForm extends React.Component {
  constructor (props, context) {
    super(props, context)
    bindAll(this, 'onFormChange', 'handleSubmit')
  }

  onFormChange (key, e) {}

  handleSubmit (e) {
    e.preventDefault()

    var author = this.refs.author.value.trim()
    var text = this.refs.text.value.trim()
    if (!text || !author) {
      return
    }

    this.props.onMessageSubmit({author: author, text: text, url: this.url})
    this.refs.author.value = ''
    this.refs.text.value = ''
    return
  }

  render () {
    return (
      <form className='messageForm' onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Your name' ref='author' />
        <input type='text' placeholder='Say something...' ref='text' />
        <MessageType onChange={this.handleTypeChange}/>
        <input type='submit' value='Send' />
      </form>
    )
  }
}

class MessageType extends React.Component {
  constructor (props, context) {
    super(props, context)
    bindAll(this, 'handleTypeChange')
  };

  props () { onChange: React.PropTypes.func.isRequired }

  handleTypeChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    return (
    <div className='messageType'>
        <select ref='messageType' onChange={this.handleTypeChange}>
          <option value='text'>Text</option>
          <option value='email'>Email</option>
        </select>
      </div>
    )
  }
}

class Message extends React.Component {
  render () {
    return (
      <div className='message'>
        <h2 className='messageAuthor'>
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    )
  }
}

ReactDOM.render(
  <MessageBox pollInterval={2000} />,
  document.body
)
