describe('Signup Suite', function () {
  var rootModel = require('../src/js/root/models/display'); 
  it('contains a model whose defaults are set', function () {
    var model = new rootModel();

    expect(model.get('text')).toBe('This will be the future home of contre.bit')
  })
});

