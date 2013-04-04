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

buster.testCase("FlancheJs basic features", {
  setUp: function () {
    FlancheJs.defineClass("test.MyClass", {
      init: function (intVal) {
        this._internalVar = intVal;
      },

      properties: {
        simpleProp: {
          value: "correct"
        },

        unreadableProp: {
          value   : "unreadable",
          readable: false
        },

        unwritableProp: {
          value   : "unwritable",
          writable: false
        }

      },

      internals: {
        internalVar: 0
      },

      methods: {
        getNumber42: function () {
          return 42;
        },

        doIntTest: function () {
          return  (this._internalVar * 2)
        }
      }
    });
    this.instanceVar1 = -15;
    this.instance1 = new test.MyClass(this.instanceVar1);
    this.instanceVar2 = 7;
    this.instance2 = new test.MyClass(this.instanceVar2);
  },

  "Private fields are correct": function () {
    buster.assert(this.instanceVar1 * 2 === this.instance1.doIntTest());
    buster.assert(this.instanceVar2 * 2 === this.instance2.doIntTest());
  },

  "Basic property works correctly": function () {
    buster.assert.equals(this.instance1.getSimpleProp() ,"correct");
    this.instance1.setSimpleProp("stillCorrect");
    buster.assert.equals(this.instance1.getSimpleProp() ,"stillCorrect");
    buster.assert.equals(this.instance2.getSimpleProp() ,"correct");
  },

  "Unreadable properties should not have getters": function () {
    buster.assert(this.instance1.getUnreadableProp === undefined);
  },

  "Unwritable properties should not have setters": function () {
    buster.assert(this.instance1.setUnwritableProp === undefined);
    buster.assert(this.instance1.getUnwritableProp() === "unwritable");
  },

  "Methods can be called and return correct values" : function(){
    buster.assert(this.instance1.getNumber42() === 42);
  }
});