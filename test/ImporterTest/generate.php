<?php
require("ObjectGenerator.php");
use \Flanche\FlancheJs\ObjectGenerator;
use \Flanche\FlancheJs\Specs;

$specs = new \Flanche\FlancheJs\Specs("./generatedFiles", 10);
$specs->createInheritance(4);

try {
  $generator = new ObjectGenerator($specs);
  $generator->generate();
  print "#Files generated successfully!\n";
} catch (\Exception $e) {
  print "#Could not generate test files. Error Message: " . $e->getMessage() . "\n";
}