<?php

class DBUtil {

    /**
     * DB接続情報(.env)からDB接続情報を返す
     */
    public static function getDBSettings(string $baseDir = '..'): array
    {
        $filePath = rtrim($baseDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.'.env';
        if (!file_exists($filePath)) {
            echo "envファイルが存在しません。\n";
            exit;
        }

        $file = file($filePath);
        $settings = [
            'type' => '',
            'host' => '',
            'port' => '',
            'database' => '',
            'username' => '',
            'password' => '',
        ];

        foreach ($file as $line) {
            $setting = explode('=', rtrim($line));
            switch ($setting[0]) {
                case 'DB_TYPE':
                case 'DB_HOST':
                case 'DB_PORT':
                case 'DB_DATABASE':
                case 'DB_USERNAME':
                case 'DB_PASSWORD':
                    $settings[strtolower(str_replace('DB_', '', $setting[0]))] = str_replace("\\\\", "\\", str_replace("\\\"", "\"", trim($setting[1], '"')));
                    break;
            }
        }

        return $settings;

    }    

}