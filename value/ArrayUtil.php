<?php

class ArrayUtil
{

    static function quickSort($a, $selector = null, $comparer = null)
    {
        if (!$selector) {
            $selector = function ($a) {
                return $a;
            };
        }
        if (!$comparer) {
            $comparer = function ($a, $b) {
                return $a < $b ? -1 : ($a > $b ? 1 : 0);
            };
        }
        if (count($a) <= 1) {
            return $a;
        }
        $middle = $a[0];
        $left = array();
        $right = array();
        for ($i = 1; $i < count($a); $i++) {
            $r = $comparer($selector($middle), $selector($a[$i]));
            if ($r < 0) {
                $right[] = $a[$i];
            } else {
                $left[] = $a[$i];
            }
        }
        $left = self::quickSort($left);
        $right = self::quickSort($right);
        return array_merge($left, array($middle), $right);
    }

    static function orderby($input, $selector, $comparer = null)
    {
        return self::quickSort($input, $selector, $comparer);
    }

    static function orderbyDesc($input, $selector, $comparer = null)
    {
        return array_reverse(self::quickSort($input, $selector, $comparer));
    }

    static function noll($target, ...$keys)
    {
        $value = $target;
        foreach ($keys as $key) {
            $value = !!$value && isset($value[$key]) ? $value[$key] : null;
        }
        return $value;
    }
}
