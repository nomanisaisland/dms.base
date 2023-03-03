<?php

namespace rjlx\base\data;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";
require_once __DIR__ . "/./DbcPdo.php";

use \PDO;
use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

/**
 * 简单数据模型映射；简单数据模型生成语句；
 */
abstract class DbcMeta extends DbcPdo
{
    /**
     * 获取全部的表描述 [ "table" => [ "col" => ["primary", "auto" ] ] ]
     */
    function meta()
    {
        return [];
    }

    /**
     * 获取指定的表描述，筛选指定的字段
     */
    function metadata($table, $keys = null)
    {
        $this->init();

        $meta = $this->meta();
        $tableMeta = $meta[$table];
        $cols = array_map(function ($k) use ($tableMeta) {
            return [
                "name" => $k,
                "primary" => strpos($tableMeta[$k], "primary") !== false,
                "default" => strpos($tableMeta[$k], "default") !== false
            ];
        }, array_keys($tableMeta));

        $fields = array_map(function ($a) {
            return $a["name"];
        }, $cols);

        $idCols = array_filter($cols, function ($a) {
            return !!$a["primary"];
        });
        $idFields = array_map(function ($a) {
            return $a["name"];
        }, $idCols);

        if (!$keys) {
            $keys = $fields;
        }
        $dataFields = array_filter(
            $keys,
            function ($key) use ($fields) {
                return count(
                    array_filter(
                        $fields,
                        function ($field) use ($key) {
                            return $field === $key;
                        }
                    )
                ) > 0;
            }
        );

        $setFields = array_filter(
            $dataFields,
            function ($field) use ($idFields) {
                return count(
                    array_filter(
                        $idFields,
                        function ($a) use ($field) {
                            $a === $field;
                        }
                    )
                ) < 1;
            }
        );

        $metadata = (object) [
            "cols" => $cols,
            "fields" => $fields,
            "idCols" => $idCols,
            "idFields" => $idFields,
            "dataFields" => $dataFields,
            "setFields" => $setFields
        ];
        return $metadata;
    }

    /**
     * 创建指定表的数据行对象
     * 返回 ["field1" => "value1", "field2" => "value2"]
     */
    function create($table, $data = [])
    {
        $metadata = $this->metadata($table);

        foreach ($metadata->dataFields as $field) {
            if (!isset($data[$field])) {
                $data[$field] = null;
            }
        }

        return $data;
    }

    /**
     * 插入一行，自动生成主键，返回插入的结果
     */
    function add($table, $data)
    {
        $metadata = $this->metadata($table, array_keys($data));

        //空id不生成语句
        $dataFields = $metadata->dataFields;
        foreach ($metadata->idFields as $idField) {
            if (!isset($data[$idField]) || !$data[$idField]) {
                $dataFields = array_filter($dataFields, function ($a) use ($idField) {
                    return $a != $idField;
                });
            }
        }

        //生成语句
        $colNames = join(", ", array_map(function ($a) {
            return "`$a`";
        }, $dataFields));
        $valueNames = join(", ", array_map(function ($a) {
            return ":$a";
        }, $dataFields));
        $sql = "insert into `$table` ($colNames) values ($valueNames)";

        //执行
        $stmt = $this->exec($sql, $data);
        $rowCount = $stmt->rowCount();
        if ($rowCount !== 1) {
            throw new Exception("响应条数异常");
        }

        //获取生成的id
        if (count($metadata->idFields) === 1) {
            $idField = $metadata->idFields[0];
            $lastInsertId = $this->pdo()->lastInsertId();
            $data[$idField] = $lastInsertId;
        }

        return $data;
    }

    /**
     * 根据主键删除一条数据
     */
    function remove($table, $data)
    {
        $metadata = $this->metadata($table);

        //生成语句
        $whereCodes = join(", ", array_map(function ($a) {
            return "`$a` = :$a";
        }, $metadata->idFields));
        $sql = "
delete from `$table` where $whereCodes
";

        //执行
        $stmt = $this->exec($sql, $data);
        $rowCount = $stmt->rowCount();
        if ($rowCount !== 1) {
            throw new Exception("响应条数异常");
        }
        return $data;
    }

    /**
     * 根据主键更新一行数据
     */
    function edit($table, $data)
    {
        $metadata = $this->metadata($table, array_keys($data));

        //生成语句
        $setCodes = join(", ", array_map(function ($a) {
            return "`$a` = :$a";
        }, $metadata->setFields));
        $whereCodes = join(", ", array_map(function ($a) {
            return "`$a` = :$a";
        }, $metadata->idFields));
        $sql = "update `$table` set $setCodes where $whereCodes";

        //执行
        $stmt = $this->exec($sql, $data);
        $rowCount = $stmt->rowCount();
        if ($rowCount > 1) {
            throw new Exception("响应条数异常");
        }
        return $data;
    }

    /**
     * 根据主键查询一条数据
     */
    function detail($table, $data)
    {
        $metadata = $this->metadata($table);

        //填充默认值
        foreach ($metadata->dataFields as $field) {
            if (!isset($data[$field])) {
                $data[$field] = null;
            }
        }

        //生成语句
        $whereCodes = join(", ", array_map(function ($a) {
            return "`$a` = :$a";
        }, $metadata->idFields));
        $sql = "select * from `$table` where $whereCodes";

        //执行查询
        $row = $this->selectRow($sql, $data);
        $data["null"] = true;
        if (!!$row) {
            $data["null"] = false;
            $data = $row + $data;
        }

        return $data;
    }

    /**
     * 分页查询数据，返回查询的行数据，["skip"=>跳过几行,"take"=> 读取几行] : [["col1"=>"value1"],["col1","value2"]]
     */
    function limit($sql, $data = [])
    {
        $skip = isset($data["skip"]) ? (int) $data["skip"] : 0;
        $take = isset($data["take"]) ? (int) $data["take"] : 10000;

        $qlSql = "$sql limit $skip, $take";
        if ($this->pdoType() === "sqlite") {
            $qlSql = "$sql limit $take offset $skip";
        }

        return $this->selectList($qlSql, $data);
    }

    /**
     * 统计符合sql条件的总行数
     */
    function count($sql, $data = [])
    {
        $countSql = "select count(*) from ($sql) t";
        return (int)$this->selectCell($countSql, $data);
    }

    /**
     * 分页查询数据并统计总函数，["skip"=>跳过几行,"take"=> 读取几行] : [ "count" => 123,  "list" => [["col1"=>"value1"],["col1","value2"]],  ]
     */
    function listSearch($sql, $data = [])
    {
        $data["list"] = $this->limit($sql, $data);
        $data["count"] = $this->count($sql, $data);
        return $data;
    }
}
