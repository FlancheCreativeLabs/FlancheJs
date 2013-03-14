/**
 * @description Allows creation of classes based on the metadata supplied
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param {ClassMetadata} classMetadata the class metadata supplied
 */
function ClassMaker(classMetadata){
  this.constrClass = null;
  this.classMetadata = classMetadata;
}

/**
 * Creates the initial class object
 * @param {String} fullClassName the full name of the class, including the namespace
 * @return {Object} the constructed class
 */
ClassMaker.prototype.createClass = function(){
  var parts = this.classMetadata.className.split(".");
  var className = parts.pop();
  var container = Util.createNamespace(parts.join("."));

  container[className] = function builder(){
    var properties = this.__meta__.properties;
    var internals = this.__meta__.internals;
    for(var index in properties){
      this[ConfigManager.getPropertyIdentifier() + index] = Util.clone(properties[index].value);
    }
    for(index in internals){
      this[ConfigManager.getInternalIdentifier() + index] = Util.clone(internals[index]);
    }
    this.__meta__.init.apply(this, arguments);
  };

  this.constrClass = container[className];
};


/**
 * Builds the prototype for the new class based on the existing class
 * if so
 */
ClassMaker.prototype.buildPrototype = function(){
  if(Util.exists(this.classMetadata.extendedClass)){
    this.constrClass.prototype = new this.classMetadata.extendedClass();
    this.constrClass.prototype.constructor = this.constrClass;

    this.constrClass.prototype.callParent = function(){
      this.__meta__.extendedClass.apply(this, arguments);
    };
  }
};

/**
 * Adds the metadata to the class prototype
 */
ClassMaker.prototype.buildMeta = function(){
  this.constrClass.prototype.__meta__ = this.classMetadata;
};

/**
 * Adds the properties to the class prototype and generates setters and
 * getters for each based on their readability / writability
 */
ClassMaker.prototype.buildProperties = function(){
  for(var index in this.classMetadata.properties){
    var property = this.classMetadata.properties[index];
    this.constrClass.prototype[ConfigManager.getPropertyIdentifier() + index] = property.value;
    if(property.readable !== false){
      var getter = Util.exists(property.get) ? property.get : function(){
        return this[ConfigManager.getPropertyIdentifier() + index];
      };
      this.constrClass.prototype[ConfigManager.getGetIdentifier() + Util.capitalizeFirstLetter(index)] = getter;
    }
    if(property.writable !== false){
      var setter = Util.exists(property.set) ? property.set : function(value){
        this[ConfigManager.getPropertyIdentifier() + index] = value;
      };
      this.constrClass.prototype[ConfigManager.getSetIdentifier() + Util.capitalizeFirstLetter(index)] = setter;
    }
  }
};

/**
 * Adds the methods to the class prototype
 */
ClassMaker.prototype.buildMethods = function(){
  for(var index in this.classMetadata.methods){
    this.constrClass.prototype[index] = this.classMetadata.methods[index];
  }
};

/**
 * Adds the private members (internals) to the class prototype
 */
ClassMaker.prototype.buildInternals = function(){
  for(var index in this.classMetadata.internals){
    this.constrClass.prototype[ConfigManager.getInternalIdentifier() + index] = this.classMetadata.internals[index];
  }
};

/**
 * Adds the static memebers to the class prototype and the class object
 */
ClassMaker.prototype.buildStatics = function(){
  for(var index in this.classMetadata.statics){
    this.constrClass[index] = this.classMetadata.statics[index];
    this.constrClass.prototype[index] = this.classMetadata.statics[index];
  }
};

/**
 * Builds the class from the initial definition
 */
ClassMaker.prototype.buildClass = function(){
  this.createClass();
  this.buildPrototype();
  this.buildMethods();
  this.buildProperties();
  this.buildInternals();
  this.buildStatics();
  this.buildMeta();
};

