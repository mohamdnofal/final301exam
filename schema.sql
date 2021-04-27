DROP TABLE ammanmakeup;

CREATE TABLE IF NOT EXISTS ammanmakeup (
    id SERIAL PRIMARY KEY,
    name TEXT,
    image_link TEXT,
    price TEXT, 
    description TEXT
)