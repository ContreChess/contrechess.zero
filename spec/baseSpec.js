
describe('Base Suite', function () {
  var Component = require('../src/js/_base/component'),
      component;
  
  beforeAll(function () {
    component = new Component();
  });

  it('contains a MarionetteJS-based component which requires a name when adding components', function () {
    var componentAdder = function () {
     component.addComponent(null, { componentClass: Object });
    };

    expect(componentAdder).toThrow();
  })

  it('contains a MarionetteJS-based component which requires an options object when adding components', function () {
    var componentAdder = function () {
     component.addComponent('foo');
    };

    expect(componentAdder).toThrow();
  })

  it('contains a MarionetteJS-based component which requires an options object containing a componentClass property when adding components', function () {
    var componentAdder = function () {
     component.addComponent('foo', {});
    };

    expect(componentAdder).toThrow();
  })

  it('contains a MarionetteJS-based component which requires an options object containing a componentClass property with a valid class function when adding components', function () {
    var componentAdder = function () {
     component.addComponent('foo', { componentClass: 'not a valid function' });
    };

    expect(componentAdder).toThrow();
  })

  it('contains a MarionetteJS-based component which can add components', function () {
    component.addComponent('foo', { componentClass: Object });

    expect(component.components['foo']).not.toBeUndefined();
  })

  it('contains a MarionetteJS-based component which instantiates a component when adding components', function () {
    expect(component.addComponent('bar', { componentClass: Date }) instanceof Date).toBe(true);
  })
});

