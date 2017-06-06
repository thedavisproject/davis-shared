const {expect} = require('chai');
const R = require('ramda');
const compare = require('../src/compare');

const people = [
  {id: 2, name: 'Adam', age: 40},
  {id: 6, name: 'John', age: 25},
  {id: 3, name: 'Mary', age: 10},
  {id: 10, name: 'Jessica', age: 36},
  {id: 25, name: 'Charles', age: 25}
];

describe('Comparators', function(){

  const ageComparer = compare.compare(x => x.age),
    nameComparer = compare.compare(x => x.name);

  it('should sort ascending comparator', function(){
    const comparer = ageComparer(compare.ascending);
    expect(R.sort(comparer, people).map(p => p.id)).to.deep.equal([3, 6, 25, 10, 2]);
  });

  it('should sort descending comparator', function(){
    const comparer = ageComparer(compare.descending);
    expect(R.sort(comparer, people).map(p => p.id)).to.deep.equal([2, 10, 6, 25, 3]);
  });

  it('should compose comparers', function(){
    const comparer = compare.composeComparators([
      ageComparer(compare.ascending),
      nameComparer(compare.ascending)]);

    expect(R.sort(comparer, people).map(p => p.id)).to.deep.equal([3, 25, 6, 10, 2]);
  });

});
