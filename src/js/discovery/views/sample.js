import Marionette from 'backbone.marionette';
import $          from 'jquery';
import accordion  from '../../../../semantic/dist/components/accordion';
import rating     from '../../../../semantic/dist/components/rating';
import Radio      from 'backbone.radio';
import tmpl       from '../templates/sample.chbs';
let _self;


const DiscoverySampleView = Marionette.View.extend({
  initialize: function (options) {
    _self = this;
  },
  template: function () {
    return _self.model ?
      tmpl(_self.model.toJSON()):
      tmpl();
  },
  ui: {
    playerAccordian: '.player.ui.accordian',
    playerRatings: '.player.ui.rating'
  },
  onRender: function (view) {
    let playerAccordian = this.getUI('playerAccordian'),
        playerRatings   = this.getUI('playerRatings');
    
    if (jQuery.fn.accordion) {
      let accordions =
          playerAccordian
          .accordion();
    }

    if (jQuery.fn.rating) {
      let  ratings =
          playerRatings
          .rating('disable');
    }
  }
});

export default DiscoverySampleView;
