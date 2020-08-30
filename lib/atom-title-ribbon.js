'use babel'

import AtomTitleRibbonView from './atom-title-ribbon-view'
import { CompositeDisposable } from 'atom'
const $ = require('jquery')
export default {

  atomTitleRibbonView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.atomTitleRibbonView = new AtomTitleRibbonView(state.atomTitleRibbonViewState)
    this.modalPanel = $('atom-workspace.workspace')[0].prepend(this.atomTitleRibbonView.getElement()[0])
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()
  },

  deactivate () {
    this.modalPanel.remove()
    this.subscriptions.dispose()
    this.atomTitleRibbonView.destroy()
  },

  serialize () {
    return {
      atomTitleRibbonViewState: this.atomTitleRibbonView.serialize()
    }
  }

}
