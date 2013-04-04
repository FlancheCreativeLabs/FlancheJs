/**
 * @description Simple object type to keep track the class metadata
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param {String} className the full name including the namespace
 * @param {Function} init the constructor of the class
 * @param {Object} extendedClass the class that is extended or null
 * @param {Array} traits an array of traits to implement or null
 * @param {Object} properties a map of properties to be defined or null
 * @param {Object} methods a map of the methods to be defined or null
 * @param {Object} internals a map of private variables to be defined or null
 * @param {Object} statics a map of properties to be preserved across the class
 * @param {Object} meta a map of actions to be executed in special cases (e.g. before an accessor for a property is
 * called)
 */
function ClassMetadata(className, init, extendedClass, traits, properties, methods, internals, statics, meta){
  this.className = className;
  this.init = init || Util.emptyFunction();
  this.extendedClass = extendedClass;
  this.traits = traits || [];
  this.properties = properties || {};
  this.methods = methods || {};
  this.internals = internals || {};
  this.statics = statics || {};
  this.meta = meta || {};
  this.buildFinalDefinition();
}

/**
 * This function merges all the definitions from the extended class and from the traits
 * into the class metadata.
 */
ClassMetadata.prototype.buildFinalDefinition = function(){
  if(Util.exists(this.extendedClass)){
    this.properties = Util.merge(this.properties, this.extendedClass.prototype.__meta__.properties);
    //this.methods = Util.merge(this.methods, this.extendedClass.__meta__.methods);
    this.internals = Util.merge(this.internals, this.extendedClass.prototype.__meta__.internals);
    this.statics = Util.merge(this.statics, this.extendedClass.prototype.__meta__.statics);
  }
  for(var i = 0; i < this.traits.length; i++){
    this.checkTraitNeeds(this.traits[i]);
    this.properties = Util.merge(this.properties, this.traits[i].properties);
    this.methods = Util.merge(this.methods, this.traits[i].methods);
    this.internals = Util.merge(this.internals, this.traits[i].internals);
    this.statics = Util.merge(this.statics, this.traits[i].statics);
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

