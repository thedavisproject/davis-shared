const R = require('ramda');

exports.composeComparators =
    (comparators) =>
        (a, b) =>
          comparators.reduce(
            (prevResult, c) =>
              prevResult !== 0 ? prevResult : c(a, b), 0);

exports.ascending = R.lt;

exports.descending = R.gt;

exports.compare = R.curry((f, compareOp) => R.comparator((a, b) => compareOp(f(a), f(b))));
