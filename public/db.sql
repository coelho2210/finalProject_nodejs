DROP TABLE USERS;

CREATE TABLE USERS
(
	id SERIAL PRIMARY KEY NOT NULL,
	-- first_name VARCHAR(100) NOT NULL,
	-- last_name VARCHAR(100),
	username VARCHAR (100) NOT NULL,
	pw VARCHAR (255) NOT NULL
);


INSERT INTO USERS (username, pw)
VALUES ('coelho', '123456');