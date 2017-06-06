const {expect} = require('chai');
const protocol = require('../src/protocol');

describe('Protocols', function(){

  it('should properly register protocol', function(){

    const proto = protocol({
      foo: ['data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    });

    const dataObj = {
      __type: ['type1']
    };

    expect(proto.foo(dataObj)).to.equal('bar');
  });

  it('should properly register protocol with multiple methods', function(){

    const proto = protocol({
      foo: ['data'],
      bar: ['x', 'data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      },
      bar: function(x, data){
        return x + data.val;
      }
    });

    const dataObj = {
      __type: ['type1'],
      val: 3
    };

    expect(proto.foo(dataObj)).to.equal('bar');
    expect(proto.bar(7, dataObj)).to.equal(10);
  });

  it('should choose the right implementation', function(){

    const proto = protocol({
      foo: ['data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    });

    proto('type2', {
      foo: function(dataIgnored){
        return 'baz';
      }
    });

    const dataObj1 = {
      __type: ['type1']
    };

    const dataObj2 = {
      __type: ['type2']
    };

    expect(proto.foo(dataObj1)).to.equal('bar');
    expect(proto.foo(dataObj2)).to.equal('baz');
  });

  it('should choose the first type implementation', function(){

    const proto = protocol({
      foo: ['data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    });

    proto('type2', {
      foo: function(dataIgnored){
        return 'baz';
      }
    });

    const dataObj1 = {
      __type: ['type2', 'type1']
    };

    expect(proto.foo(dataObj1)).to.equal('baz');
  });

  it('should fall back to implementations for types later in the list', function(){

    const proto = protocol({
      foo: ['data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    });

    const dataObj1 = {
      __type: ['type2', 'type1']
    };

    expect(proto.foo(dataObj1)).to.equal('bar');
  });

  it('should throw exception for no implementation found', function(){

    const proto = protocol({
      foo: ['data']
    });

    proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    });

    const dataObj1 = {
      __type: ['typea', 'typeb']
    };

    expect(() => proto.foo(dataObj1)).to.throw('No implementation found for method: foo');
  });

  it('should throw registration exception for method not implemented', function(){

    const proto = protocol({
      foo: ['data']
    });

    expect(() =>proto('type1', {
      bar: function(dataIgnored){
        return 'bar';
      }
    })).to.throw('Error registering protocol implementation. Method not implemented: foo');

  });

  it('should throw registration exception for method not implemented with correct number of parameters', function(){

    const proto = protocol({
      foo: ['param1', 'data']
    });

    expect(() =>proto('type1', {
      foo: function(dataIgnored){
        return 'bar';
      }
    })).to.throw('Error registering protocol implementation. Method not implemented with proper number of parameters: foo. Expected: (param1, data) Found: (dataIgnored)');

  });

});
