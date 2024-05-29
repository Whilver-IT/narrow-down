<?php
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding("UTF-8");

require_once(implode(DIRECTORY_SEPARATOR, [__DIR__, '..', 'phputil', 'DBUtil.php']));

class NarrowDownTest {

    // DB接続保持用
    private $db = null;

    /**
     * コンストラクタ
     */
    public function __construct()
    {
        $settings = DBUtil::getDBSettings();
        $dsn = $settings['type'].':host='.$settings['host'].';port='.$settings['port'].';dbname='.$settings['database'];
        $options = [
            PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION,
        ];
        $this->db = new PDO($dsn, $settings['username'], $settings['password']);
    }

    /**
     * 即時メッセージ出力
     *
     * @param string $message
     * @param boolean $isLine
     * @return void
     */
    private function echoMsg(string $message, bool $isLine = true): void
    {
        ob_start();
        echo $message.($isLine ? "\n" : '');
        ob_end_flush();
    }

    /**
     * テスト実行
     *
     */
    public function exec(array $argv = []): void
    {
        $limit = ini_get('memory_limit');
        ini_set('memory_limit', -1);

        // 条件作成用データ取得
        $baseSql = <<<SQL
{$this->getBaseSql()}
ORDER BY
      col_r
    , col_pc
    , col_j
    , col_i
SQL;
        $searchList = $this->getSearchList($baseSql);

        $max = 0;
        foreach ($searchList['i']['multi'] as $multi) {
            if (count($multi) > $max) {
                $max = count($multi);
            }
        }

        $options = [
            'isAdd' => [
                'function' => function ($combination, $multi) {
                    $isAdd = false;
                    foreach ($multi as $multiElement) {
                        $isAddItem = true;
                        foreach ($combination as $combinationElement) {
                            if (!in_array($combinationElement, $multiElement)) {
                                $isAddItem = false;
                                break;
                            }
                        }
                        if ($isAddItem) {
                            $isAdd = true;
                            break;
                        }
                    }
                    return $isAdd;
                },
                'elements' => $searchList['i']['multi'],
            ],
            'sort' => [
                'elementSort' => [$this, 'simpleSort'],
                'wholeSort' => [$this, 'iSort'],
            ],
            'limit' => $max,
            'isHash' => false,
        ];

$start = new DateTimeImmutable();
        $iList = $this->getCombinationAll($searchList['i']['single'], $options);
$end = new DateTimeImmutable();
echo ($start->diff($end))->format('%s.%F')."\n";exit;

        // 1つ目に未選択の条件を追加
        array_unshift($searchList['r'], '');
        array_unshift($searchList['pc'], '');
        array_unshift($searchList['j'], '');
        array_unshift($iList, []);
        // デバッグ用
        /*$searchList['r'] = [];
        $searchList['pc'] = [];
        $searchList['j'] = [];
        $iList = [];
        $searchList['r'][] = 'R01';
        $searchList['pc'][] = '';
        $searchList['j'][] = '';
        $iList[] = ['I01'];*/


        // CSV作成(javascriptの方はBOM付きにしているので、必要なら頭にBOMを付けてください)
        $csv = "R(選択値),PC(選択値),J(選択値),I(選択値),R(選択可能値),PC(選択可能値),J(選択可能値),I(選択可能値)\r\n";
        for ($iLoop = 0; $iLoop < count($iList); $iLoop++) {
            for ($jLoop = 0; $jLoop < count($searchList['j']); $jLoop++) {
                for ($pcLoop = 0; $pcLoop < count($searchList['pc']); $pcLoop++) {
                    for ($rLoop = 0; $rLoop < count($searchList['r']); $rLoop++) {

                        // 条件なしの場合は自明なのでcsvに書き込まない
                        if (empty($searchList['r'][$rLoop]) && empty($searchList['pc'][$pcLoop]) && empty($searchList['j'][$jLoop]) && empty($iList[$iLoop])) {
                            continue;
                        }

                        // 検索条件を配列に
                        $searchItem = [
                            'r' => $searchList['r'][$rLoop],
                            'pc' => $searchList['pc'][$pcLoop],
                            'j' => $searchList['j'][$jLoop],
                            'i' => $iList[$iLoop],
                        ];

                        // 検索条件画面出力
                        $search = 'R: '.$searchItem['r'] .' ';
                        $search .= 'PC: '.$searchItem['pc'].' ';
                        $search .= 'J: '.$searchItem['j'].' ';
                        $search .= 'I: ['.implode(',', $searchItem['i']).']';
                        $this->echoMsg($search);

                        // 条件を元に値を取得
                        $searchResult = $this->getItem($baseSql, $searchItem);

                        if (!empty($searchResult['r']) && !empty($searchResult['pc']) && !empty($searchResult['j']) && !empty($searchResult['i'])) {
                            // R、PC、J、Iに値が全部有った場合だけcsvに書き込み
                            $csv .= '"'.(empty($searchItem['r']) ? '(なし)' : $searchItem['r']).'"';
                            $csv .= ',';
                            $csv .= '"'.(empty($searchItem['pc']) ? '(なし)' : $searchItem['pc']).'"';
                            $csv .= ',';
                            $csv .= '"'.(empty($searchItem['j']) ? '(なし)' : $searchItem['j']).'"';
                            $csv .= ',';
                            $csv .= '"'.(empty($searchItem['i']) ? '(なし)' : implode(',', $searchItem['i'])).'"';
                            $csv .= ',';
                            $csv .= '"'.implode(',', $searchResult['r']).'"';
                            $csv .= ',';
                            $csv .= '"'.implode(',', $searchResult['pc']).'"';
                            $csv .= ',';
                            $csv .= '"'.implode(',', $searchResult['j']).'"';
                            $csv .= ',';
                            $csv .= '"'.implode(',', $searchResult['i']).'"';
                            $csv .= "\r\n";
                        }

                    }
                }
            }
        }

        $date = new DateTime();
        file_put_contents('db_narrow_down_test-'.$date->format('YmdHis').'.csv', $csv);

        ini_set('memory_limit', $limit);
    }

