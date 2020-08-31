'use babel'

import AtomTitleBar from '../lib/atom-title-bar'
const jQuery = require('jquery')
// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomTitleBar', () => {
  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('atom-title-bar'))
  })

  it('prepends the title bar to the workspace', async () => {
    const expectedBar = jQuery('.atom-title-bar')
    expect(expectedBar).toBeVisible()
  })
})
