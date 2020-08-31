'use babel'

import AtomTitleBarView from '../lib/atom-title-bar-view.js'
const jQuery = require('jquery')
describe('AtomTitleBarView', () => {
  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('atom-title-bar'))
  })
  it('creates an element to be attached to the workspace', async () => {
    const thatElement = jQuery('.atom-title-bar')
    expect(thatElement).toHaveClass('atom-title-bar')
    expect(thatElement.children().length).toBe(3)
  })
})
