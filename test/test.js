/**
 * @description This file contains a variety of tests that check the features
 * of the FlancheJs library
 * @author Alex Dumitru <alex@flanche.net>
 */

FlancheJs.defineTrait("Rj.util.Observable", {

  methods:{
    /**
     * Adds a listener to the events fired by this object
     * @param {String} caller - a identifier for the object that is requesting the addon
     * @param {String} event - the name of the event you want to listen to
     * @param {Function} callback - a callback function that will be executed once the event is fired
     */
    addListener:function (caller, event, callback) {
      if (!this._listeners[event]) {
        this._listeners[event] = {};
      }
      this._listeners[event][caller] = callback;
    },

    /**
     * Removes a listnener from the list
     * @param {String} caller - @see addListener
     * @param {String} event - @see addListener
     */
    removeListener:function (caller, event) {
      delete(this._listeners[event][caller]);
    },

    /**
     * Fires an event associated with the widgets. All objects that registered for this event
     * will be notified
     * @param <string> event - the name of the event to be fired
     * @param <object> args - any aditional parameters you might pass to the handlers
     */
    fireEvent:function (event, args) {
      var callers = this._listeners[event];
      var status = true;
      for (var callerId in callers) {
        var currentCaller = callers[callerId];
        var currentStatus = currentCaller.call(this, args);
        if (currentStatus === false) {
          status = false;
        }
        else {
          status = (currentStatus !== null && currentStatus !== undefined && currentStatus !== false) ? currentStatus : status;
        }
      }
      return status;
    }
  },

  internals:{
    listeners:{}
  }
});

FlancheJs.defineClass("test.MyClass", {

  implements : [Rj.util.Observable],

  init: function(){
    console.log("started");
  },

  properties: {
    testProp: {
      value: "testing"
    }
  },

  internals: {
    testInt: 2
  },

  methods: {
    testMeth: function(){
      console.log("testMeth");
    }
  }
});

FlancheJs.defineObject("test.MyClass2", {

  implements : [Rj.util.Observable],

  extends : test.MyClass,

  init: function(){
    console.log("started");
  },

  properties: {
    testProp2: {
      value: "testing"
    }
  },

  internals: {
    testInt2: 2
  },

  methods: {
    testMeth2: function(){
      console.log("testMeth");
    }
  }
});

var x = new test.MyClass();
var y = new test.MyClass();
var z = test.MyClass2;