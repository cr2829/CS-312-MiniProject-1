-- seed.sql

-- Insert users
INSERT INTO users (user_id, password, name)
VALUES 
('alice123', 'alicepass', 'Alice'),
('bob456', 'bobpass', 'Bob'),
('charlie789', 'charliepass', 'Charlie');

-- Insert blogs
INSERT INTO blogs (creator_name, creator_user_id, title, body)
VALUES
('Alice', 'alice123', 'My First Blog', 'This is the first blog post.'),
('Bob', 'bob456', 'Bob''s Thoughts', 'Bob shares his thoughts here.'),
('Alice', 'alice123', 'Another Blog', 'Alice writes another blog post.'),
('Charlie', 'charlie789', 'Hello World', 'Charlie''s first blog post.'),
('Bob', 'bob456', 'Second Post', 'Bob writes a second post.');
