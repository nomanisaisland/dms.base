<?php

namespace rjlx\base\secure;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/./SimpleJwt.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";

use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

class SimpleSigned
{

  function secretKey()
  {
    $simpleConfig = SimpleIoc::resolve(SimpleConfig::class);
    $secreKey = $simpleConfig->readRefl($this, "secreKey");
    if (!$secreKey) {
      throw new Exception("必须配置密钥");
    }
    return $secreKey;
  }

  function signed($input)
  {
    return self::hashEncode($input, $this->secretKey());
  }

  static function hashEncode($input, $key, $alg = 'sha256')
  {
    return base64_encode(hash_hmac($alg, $input, $key, true));
  }
}
