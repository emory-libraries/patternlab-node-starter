// Load extensions.
const helpers = require('./_helpers.js');

// Initialize extensions.
module.exports = (engine) => {

  // Load helpers.
  for( let key in helpers ) {

    if( helpers[key] ) engine.registerHelper(key, helpers[key]);

  }

  // Done.
  return engine;

};
