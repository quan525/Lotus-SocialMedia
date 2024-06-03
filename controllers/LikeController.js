const pool = require('../config/postgresdb');
const rabbitMq = require('../services/messageQueue/rabbitMq');
const { SendMessage } = require('./MessageController');
const { pushNotiToSystem } = require('../services/notification.service');
const producer = require('../services/Producer')

const LikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    // Check if the post exists
    const postExists = await pool.query('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
    if (postExists.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post is already liked by the user
    const likeExists = await pool.query('SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    if (likeExists.rowCount > 0) {
      return res.status(200).json({ messsage: "Post already liked" });
    }

    const query = ` WITH inserted_row AS (
                    INSERT INTO likes (post_id, user_id)
                    VALUES ($1, $2)
                    RETURNING *
                )
                SELECT 
                    (SELECT user_id FROM posts WHERE post_id = $3) AS referenced_user_id,
                    *
                FROM inserted_row`;
    const values = [postId, userId, postId];
    const likeResponse = await pool.query(query, values);
    
    if(likeResponse.rows.length > 0 ){
      const receiverId= likeResponse.rows[0].referenced_user_id;
      const post_id = likeResponse.rows[0].post_id;
      res.status(200).json({ status: "Liked" });
      const message = {
        noti_type: 'LIKE_POST',
        item_id : post_id,
        sender_id: userId,
        receiver_id: receiverId,
        date : new Date().toUTCString()
      };
      await producer.publishMessage(likeResponse.rows[0].referenced_user_id, message)
      await pushNotiToSystem('LIKE_POST', post_id, userId, receiverId);
    } else {
      res.status(404).json({ error: "Failed to like post" });
    }
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const UnLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    // Check if the post exists
    const postExists = await pool.query('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
    if (postExists.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post is liked by the user
    const likeExists = await pool.query('SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    if (likeExists.rowCount === 0) {
      return res.status(400).json({ error: "Post not liked yet" });
    }

    const query = 'DELETE FROM likes WHERE post_id = $1 AND user_id = $2';
    const values = [postId, userId];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.status(200).json({ status: "Unliked" });
    } else {
      res.status(500).json({ error: "Failed to unlike post" });    }
  } catch (error) {
    console.error('Error removing like:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const GetTotalLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const query = 'SELECT * FROM likes WHERE post_id = $1';
    const values = [postId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting likes:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { LikePost, UnLikePost, GetTotalLikes }