<?php
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding('UTF-8');

// DB接続
$options = [
    PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION,
];
$db = new PDO('mysql:host=localhost;port=3306;dbname=narrow_down', 'gari', 'db#1qsyM', $options);

$stmt = $db->prepare('TRUNCATE TABLE goods');
$stmt->execute();
$stmt->closeCursor();

$db->beginTransaction();
$sql = getInsertSql();
$stmt = $db->prepare($sql);

$already = [];
$file = file('data.csv');
foreach ($file as $lineNo => $lineItem) {
    $items = explode(',', rtrim($lineItem));
    $data = [
        'r' => trim($items[0], '"'),
        'p' => trim($items[3], '"'),
        'c' => trim($items[4], '"'),
        'j' => trim($items[1], '"'),
        'i' => trim($items[2], '"'),
    ];
    ob_start();
    echo ($lineNo + 1)."\n";
    ob_end_flush();
    if (!in_array($data, $already)) {
        $already[] = $data;
        foreach ($data as $suffix => $value) {
            $stmt->bindValue(':col_'.$suffix, $value, PDO::PARAM_STR);
        }
        $stmt->execute();
    }
}
$stmt->closeCursor();
$db->commit();

function getInsertSql()
{
    return <<<SQL
INSERT INTO goods (
      col_r
    , col_p
    , col_c
    , col_j
    , col_i
) VALUES (
      :col_r
    , :col_p
    , :col_c
    , :col_j
    , :col_i
)
SQL;
}
