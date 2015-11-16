import React from 'react'
import Message from './message'

export default class MessageList extends React.Component {
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
