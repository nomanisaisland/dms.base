<?php

namespace rjlx\base\http;

class SimpleModel
{
    /**
     * 获取请求中的表单数据，合成请求数据对象。
     * 结构类型：对象结构、数组， 值类型支持：字符串，表单文件
     * 数据源合并来自 url query， form， json。
     */
    static function data()
    {
        $get = array_filter($_GET, function ($k) {
            return $k !== "do";
        }, ARRAY_FILTER_USE_KEY);
        $post = $_POST;
        $json = [];
        if (
            isset($_SERVER["CONTENT_TYPE"]) &&
            strpos(strtolower($_SERVER["CONTENT_TYPE"]), "json") !== false
        ) {
            $input = file_get_contents('php://input');
            $json = json_decode($input, true);
        }
        $files = $_FILES;

        function nestSet($target, $ks, $v)
        {
            if (count($ks) < 2) {
                $target[$ks[0]] = $v;
                return $target;
            }
            $subK = $ks[0];
            $subV = isset($target[$subK]) && !!$target[$subK]  ? $target[$subK] : [];
            $restKs = array_slice($ks, 1);
            $target[$subK] = nestSet($subV, $restKs, $v);
            return $target;
        }
        $data = [];
        foreach ($get as $k => $v) {
            $ksStr = str_replace("__dot__", ".", $k);
            $ks = preg_split('/\./', $ksStr);
            $data = nestSet($data, $ks, $v);
        }
        foreach ($post as $k => $v) {
            $ksStr = str_replace("__dot__", ".", $k);
            $ks = preg_split('/\./', $ksStr);
            $data = nestSet($data, $ks, $v);
        }
        if (is_array($json)) {
            foreach ($json as $k => $v) {
                $ksStr = str_replace("__dot__", ".", $k);
                $ks = preg_split('/\./', $ksStr);
                $data = nestSet($data, $ks, $v);
            }
        }
        foreach ($files as $k => $v) {
            $ksStr = str_replace("__dot__", ".", $k);
            $ks = preg_split('/\./', $ksStr);
            $data = nestSet($data, $ks, $v);
        }
        return $data;
    }
}
