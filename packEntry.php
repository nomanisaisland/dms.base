<?php

require_once __DIR__ . "/pack/SimpleConfig.php";
require_once __DIR__ . "/pack/SimpleIoc.php";

use rjlx\base\pack\SimpleConfig;

// SimpleConfig::regist(
//   "rjlx\base\data\Dbc::pdo",
//   [
//     "mysql:host=localhost;port=3306;dbname=test",
//     "root",
//     "",
//   ]
// );

// SimpleConfig::regist(
//   "rjlx\base\data\Dbc::pdo",
//   [
//     "mysql:host=rds06lotvrd9ys9m8529.mysql.rds.aliyuncs.com;port=3306;dbname=re266n6blg",
//     "re266n6blg",
//     "Rjlx8888",
//   ]
// );

SimpleConfig::regist(
  "rjlx\base\secure\SimpleSigned::secreKey",
  "rjlx"
);
