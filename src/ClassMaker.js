/**
 * @description Allows creation of classes based on the metadata supplied
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param {ClassMetadata} classMetadata the class metadata supplied
 */
function ClassMaker(classMetadata) {
  this.constrClass = null;
  this.classMetadata = classMetadata;
}

/**
 * Creates the initial class object
 */
ClassMaker.prototype.createClass = function () {
  var parts = this.classMetadata.className.split(".");
  var className = parts.pop();
  var container = Util.createNamespace(parts.join("."));

  container[className] = function builder() {
    var properties = this.__meta__.properties;
    var internals = this.__meta__.internals;
    for (var index in properties) {
      this[ConfigManager.getPropertyIdentifier() + index] = Util.clone(properties[index].value);
    }
    for (index in internals) {
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
ClassMaker.prototype.buildPrototype = function () {
  if (Util.exists(this.classMetadata.extendedClass)) {
    this.constrClass.prototype = new this.classMetadata.extendedClass();
    this.constrClass.prototype.constructor = this.constrClass;

    this.constrClass.prototype.callParent = function () {
      this.__meta__.extendedClass.apply(this, arguments);
    };
  }
};

/**
 * Adds the metadata to the class prototype
 */
ClassMaker.prototype.buildClassMeta = function () {
  this.constrClass.prototype.__meta__ = this.classMetadata;
};

/**
 * Adds the properties to the class prototype and generates setters and
 * getters for each based on their readability / writability
 */
ClassMaker.prototype.buildProperties = function () {
  for (var index in this.classMetadata.properties) {
    var property = this.classMetadata.properties[index];
    this.constrClass.prototype[ConfigManager.getPropertyIdentifier() + index] = property.value;
    if (property.readable !== false) {
      var getter = this.getPropertyAccessor(index, property, "get");
      this.constrClass.prototype[ConfigManager.getGetIdentifier() + Util.capitalizeFirstLetter(index)] = getter;
    }
    if (property.writable !== false) {
      var setter = this.getPropertyAccessor(index, property, "set");
      this.constrClass.prototype[ConfigManager.getSetIdentifier() + Util.capitalizeFirstLetter(index)] = setter;
    }
  }
};

/**
 *
 * @param {String} propertyName the property name
 * @param {Object} property the actual property, containing any user supplied getter or setter
 * @param {String} accessorType either get or set
 * @return {Function} the accessor function
 */
ClassMaker.prototype.getPropertyAccessor = function (propertyName, property, accessorType) {
  var preAccessor = Util.exists(property[accessorType]) ? property[accessorType] : null;
  if(preAccessor === null && accessorType === "get"){
    preAccessor = function () {
      return this[ConfigManager.getPropertyIdentifier() + propertyName];
    };
  }
  else if(preAccessor === null && accessorType === "set"){
    preAccessor = function (value) {
      this[ConfigManager.getPropertyIdentifier() + propertyName] = value;
    };
  }
  var accessor,
    beforeAccessor = this.classMetadata.meta["after" + Util.capitalizeFirstLetter(accessorType)],
    afterAccessor = this.classMetadata.meta["before" + Util.capitalizeFirstLetter(accessorType)],
    hasBeforeAccessor = Util.exists(beforeAccessor),
    hasAfterAccessor = Util.exists(afterAccessor);

  if (!hasBeforeAccessor && !hasAfterAccessor) {
    accessor = preAccessor;
  }
  else if (hasBeforeAccessor && !hasAfterAccessor) {
    accessor = function () {
      beforeAccessor.apply(this, arguments);
      preAccessor.apply(this, arguments);
    }
  }
  else if (!hasBeforeAccessor && hasAfterAccessor) {
    accessor = function (value) {
      preAccessor.apply(this, arguments);
      afterAccessor.apply(this, arguments);
    }
  }
  else {
    accessor = function (value) {
      beforeAccessor.apply(this, arguments);
      preAccessor.apply(this, arguments);
      afterAccessor.apply(this, arguments);
    }
  }
  return accessor;
};

/**
 * Adds the methods to the class prototype
 */
ClassMaker.prototype.buildMethods = function () {
  for (var index in this.classMetadata.methods) {
    this.constrClass.prototype[index] = this.classMetadata.methods[index];
  }
};

/**
 * Adds the private members (internals) to the class prototype
 */
ClassMaker.prototype.buildInternals = function () {
  for (var index in this.classMetadata.internals) {
    this.constrClass.prototype[ConfigManager.getInternalIdentifier() + index] = this.classMetadata.internals[index];
  }
};

/**
 * Adds the static memebers to the class prototype and the class object
 */
ClassMaker.prototype.buildStatics = function () {
  for (var index in this.classMetadata.statics) {
    this.constrClass[index] = this.classMetadata.statics[index];
    this.constrClass.prototype[index] = this.classMetadata.statics[index];
  }
};

/**
 * Builds the class from the initial definition
 */
ClassMaker.prototype.buildClass = function () {
  this.createClass();
  this.buildPrototype();
  this.buildMethods();
  this.buildProperties();
  this.buildInternals();
  this.buildStatics();
  this.buildClassMeta();
};

