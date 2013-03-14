/**
 * @description A traitmetadat object contains all the necesarry information to build a trait
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param {String} traitName
 * @param {Array} traits
 * @param {Object} properties
 * @param {Object} methods
 * @param {Object} internals
 * @param {Object} statics
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

/**
 * Transforms the initial metadata into a complete one by merging the definitions
 * of any traits that are implemented
 */
TraitMetadata.prototype.buildFinalDefinition = function(){
  if(Util.exists(this.traits)){
    for(var i = 0; i < this.traits.length; i++){
      this.properties = Util.merge(this.properties, this.traits[i].properties);
      this.methods = Util.merge(this.methods, this.traits[i].methods);
      this.internals = Util.merge(this.internals, this.traits[i].internals);
      this.statics = Util.merge(this.statics, this.traits[i].statics);
    }
  }
};

