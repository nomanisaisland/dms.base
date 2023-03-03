<?php

namespace rjlx\base\secure;

class SimpleConn
{
  function clientIp()
  {
    $ip = null;
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
      $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ips = explode(', ', $_SERVER['HTTP_X_FORWARDED_FOR']);
      if ($ip) {
        array_unshift($ips, $ip);
        $ip = null;
      }
      for ($i = 0; $i < count($ips); $i++) {
        if (!preg_match('^(10│172.16│192.168).', $ips[$i])) {
          $ip = $ips[$i];
          break;
        }
      }
    }
    $ip = $ip ?: $_SERVER['REMOTE_ADDR'];
    return $ip;
  }
}
