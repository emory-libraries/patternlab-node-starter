// Load modules.
var fs = require('fs'),
    path = require('path');

// Capture arguments.
var config = {
      dirs: process.argv.slice(2, process.argv.length),
      ext: {
        in: '.mustache.pre',
        out: '.mustache',
      },
      delimiter: [ '[[', ']]'],
      copy: {
        enabled: false,
        ext: '.mustache.pre'
      }
    },
    walkDir = function(dir, callback){

      // Read files.
      var list = fs.readdirSync(dir),
          regex = new RegExp(escapeRegExp(config.ext.in) + '$');

      // Resolve files.
      list.forEach(function(file, index){

        file = path.resolve(dir, file);

        // Deep file search.
        if( fs.statSync(file).isDirectory() ){

          walkDir(file, callback);

        }
        else if( regex.test(file) === true ) {

          callback(file);

        }

      });

    },
    escapeRegExp = function( string ){
      return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    getMatches = function( regex, contents ){

      var match = null, matches = [];

      regex.lastIndex = 0;

      while( (match = regex.exec(contents)) ){
        if( matches.indexOf(match) == -1 ){
          matches.push(match);
        }
      }

      return matches;

    },
    readFile = function( file ){
      return fs.readFileSync( file ).toString();
    },
    copyFile = function( file ){
      fs.writeFileSync(file.replace(config.ext.in,'') + config.copy.ext, readFile(file) );
    },
    saveFile = function( file, contents ){
      fs.writeFileSync(file.replace(config.ext.in,'') + config.ext.out, contents);
    },
    parseFile = {
      each: function(contents, data){

        var regex = new RegExp(
          escapeRegExp(config.delimiter[0]) + '#EACH +(.+?) *' + escapeRegExp(config.delimiter[1]) +
          '((?:\\s|\\S)+?)' +
          escapeRegExp(config.delimiter[0]) + '\/EACH +\\1 *' + escapeRegExp(config.delimiter[1]), 'g'
        );

        if( regex.test(contents) !== true ) return false;

        var matches = getMatches( regex, contents );

        if( config.copy.enabled === true ) copyFile( file );

        matches.forEach(function(match){

          // Parse match.
          var source = match[0],
              id = match[1],
              template = match[2],
              output = [];

          if( !data[id] ) return false;

          data[id].forEach(function(object){

            var result = template.trim(),
                resultRegex = new RegExp(
                  '(' + escapeRegExp(config.delimiter[0]) + ' *' + // OPEN DELIMITER ([[)
                  '((?:.+) +\\&\\&)* *' + // ANDs (&&)
                  escapeRegExp(id) + '\\.(.+?) *' + // SELECTOR
                  '((?:(?:\\|\\| +.+?)|(?:\\&\\& +.+?))*?)? *' + // ORs (||) and ANDs (&&)
                  '(\\?\\??)? *' + // CONDITIONALS
                  escapeRegExp(config.delimiter[1]) + ')', 'g' // CLOSE DELIMITER (]])
                );

            if( resultRegex.test(result) !== true ) return true;

            var resultMatches = getMatches( resultRegex, result );

            resultMatches.forEach(function(resultMatch){

              var orig = resultMatch[0],
                  bind = resultMatch[1],
                  andsBefore = resultMatch[2],
                  key = resultMatch[3],
                  ors_andsAfter = resultMatch[4],
                  conditional = (resultMatch[5] == '??' || resultMatch[5] == '?') ? true : false,
                  additional = andsBefore || (ors_andsAfter && ors_andsAfter.indexOf('&&') > -1) ? true : false;

              // Bind simple variables.
              if( object.hasOwnProperty(key) && object[key] && !conditional && !additional ){
                result = result.replace(bind, object[key]);
              }
              // Bind additional and conditional variables.
              else if( conditional && additional ){
                
                var ands = {
                  before: andsBefore,
                  after: (ors_andsAfter && ors_andsAfter.indexOf('&&') > -1 ) ? ors_andsAfter : ''
                };
                
                ands.before = ands.before.split('&&').map(function(and){ return and.trim(); });  
                ands.after = ands.after.split('&&').map(function(and){ return and.trim(); }); 
                
                for(var i = 0; i < ands.before.length; i++){

                  var and = ands.before[i];

                  if(and.indexOf('"') === 0 || and.indexOf("'") === 0){

                    ands.before[i] = and.replace(/"/g,'').replace(/'/g,'');

                    break;

                  }
                  else if(object.hasOwnProperty(and) && object[and]) {

                    ands.before[i] = and.replace(and, object[and]);

                    break;

                  }

                }
                for(var i = 0; i < ands.after.length; i++){

                  var and = ands.after[i];

                  if(and.indexOf('"') === 0 || and.indexOf("'") === 0){

                    ands.after[i] = and.replace(/"/g,'').replace(/'/g,'');

                    break;

                  }
                  else if(object.hasOwnProperty(and) && object[and]) {

                    ands.after[i] = and.replace(and, object[and]);

                    break;

                  }

                }
                
                if(object.hasOwnProperty(key) && object[key]){
                  result = result.replace(bind, ands.before.join('') + object[key] + ands.after.join(''));
                }
                else if( conditional == '??' ) {

                  var sub = result.match(new RegExp(
                    '[A-Za-z0-9-_="\']*' +
                    escapeRegExp(orig) +
                    '[A-Za-z0-9-_="\']*',
                    'g'));

                  result = result.replace(sub, '');

                }
                else {
                  
                  var sub = result.match(new RegExp( escapeRegExp(orig), 'g'));

                  result = result.replace(sub, '');
                  
                }
                
              }
              // Bind additional variables.
              else if( additional ){
                
                var ands = {
                  before: andsBefore,
                  after: (ors_andsAfter && ors_andsAfter.indexOf('&&') > -1 ) ? ors_andsAfter : ''
                };
                
                ands.before = ands.before.split('&&').map(function(and){ return and.trim(); });  
                ands.after = ands.after.split('&&').map(function(and){ return and.trim(); }); 
                
                for(var i = 0; i < ands.before.length; i++){

                  var and = ands.before[i];

                  if(and.indexOf('"') === 0 || and.indexOf("'") === 0){

                    ands.before[i] = and.replace(/"/g,'').replace(/'/g,'');

                    break;

                  }
                  else if(object.hasOwnProperty(and) && object[and]) {

                    ands.before[i] = and.replace(and, object[and]);

                    break;

                  }

                }
                for(var i = 0; i < ands.after.length; i++){

                  var and = ands.after[i];

                  if(and.indexOf('"') === 0 || and.indexOf("'") === 0){

                    ands.after[i] = and.replace(/"/g,'').replace(/'/g,'');

                    break;

                  }
                  else if(object.hasOwnProperty(and) && object[and]) {

                    ands.after[i] = and.replace(and, object[and]);

                    break;

                  }

                }
                
                if(object.hasOwnProperty(key) && object[key]){
                  result = result.replace(bind, ands.before.join('') + object[key] + ands.after.join(''));
                }
                else {

                  result = result.replace(bind, ands.before.join('') + ands.after.join(''));
                  
                }
                
              }
              // Bind conditional variables.
              else if( conditional ){

                if(object.hasOwnProperty(key) && object[key]){
                  result = result.replace(bind, object[key]);
                }
                else if( conditional == '??' ) {

                  var sub = result.match(new RegExp(
                    '[A-Za-z0-9-_="\']*' +
                    escapeRegExp(orig) +
                    '[A-Za-z0-9-_="\']*',
                    'g'));

                  result = result.replace(sub, '');

                }
                else {
                  
                  var sub = result.match(new RegExp( escapeRegExp(orig), 'g'));

                  result = result.replace(sub, '');
                  
                }

              }
              // Bind fallback variables.
              else if ( ors_andsAfter ) {
                  
                var ors = ors_andsAfter;

                ors = ors.split('||').map(function(or){ return or.trim(); });

                for(var i = 0; i < ors.length; i++){

                  var or = ors[i];

                  if(or.indexOf('"') === 0 || or.indexOf("'") === 0){

                    result = result.replace(bind, or.replace(/"/g,'').replace(/'/g,''));

                    break;

                  }
                  else if(object.hasOwnProperty(or) && object[or]) {

                    result = result.replace(bind, object[or]);

                    break;

                  }

                }

              }
              // Bind nothing.
              else {
                result = result.replace(bind, '');
              }

            });

            output.push(result);

          });

          contents = contents.replace(source, output.join("\n"));

        });

        return contents;

      }
    };

// Loop through paths.
config.dirs.forEach(function(dir){

  walkDir(dir, function(file){

    var dirname = path.dirname(path.resolve(file)),
        filename = path.basename(path.resolve(file)),
        contents = readFile( file ),
        json = filename.replace(config.ext.in,'.json'),
        data = JSON.parse( readFile(dirname + '/' + json) );

    // Parse files.
    for(var parser in parseFile){

      if(typeof parseFile[parser] == 'function'){

        saveFile( file, parseFile[parser](contents, data) );

      }

    }

  });

});
