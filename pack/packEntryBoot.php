<?php

namespace rjlx\base\pack;

$packEntryPath = getenv("packEntryPath") ?: __DIR__ . "/../..";
require_once $packEntryPath . "/packEntry.php";
