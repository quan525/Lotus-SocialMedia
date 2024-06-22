const pool = require("../config/postgresdb")
const cloudinary = require("../config/cloudinary")

const CreatePost = async (req, res) => {
  try {
    const pictureFiles = Array.isArray(req.files) ? req.files : [];
    const { userId } = req;
    let { content = "" } = req.body;

    // Check if user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    if (!userCheck.rows[0]) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if content or pictureFiles exist
    if (!content && pictureFiles.length === 0) {
      return res.status(400).json({ message: "Nothing to create" });
    }

    let query;
    let values;
    let imageResponses = [];
    // If pictureFiles exist, upload images to cloudinary
    if (pictureFiles.length > 0) {
      let multiplePicturePromise = pictureFiles.map((picture) =>
        cloudinary.uploader.upload(picture.path).catch((error) => {
          console.error(`Failed to upload ${picture.path}: ${error}`);
        })
      );
      imageResponses = await Promise.all(multiplePicturePromise);
      // Extract media URLs from imageResponses
      let mediaUrls = imageResponses.map((response) => response.secure_url);

      // Construct query for inserting posts with images
      query = "INSERT INTO posts (user_id, content, images_url) VALUES ($1, $2, $3) RETURNING post_id";
      values = [userId, content, mediaUrls];
    } else {
      // Construct query for inserting posts without images
      query = "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING post_id";
      values = [userId, content];
    }

    // Execute the query
    const result = await pool.query(query, values);
    const postId = result.rows[0].post_id;

    res.status(200).json({ message: 'Post created successfully', postId: postId });

  } catch (error) {
    imageResponses.forEach((response) => cloudinary.uploader.destroy(response.public_id));
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};

const SharePost = async (req, res) => {
  try {
    const sharedPostId = req.params.postId;
    const userId = req.userId;
    const content = req.body.content;
    console.log(content)
    // Check if the post to be shared exists
    const checkPost = await pool.query(`SELECT * FROM posts WHERE post_id = $1`, [sharedPostId]);

    if (checkPost.rowCount > 0) {
      // Insert the shared post into the database
      const result = await pool.query(`INSERT INTO posts (shared_post, content, user_id) VALUES ($1, $2, $3)`, [sharedPostId, content, userId]);

      if (result.rowCount === 1) {
        // If insertion successful, send success response
        res.status(200).send("Post shared");
      } else {
        // If insertion failed, send error response
        res.status(400).send("Failed to create message");
      }
    } else {
      // If the post to be shared doesn't exist, send 404 error
      res.status(300).send("Post not found");
    }
  } catch (err) {
    // Handle any unexpected errors
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

const GetPost = async (req, res) => {
  const postId = req.body.postId;
  
  // Assuming you have a table named 'posts' where posts are stored
  const query = "SELECT * FROM posts WHERE post_id = $1";
  const values = [postId]
  
  // Assuming you're using a database library like 'mysql'
  // Make sure to replace 'mysql' with your actual database library
  try {
    // Execute the query
    const post = await pool.query(query, values);
    
    // Check if the post exists
    if (post.rows === 0) {
      // If the post doesn't exist, return a 404 status
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // If the post exists, return it
    res.json(post.rows);
  } catch (error) {
    // If an error occurs during the database operation, return a 500 status
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const GetUserPosts = async (req, res) => {
  let userId ;
  if(req.params.userId)
  {
    userId = req.params.userId;
  }
  else {
    userId = req.userId;
  }
  const query =`SELECT 
    p.*, su.profile_name, su.avatar_url,
    JSON_ARRAYAGG(l.user_id) AS user_like_ids,
    CASE 
        WHEN p.shared_post IS NOT NULL THEN (
            SELECT 
                CONCAT(
                    '{"content": "', REPLACE(sp.content, '"', '\"'), '", ',
                    '"created_at": "', sp.created_at, '", ',
                    '"images_url": "', sp.images_url, '", ',
                    '"user_id": "', sp.user_id, '", ',
                    '"profile_name": "', u.profile_name, '", ',
                    '"avatar_url": "', u.avatar_url, '"}'
                )
            FROM posts sp
            INNER JOIN users u ON u.user_id = sp.user_id
            WHERE sp.post_id = p.shared_post
        )
    END AS shared_post_details
    FROM posts p
    INNER JOIN users su
    ON p.user_id = su.user_id
    LEFT JOIN likes l 
    ON p.post_id = l.post_id
    WHERE p.user_id = $1
    GROUP BY p.post_id , su.profile_name, su.avatar_url
    ORDER BY p.created_at DESC`
  // const query = 
  // `SELECT 
  //   users.user_id, 
  //   users.profile_name, 
  //   users.avatar_url,
  //   posts.post_id,
  //   posts.content,
  //   posts.images_url,
  //   posts.created_at,
  //   posts.comments_count,
  //   posts.likes_count
  // FROM 
  //   users 
  // INNER JOIN 
  //   posts 
  // ON 
  //   posts.user_id = users.user_id 
  // WHERE 
  //   posts.user_id = $1
  // ORDER BY
  //   posts.created_at DESC`;
  const values = [userId]
  const posts = await pool.query(query, values)
  if(posts.rows.length > 0) {
    res.status(200).json(posts.rows)
  }else{
    res.status(404).send("No post found")
  }
}

const GetSelfPosts = async (req, res) => {
  const userId = req.userId;
  const query = 
  `SELECT 
    users.user_id, 
    users.profile_name, 
    users.avatar_url,
    posts.post_id,
    posts.content,
    posts.images_url,
    posts.created_at,
    CASE 
        WHEN posts.shared_post IS NOT NULL THEN (
            SELECT 
                CONCAT(
                    '{"content": "', REPLACE(sp.content, '"', '\"'), '", ',
                    '"created_at": "', sp.created_at, '", ',
                    '"images_url": "', sp.images_url, '", ',
                    '"user_id": "', sp.user_id, '", ',
                    '"profile_name": "', u.profile_name, '", ',
                    '"avatar_url": "', u.avatar_url, '"}'
                )
            FROM posts sp
            INNER JOIN users u ON u.user_id = sp.user_id
            WHERE sp.post_id = posts.shared_post
        )
    END AS shared_post_details
FROM 
    users 
INNER JOIN 
    posts 
ON 
    posts.user_id = users.user_id 
WHERE 
    posts.user_id = $1
ORDER BY
    posts.created_at DESC`; 
  const values = [userId]
  const posts = await pool.query(query, values)
  if(posts.rows.length > 0) {
    res.status(200).json(posts.rows)
  }else{
    res.status(404).send("No post found")
  }
}

const GetPosts = async(req, res) => {
  const userId = req.userId;
  const query = `SELECT 
    p.post_id, 
    p.content, 
    p.images_url, 
    p.created_at, 
    p.likes_count,
    p.comments_count,
    u.profile_name, 
    u.avatar_url, 
    u.user_id,
    COUNT(l.like_id) AS like_count,
    JSON_ARRAYAGG(l.user_id) AS user_like_ids,
    CASE 
        WHEN p.shared_post IS NOT NULL THEN (
            SELECT 
                CONCAT(
                    '{"content": "', REPLACE(sp.content, '"', '\"'), '", ',
                    '"created_at": "', sp.created_at, '", ',
                    '"images_url": "', sp.images_url, '", ',
                    '"user_id": "', sp.user_id, '", ',
                    '"profile_name": "', u.profile_name, '", ',
                    '"avatar_url": "', u.avatar_url, '"}'
                )
            FROM posts sp
            INNER JOIN users u ON u.user_id = sp.user_id
            WHERE sp.post_id = p.shared_post
        )
    END AS shared_post_details
FROM 
    posts p 
INNER JOIN 
    users u 
ON 
    p.user_id = u.user_id
LEFT JOIN 
    likes l
ON 
    p.post_id = l.post_id
WHERE 
    p.post_id IN (
        SELECT post_id FROM posts WHERE user_id != $1
    )
GROUP BY 
    p.likes_count,
    p.comments_count,
    p.post_id, 
    p.content, 
    p.images_url, 
    p.created_at, 
    u.profile_name, 
    u.avatar_url, 
    u.user_id
ORDER BY 
    p.created_at DESC;`
  const values = [userId]
  const posts = await pool.query(query, values)
  if (posts){
    res.status(200).send(posts.rows)
  }
}


const UpdatePost = async(req, res) => {
    const postId = req.body.postId;
}

const DeletePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;
    const query = `DELETE FROM posts WHERE post_id=$1 
                   AND user_id = $2`
    const values = [ postId, userId ]
    const result = await pool.query(query, values)
    if(result.rowCount > 0){  
      res.status(200).send("Successfully deleted")
    }else if (result.error) {
      res.status(500).send("Failed to delete: " + result.error.message);
    } else {
      res.status(400).send("Post Not found");
    }
}

module.exports =  { CreatePost, DeletePost, GetUserPosts, GetPost, GetPosts, SharePost }