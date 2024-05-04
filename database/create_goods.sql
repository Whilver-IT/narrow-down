/* テーブル定義 */
CREATE TABLE goods (
      id        SMALLINT    UNSIGNED  AUTO_INCREMENT
    , col_r     VARCHAR(3)  NOT NULL
    , col_p     VARCHAR(2)  NOT NULL
    , col_c     VARCHAR(2)  NOT NULL
    , col_j     VARCHAR(3)  NOT NULL
    , col_i     VARCHAR(3)  NOT NULL
    , PRIMARY KEY(id)
);