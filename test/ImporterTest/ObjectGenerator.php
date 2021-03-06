<?php

namespace Flanche\FlancheJs;

class ObjectGenerator {

  private $specs;
  private static $classesGenerated = array();

  function __construct(Specs $specs) {
    $this->specs = $specs;
  }

  public function generate() {
    $this->generateClasses();
    $this->generateSpecFile();
  }

  private function generateClass($shouldExtend = FALSE, $shouldImplement = FALSE) {
    $extends = "";
    $depends = NULL;
    if ($shouldExtend && count(self::$classesGenerated)) {
      $classToExtend = self::$classesGenerated[count(self::$classesGenerated) - 1]->name;
      $extends       = " extends: " . $classToExtend . ", ";
      $depends       = $classToExtend;
    }
    $className                = NameGenerator::generateUniqueName(ObjectType::eClass);
    $properties               = $this->generateProperties(rand(0, 10));
    $internals                = $this->generateInternals(rand(0, 10));
    $methods                  = $this->generateMethods(rand(0, 10));
    $init                     = "init: " . ValueGenerator::generateRandomValue(ValueType::eFunction);
    $classContents            = "FlancheJs.defineClass('$className', {
      $extends
      $init,
      $properties,
      $internals,
      $methods
    });";
    self::$classesGenerated[] = (object)array("contents" => $classContents, "name" => $className, "depends" => $depends);
    return self::$classesGenerated[count(self::$classesGenerated) - 1];
  }

  private function generateClasses() {
    for ($i = 0; $i < $this->specs->levelsOfInheritance; $i++) {
      $this->generateClass(TRUE);
    }
    for ($i = 0; $i < $this->specs->classesToBuild - $this->specs->levelsOfInheritance; $i++) {
      $this->generateClass(FALSE);
    }
    foreach (self::$classesGenerated as $class) {
      $fileContents = self::$fileHeader . $class->contents;
      file_put_contents($this->getFilePathForObject($class->name), $fileContents);
    }
  }

  private function generateSpecFile() {
    $specContents = self::$fileHeader . "var specs = {\n";
    foreach (self::$classesGenerated as $class) {
      $fileName  = $this->getFilePathForObject($class->name);
      $depends   = $class->depends ? "[\"" . $class->depends . "\"]" : "null";
      $classSpec = '"' . $class->name . '"' . " : new FlancheJs.Spec('$class->name', '$fileName', $depends),\n";
      $specContents .= $classSpec;
    }
    $specContents = substr($specContents, 0, -2);
    $specContents .= "\n}\n";
    file_put_contents($this->specs->path . "/SpecFile.js", $specContents);
  }

  private function getFilePathForObject($objectName) {
    $fileName = str_replace(".", "_", $objectName);
    return $this->specs->path . "/" . $fileName . ".js";
  }

  private function generateProperties($noOfProperties) {
    $props = array();
    for ($i = 0; $i < $noOfProperties; $i++) {
      $readable = rand(0, 1) ? "true" : "false";
      $writable = rand(0, 1) ? "true" : "false";
      $prop     = NameGenerator::generateUniqueName(ObjectType::eProperty) . " :{";
      $prop .= rand(0, 1) ? "readable: $readable," : "";
      $prop .= rand(0, 1) ? " writable : $writable," : "";
      $prop .= "value : " . ValueGenerator::generateRandomValue(ValueType::eString);
      $prop .= "}";
      $props[] = $prop;
    }
    return " properties : {\n" . implode($props, ",\n") . "\n}\n\n";
  }

  private function generateInternals($noOfInternals) {
    $internals = array();
    for ($i = 0; $i < $noOfInternals; $i++) {
      $internal    = NameGenerator::generateUniqueName(ObjectType::eInternal) . " : " .
        ValueGenerator::generateRandomValue();
      $internals[] = $internal;
    }
    return " internals : {\n" . implode($internals, ",\n") . "\n}\n\n";
  }

  private function generateMethods($noOfMethods) {
    $methods = array();
    for ($i = 0; $i < $noOfMethods; $i++) {
      $method    = NameGenerator::generateUniqueName(ObjectType::eMethod) . " : " .
        ValueGenerator::generateRandomValue(ValueType::eFunction);
      $methods[] = $method;
    }
    return " methods : {\n" . implode($methods, ",\n") . "\n}\n\n";
  }

  private
  function generateTrait() {
  }

  private
  function generateObject() {

  }

  static $fileHeader = "/* This file was auto-generated by FlancheJs Test suite.  */\n";

}

