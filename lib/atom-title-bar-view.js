'use babel'
/**
* $ object
* @external jQuery
* @see {@link https://api.jquery.com/jQuery/}
*/
const $ = require('jquery')
const feather = require('feather-icons')
const remote = require('electron').remote
export default class AtomTitleBarView {
  /**
  * @constructs AtomTitleBarView
  * @param {object} serializedState Comes from previous session.
  */
  constructor (serializedState) {
    // Create root element
    /** @constant {external:jQuery} this.element */
    this.element = $('<div class="atom-title-bar"/>')
    this.currentTemplate = atom.menu.template.slice(0)
    // Create an element for the app menu to attach to
    const appWrapper = $('<div class="app-menu"/>')
    $(document).click(function (event) {
      var $target = $(event.target)
      if (!$target.closest('.app-menu-label,.menu-box').filter(':visible').length) {
        $('.menu-box').hide()
      }
    })
    $(function () {
      $('.menu-box').hide()
    })
    const menuList = this.createTempLabels()
    appWrapper.append(menuList)
    // Create an element for the controls to attach to
    const controlWrapper = $('<div class="control-wrap"/>')
    const controlButtons = this.createControls()
    controlButtons.forEach((index) => {
      controlWrapper.append(index)
    })
    // Create title
    const titleElem = $('<div class="app-title"/>')
    titleElem.text = 'Atom'
    this.initTitleListener(titleElem)
    remote.getCurrentWindow().on('maximize', () => {
      $('.app-max').html(feather.icons.minimize.toSvg({ height: '16', width: '16' }))
    })
    remote.getCurrentWindow().on('unmaximize', () => {
      $('.app-max').html(feather.icons.maximize.toSvg({ height: '16', width: '16' }))
    })
    const _this = this
    // append to div
    this.element.append(appWrapper, titleElem, controlWrapper)
    appWrapper.children('.app-menu-label').each(function (index) {
      const menu = _this.traverseMenu(_this.currentTemplate[index].submenu, $(this).text().toLowerCase() === 'packages')
      const altData = _this.formatAltKey(this.label)
      $(this).attr('data-alt', altData.html)
      this.appendChild(menu[0])
    })
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
    return this.currentTemplate
  }

  setCurrentTemplate (menuArray) {
    this.currentTemplate = menuArray
  }

  createTempLabels () {
    this.setCurrentTemplate(atom.menu.template.slice(0))
    var labelList = []
    for (var i = 0; i < this.currentTemplate.length; i++) {
      var tempLabel = $('<span class="app-menu-label"/>')
      tempLabel.text(this.currentTemplate[i].label.replace(/[&]/, ''))
      tempLabel.click(function () {
        $('.menu-box').css('display', 'none')
        $(this).children().css('display', 'block')
      })
      labelList.push(tempLabel)
    }
    return labelList
  }

  /**
  * @param {HTMLElement} titleSpan
  * @returns {NodeJS.Timeout}
  */
  initTitleListener (titleSpan) {
    return setInterval(() => {
      const title = $('title')
      $(titleSpan).text($(title).text())
    }, 500)
  }

  /**
  * @returns {external:jQuery[]}
  */
  createControls () {
    // TODO: Add config for theme
    const closeElem = $('<div class="app-close"/>')
    closeElem.html(feather.icons.x.toSvg({ width: '16', height: '16' }))
    closeElem.click(function () {
      remote.getCurrentWindow().close()
    })
    const maxElem = $('<div class="app-max"/>')
    if (remote.getCurrentWindow().isMaximized()) {
      maxElem.html(feather.icons.minimize.toSvg({ width: '16', height: '16' }))
    } else {
      maxElem.html(feather.icons.maximize.toSvg({ width: '16', height: '16' }))
    }
    maxElem.click(function () {
      const currentWindow = remote.getCurrentWindow()
      if (currentWindow.isMaximized()) {
        currentWindow.unmaximize()
      } else {
        currentWindow.maximize()
      }
    })
    const minElem = $('<div class="app-min"/>')
    minElem.html(feather.icons.minus.toSvg({ width: '16', height: '16' }))
    minElem.click(function () {
      const currentWindow = remote.getCurrentWindow()
      if (currentWindow.isMinimized()) {
        currentWindow.restore()
      } else {
        currentWindow.minimize()
      }
    })
    return [minElem, maxElem, closeElem]
  }

