import React from 'react'
import {bindAll} from 'lodash'
import MessageType from './messageType'

export default class MessageForm extends React.Component {
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
