DROP DATABASE IF EXISTS messagely_test;
CREATE DATABASE messagely_test;

\c messagely_test;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    -- if its a PRIMARY KEY, means it is NOT NULL and UNIQUE
    username text PRIMARY KEY, 
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users ON DELETE CASCADE,
    to_username text NOT NULL REFERENCES users ON DELETE CASCADE,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

INSERT INTO users (username, password, first_name, last_name, phone, join_at) 
    VALUES ('rick12', '123', 'Richard', 'Beatnick', '666-6969-6969', '2023-05-17 10:30:45');

INSERT INTO users (username, password, first_name, last_name, phone, join_at) 
    VALUES ('bobba12', '123', 'Boublass', 'Brrrr', '420-6699-4204', '2023-06-19 13:24:55');

INSERT INTO messages ( from_username, to_username, body, sent_at)
    VALUES ('bobba12', 'rick12', 'Got it!', '2023-05-19 13:24:55');

INSERT INTO messages ( from_username, to_username, body, sent_at)
    VALUES ('rick12', 'bobba12', 'Message 2, brouh', '2023-05-19 12:24:55');