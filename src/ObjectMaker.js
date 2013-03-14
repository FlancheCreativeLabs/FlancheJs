/**
 * @description Allows creation of objects (singletons) by creating a new class and instantiating
 * only one object.
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param objectMeta
 */
function ObjectMaker(objectMeta){
  this.objectMeta = objectMeta;
}

/**
 * Builds the object according to the specifications
 */
ObjectMaker.prototype.buildObject = function(){
  var parts = this.objectMeta.className.split(".");
  var objectName = parts.pop();
  var container = Util.createNamespace(parts.join("."));
  this.objectMeta.className = ConfigManager.getObjectInternalIdentifier() + this.objectMeta.className;
  var classMaker = new ClassMaker(this.objectMeta);
  classMaker.buildClass();
  var current = Util.getMainNamespace()[ConfigManager.getObjectInternalIdentifier() + parts[0]];
  for(var i = 1; i < parts.length; i++){
    current = current[parts[i]];
  }
  container[objectName] = new current[objectName]();
};


