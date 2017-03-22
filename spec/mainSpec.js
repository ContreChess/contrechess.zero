require('../src/js/bootstrap');
require('./baseSpec');
require('./rootSpec');
require('./signupSpec');


describe('Main Suite', function () {
  it('contains spec with an expectation', function () {
    expect(true).toBe(true)
  })
});

