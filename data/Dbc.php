<?php

namespace rjlx\base\data;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";
require_once __DIR__ . "/./DbcMeta.php";

/**
 * 公共的数据库连接对象。
 * 简单sql命令处理；自动数据迁移；
 * 简单数据模型映射；简单数据模型生成语句；
 */
abstract class Dbc extends DbcMeta
{
  
}
