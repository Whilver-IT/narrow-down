<?php
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding('UTF-8');

// DB接続
$options = [
    PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION,
];
$db = new PDO('mysql:host=localhost;port=3306;dbname=narrow_down', 'gari', 'db#1qsyM', $options);

$sql = getDataSql();
$stmt = $db->prepare($sql);
$stmt->execute();
$data = [];
while (($row = $stmt->fetch(PDO::FETCH_ASSOC)) != false) {
    $data[$row['col_r']][$row['col_pc']][$row['col_j']] = json_decode($row['col_i'], true);
}
$stmt->closeCursor();
print_r($data);
file_put_contents('data.json', json_encode($data, JSON_FORCE_OBJECT));


function getDataSql()
{
    return <<<SQL
SELECT DISTINCT
      col_r
    , CONCAT(col_p, '|', col_c) AS col_pc
    , col_j
    , CAST(CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', col_i, '"') ORDER BY col_i), ']') AS JSON) AS col_i
FROM
      goods
GROUP BY
      col_r
    , col_pc
    , col_j
ORDER BY
      col_r
    , col_pc
    , col_j
SQL;
}

