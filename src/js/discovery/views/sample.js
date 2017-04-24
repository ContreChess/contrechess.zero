var Marionette  = require('backbone.marionette'),
    $           = require('jquery'),
    accordion   = require('../../../../semantic/dist/components/accordion'),
    rating      = require('../../../../semantic/dist/components/rating'),
    Radio       = require('backbone.radio'),
    tmpl        = require('../templates/sample.chbs'),
    _self;


  module.exports = Marionette.View.extend({
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
      var playerAccordian = this.getUI('playerAccordian'),
          playerRatings   = this.getUI('playerRatings');
      
      if (jQuery.fn.accordion) {
        var accordions =
            playerAccordian
            .accordion();
      }

      if (jQuery.fn.rating) {
        var ratings =
            playerRatings
            .rating('disable');
      }
    }
  });
