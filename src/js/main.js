  require('./bootstrap');

  var App   = require('./app'),
      View  = require('./root/views/index'),
      Root  = require('./root/index');

  var app   = new App(),
      view  = new View();

  app.addSubApp('root', {
    subAppClass: Root,
    container: view.getRegion('main')
  });

  app.start();