class NameGenerator {
  public static function generateUniqueName($type) {
    switch ($type) {

      case ObjectType::eClass:
        self::$classSuffixNumber += 1;
        return self::ClassPrefix . (string)self::$classSuffixNumber;

      case ObjectType::eObject:
        self::$objectSuffixNumber += 1;
        return self::ObjectPrefix . (string)self::$objectSuffixNumber;

      case ObjectType::eTrait:
        self::$traitSuffixNumber += 1;
        return self::TraitPrefix . (string)self::$traitSuffixNumber;

      case ObjectType::eMethod:
        self::$methodSuffixNumber += 1;
        return self::MethodPrefix . (string)self::$methodSuffixNumber;

      case ObjectType::eStatic:
        self::$staticSuffixNumber += 1;
        return self::StaticPrefix . (string)self::$staticSuffixNumber;

      case ObjectType::eInternal:
        self::$internalSuffixNumber += 1;
        return self::InternalPrefix . (string)self::$internalSuffixNumber;

      case ObjectType::eProperty:
        self::$propertySuffixNumber += 1;
        return self::PropertyPrefix . (string)self::$propertySuffixNumber;

      default:
        throw new \Exception("Invalid object type");
    }
  }

  const ClassPrefix    = "test.Class";
  const ObjectPrefix   = "test.Object";
  const TraitPrefix    = "test.Trait";
  const PropertyPrefix = "property";
  const InternalPrefix = "internal";
  const MethodPrefix   = "method";
  const StaticPrefix   = "static";

  private static $classSuffixNumber = 0;
  private static $objectSuffixNumber = 0;
  private static $traitSuffixNumber = 0;
  private static $propertySuffixNumber = 0;
  private static $methodSuffixNumber = 0;
  private static $internalSuffixNumber = 0;
  private static $staticSuffixNumber = 0;
}

final class ObjectType {
  const eUnknown  = 0;
  const eClass    = 1;
  const eObject   = 2;
  const eTrait    = 3;
  const eProperty = 4;
  const eMethod   = 5;
  const eInternal = 6;
  const eStatic   = 7;
}

class ValueGenerator {
  public static function generateRandomValue($type = NULL) {
    if ($type == NULL) {
      $type = rand(1, 5);
    }
    switch ($type) {
      case  ValueType::eNumber:
        return self::getRandomNumber();

      case ValueType::eString:
        return self::getRandomString();

      case ValueType::eArray:
        return "[" . implode(",",self::getRandomArray()) . "]";

      case ValueType::eObject:
        return self::getRandomObject();

      case ValueType::eFunction:
        return self::getRandomFunction();

      default:
        throw new \RuntimeException("No known value type supplied: " . var_export($type, TRUE));
    }
  }

  private static function getRandomString($length = 10, $alfaOnly = FALSE, $quoted = TRUE) {
    $shufStr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if ($alfaOnly) {
      $shufStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    $ret = substr(str_shuffle($shufStr), 0, $length);
    if ($quoted) {
      $ret = "\"" . $ret . "\"";
    }
    return $ret;
  }

  private static function getRandomFunction() {
    return "function(){ console.log('" . self::getRandomString() . "'); }";
  }

  private static function getRandomArray($length = 10, $type = ValueType::eNumber) {
    $array = [];
    switch ($type) {
      case ValueType::eNumber:
        for ($i = 0; $i < $length; $i++) {
          $array[] = self::getRandomNumber();
        }
        break;
      case ValueType::eString:
        for ($i = 0; $i < $length; $i++) {
          $array[] = self::getRandomString();
        }
        break;
      case ValueType::eObject:
        for ($i = 0; $i < $length; $i++) {
          $array[] = self::getRandomObject();
        }
        break;
      default:
        throw new \RuntimeException("No known value type supplied: " . var_export($type, TRUE));
    };
    return $array;
  }

  private static function getRandomNumber($low = self::MinInt, $high = self::MaxInt) {
    return rand($low, $high);
  }

  private static function getRandomObject($length = 10) {
    $object = "{\n";
    for ($i = 0; $i < $length; $i++) {
      $object .= self::getRandomString(10, TRUE, FALSE) . " : " . self::getRandomString(10) . ",\n";
    }
    $object = substr($object, 0, -2);
    $object .= "\n}\n";
    return $object;
  }

  const MaxInt = 9007199254740990;
  const MinInt = -9007199254740990;
}

final class ValueType {
  const eUnknown  = 0;
  const eNumber   = 1;
  const eString   = 2;
  const eArray    = 3;
  const eObject   = 4;
  const eFunction = 5;
}

class Specs {
  function __construct($path, $classesToBuild = 0, $traitsToBuild = 0, $objectToBuild = 0) {
    $this->path           = $path;
    $this->classesToBuild = $classesToBuild;
    $this->traitsToBuild  = $traitsToBuild;
    $this->objectsToBuild = $objectToBuild;
  }

  public function createInheritance($minLevelsOfInheritance = 1) {
    $this->levelsOfInheritance = $minLevelsOfInheritance;
  }

  public $classesToBuild;
  public $traitsToBuild;
  public $objectsToBuild;
  public $levelsOfInheritance;
  public $path;
}