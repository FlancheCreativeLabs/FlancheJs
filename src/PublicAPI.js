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
 * The public API that the library exposes.
 * @type {Object}
 */
MAIN_NAMESPACE.FlancheJs = {

  /**
   * Creates a class based on the given configuration
   * @see The README.md for more details
   * @param {String} className the name of the class
   * @param {Object} config configuration object as per docs
   */
  defineClass: function (className, config) {
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

  /**
   * Defines a trait based on the given configuration
   * @param {String} traitName the name of the trait
   * @param {Object} config configuration object as per docs
   */
  defineTrait: function (traitName, config) {
    var traitMeta = new TraitMetadata(traitName, config.implements, config.properties, config.methods, config.internals, config.statics);
    var traitMaker = new TraitMaker(traitMeta);
    traitMaker.buildTrait();
  },

  /**
   * Defines a singleton object
   * @param {String} objectName the name of the object
   * @param {Object} config configuration object as per docs
   */
  defineObject: function (objectName, config) {
    var meta = new ClassMetadata(objectName,
      config.init,
      config.extends,
      config.implements,
      config.properties,
      config.methods,
      config.internals,
      config.statics,
      config.meta
    );
    var objectMaker = new ObjectMaker(meta);
    objectMaker.buildObject();
  },

  /**
   * Imports an object and executes the given callback when the object was loaded
   * @param {String} objectName the name of the object to load (e.g. a class or some trait)
   * @param {Function} callback the function to be executed once the object was loaded
   * @param {Object} context the value of the *this* variable inside the callback
   */
  import: function (objectName, callback, context) {
    var specs = ConfigManager.getSpecs();
    var importer = new Importer(specs);
    importer.import(objectName, callback, context);
  },

  /**
   * Allows for some options to be configured according to the needs of the user program
   * @see ConfigManager for more information on which options can be modified or check the docs
   */
  config    : ConfigManager,
  /**
   * Class for defining specification objects for javascript files created with
   * this framework
   * @param {String} objectName the name of the object for which the spec is written (e.g. class name)
   * @param {String} filePath the path to the file relative to ConfigManager.getApplicationPath
   * @param {Array} dependencies a list of specs that the file is dependent on
   */
  Spec      : Spec,
  /**
   * A list of exceptions that can be thrown during the construction or importing of the objects
   */
  exceptions: {
    /**
     * This exception is thrown when an error occurred in the building process (i.e. some wrong config option)
     */
    BuildException    : BuildException,
    /**
     * This exception is thrown when an import fails for some reason
     */
    ImportException   : ImportException,
    /**
     * Generic Exception from which all the exceptions in the class inherit
     */
    FlancheJsException: FlancheJsException
  }
};