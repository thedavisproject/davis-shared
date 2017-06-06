const R = require('ramda');

module.exports = {
  log: function(){
    console.log.apply(console, arguments);
  },
  tap: R.tap
};
