'use babel';

import AtomTitleRibbonView from './atom-title-ribbon-view';
import { CompositeDisposable } from 'atom';

export default {

  atomTitleRibbonView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomTitleRibbonView = new AtomTitleRibbonView(state.atomTitleRibbonViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomTitleRibbonView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-title-ribbon:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomTitleRibbonView.destroy();
  },

  serialize() {
    return {
      atomTitleRibbonViewState: this.atomTitleRibbonView.serialize()
    };
  },

  toggle() {
    console.log('AtomTitleRibbon was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
