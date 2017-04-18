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
    onRender: function (view) {
      // TODO: get accordions via 'getUI'
      
      if (jQuery.fn.accordion) {
      }
    }
  });
