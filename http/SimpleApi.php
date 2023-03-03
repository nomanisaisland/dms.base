<?php

namespace rjlx\base\http;

require_once __DIR__ . "/./SimpleModel.php";

use Exception;

class SimpleApi
{

    static function wrap($inner)
    {
        //获取输入参数
        $data = SimpleModel::data();

        //路由要执行的方法
        $do = $_GET["do"];
        if (
            preg_match('/^__/', $do) > 0
        ) {
            throw new Exception();
        }

        //调用目标方法
        try {
            $data = $inner->{$do}($data);
        } catch (Exception $exception) {
            $data["exception"] = $exception->getMessage() ?: $exception . "";
        }

        //渲染输出
        //header('Content-Type:text/json');
        header('Content-Type:application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
