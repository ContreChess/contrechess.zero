import Marionette from 'backbone.marionette';
import tmpl       from '../templates/footer.chbs';
let  _self;

const IndexFooterView = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to the footer view');
    }

    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  }
});

export default IndexFooterView;
