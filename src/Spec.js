/**
 * Class for defining specification objects for javascript files created with
 * this framework
 * @param {String} filePath the path to the file relative to ConfigManager.getApplicationPath
 * @param {Array} dependencies a list of specs that the file is dependent on
 * @constructor
 */
function Spec(objectName, filePath, dependencies){
  this.objectName = objectName;
  this.filePath = filePath;
  this.dependencies = dependencies || [];
}

/**
 * Adds a new dependency
 * @param {String} dependency the object name as listed in your specs object
 */
Spec.prototype.addDependency = function(dependency){
  this.dependencies.push(dependency);
};

/**
 * Removes a dependency from the list
 * @param {String} dependency the object name as listed in your specs object
 */
Spec.prototype.removeDependency = function(dependency){
  var remIndex = Util.indexOf(this.dependencies, dependency);
  this.dependencies.splice(remIndex, 1);
};

Spec.prototype.getDependencies = function(){
  return this.dependencies;
};

Spec.prototype.getObjectName = function(){
  return this.objectName;
};

Spec.prototype.getFilePath = function(){
  return this.filePath;
};
