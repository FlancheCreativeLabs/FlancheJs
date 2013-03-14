/**
 * @description Defines a new Exception type in order to make it easier for clients to catch library exceptions
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @constructor
 * @param {String} message the error message
 * @extends Error
 */

function FlancheJsException(message){
  this.message = message;
}
FlancheJsException.prototype.valueOf = FlancheJsException.prototype.toString = function(){
  return  this.name + ": " + this.message;
}

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
