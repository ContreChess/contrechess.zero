import Marionette     from 'backbone.marionette';
import NavigationView from './navigation.js';
import FooterView     from './footer.js';
import tmpl           from '../templates/index.chbs';
let    _self;

const IndexView = Marionette.View.extend({
  initialize: function (options) {
    if (!this.model) {
      console.log('no model passed in to root view');
    }

    this.navigationView = new NavigationView({ model: this.model });
    this.footerView = new FooterView({ model: this.model });
    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  regions: {
    navigation: '.navigation',
    container: 'main > .game.container',
    main: 'main',
    footer: '.footer',
  },
  onRender: function () {
    this.showChildView('navigation', this.navigationView);
    this.showChildView('footer', this.footerView);
  }
});

export default IndexView;
