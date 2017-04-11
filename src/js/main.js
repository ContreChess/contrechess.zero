  require('./bootstrap');

  var App       = require('./app'),
      Root      = require('./root/index'),
      Signup    = require('./signup/signup');

  var app = new App();

  app.addComponent('root', {
    componentClass: Root,
    isRoot: true
  });

  app.addComponent('signup', {
    componentClass: Signup
  });

  app.start();

