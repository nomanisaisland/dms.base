<?php

namespace rjlx\base\secure;

class SimpleJwt
{

  private static $header = array(
    'alg' => 'HS256',
    'typ' => 'JWT'
  );

  public static function getToken($payload, $key)
  {
    $base64header = self::base64UrlEncode(json_encode(self::$header, JSON_UNESCAPED_UNICODE));
    $base64payload = self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_UNICODE));
    $token = $base64header . '.' . $base64payload . '.' . self::signature($base64header . '.' . $base64payload, $key, self::$header['alg']);
    return $token;
  }

  public static function getPlayoad($token)
  {
    $tokens = explode('.', $token);
    $base64payload = $tokens[1];
    $payload = json_decode(self::base64UrlDecode($base64payload), JSON_OBJECT_AS_ARRAY);
    return $payload;
  }

  public static function verifyToken($token, $key)
  {
    $tokens = explode('.', $token);
    if (count($tokens) != 3)
      return false;

    list($base64header, $base64payload, $sign) = $tokens;

    $base64decodeheader = json_decode(self::base64UrlDecode($base64header), JSON_OBJECT_AS_ARRAY);
    if (empty($base64decodeheader['alg']))
      return false;

    if (self::signature($base64header . '.' . $base64payload, $key, $base64decodeheader['alg']) !== $sign)
      return false;

    $payload = json_decode(self::base64UrlDecode($base64payload), JSON_OBJECT_AS_ARRAY);

    if (isset($payload['iat']) && $payload['iat'] > time())
      return false;

    if (isset($payload['exp']) && $payload['exp'] < time())
      return false;

    if (isset($payload['nbf']) && $payload['nbf'] > time())
      return false;

    return $payload;
  }

  private static function base64UrlEncode($input)
  {
    return str_replace('=', '', strtr(base64_encode($input), '+/', '-_'));
  }

  private static function base64UrlDecode($input)
  {
    $remainder = strlen($input) % 4;
    if ($remainder) {
      $addlen = 4 - $remainder;
      $input .= str_repeat('=', $addlen);
    }
    return base64_decode(strtr($input, '-_', '+/'));
  }

  private static function signature($input, $key, $alg = 'HS256')
  {
    $alg_config = array(
      'HS256' => 'sha256'
    );
    return self::base64UrlEncode(hash_hmac($alg_config[$alg], $input, $key, true));
  }
}
