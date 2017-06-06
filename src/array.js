const R = require('ramda');

const isArray = Array.isArray;

const toArray = R.cond([
  [R.isNil, () => []],
  [isArray, R.identity],
  [R.T, x => [x]]
]);

module.exports = {
  isArray,
  toArray
};
