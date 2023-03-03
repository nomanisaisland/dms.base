<?php

namespace rjlx\base\data;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";

use \PDO;
use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

class DbcMetaUtil
{

  /**
   * 获取字段元信息集合，过滤包含字段、排除字段
   */
  static function metadataFieldsStr($dbc, $table, $includeStr, $excludeStr)
  {
    $metadata = $dbc->metadata($table);
    $include = array_map(function ($a) {
      return trim($a);
    }, explode(",", $includeStr));
    $exclude = array_map(function ($a) {
      return trim($a);
    }, explode(",", $excludeStr));
    $dataFields = array_filter($metadata->dataFields, function ($a) use ($includeStr, $excludeStr, $include, $exclude) {
      return (!$includeStr || in_array($a, $include)) &&
        (!$excludeStr || !in_array($a, $exclude));
    });
    $select = join(", ", array_map(function ($a) {
      return "`" . $a . "`";
    }, $dataFields));
    return $select;
  }
}
