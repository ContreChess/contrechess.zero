  require('./bootstrap');

  var App   = require('./app'),
      Root  = require('./root/index');

  var app   = new App();

  app.addComponent('root', {
    componentClass: Root,
    isRoot: true
  });

  app.start();

