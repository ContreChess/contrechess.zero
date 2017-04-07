  require('./bootstrap');

  var App       = require('./app'),
      Root      = require('./root/index'),
      Signup    = require('./signup/signup'),
      Discovery = require('./discovery/discovery');

  var app = new App();

  app.addComponent('root', {
    componentClass: Root,
    isRoot: true
  });

  app.addComponent('signup', {
    componentClass: Signup
  });

  app.addComponent('discovery', {
    componentClass: Discovery
  });

  app.start();

