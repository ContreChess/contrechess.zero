import Bootstrap from './bootstrap';

import App       from './app';
import Index     from './index/index';
import Signup    from './signup/signup';
import Discovery from './discovery/discovery';


const app = new App();

app.addComponent({
  name: 'root', 
  componentClass: Index,
  isRoot: true
});

app.addComponent({
  name: 'signup', 
  componentClass: Signup
});

app.addComponent({
  name: 'discovery', 
  componentClass: Discovery
});

app.start();