    /**
     * 条件作成用データ取得
     *
     * @param string $baseSql
     * @return array
     */
    private function getSearchList(string $baseSql): array
    {
        $stmt = $this->db->prepare($baseSql);
        $stmt->execute();
        $paramList = [
            'r' => [],
            'pc' => [],
            'j' => [],
            'i' => [
                'single' => [],
                'multi' => [],
            ],
        ];
        while (($row = $stmt->fetch(PDO::FETCH_ASSOC)) != false) {
            if (!in_array($row['col_r'], $paramList['r'])) {
                $paramList['r'][] = $row['col_r'];
            }
            if (!in_array($row['col_pc'], $paramList['pc'])) {
                $paramList['pc'][] = $row['col_pc'];
            }
            if (!in_array($row['col_j'], $paramList['j'])) {
                $paramList['j'][] = $row['col_j'];
            }
            $multi = json_decode($row['col_i'], true);
            if (count($multi) > 1) {
                usort($multi, [$this, 'simpleSort']);
                if (!in_array($multi, $paramList['i']['multi'])) {
                    $paramList['i']['multi'][] = $multi;
                }
            }
            foreach ($multi as $i) {
                if (!in_array($i, $paramList['i']['single'])) {
                    $paramList['i']['single'][] = $i;
                }
            }
        }
        $stmt->closeCursor();

        usort($paramList['r'], [$this, 'simpleSort']);
        usort($paramList['pc'], [$this, 'pcSort']);
        usort($paramList['j'], [$this, 'simpleSort']);
        usort($paramList['i']['single'], [$this, 'simpleSort']);
        usort($paramList['i']['multi'], [$this, 'iSort']);

        return $paramList;
    }

    /**
     * ビットカウントを求める(以下リンク参考)
     * https://qiita.com/zawawahoge/items/8bbd4c2319e7f7746266
     *
     * @param integer $value
     * @return integer
     */
    private function getBitCount(int $value): int
    {
        $bitHash1 = 0x5555555555555555;
        $bitHash2 = 0x3333333333333333;
        $bitHash3 = 0x0f0f0f0f0f0f0f0f;

        $count = 0;
        if ($value <= 0) {
            return 0;
        }

        // 2bitごとの組に分けて立っているbit数を2bitで表現
        $remainder = $value % 2;
        $quotient = ($value - $remainder) / 2;
        $count = $value - ($quotient & $bitHash1);

        // 4bit整数に、上位2ビット+下位2bitを計算した値を入れる
        $remainder = $count % pow(2, 2);
        $quotient = ($count - $remainder) / pow(2, 2);
        $count = ($count & $bitHash2) + ($quotient & $bitHash2);

        // 8bitごと
        $remainder = $count % pow(2, 4);
        $quotient = ($count - $remainder) / pow(2, 4);
        $count = ($count + $quotient) & $bitHash3;

        // 16bit
        $remainder = $count % pow(2, 8);
        $quotient = ($count - $remainder) / pow(2, 8);
        $count = $count + $quotient;

        // 32bit
        $remainder = $count % pow(2, 16);
        $quotient = ($count - $remainder) / pow(2, 16);
        $count = $count + $quotient;

        return $count & 0x0000007f;
    }

