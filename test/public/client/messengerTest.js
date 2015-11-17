/* global describe, it, beforeEach */
import assert from 'assert'
import React from 'react'
import jsdom from 'mocha-jsdom'
import ReactTestUtils from 'react-addons-test-utils'
import Contact from '../../../public/client/contact'

const renderer = ReactTestUtils.createRenderer()

describe('Contact component', function () {
  jsdom({ useEach: true })

  let component

  beforeEach(() => {
    renderer.render(<Contact name='test' />)
    component = renderer.getRenderOutput()
  })

  it('should render a contact', function () {
    const expectedChildren = [
      // React.DOM.img({ alt: 'a random cat gif!', className: 'avatar avatar-border avatar-default' })
      React.DOM.a({ href: '/contactDetails/1' }, 'test')
    ]

    assert.equal(component.type, 'div')
    assert.equal(component.props.className, 'contact')
    assert.deepEqual(component.props.children, expectedChildren)
  })
})
