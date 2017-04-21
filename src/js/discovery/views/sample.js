var Marionette  = require('backbone.marionette'),
    $           = require('jquery'),
    accordion   = require('../../../../semantic/dist/components/accordion'),
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
      playerAccordian: '.player.ui.accordian'
    },
    onRender: function (view) {
      var playerAccordian = this.getUI('playerAccordian');
      
      if (jQuery.fn.accordion) {
        var accordions =
            playerAccordian
            .accordion();
      }
    }
  });