    /**
     * コンビネーション全体を取得
     *
     * @param array $arr
     * @param array $options
     * @return array
     */
    public function getCombinationAll(array $arr, array $options = ['isHash' => false, 'isAdd' => ['function' => null, 'element' => [],], 'sort' => ['elementSort' => null, 'wholeSort' => null,], 'limit' => 0,]): array
    {
        $limit = !empty($options['limit']) && is_int($options['limit']) && $options['limit'] > 0 ? $options['limit'] : 0;
        if (isset($options['isHash']) && $options['isHash']) {
            unset($options['isHash']);
            $hash = [];
            for ($i = 0; $i < pow(2, count($arr)); $i++) {
                $bitCount = $this->getBitCount($i);
                if ($limit >= $bitCount) {
                    $hash[$bitCount][] = $i;
                }
            }
            $options['hash'] = $hash;
        }

        $combinations = [];
        for ($i = 0; $i < count($arr); $i++) {
            if ($limit > 0 && $i + 1 > $limit) {
                break;
            }
            $combinations = array_merge($combinations, $this->getCombination($arr, $i + 1, $options));
        }
        
        return $combinations;
    }

    /**
     * コンビネーション単体を取得
     *
     * @param array $arr
     * @param integer $count
     * @param array $sort
     * @return array
     */
    public function getCombination(array $arr, int $count, array $options = ['hash' => [], 'isAdd' => ['function' => null, 'elements' => [],], 'sort' => ['elementSort' => null, 'wholeSort' => null,]]): array
    {
        if ($count <= 0) {
            return [];
        }

        if ($count == 1) {
            return array_map(function ($element) {
                return [$element];
            }, $arr);
        }

        $combination = [];

        // ハッシュがある場合はハッシュから、そうでない場合はビットカウントを毎回取得
        $isHashAvailable = !empty($options['hash']);
        for ($loopTarget = ($isHashAvailable ? 0 : 1); $loopTarget < ($isHashAvailable ? count($options['hash'][$count]) : pow(2, count($arr))); $loopTarget++) {
            if ($isHashAvailable || $this->getBitCount($loopTarget) == $count) {
                $dec = decbin($isHashAvailable ? $options['hash'][$count][$loopTarget] : $loopTarget);
                $maxIndex = strlen($dec) - 1;
                $combinationElement = [];
                for ($elementSearchLoop = $maxIndex; $elementSearchLoop >= 0; $elementSearchLoop--) {
                    if (substr($dec, $elementSearchLoop, 1)) {
                        $combinationElement[] = $arr[$maxIndex - $elementSearchLoop];
                    }
                }
                if (!empty($options['sort']['elementSort'])) {
                    if (is_callable($options['sort']['elementSort'])) {
                        usort($combinationElement, $options['sort']['elementSort']);
                    } else {
                        throw new Exception('elementSortがcallableではありません。');
                    }
                }

                $isAdd = true;
                if (!empty($options['isAdd']['function']) && is_callable($options['isAdd']['function'])) {
                    $isAdd = $options['isAdd']['function']($combinationElement, empty($options['isAdd']['elements']) ? [] : $options['isAdd']['elements']);
                }
                if ($isAdd) {
                    $combination[] = $combinationElement;
                }
            }
        }

        if (!empty($options['sort']['wholeSort'])) {
            if (is_callable($options['sort']['wholeSort'])) {
                usort($combination, $options['sort']['wholeSort']);
            } else {
                throw new Exception('wholeSortがcallableではありません。');
            }
        }

        return $combination;
    }

    /**
     * 単純なソート
     *
     * @param string $value1
     * @param string $value2
     * @return integer
     */
    private function simpleSort(string $value1, string $value2): int
    {
        return substr($value1, 1) - substr($value2, 1);
    }

