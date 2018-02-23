import Marionette from 'backbone.marionette';
import tmpl       from '../templates/signing.chbs';
let _self;

const SigningView = Marionette.View.extend({
  initialize: function (options) {
  _self = this;
  },
  template: function (data) {
    return tmpl();
  }
});

export default SigningView;
