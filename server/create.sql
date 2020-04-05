CREATE TABLE rooms(
    rid serial primary key,
    room_name text UNIQUE NOT NULL,
    creator text NOT NULL,
    created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL
);

CREATE TABLE users(
    uid serial primary key,
    username text UNIQUE NOT NULL,
    password text, 
    email text UNIQUE NOT NULL,
    socket_id text,
    avatar INTEGER NOT NULL default 0,
    games_played INTEGER NOT NULL default 0,
    games_won INTEGER NOT NULL default 0,
    logged_in BOOLEAN NOT NULL default 'false',
    room_id INTEGER REFERENCES rooms(rid)
);