const {expect} = require('chai');

const assertIsImmutable = function(obj) {
  obj.foo = 'bar';
  expect(obj).to.not.have.property('foo');
  expect(() => { Object.assign(obj, {foo: 'bar'});}).to.throw(/object is not extensible/);
};

module.exports = {
  assertIsImmutable
};
