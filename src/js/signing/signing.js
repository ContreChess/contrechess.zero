import Backbone      from 'backbone';
import View          from './views/signing';
import ViewComponent from '../_base/view-component';

let _self;

const Signing = ViewComponent.extend({
  appChannel: 'signing',
  initialize: function (options) {
    this.view = new View();
  }
});

export default Signing;

