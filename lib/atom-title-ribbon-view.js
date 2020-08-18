'use babel'

const $ = require('jquery')

export default class AtomTitleRibbonView {
  constructor (serializedState) {
    // Create root element
    this.element = $('<div class="atom-title-ribbon">')
    this.currentTemplate = atom.menu.template.slice(0)
    // Create an element for the app menu to attach to
    const appWrapper = $('<div class="app-menu"/>')
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove()
  }

  getElement () {
    return this.element
  }

  getCurrentTemplate () {

  }

  setCurrentTemplate (menuArray) {

  }

  createTempLabels (parent) {

  }
}
