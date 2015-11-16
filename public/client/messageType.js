import React from 'react'
import {bindAll} from 'lodash'

export default class MessageType extends React.Component {
  constructor (props, context) {
    super(props, context)
    bindAll(this, 'handleTypeChange')
  };

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

MessageType.propTypes = { onChange: React.PropTypes.func.isRequired }
