import Backbone      from 'backbone';
import Signing       from '../signing/signing';
import View          from './views/root';
import ViewComponent from '../_base/view-component';

let signing,
    _self;
  

const Root = ViewComponent.extend({
  appChannel: 'root',
  initialize: function (options) {
    _self = this;
    this.view = new View();
    signing = new Signing();
    this.listenTo(this.view, 'render', this.onViewRender); 
  },
  onViewRender: function () {
    let signingRegion = this.view.getRegion('signing');
    
    signing.showView(signingRegion);
  }
});

export default Root;

