<?php


$q = $_POST + [
  "submit" => "",
  "dir" => "",
  "password" => "",
];

$action = "";

if (
  isset($q["submit"]) && !!$q["submit"]
) {

  try {

    if ($q["password"] !== "packProjZip") {
      throw new Exception("密码错误。");
    }

    if (!isset($_FILES["file"])) {
      throw new Exception("未上传文件。");
    }


    $file = $_FILES["file"]["tmp_name"];
    $zip = new ZipArchive();
    $openRes = $zip->open($file);

    if ($zip->numFiles < 1) {
      throw new Exception("空文件。 可能原因：文件大小超过服务器限制。");
    }

    $outPath = __DIR__ . (!!$q["dir"] ? "/" . $q["dir"] : "");

    for ($i = 0; $i < $zip->numFiles; $i++) {
      $filename = $zip->getNameIndex($i);
      $source = "zip://" . $file . "#" . $filename;
      if (is_dir($source) || substr($source, strlen($source) - 1) == "/") {
        continue;
      }
      $action = $action . htmlentities($filename) . "<br />\r\n";

      $target = $outPath . "/" . $filename;


      $distdir = dirname($target);
      if (!is_dir($distdir)) {
        mkdir($distdir, 0777, true);
      }
      // if (file_exists($target)) {
      //   unlink($target);
      // }

      $copyRes = copy($source,  $target);
      if (!$copyRes) {
        $action = $action . "覆盖失败：" . htmlentities($filename) . "<br />\r\n";
        // throw new Exception("覆盖失败：" . $source . "，" . $target);
      }
    }
    $zip->close();
  } catch (Exception $error) {
    echo htmlentities($error);
  }
}

?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>zip</title>
</head>

<body>
  <form enctype="multipart/form-data" action="?" method="POST">
    <div>
      <input name="dir" type="text" value="<?php echo htmlentities($q["dir"]) ?>" placeholder="dir" />
    </div>
    <div>
      <input name="file" type="file" accept=".zip" placeholder="zip" />
    </div>
    <div>
      <input name="password" type="password" value="<?php echo htmlentities($q["password"]) ?>" placeholder="pwd" />
    </div>
    <div>
      <button type="submit" name="submit" value="1" data-submit="<?php echo htmlentities($q["submit"]) ?>">submit</button>
    </div>
    <div>
      <div>method: <?php echo htmlentities($_SERVER["REQUEST_METHOD"]) ?></div>
      <div>submit: <?php echo htmlentities($q["submit"]) ?></div>
      <div>
        action: <br />
        <?php echo $action ?>
      </div>
    </div>
  </form>
</body>

</html>