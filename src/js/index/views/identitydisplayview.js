import Marionette from 'backbone.marionette';
import     tmpl   from '../templates/identitydisplaypanel.chbs.js';
let _self;

const IndexIdentityView = Marionette.View.extend({
  initialize: function () {
    _self = this;
    if (!this.model) {
      console.log('no model passed in to the identity display view');
    }
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  modelEvents: {
    'change:user': 'onUserChanged'
  },
  onUserChanged: function (model, value) {
    if (value && value !== '') {
      _self.render();
    }
  }
});

export default IndexIdentityView;
