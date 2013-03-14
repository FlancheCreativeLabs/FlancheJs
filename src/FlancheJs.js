/**
 * FlancheJs
 */

(function(mainNamespace){

  var PROPERTY_IDENTIFIER = "$";
  var INTERNAL_IDENTIFIER = "_";
  var GET_IDENTIFIER = "get";
  var SET_IDENTIFIER = "set";
  var OBJECT_INTERNAL_CLASS_IDENTIFIER = "__";

  /**
   * Defines a new Exception type to be easier to catch library exceptions by clients
   * @param {String} message the error message
   * @extends Error
   */
  function BuildException(message){
    this.message = message;
  }

  BuildException.prototype = new Error();
  BuildException.prototype.constructor = BuildException;

  /**
   * Utility functions for the library
   * @type {Object}
   */
  var util = {
    /**
     * Adapted from: http://davidwalsh.name/javascript-clone
     * Performs a deep clone on the given object and returns the clone.
     * WARNING: This is a pontential source of bugs as some object types might not be cloned properly
     *
     * @param {Object} src the object to be cloned
     * @return {Object}
     */
    clone: function(src){
      function mixin(dest, source, copyFunc){
        var name, s, i, empty = {};
        for(name in source){
          // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
          // inherited from Object.prototype.   For example, if dest has a custom toString() method,
          // don't overwrite it with the toString() method that source inherited from Object.prototype
          s = source[name];
          if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
            dest[name] = copyFunc ? copyFunc(s) : s;
          }
        }
        return dest;
      }

      if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
        // null, undefined, any non-object, or function
        return src;  // anything
      }
      if(src.nodeType && "cloneNode" in src){
        // DOM Node
        return src.cloneNode(true); // Node
      }
      if(src instanceof Date){
        return new Date(src.getTime());  // Date
      }
      if(src instanceof RegExp){
        return new RegExp(src);
      }
      var r, i, l;
      if(src instanceof Array){
        // array
        r = [];
        for(i = 0, l = src.length; i < l; ++i){
          if(i in src){
            r.push(util.clone(src[i]));
          }
        }
      } else{
        // generic objects
        r = src.constructor ? new src.constructor() : {};
      }
      return mixin(r, src, util.clone);
    },

    /**
     * Determines if the variable exists by comparing it to undefined and null
     * @param {Object} variable any variable
     * @return {Boolean} true / false
     */
    exists: function(variable){
      if(variable === null || variable === undefined){
        return false;
      }
      return true;
    },

    /**
     * Merges the two given objects. The rules are the following:
     *  - obj1 is cloned, so no modification will be done upon it
     *  - if both obj1 and obj2 share a property name the more specific one is chosen (i.e. the hasOwnProperty(prop) == true)
     *  - if both obj1.prop and obj2.prop have the same specificity:
     *    - if forceOverride is set to true, obj2.prop is chosen
     *    - else obj1.prop is chosen
     * @return {Object} the merged object
     */
    merge: function(obj1, obj2, forceOverride){
      var newObj = null;
      if(!util.exists(obj1)){
        newObj = util.clone(obj2);
      }
      else if(!util.exists(obj2)){
        newObj = util.clone(obj1);
      }
      else{
        newObj = util.clone(obj1);
        for(var index in obj2){
          if(newObj[index] === undefined){
            newObj[index] = util.clone(obj2[index]);
          }
          else{
            if(!newObj.hasOwnProperty(index) && obj2.hasOwnProperty(index)){
              newObj[index] = obj2[index];
            }
            else if((newObj.hasOwnProperty(index) && obj2.hasOwnProperty(index)) ||
              (!newObj.hasOwnProperty(index) && !obj2.hasOwnProperty(index))){
              if(forceOverride){
                newObj[index] = util.clone(obj2[index]);
              }
            }
          }
        }
      }
      return newObj;
    },

    /**
     * Empty function to be used as a default for inputs where a function is required
     */
    emptyFunction: function(){
    },

    /**
     * Replaces the first letter of the string to the upper case version of it
     * @param {String} string the string to which to apply
     * @return {String} the processed string
     */
    capitalizeFirstLetter: function(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * Checks if the given namespace exists and creates it otherwise
     * @param {String} namespace the namespace name
     * @return {Object} a reference to the created namespace
     */
    createNamespace: function(namespace){
      var parts = namespace.split(".");
      var current = mainNamespace;
      if(parts.length > 0){
        for(var i = 0; i < parts.length; i++){
          var part = parts[i];
          if(!util.exists(current[part])){
            current[part] = {};
          }
          current = current[part];
        }
      }
      return current;
    }


  };

  /**
   * Simple object type to keep track the class metadata
   * @param {String} className the full name including the namespace
   * @param {Function} init the constructor of the class
   * @param {Object} extendedClass the class that is extended or null
   * @param {Array} traits an array of traits to implement or null
   * @param {Object} properties a map of properties to be defined or null
   * @param {Object} methods a map of the methods to be defined or null
   * @param {Object} internals a map of private variables to be defined or null
   * @param {Object} statics a map of properties to be preserved across the class
   */
  function ClassMetadata(className, init, extendedClass, traits, properties, methods, internals, statics){
    this.className = className;
    this.init = init || util.emptyFunction();
    this.extendedClass = extendedClass;
    this.traits = traits || [];
    this.properties = properties || {};
    this.methods = methods || {};
    this.internals = internals || {};
    this.statics = statics;
    this.buildFinalDefinition();
  }

  /**
   * This function merges all the definitions from the extended class and from the traits
   * into the class metadata.
   */
  ClassMetadata.prototype.buildFinalDefinition = function(){
    if(util.exists(this.extendedClass)){
      this.properties = util.merge(this.properties, this.extendedClass.prototype.__meta__.properties);
      //this.methods = util.merge(this.methods, this.extendedClass.__meta__.methods);
      this.internals = util.merge(this.internals, this.extendedClass.prototype.__meta__.internals);
      this.statics = util.merge(this.statics, this.extendedClass.prototype.__meta__.statics);
    }
    for(var i = 0; i < this.traits.length; i++){
      this.checkTraitNeeds(this.traits[i]);
      this.properties = util.merge(this.properties, this.traits[i].properties);
      this.methods = util.merge(this.methods, this.traits[i].methods);
      this.internals = util.merge(this.internals, this.traits[i].internals);
      this.statics = util.merge(this.statics, this.traits[i].statics);
    }
  };

  /**
   * Checks if the needs of the trait are fulfilled.
   * @param trait
   */
  ClassMetadata.prototype.checkTraitNeeds = function(trait){
    for(var index in trait.needs){
      var isInMethod = this.methods[index] !== undefined && this.methods[index] instanceof trait.needs[index];
      var isInInternals = this.internals[index] !== undefined && this.internals[index] instanceof trait.needs[index];
      var isInProperties = this.properties[index] !== undefined && this.properties[index] instanceof trait.needs[index];
      if(!isInMethod && !isInInternals && !isInProperties){
        throw new BuildException("The trait that you're trying to implement requires that your class contain " +
          index.toString() + " of type " + trait.needs[index].toString()
        );
      }
    }
  };


  /**
   * Allows creation of classes based on the metadata supplied
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
    var container = util.createNamespace(parts.join("."));

    container[className] = function builder(){
      var properties = this.__meta__.properties;
      var internals = this.__meta__.internals;
      for(var index in properties){
        this[PROPERTY_IDENTIFIER + index] = util.clone(properties[index].value);
      }
      for(index in internals){
        this[INTERNAL_IDENTIFIER + index] = util.clone(internals[index]);
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
    if(util.exists(this.classMetadata.extendedClass)){
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
      this.constrClass.prototype[PROPERTY_IDENTIFIER + index] = property.value;
      if(property.readable !== false){
        var getter = util.exists(property.get) ? property.get : function(){
          return this[PROPERTY_IDENTIFIER + index];
        };
        this.constrClass.prototype[GET_IDENTIFIER + util.capitalizeFirstLetter(index)] = getter;
      }
      if(property.writable !== false){
        var setter = util.exists(property.set) ? property.set : function(value){
          this[PROPERTY_IDENTIFIER + index] = value;
        };
        this.constrClass.prototype[SET_IDENTIFIER + util.capitalizeFirstLetter(index)] = setter;
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
      this.constrClass.prototype[INTERNAL_IDENTIFIER + index] = this.classMetadata.internals[index];
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

  /**
   * Constructor for TraitMetadata
   * @param traitName
   * @param traits
   * @param properties
   * @param methods
   * @param internals
   * @param statics
   * @constructor
   */
  function TraitMetadata(traitName, traits, properties, methods, internals, statics){
    this.traitName = traitName;
    this.traits = traits || [];
    this.properties = properties || {};
    this.methods = methods || {};
    this.internals = internals || {};
    this.statics = statics || {};
    this.buildFinalDefinition();
  }


  TraitMetadata.prototype.buildFinalDefinition = function(){
    if(util.exists(this.traits)){
      for(var i = 0; i < this.traits.length; i++){
        this.properties = util.merge(this.properties, this.traits[i].properties);
        this.methods = util.merge(this.methods, this.traits[i].methods);
        this.internals = util.merge(this.internals, this.traits[i].internals);
        this.statics = util.merge(this.statics, this.traits[i].statics);
      }
    }
  };

  /**
   * Class for building traits that can be mixed with class definitions
   * @param {TraitMetadata} traitMeta the trait definition
   */
  function TraitMaker(traitMeta){
    this.traitMeta = traitMeta;
  }

  /**
   * Builds the trait according to the definitions given
   */
  TraitMaker.prototype.buildTrait = function(){
    var parts = this.traitMeta.traitName.split(".");
    var traitName = parts.pop();
    var container = util.createNamespace(parts.join("."));
    container[traitName] = this.traitMeta;
  };

  function ObjectMaker(objectMeta){
    this.objectMeta = objectMeta;
  }

  ObjectMaker.prototype.buildObject = function(){
    var parts = this.objectMeta.className.split(".");
    var objectName = parts.pop();
    var container = util.createNamespace(parts.join("."));
    this.objectMeta.className = OBJECT_INTERNAL_CLASS_IDENTIFIER + this.objectMeta.className;
    var classMaker = new ClassMaker(this.objectMeta);
    classMaker.buildClass();
    var current = mainNamespace[OBJECT_INTERNAL_CLASS_IDENTIFIER + parts[0]];
    for(var i = 1; i < parts.length; i++){
      current = current[parts[i]];
    }
    console.log(current[objectName]);
    container[objectName] = new current[objectName]();
  };

  function Importer(){

  }

  mainNamespace.FlancheJs = {
    defineClass: function(className, config){
      var meta = new ClassMetadata(className,
        config.init,
        config.extends,
        config.implements,
        config.properties,
        config.methods,
        config.internals,
        config.statics);
      var classMaker = new ClassMaker(meta);
      classMaker.buildClass();
    },

    defineTrait: function(traitName, config){
      var traitMeta = new TraitMetadata(traitName, config.implements, config.properties, config.methods, config.internals, config.statics);
      var traitMaker = new TraitMaker(traitMeta);
      traitMaker.buildTrait();
    },

    defineObject: function(objectName, config){
      var meta = new ClassMetadata(objectName,
        config.init,
        config.extends,
        config.implements,
        config.properties,
        config.methods,
        config.internals,
        config.statics);
      var objectMaker = new ObjectMaker(meta);
      objectMaker.buildObject();
    }

  };

})(window);
