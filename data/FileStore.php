<?php

namespace rjlx\base\data;

require_once __DIR__ . "/../pack/SimpleIoc.php";
require_once __DIR__ . "/../pack/SimpleConfig.php";

use Exception;
use rjlx\base\pack\SimpleConfig;
use rjlx\base\pack\SimpleIoc;

class FileStore
{

  /**
   * 获取本地存储物理文件的目录
   */
  function localDir()
  {
    $simpleConfig = SimpleIoc::resolve(SimpleConfig::class);
    $dir = $simpleConfig->readRefl($this, "dir");
    if (!$dir) {
      $dir = __DIR__ . "/../../rjlx.base.data.data/files";
    }
    return  $dir;
  }

  /**
   * 获取虚拟路径对应的物理路径
   */
  function localPath($virualPath)
  {
    if (!$virualPath) {
      throw new Exception();
    }
    $dir = $this->localDir();
    $localPath =  $dir . "/" . $virualPath;
    return $localPath;
  }

  /**
   * 从上传的临时文件保存到本地物理存储目录，返回虚拟路径
   */
  function addLocal($upPath, $name = null, $copy = null)
  {
    $name = basename($name ?: $upPath);
    date_default_timezone_set('PRC');
    $virualPath = "f" . date('Y-m-d/His') . rand(0, 1000) . "." . basename($name);

    $localPath =  $this->localPath($virualPath);

    $localDir = dirname($localPath);
    if (!file_exists($localDir)) {
      mkdir($localDir, 0777, true);
    }

    if (!$copy) {
      if (!move_uploaded_file($upPath, $localPath)) {
        throw new Exception();
      }
    } else {
      copy($upPath, $localPath);
    }

    return $virualPath;
  }

  /**
   * 删除虚拟路径对应的物理文件
   */
  function remove($virualPath)
  {
    $localPath = $this->localPath($virualPath);
    unlink($localPath);
  }
}
