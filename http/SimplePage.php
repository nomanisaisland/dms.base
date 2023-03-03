<?php

namespace rjlx\base\http;

require_once __DIR__ . "/./SimpleModel.php";

class SimplePage
{

    static function data()
    {
        $data = SimpleModel::data();
        return $data;
    }
}
