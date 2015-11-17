import React, {PropTypes} from 'react'
import {bindAll} from 'lodash'
import {Link} from 'react-router'
import request from 'http-as-promised'

class Contact extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number
  }

  constructor (props, context) {
    super(props, context)

    bindAll(this, 'getCatImage')
    this.state = { cat: '' }
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
