/**
 * @description Utility functions for the library
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 */
var Util = {
  /**
   * Adapted from: http://davidwalsh.name/javascript-clone
   * Performs a deep clone on the given object and returns the clone.
   * WARNING: This is a potential source of bugs as some object types might not be cloned properly
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
          r.push(Util.clone(src[i]));
        }
      }
    } else{
      // generic objects
      r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, Util.clone);
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
    if(!Util.exists(obj1)){
      newObj = Util.clone(obj2);
    }
    else if(!Util.exists(obj2)){
      newObj = Util.clone(obj1);
    }
    else{
      newObj = Util.clone(obj1);
      for(var index in obj2){
        if(newObj[index] === undefined){
          newObj[index] = Util.clone(obj2[index]);
        }
        else{
          if(!newObj.hasOwnProperty(index) && obj2.hasOwnProperty(index)){
            newObj[index] = obj2[index];
          }
          else if((newObj.hasOwnProperty(index) && obj2.hasOwnProperty(index)) ||
            (!newObj.hasOwnProperty(index) && !obj2.hasOwnProperty(index))){
            if(forceOverride){
              newObj[index] = Util.clone(obj2[index]);
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
    var current = Util.getMainNamespace();
    if(parts.length > 0){
      for(var i = 0; i < parts.length; i++){
        var part = parts[i];
        if(!Util.exists(current[part])){
          current[part] = {};
        }
        current = current[part];
      }
    }
    return current;
  },

  /**
   * Returns the main namespace where objects are deployed (i.e. window for browser, exports for node.js)
   * @return {Object}
   */
  getMainNamespace: function(){
    return MAIN_NAMESPACE;
  },

  /**
   * Returns the index of the value in the given array
   * Adapated from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
   * @param  {Array} array the array to search in
   * @param  {Object} searchElement the element to search for
   * @return {Number} the index of the element
   */
  indexOf: function(array, searchElement /*, fromIndex */){
    "use strict";
    if(array == null){
      throw new TypeError();
    }
    var t = Object(array);
    var len = t.length >>> 0;
    if(len === 0){
      return -1;
    }
    var n = 0;
    if(arguments.length > 1){
      n = Number(arguments[1]);
      if(n != n){ // shortcut for verifying if it's NaN
        n = 0;
      } else if(n != 0 && n != Infinity && n != -Infinity){
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if(n >= len){
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for(; k < len; k++){
      if(k in t && t[k] === searchElement){
        return k;
      }
    }
    return -1;
  },

  /**
   * Logs a message to the console
   * @param {String} message the message to be sent
   * @param {Number} logLevel the importance level of the message (must be from LOG_LEVEL)
   */
  log: function(message, logLevel){
    if(!console){
      return;
    }
    var currentLogLevel = ConfigManager.getLogLevel();
    if(logLevel >= currentLogLevel){
      if(logLevel == LOG_LEVEL.warning){
        console.warn("[FJs]# " + message);
      }
      else{
        console.log("[FJs]# " + message);
      }
    }
  }


};

