CREATE TABLE member 
( member_id    SERIAL PRIMARY KEY
, username     VARCHAR (50)   NOT NULL UNIQUE 
, pass_word    VARCHAR (250)  NOT NULL
, first_name   VARCHAR (50)   NOT NULL
, last_name    VARCHAR (50)   NOT NULL
, email        VARCHAR (50)   NOT NULL UNIQUE
);