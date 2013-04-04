/**
 * Keeps track of all the configurations that can be done for the library
 * @constructor
 */
var ConfigManager = {
  //The path to where the scripts that can be loaded by the importer reside
  //If not set (=null), it will try to guess.
  applicationPath         : null,
  //Identifier to be placed at the beginning of a property
  propertyIdentifier      : "$",
  //Identifier to be placed at the beginning of a private field
  internalIdentifier      : "_",
  //Identifier to be placed at the beginning of a getter function
  getIdentifier           : "get",
  //Identifier to be placed at the beginning of a setter function
  setIdentifier           : "set",
  //Classes for static objects will start with this
  objectInternalIdentifier: "___",
  //The keyword to mark a meta action executed before the original method
  beforeKeyword           : "before",
  //The keyword to mark a meta action executed after the original method
  afterKeyword            : "after",
  //The log level, each smaller level contains all the messages of the higher levels.
  logLevel                : LOG_LEVEL.debug,
  //the specs object that describes your class structure
  specs                   : null
};

ConfigManager.setApplicationPath = function (appPath) {
  this.applicationPath = appPath;
};

ConfigManager.getApplicationPath = function () {
  if (this.applicationPath === null) {
    var scripts = window.document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute("src").search("FlancheJs") != -1) {
        this.applicationPath = scripts[i].getAttribute("src").split("FlancheJs")[0];
      }
    }
    Util.log("No application path found, guessing: " + this.applicationPath + ". You can change it using FlancheJs.config.setApplicationPath().", LOG_LEVEL.warning);
  }
  return this.applicationPath;
};

ConfigManager.setPropertyIdentifier = function (propIdent) {
  this.propertyIdentifier = propIdent;
};

ConfigManager.getPropertyIdentifier = function () {
  return this.propertyIdentifier;
};

ConfigManager.setInternalIdentifier = function (internalIdentifier) {
  this.internalIdentifier = internalIdentifier;
};

ConfigManager.getInternalIdentifier = function () {
  return this.internalIdentifier;
};

ConfigManager.setGetIdentifier = function (getIdentifier) {
  this.getIdentifier = getIdentifier;
};

ConfigManager.getGetIdentifier = function () {
  return this.getIdentifier;
};

ConfigManager.setSetIdentifier = function (setIdentifier) {
  this.setIdentifier = setIdentifier;
};

ConfigManager.getSetIdentifier = function () {
  return this.setIdentifier;
};

ConfigManager.setObjectInternalIdentifier = function (objectInternalIdentifier) {
  this.objectInternalIdentifier = objectInternalIdentifier;
};

ConfigManager.getObjectInternalIdentifier = function () {
  return this.objectInternalIdentifier;
};

ConfigManager.setLogLevel = function (logLevel) {
  this.logLevel = logLevel;
};

ConfigManager.getLogLevel = function () {
  return this.logLevel;
};

ConfigManager.setSpecs = function (specs) {
  this.specs = specs;
};

ConfigManager.getSpecs = function () {
  return this.specs;
};