  /**
  * Many of these properties are mutually exclusive.
  * Label and Type are mutually exclusive
  * Command and Submenu are mutually exclusive too.
  * @typedef {object} AppMenu
  * @property {string} [label]
  * @property {string} [command]
  * @property {AppMenu[]} [submenu]
  * @property {boolean} [enabled=true]
  * @property {boolean} [visible=true]
  * @property {string} [type]
  */
  /**
  * @private
  * @param {AppMenu[]} menuArray
  * @param {boolean} [sort=false] decision to sort. Used for packages.
  * @returns {jQuery}
  */
  traverseMenu (menuArray, sort = false) {
    var itemElement = $('<div class="menu-box"/>')
    if (sort) {
      menuArray.sort((a, b) => {
        if (a.type === 'separator' || b.type === 'separator') {
          return 0
        }
        const fa = a.label.toLowerCase()
        const fb = b.label.toLowerCase()
        if (fa < fb) {
          return -1
        }
        if (fa > fb) {
          return 1
        }
        return 0
      })
    }
    menuArray.forEach((item) => {
      if (item.label == null && item.type === 'separator') {
        var separator = $('<hr/>')
        itemElement.append(separator)
        return
      }
      if (item.visible === false) return
      var subItemElement = $('<div class="sub-menu-child"/>')
      var subItemLabel = $('<span class="sub-menu-label"/>')
      var subItemKeystroke = $('<span class="sub-menu-keystroke">')
      if (item.enabled === false) subItemElement.addClass('disabled')
      switch (item.label) {
        case 'VERSION':
          subItemLabel.text(atom.getVersion())
          break
        default:
          subItemLabel.text(this.removeAmp(item.label))
      }

      if (item.command != null) {
        subItemKeystroke.text(this.getPlatformSpecificKeystroke(atom.keymaps.findKeyBindings({ command: item.command })))
        subItemElement.click(function () {
          atom.commands.dispatch(atom.views.getView(atom.workspace), item.command)
        })
      }
      subItemElement.append(subItemLabel, subItemKeystroke)
      itemElement.append(subItemElement)
      var altData = this.formatAltKey(item.label)
      var s = altData.html
      subItemElement.attr('data-alt', s)
      if (item.submenu !== undefined) {
        subItemElement.addClass('has-sub')
        var menu = this.traverseMenu(item.submenu)
        menu.addClass('menu-item-submenu')
        subItemElement.mouseenter(function () {
          $(this).children('.menu-item-submenu').css('display', 'block')
        })
        subItemElement.append(menu)
        subItemKeystroke.text('>')
      }
      itemElement.append(subItemElement)
    })
    itemElement.children().mouseenter(function (event) {
      const target = $(event.target)
      target.siblings('.has-sub').children('.menu-box').css('display', 'none')
    })
    return itemElement
  }

  /**
  * Strips the Ampersand from string and creates an html version with the key underlined.
  * @private
  * @param {string} string - The name you want to format.
  * @returns { {html: string, name: string, key: ?string} } An object that contains the html, name, and key. */
  formatAltKey (string) {
    if (typeof string !== 'string') return { html: string, name: string, key: null }
    var keys = string.match(/&./)
    if (keys == null) {
      return { html: string, name: string, key: null }
    }
    var html = string.replace(/&./g, '<u>$&</u>')
    html = this.removeAmp(html)
    return { html: html, name: this.removeAmp(string), key: keys[0].slice(1).toLowerCase() }
  }

  /**
  * Removes ampersand.
  * @private
  * @param {string} string
  * @returns {string} modifiedString
   */
  removeAmp (string) {
    return string.replace(/[&]/, '')
  }

  /**
  * @typedef {object} KeyBinding
  * @property {?string[]} cachedKeyups
  * @property {string} command
  * @property {number} index
  * @property {string[]} keystrokeArray
  * @property {number} keystrokeCount
  * @property {string} keystrokes
  * @property {number} priority
  * @property {string} selector
  * @property {string} source
  * @property {number} specificity
  */
  /**
  * Gets the platform from the keystroke object.
  * @private
  * @param {KeyBinding} keystrokeObj - comes from atom.keymaps.findKeyBindings()
  * @returns {'win32'|'darwin'|'linux'|null}
  */
  getPlatformKeystroke (keystrokeObj) {
    if (keystrokeObj.selector.includes('win32') || keystrokeObj.source.includes('win32')) {
      return 'win32'
    } else if (keystrokeObj.selector.includes('darwin') || keystrokeObj.source.includes('darwin')) {
      return 'darwin'
    } else if (keystrokeObj.selector.includes('linux') || keystrokeObj.source.includes('linux')) return 'linux'
    return null
  }

  /**
  * Attempts to get most relavant keystroke
  * @private
  * @param {!KeyBinding[]} keystrokeArray
  * @returns {KeyBinding}
  */
  getPlatformSpecificKeystroke (keystrokeArray) {
    for (var i = 0; i < keystrokeArray.length; i++) {
      var platform = this.getPlatformKeystroke(keystrokeArray[i])
      if (platform === process.platform) {
        return keystrokeArray[i].keystrokes
      }
    }
    if (keystrokeArray[0] == null) return ''
    return keystrokeArray[0].keystrokes
  }
}
