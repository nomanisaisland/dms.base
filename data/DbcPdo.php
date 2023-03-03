<?php

namespace rjlx\base\data;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";

use \PDO;
use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

/**
 * 数据库连接相关。
 * 简单sql命令处理；自动数据迁移；
 * 支持 mysql，sqlite。
 */
abstract class DbcPdo
{
    protected $inited;

    protected $pdoValue;

    protected $pdoTypeValue;

    /**
     * 获取连接内部的pdo对象，内部使用
     */
    function pdo()
    {
        $this->init();
        return $this->pdoValue;
    }

    /**
     * 获取连接的数据库类型 "sqlite" | "mysql" | "其他"，内部使用
     */
    function pdoType()
    {
        $this->init();
        return $this->pdoTypeValue;
    }

    /**
     * 初始化连接，内部使用
     */
    function init()
    {
        if ($this->inited) {
            return;
        }
        $this->inited = true;

        //读取配置
        $simpleConfig = SimpleIoc::resolve(SimpleConfig::class);
        $config = $simpleConfig->readRefl($this, "pdo");
        if (!$config) {
            $config = [
                "mysql:host=localhost;port=3306;dbname=test",
                "root",
                ""
            ];
            $useSqlite = true;
            if ($useSqlite) {
                $sqliteFile = __DIR__ . "/../../rjlx.base.data.data/dbc.sqlite";
                $sqliteFileDir = dirname($sqliteFile);
                $sqliteFileName = basename($sqliteFile);
                if (!file_exists($sqliteFileDir)) {
                    mkdir($sqliteFileDir);
                }
                $sqliteFile =  realpath($sqliteFileDir) . "/" . $sqliteFileName;
                $config = [
                    "sqlite:" . $sqliteFile,
                    "",
                    ""
                ];
            }
        }

        //设置连接
        $matches = [];
        preg_match('/^(.+?)\:/', $config[0], $matches);
        $this->pdoTypeValue = $matches[1];
        $this->pdoValue = new PDO(
            $config[0],
            $config[1],
            $config[2],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );

        // 执行自动迁移
        $migrateThrow = true;
        try {
            $migrateList = $this->migrate();

            $dbMigrateList = [];
            try {
                $dbMigrateList = $this->selectList(
                    "
select * from rjlx_base_data_migrate"
                );
            } catch (Exception $ex) {

                try {
                    //阿里云有时候会限制创建表的权限
                    $this->exec(
                        "
        create table if not exists rjlx_base_data_migrate (
            `key` varchar(250) not null primary key,
            time bigint not null,
            comment longtext null
        )"
                    );
                    $dbMigrateList = $this->selectList(
                        "
select * from rjlx_base_data_migrate"
                    );
                } catch (Exception $ex) {
                    throw $ex;
                }
            }

            foreach ($migrateList as $key => $action) {
                $dbMigrateFilter = array_filter(
                    $dbMigrateList,
                    function ($a) use ($key) {
                        return $a["key"] == $key;
                    }
                );
                $count = count($dbMigrateFilter);
                if ($count > 0) {
                    continue;
                }
                $migrate = ["key" => $key, "time" => time()];
                array_push($dbMigrateList, $migrate);
                $this->pdoValue->beginTransaction();
                try {
                    $action($this);
                    $this->exec(
                        "insert into rjlx_base_data_migrate (`key`, time) values (:key, :time)",
                        $migrate
                    );
                    $this->pdoValue->commit();
                } catch (Exception $ex) {
                    $this->pdoValue->rollBack();
                    throw $ex;
                }
            }
        } catch (Exception $ex) {
            if ($migrateThrow) {
                throw $ex;
            }
        }
    }

    /**
     * 获取迁移配置，应由子类提供重写， [ "key" => function () { this->exec(); } ]
     */
    function migrate()
    {
        return [];
    }

    /**
     * 将数据转成sql字符串格式
     */
    function sqlQuote($value)
    {
        return $this->pdo()->quote($value);
        //  return "'" . str_replace("'", "''", $value) . "'";
    }

    /**
     * 不同数据库平台的语法差异
     */
    function sqlSyntax()
    {
        $data =  [
            "auto_increment" => "auto_increment"
        ];
        if ($this->pdoType() === "sqlite") {
            $data = [
                "auto_increment" => "autoincrement"
            ] + $data;
        }
        return $data;
    }

    /**
     * 生成sql语句，参数会直接生成常量形式放置到sql语句对应位置
     */
    function sql($sqlTpl, $data = [])
    {
        $data += $this->sqlSyntax();
        $sql = preg_replace_callback('/\\$:(\\w+)/i', function ($matches) use ($data) {
            $key = $matches[1];
            $value = isset($data[$key]) ? $data[$key] : null;
            $text = $value;
            if (!$value) {
                $text = "('2020073114390111')"; //sqlTplParEmpty
            } else if (is_array($value)) {
                $that = $this;
                $childTexts = array_map(function ($a) use ($that) {
                    return $that->sqlQuote($a);
                }, $value);
                $text = "(" . join(", ", $childTexts) . ")";
            }
            return $text;
        }, $sqlTpl);
        return $sql;
    }

    /**
     * 执行sql命令，返回pdo命令对象
     */
    function exec($sql, $data = [])
    {
        $sql = $this->sql($sql, $data);
        $stmt = $this->pdo()->prepare($sql);
        $pars = array_filter($data, function ($v, $k) use ($sql) {
            $ke = preg_quote($k);
            return preg_match("/\:$ke\b/", $sql) > 0;
        }, ARRAY_FILTER_USE_BOTH);
        $stmt->execute($pars);
        return $stmt;
    }

    /**
     * 执行sql，返回查询的行数组，每行是关联数组格式，[["col1" => '1',"col2":"2",],]
     */
    function selectList($sql, $data = [])
    {
        $stmt = $this->exec($sql, $data);
        $q = $stmt->fetchAll(PDO::FETCH_NAMED);
        return $q;
    }

    /**
     * 查询单行
     */
    function selectRow($sql, $data = [])
    {
        $q = $this->selectList($sql, $data);
        $q0 = isset($q[0]) ? $q[0] : null;
        return $q0;
    }

    /**
     * 查询单行单列
     */
    function selectCell($sql, $data = [])
    {
        $q0 = $this->selectRow($sql, $data);
        $q00 = array_values($q0)[0];
        return $q00;
    }

    /**
     * 分页查询数据，返回查询的行数据，["skip"=>跳过几行,"take"=> 读取几行]
     * 返回 [["col1"=>"value1"],["col1","value2"]]
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
     * 分页查询数据并统计总函数，["skip"=>跳过几行,"take"=> 读取几行]
     * : [ "count" => 123,  "list" => [["col1"=>"value1"],["col1","value2"]],  ]
     */
    function listSearch($sql, $data = [])
    {
        $data["list"] = $this->limit($sql, $data);
        $data["count"] = $this->count($sql, $data);
        return $data;
    }
}
