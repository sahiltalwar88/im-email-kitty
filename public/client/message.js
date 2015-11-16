import React from 'react'

export default class Message extends React.Component {
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
