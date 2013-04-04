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
 * @description Allows creation of objects (singletons) by creating a new class and instantiating
 * only one object.
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


