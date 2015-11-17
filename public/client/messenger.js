import React from 'react'
import {render} from 'react-dom'
import {bindAll} from 'lodash'
import request from 'http-as-promised'
import { Router, Route, Link } from 'react-router'
// import MessageBox from './messageBox'

const contactUrl = 'http://localhost:3000/contacts'

class ContactBox extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = { data: [] }
    bindAll(this, 'loadContactsFromServer')
  }

  loadContactsFromServer () {
    request({
      url: contactUrl,
      json: true,
      resolve: 'body'
    })
    .bind(this)
    .then(function (data) {
      this.setState({data: data})
    })
  }

  componentDidMount () {
    this.loadContactsFromServer()
  }

  render () {
    return (
      <div className='contactBox'>
        <h1>Contacts</h1>
        <ContactList data={this.state.data} />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class ContactList extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    const contactNodes = this.props.data.map(contact => {
      return (
        <Contact key={contact.id} name={contact.name} id={contact.id}>
        </Contact>
      )
    })
    return (
    <div className='contactList'>
        { contactNodes }
      </div>
    )
  }
}

ContactList.propTypes = {
  data: React.PropTypes.array
}

ContactList.defaultProps = {
  data: []
}

class Contact extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = { cat: '' }
    bindAll(this, 'getCatImage')
  }

  getCatImage () {
    request({
      url: 'http://edgecats.net/random',
      json: true,
      resolve: 'body'
    })
    .bind(this)
    .then(function (data) {
      this.setState({ cat: data })
    })
  }

  componentWillMount () {
    this.getCatImage()
  }

  render () {
    return (
      <div className='contact'>
        <img src={this.state.cat} alt='a random cat gif!' className='avatar avatar-border avatar-default' />
        <Link to={`/contactDetails/${this.props.id}`}>
          {this.props.name}
        </Link>
      </div>
    )
  }
}

class MessageBox extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = { data: [], contact: {} }
    bindAll(this, 'loadContactFromServer', 'loadMessagesFromServer', 'handleMessageSubmit')
  }

  get baseContactUrl () {
    return `http://localhost:3000/contacts/${this.props.params.id}`
  }

  get messageUrl () {
    return this.baseContactUrl + '/messages'
  }

  loadContactFromServer () {
    request({
      url: this.baseContactUrl,
      json: true,
      resolve: 'body'
    })
    .bind(this)
    .then(function (data) {
      this.setState({contact: data[0]})
    })
  }

  loadMessagesFromServer () {
    request({
      url: this.messageUrl,
      json: true,
      resolve: 'body'
    })
    .bind(this)
    .then(function (data) {
      this.setState({data: data})
    })
  }

  componentDidMount () {
    this.loadContactFromServer()
    this.loadMessagesFromServer()
    // setInterval(this.loadMessagesFromServer, this.props.pollInterval)
  }

  handleMessageSubmit (message) {
    var allMessages = this.state.data.concat([message])
    this.setState({data: allMessages})

    message.contact_id = this.state.contact.id

    request({
      url: this.messageUrl,
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
        <h1>{'Conversation with ' + this.state.contact.name}</h1>
        <MessageList data={this.state.data} name={this.state.contact.name} />
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
        <Message sent={message.sent} name={this.props.name} key={index}>
          {message.message_text}
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

class Message extends React.Component {
  get senderName () {
    if (Math.random() < 0.25) return <img src="http://49.media.tumblr.com/tumblr_lrbu1l9BJk1qgzxcao1_250.gif" />
    return this.props.sent ? 'You' : this.props.name
  }

  render () {
    return (
      <div className='message'>
        <h2 className='messageAuthor'>
          { this.senderName }
        </h2>
        { this.props.children }
      </div>
    )
  }
}

class MessageForm extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = { 'message_type': 'text' }
    bindAll(this, 'onFormChange', 'handleSubmit')
  }

  onFormChange (key, e) {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  handleSubmit (e) {
    e.preventDefault()

    var message_text = this.refs.message_text.value.trim()
    var message_type = this.state.message_type

    var typeIsValid = message_type === 'text' || message_type === 'email'
    if (!message_text || !typeIsValid) {
      return
    }

    this.props.onMessageSubmit({ message_text: message_text, message_type: message_type })
    this.refs.message_text.value = ''
    return
  }

  render () {
    return (
      <form className='messageForm' onSubmit={this.handleSubmit}>
        <br />
        <br />
        <input type='text' placeholder='Say something...' ref='message_text' />
        <MessageType onChange={ this.onFormChange }/>
        <input type='submit' value='Send' />
      </form>
    )
  }
}

class MessageType extends React.Component {
  constructor (props, context) {
    super(props, context)
    bindAll(this, 'onFormChange')
  };

  props () { onChange: React.PropTypes.func.isRequired }

  onFormChange (key, e) {
    this.props.onChange(key, e)
  }

  render () {
    return (
    <div className='messageType'>
        <select ref='messageType' onChange={ this.onFormChange.bind(this, 'message_type') }>
          <option value='text'>Text</option>
          <option value='email'>Email</option>
        </select>
      </div>
    )
  }
}

render((
  <Router>
    <Route path='/' component={ContactBox} />
    <Route path='/contactDetails/:id' component={MessageBox}/>
  </Router>
), document.getElementById('content'))

// <Route path='users' component={Users}>
//   <Route path='/user/:userId' component={User}/>
// </Route>
// <Route path='*' component={NoMatch}/>
