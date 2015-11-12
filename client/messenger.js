import React from 'react'
import ReactDOM from 'react-dom'
import request from 'http-as-promised'
import marked from 'marked'
import {bindAll} from 'lodash'

const url = 'http://localhost:3000/api/messages'

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
      json: true
    })
    .then(function (data) {
      this.setState({data: data})
    })
    .catch(function (err) {
      console.error(url, err.toString())
    })
  }

  componentDidMount () {
    this.loadMessagesFromServer()
    setInterval(this.loadMessagesFromServer, this.props.pollInterval)
  }

  handleMessageSubmit (message) {
    var messages = this.state.data
    var newMessage = messages.concat([message])
    this.setState({data: newMessage})

    request ({
      url: url,
      json: message,
      method: 'POST'
    })
    .then(function (data) {
      this.setState({data: data})
    })
    .catch(function (err) {
      console.error(url, err.toString())
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
    super (props, context)
  }

  render () {
    const messageNodes = this.props.data.map(message => {
      return (
      <Message author={message.author}>
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

class MessageForm extends React.Component {
  constructor (props, context) {
    super (props, context)
    bindAll (this, 'onFormChange', 'handleSubmit')
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
    super (props, context)
    bindAll (this, 'handleTypeChange')
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
  constructor (props, context) {
    super (props, context)
    bindAll (this, 'rawMarkup')
  }

  rawMarkup () {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true})
    return { __html: rawMarkup }
  }

  render () {
    return (
    <div className='message'>
        <h2 className='messageAuthor'>
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    )
  }
}

ReactDOM.render(
  <MessageBox pollInterval={2000} />,
  document.body
)
