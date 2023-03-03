<?php

namespace rjlx\base\pack;

class SimpleConfig
{
  protected static $config = [];

  function read($key)
  {
    $config = self::$config;
    $value = isset($config[$key]) ? $config[$key] : null;
    return $value;
  }

  //查找配置，类名.pdo，父类名.pdo
  function readRefl($obj, $prop = "")
  {
    $config = null;
    for (
      $class = is_string($obj) ? $obj : get_class($obj);
      !!$class;
      $class = get_parent_class($class)
    ) {
      $configKey = !$prop ? $class : "$class::$prop";
      $config = $this->read($configKey);
      if ($config) {
        break;
      }
    }
    return $config;
  }


  static function regist($key, $value)
  {
    $config = &self::$config;
    $config[$key] = $value;
  }
}
