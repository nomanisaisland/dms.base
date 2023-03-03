<?php

namespace rjlx\base\pack;

class SimpleIoc
{

  protected static $singleMap = [];

  protected static function factorySingle($key, $factory)
  {
    $map = &self::$singleMap;
    if (!isset($map[$key])) {
      $map[$key] = $factory();
    }
    $value = $map[$key];
    return $value;
  }

  static $resolveMap = [];

  static function resolve($type)
  {
    $map = &self::$resolveMap;
    if (!isset($map[$type])) {
      $map[$type] = function () use ($type) {
        return self::factorySingle($type, function () use ($type) {
          return new $type();
        });
      };
    }
    $factory = $map[$type];
    return $factory();
  }

  static $resolveArrayMap = [];

  static function resolveArray($type)
  {
    $key = $type;
    $map = &self::$resolveArrayMap;
    if (!isset($map[$key])) {
      $map[$key] = function () {
        return [];
      };
    }
    $factory = $map[$key];
    return $factory();
  }

  static function registOne($key, $impl)
  {
    $map = &self::$resolveMap;
    $map[$key] = function () use ($key, $impl) {
      return self::factorySingle($key, function () use ($impl) {
        return new $impl();
      });
    };
  }

  static function registArray($type, $impl)
  {
    $map = &self::$resolveArrayMap;
    $key = $type;
    if (!isset($map[$key])) {
      $map[$key] = function () {
        return [];
      };
    }
    $pre = $map[$key];
    $map[$key] = function () use ($impl, $pre) {
      return [self::resolve($impl)] + $pre;
    };
  }
}
