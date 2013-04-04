/**
 * Copyright (c) <2012> <S.C. Flanche Creative Labs SRL>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 */

/**
 * @description A traitmetadat object contains all the necesarry information to build a trait
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

