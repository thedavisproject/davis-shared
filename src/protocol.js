// Implementation of Clojure style protocols
// Resolves implementations by the object's __type property.
// Using actual types is unsafe in this project, because we
// make extensive use of object clones and immutable objects.
// Cloning an object will drop constructor information,
// and render the protocol useless.
const R = require('ramda');

module.exports = function createProtocol(signature){

  const implementations = {};

  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null) result = [];
    return result;
  }

  function registerImplementation(type, methods){
    // Check the implementation
    Object.keys(signature).forEach(k => {
      const impFn = methods[k];
      if(!impFn){
        throw Error(`Error registering protocol implementation. Method not implemented: ${k}`);
      }

      const impFnParams = getParamNames(impFn);

      if(!R.equals(signature[k].length, impFnParams.length)){
        throw Error(`Error registering protocol implementation. Method not implemented with proper number of parameters: ${k}. Expected: (${signature[k].join(', ')}) Found: (${impFnParams.join(', ')})`);
      }
    });

    implementations[type] = methods;
  }

  function resolveImplementation(types, methodKey){

    if(!types || !types.length){
      throw Error(`No implementation found for method: ${methodKey}`);
    }

    const implementation = implementations[types[0]];

    if(!implementation || !implementation[methodKey]){
      // Recurse. Check the next types up the list
      return resolveImplementation(R.tail(types), methodKey);
    }

    return implementation[methodKey];
  }

  function createDispatch(methodKey){

    return function dispatch(...args){
      const protocolObj = R.last(args);
      const implementation = resolveImplementation(protocolObj.__type, methodKey);
      return implementation.apply(null, args);
    };
  }

  Object.keys(signature).forEach(k => {
    registerImplementation[k] = createDispatch(k);
  });

  return registerImplementation;
};
