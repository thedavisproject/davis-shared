const {expect} = require('chai');
const R = require('ramda');
const Maybe = require('data.maybe');
const Either = require('data.either');

const {thread, maybe2Either, either2Task} = require('../src/fp');

describe('Compose', function(){

  it('should thread first argument as data value through series of functions', function(){

    const out = thread(['an', 'array', 'to', 'test'],
      R.map(R.toUpper),
      R.reverse);

    expect(out).to.deep.equal(['TEST', 'TO', 'ARRAY', 'AN']);
  });

  it('should return 1st argument if only 1 is present', function(){
    expect(thread('One Arg')).to.equal('One Arg');
  });

});

describe('maybe2Either', function(){
  it('should convert Nothing to Left', function(){
    const result = maybe2Either('Error msg', Maybe.Nothing());
    expect(result.isLeft).to.be.true;
    expect(result.merge()).to.equal('Error msg');
  });

  it('should convert Just to Right', function(){
    const result = maybe2Either('Anything', Maybe.Just(6));
    expect(result.isRight).to.be.true;
    expect(result.merge()).to.equal(6);
  });
});

describe('either2Task', function(){

  it('should convert Left to Rejected', function(done){
    const result = either2Task(Either.Left('Error msg'));

    result.fork(error => {
      expect(error).to.equal('Error msg');
      done();
    },
    successIgnored => {
      done('Should not hit success branch');
    });
  });

  it('should convert Right to Success', function(done){
    const result = either2Task(Either.Right('Success!'));

    result.fork(errorIgnored => {
      done('Should not hit error branch');
    },
    success => {
      expect(success).to.equal('Success!');
      done();
    });
  });
});
