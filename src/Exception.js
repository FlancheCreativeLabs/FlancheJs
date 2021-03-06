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
 * @description Defines a new Exception type in order to make it easier for clients to catch library exceptions
 * @constructor
 * @param {String} message the error message
 * @extends Error
 */

function FlancheJsException(message){
  this.message = message;
}
FlancheJsException.prototype.valueOf = FlancheJsException.prototype.toString = function () {
  return  this.name + ": " + this.message;
};

function BuildException(){
  FlancheJsException.apply(this, arguments);
}
BuildException.prototype = new FlancheJsException();
BuildException.prototype.constructor = BuildException;
BuildException.prototype.name = "BuildException";

function ImportException(message){
  FlancheJsException.apply(this, arguments);
}
ImportException.prototype = new FlancheJsException();
ImportException.prototype.constructor = ImportException;
ImportException.prototype.name = "ImportException";
