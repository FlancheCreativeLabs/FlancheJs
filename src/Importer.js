/**
 * Packaging system for retrieving the files in which the classes are stored
 * @param specs a hash of type {objectName : objectSpec}
 * @constructor
 */

function Importer(specs){
  if(!specs){
    throw new ImportException("No specs object could be found. Maybe you forgot to add it via FlancheJs.getConfig().setSpecs()");
  }
  this.specs = specs;
  this.collectedObjects = {};
}

Importer.prototype.import = function(objectName, callback, context){
  console.log(1,objectName,callback)
  this.collectFiles(objectName);
  this.importCollectedObjects(callback, context);
  this.collectedObjects = {};
}

Importer.prototype.collectFiles = function(objectName){
  if(!Util.exists(this.collectedObjects[objectName])){
    if(!Util.exists(this.specs[objectName])){
      throw new ImportException("Could not find a suitable spec object for " + objectName + ". Make sure it is included in FlancheJs.config.getSpecs();");
    }
    var spec = this.specs[objectName];
    var deps = spec.getDependencies();
    for(var i = 0; i < deps.length; i++){
      this.collectFiles(deps[i]);
    }
    this.collectedObjects[objectName] = objectName;
  }
}

Importer.prototype.importCollectedObjects = function(callback, context){
  var paths = [];
  for(var objectName in this.collectedObjects){
    if(this.collectedObjects.hasOwnProperty(objectName)){
      if(!Util.exists(this.specs[objectName])){
        throw new ImportException("No object name *" + objectName + "* found in the specs.");
      }
      var pathToFile = ConfigManager.getApplicationPath() + this.specs[objectName].getFilePath();
      paths.push(pathToFile);
    }
  }
  var realContext = Util.exists(context) ? context : window;
  this.loadScripts.js(paths, callback, null, realContext);
};