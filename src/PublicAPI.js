/**
 * The public API that the library exposes.
 * @type {Object}
 */
MAIN_NAMESPACE.FlancheJs = {

  defineClass: function(className, config){
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

  defineTrait: function(traitName, config){
    var traitMeta = new TraitMetadata(traitName, config.implements, config.properties, config.methods, config.internals, config.statics);
    var traitMaker = new TraitMaker(traitMeta);
    traitMaker.buildTrait();
  },

  defineObject: function(objectName, config){
    var meta = new ClassMetadata(objectName,
      config.init,
      config.extends,
      config.implements,
      config.properties,
      config.methods,
      config.internals,
      config.statics);
    var objectMaker = new ObjectMaker(meta);
    objectMaker.buildObject();
  },

  import: function(objectName, callback, context){
    var specs = ConfigManager.getSpecs();
    var importer = new Importer(specs);
    importer.import(objectName, callback, context);
  },

  config    : ConfigManager,
  Spec      : Spec,
  exceptions: {
    BuildException    : BuildException,
    ImportException   : ImportException,
    FlancheJsException: FlancheJsException
  }
};