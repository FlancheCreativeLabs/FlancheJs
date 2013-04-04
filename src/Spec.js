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
 * Class for defining specification objects for javascript files created with
 * this framework
 * @param {String} objectName the name of the object for which the spec is written (e.g. class name)
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
