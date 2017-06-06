const R = require('ramda');
const Maybe = require('data.maybe');

// Can be used for both objects and arrays
const tryGet = R.curry((key, obj) => {
  return !R.isNil(obj) && R.has(key, obj) ?
    Maybe.Just(obj[key]) :
    Maybe.Nothing();
});

module.exports = {
  tryGet
};
