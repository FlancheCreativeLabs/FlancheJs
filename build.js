(function(){

  var gear = require('gear');
  var gear_lib = require('gear-lib');


  var FILES = ["InternalHeader.js", "Constants.js", "ConfigManager.js", "Exception.js", "Util.js", "Spec.js", "Importer.js", "../lib/LazyLoad/lazyload.js", "ClassMetadata.js", "ClassMaker.js",
    "TraitMetadata.js", "TraitMaker.js", "ObjectMaker.js", "PublicAPI.js", "InternalFooter.js"];

  var processFiles = function(files){
    var mappedFiles = files.map(function(value){
      return './src/' + value;
    });
    return mappedFiles;
  };

  function getAllFiles(){
    return processFiles(FILES);
  }

  function buildEnvBrowser(debug){
    var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
      .log("=== Building FlancheJs ===")
      .log("#Reading files")
      .read(getAllFiles())
      .log("#Concatenating files")
      .concat();

    if(!debug){
      build = build.log("#Minifying files")
        .jsminify({
          config: {
            mangle: true
          }
        })
        .log("#Writing to ./dist/FlancheJs.min.js")
        .write("./dist/FlancheJs.min.js");
    }
    else{
      build = build.log("#Writing to ./dist/FlancheJs.debug.js")
        .write("./dist/FlancheJs.debug.js")
    }

    build.run(function(err, results){
      if(err){
        console.log(err);
        return;
      }
      console.log("#Build finished successfully!");
    });
  }

  function buildEnvNode(){
    var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
      .log("=== Building FlancheJs ===")
      .log("#Reading files")
      .read(getAllFiles())
      .log("#Concatenating files")
      .concat()
      .log("#Minifying files")
      .log("#Writing to ./dist/FlancheJs.node.js")
      .write("./dist/FlancheJs.node.js")
      .run(function(err, results){
        if(err){
          console.log(err);
          return;
        }
        console.log("#Build finished successfully!");
      });
  }

  function parseCommands(){
    var debug = false, env = "browser";
    process.argv.forEach(function(value){
      if(value === "--debug"){
        debug = true;
      }
      else if(value === "--browser"){
        env = "browser";
      }
      else if(value === "--nodejs"){
        env = "nodejs";
      }
    });
    if(env === "browser"){
      buildEnvBrowser(debug);
    }
    else{
      buildEnvNode();
    }
  }

  parseCommands();

})();