    /**
     * PCのソート
     *
     * @param string $value1
     * @param string $value2
     * @return integer
     */
    private function pcSort(string $value1, string $value2): int
    {
        $pc1 = explode('|', $value1);
        $pc2 = explode('|', $value2);
        $p1 = str_replace('P', '', $pc1[0]);
        $p2 = str_replace('P', '', $pc2[0]);
        if ($p1 > $p2) {
            return 1;
        }
        if ($p1 < $p2) {
            return -1;
        }
        $c1 = str_replace('C', '', $pc1[1]);
        $c2 = str_replace('C', '', $pc2[1]);
        if ($c1 > $c2) {
            return 1;
        }
        if ($c1 < $c2) {
            return -1;
        }
        return 0;
    }

    /**
     * Iのソート
     *
     * @param array $value1
     * @param array $value2
     * @return integer
     */
    private function iSort(array $value1, array $value2): int
    {
        if (count($value1) > count($value2)) {
            return 1;
        }
        if (count($value1) < count($value2)) {
            return -1;
        }
        for ($i = 0; $i < count($value1); $i++) {
            if ($value1[$i] > $value2[$i]) {
                return 1;
            }
            if ($value1[$i] < $value2[$i]) {
                return -1;
            }
        }
        return 0;
    }

    /**
     * 結果取得
     *
     * @param string $baseSql
     * @param array $searchItem
     * @return array
     */
    private function getItem(string $baseSql, array $searchItem): array
    {
        $sql = $this->getMainSql($searchItem);
        $sql = <<<SQL
WITH base AS (
    {$baseSql}
)
{$sql}
ORDER BY
      target
    , item
SQL;
        $stmt = $this->db->prepare($sql);
        $keys = array_keys($searchItem);
        foreach ($keys as $target) {
            foreach ($searchItem as $key => $value) {
                if ($target != 'i' && $target == $key) {
                    continue;
                }
                if (!empty($value)) {
                    if ($key == 'i') {
                        $map = array_map(function ($v) {
                            return '"'.$v.'"';
                        }, $value);
                        $value = '['.implode(',', $map).']';
                    }
                    $stmt->bindValue(':'.$key.'_'.$target, $value, PDO::PARAM_STR);
                }
            }
        }
        $stmt->execute();
        $searchResult = ['r' => [], 'pc' => [], 'j' => [], 'i' => []];
        while (($row = $stmt->fetch(PDO::FETCH_ASSOC)) != false) {
            switch ($row['target']) {
                case 0:
                    if (!in_array($row['item'], $searchResult['r'])) {
                        $searchResult['r'][] = $row['item'];
                    }
                    break;
                case 1:
                    if (!in_array($row['item'], $searchResult['pc'])) {
                        $searchResult['pc'][] = $row['item'];
                    }
                    break;
                case 2:
                    if (!in_array($row['item'], $searchResult['j'])) {
                        $searchResult['j'][] = $row['item'];
                    }
                    break;
                case 3:
                    $items = json_decode($row['item'], true);
                    foreach ($items as $item) {
                        if (!in_array($item, $searchResult['i'])) {
                            $searchResult['i'][] = $item;
                        }
                    }
                    break;
            }
        }
        
        usort($searchResult['r'], [$this, 'simpleSort']);
        usort($searchResult['pc'], [$this, 'pcSort']);
        usort($searchResult['j'], [$this, 'simpleSort']);
        usort($searchResult['i'], [$this, 'simpleSort']);

        return $searchResult;
    }

    /**
     * 基本のSQLを取得
     *
     * @return void
     */
    private function getBaseSql(): string
    {
        $baseSql = <<<SQL
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
SQL;
    
        return $baseSql;
    }

    /**
     * メインSQL取得
     *
     * @param array $searchItem
     * @return string
     */
    private function getMainSql(array $searchItem): string
    {
        $keys = array_keys($searchItem);
        $sql = '';
        foreach ($keys as $num => $target) {
            $where = '';
            foreach ($searchItem as $key => $value) {
                if ($target != 'i' && $target == $key) {
                    continue;
                }
                if (!empty($value)) {
                    $where .= empty($where) ? '' : ' AND ';
                    if ($key == 'i') {
                        $where .= 'JSON_CONTAINS(col_'.$key.', :'.$key.'_'.$target.')';
                    } else {
                        $where .= 'col_'.$key.' = :'.$key.'_'.$target;
                    }
                }
            }
            $union = empty($sql) ? '' : ' UNION ALL ';
            $where = empty($where) ? $where : 'WHERE '.$where;
            $sql .= <<<SQL
{$union}
SELECT
      '{$num}' AS target
    , col_{$target} AS item
FROM
      base
{$where}
SQL;
        }

        return $sql;
    }

}

$test  = new NarrowDownTest();
$test->exec($argv);
