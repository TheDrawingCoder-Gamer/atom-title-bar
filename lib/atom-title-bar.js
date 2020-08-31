'use babel'

import AtomTitleBarView from './atom-title-bar-view'
const $ = require('jquery')
export default {

  AtomTitleBarView: null,
  modalPanel: null,

  activate (state) {
    this.AtomTitleBarView = new AtomTitleBarView(state.AtomTitleBarViewState)
    this.modalPanel = $('atom-workspace').first().prepend(this.AtomTitleBarView.getElement())
  },

  deactivate () {
    this.modalPanel.remove()
    this.AtomTitleBarView.destroy()
  },

  serialize () {
    return {
      AtomTitleBarViewState: this.AtomTitleBarView.serialize()
    }
  }

}
