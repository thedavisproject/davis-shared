const R = require('ramda');
const Either = require('data.either');
const Task = require('data.task');

const thread = (data, ...fns) => {
  return fns.length > 0 ?
    R.pipe.apply(null, fns)(data) :
    data;
};

// maybe2Either :: (Maybe a, Either b) => x => a => b
const maybe2Either = R.curry((errorMsg, a) =>
  a.isJust ? Either.Right(a.get()) : Either.Left(errorMsg));

// either2Task :: (Either a, Task b) => x => a => b
const either2Task =  a =>
  a.isLeft ? Task.rejected(a.merge()) : Task.of(a.get());

module.exports = {
  thread,
  maybe2Either,
  either2Task
};

