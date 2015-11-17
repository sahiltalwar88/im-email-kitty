/* global describe, it, beforeEach */
import assert from 'assert'
import React from 'react'
import jsdom from 'mocha-jsdom'
import Contact from '../../../public/client/contact.js'

const TestUtils = React.addons.TestUtils
const renderer = TestUtils.createRenderer()

describe('Contact component', function () {
  jsdom({ useEach: true })

  let component

  beforeEach(() => {
    renderer.render(<Contact name='test' id='0' />)
    component = renderer.getRenderOutput()
  })

  it('should render a contact', function () {
    const expectedChildren = [
      React.DOM.a({ href: '/contactDetails/1' }, 'test')
    ]

    assert.equal(component.type, 'div')
    assert.equal(component.props.className, 'contact')
    assert.deepEqual(component.props.children, expectedChildren)
  })
})
