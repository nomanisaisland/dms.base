<?php

namespace rjlx\base\secure;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/./SimpleJwt.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";

use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

class SimpleVcode
{

  function storeKey()
  {
    return "SmsSimpleVcode";
  }

  protected function randStr($len = 4)
  {
    $str = "";
    $chars = "1234567890";
    for ($i = 0; $i < $len; $i++) {
      $chrIndex = mt_rand(0, strlen($chars) - 1);
      $chr = substr($chars, $chrIndex, 1);
      $str .= $chr;
    }
    return $str;
  }

  function add($meta = [])
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $vcodeMap = isset($_SESSION[$storeKey]) ? $_SESSION[$storeKey] : [];
    $vcodeKey = $this->randStr();
    $vcodeValue = $this->randStr();
    $vcodeMap[$vcodeKey] = [
      "vcodeValue" => $vcodeValue,
    ] + $meta;
    $_SESSION[$storeKey] = $vcodeMap;
    return $vcodeKey;
  }

  function get($vcodeKey)
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $vcodeMap = isset($_SESSION[$storeKey]) ? $_SESSION[$storeKey] : [];
    $meta = isset($vcodeMap[$vcodeKey]) ? $vcodeMap[$vcodeKey] : null;
    return $meta["vcodeValue"];
  }

  function getMeta($vcodeKey)
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $vcodeMap = isset($_SESSION[$storeKey]) ? $_SESSION[$storeKey] : [];
    $meta = isset($vcodeMap[$vcodeKey]) ? $vcodeMap[$vcodeKey] : null;
    return $meta;
  }

  function remove($vcodeKey)
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $vcodeMap = isset($_SESSION[$storeKey]) ? $_SESSION[$storeKey] : [];
    unset($vcodeMap[$vcodeKey]);
    $_SESSION[$storeKey] = $vcodeMap;
  }
}
