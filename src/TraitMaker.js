/**
 * @description Class for building traits that can be mixed with class definitions
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
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
  var container = Util.createNamespace(parts.join("."));
  container[traitName] = this.traitMeta;
};


