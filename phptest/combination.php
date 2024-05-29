<?php
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding('UTF-8');

function getCombinationAll(array $arr, int $limit = 0, array $isInclude = []): array
{
    $combination = [];
    for ($i = 0; $i < count($arr); $i++) {
        if ($limit > 0 && $i + 1 > $limit) {
            break;
        }
        $combination = array_merge($combination, getCombination($arr, $i + 1, $isInclude));
    }

    return $combination;
}

function getCombination(array $arr, int $count, array $isInclude = []): array
{
    $arrCount = count($arr);
    $combination = [];
    if ($count < 1 || $arrCount < $count) {
        return [];
    }

    if($count == 1){
        foreach($arr as $item){
            $combination[] = [$item];
        }
    } else {
        for($i = 0; $i < $arrCount - $count + 1; $i++){
            $recursion = getCombination(array_slice($arr, $i + 1), $count - 1, $isInclude);
            foreach($recursion as $recursionItem){
                array_unshift($recursionItem, $arr[$i]);
                usort($recursionItem, function ($value1, $value2) { return substr($value1, 1) - substr($value2, 1); });

                $isAdd = false;
                foreach ($isInclude as $includeItem) {


                    if (count($includeItem) < count($recursionItem)) {
                        continue;
                    }

                    $isAdd = true;
                    foreach ($recursionItem as $item) {
                        if (array_search($item, $includeItem, true) === false) {
                            $isAdd = false;
                            break;
                        }
                    }
                    if ($isAdd) {
                        break;
                    }
                }
                if ($isAdd) {
                    $combination[] = $recursionItem;
                }
            }
        }
    }

    return $combination;
}

$single = ['I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'I09', 'I10', 'I11', 'I12', 'I13', 'I14', 'I15', 'I16'];
$multi = json_decode('[["I01","I02"],["I04","I12"],["I06","I13"],["I07","I12"],["I09","I11"],["I10","I12"],["I12","I13"],["I12","I14"],["I13","I14"],["I04","I06","I12"],["I06","I12","I14"],["I06","I12","I15"],["I08","I10","I12"],["I09","I10","I14"],["I12","I13","I14"],["I12","I13","I15"],["I03","I04","I11","I12"],["I04","I06","I12","I13"],["I04","I08","I09","I12"],["I04","I09","I10","I12"],["I06","I09","I10","I12"],["I12","I13","I14","I15"],["I06","I10","I12","I14","I15"],["I06","I12","I13","I14","I15"],["I06","I12","I13","I14","I15","I16"]]', true);
print_r(getCombinationAll($single, 6, $multi));


