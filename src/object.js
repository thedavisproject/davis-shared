const R = require('ramda');

exports.evolveKeys = R.curry(function(keyMap, obj){

  var newObj = {};

  R.keys(obj).forEach(function(k){
    if(keyMap[k]){
      newObj[keyMap[k]] = obj[k];
    }
    else{
      newObj[k] = obj[k];
    }
  });

  return newObj;
});
