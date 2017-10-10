import Marionette          from 'backbone.marionette';
import IdentityDisplayView from './identitydisplayview.js';
import tmpl                from '../templates/navigation.chbs';
let     _self;

const IndexNavigationView = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to root view');
    }

    this.identityDisplayView = new IdentityDisplayView({model: this.model});

    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  regions: {
    identityDisplay: '.identity.display',
  },
  onRender: function () {
    this.showChildView('identityDisplay', this.identityDisplayView);
  }
});

export default IndexNavigationView;
