CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    post_id INT REFERENCES posts(post_id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    post_id INT REFERENCES posts(post_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Select user by username
SELECT * FROM users WHERE username = 'desired_username';

-- Create Collumn
ALTER TABLE users
ADD COLUMN avatar_url VARCHAR(255) NOT NULL DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
	 
	 
SELECT * FROM users