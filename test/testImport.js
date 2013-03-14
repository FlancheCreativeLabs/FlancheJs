/**
 * @brief Description
 * @author: Alex Dumitru <alex@flanche.net>
 * @package test
 */
FlancheJs.config.setSpecs(specs);
FlancheJs.config.setApplicationPath("./ImporterTest/");
FlancheJs.import("test.Class3", function(){
  console.log("done");
});
