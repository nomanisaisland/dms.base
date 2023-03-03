<?php

namespace rjlx\base\secure;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/./SimpleJwt.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";
require_once __DIR__ . "/./SimpleSigned.php";

use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

class SimpleSessionException extends Exception
{
}

class SimpleSession
{

  function storeKey()
  {
    return "SimpleSession";
  }

  function get()
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $data = isset($_SESSION[$storeKey]) ? $_SESSION[$storeKey] : null;
    if (!$data) {
      $simpleSigned = SimpleIoc::resolve(SimpleSigned::class);
      $jwtHashKey = $simpleSigned->secretKey();
      $token = isset($_COOKIE[$storeKey]) ? $_COOKIE[$storeKey] : null;
      if (!!$token && SimpleJwt::verifyToken($token, $jwtHashKey)) {
        $data = SimpleJwt::getPlayoad($token);
        $_SESSION[$storeKey] = $data;
      }
      $token = isset($_SERVER[$storeKey]) ? $_SERVER[$storeKey] : null;
      if (!!$token && SimpleJwt::verifyToken($token, $jwtHashKey)) {
        $data = SimpleJwt::getPlayoad($token);
        $_SESSION[$storeKey] = $data;
      }
    }
    return $data;
  }

  function set($data)
  {
    if (!session_id() || !isset($_SESSION)) {
      session_start();
    }
    $storeKey = $this->storeKey();
    $_SESSION[$storeKey] = $data;
    $token = "";
    if (!!$data) {
      $simpleSigned = SimpleIoc::resolve(SimpleSigned::class);
      $jwtHashKey = $simpleSigned->secretKey();
      $token = SimpleJwt::getToken($data, $jwtHashKey);
    }
    $expire = isset($data["exp"]) ? $data["exp"] : 0;
    setcookie($storeKey, $token, $expire, "/");
    return $token;
  }

  function permitCheck($permitKey)
  {
    $data = $this->get();
    if (!$data) {
      return false;
    }
    if (!isset($data["permitsStr"])) {
      return false;
    }
    $permitsStr = $data["permitsStr"];
    if (!$permitsStr) {
      return false;
    }
    $has = strpos(",$permitsStr,", ",$permitKey,") !== false;
    return $has;
  }

  function getThrow()
  {
    if (!$this->get()) {
      throw new SimpleSessionException();
    }
  }

  function permitThrow($permitKey)
  {
    if (!$this->permitCheck($permitKey)) {
      throw new SimpleSessionException();
    }
  }
}
