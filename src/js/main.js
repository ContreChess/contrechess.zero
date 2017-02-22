  require('./bootstrap');

  var App   = require('./app'),
      View  = require('./root/views/index'),
      Root  = require('./root/index');

  var app   = new App();

  app.addComponent('root', {
    componentClass: Root,
    isRoot: true
  });

  app.start();

