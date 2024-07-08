const cloudinary = require("../config/cloudinary")
const pool = require("../config/postgresdb")
const {pushNotiToSystem} = require('../services/notification.service');
const producer = require('../services/Producer')

const AddComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comment = req.body.content;
    const userId = req.userId;
    const image = req.file; // This will be undefined if no image is uploaded

    let query;
    let values;

    if (image) {
      const uploadedItem = cloudinary.uploader.upload(file)
      const image_url = uploadedItem.secure_url;
      // If an image is uploaded, update the comment with image
      query = `WITH inserted_row as (
                  INSERT INTO comments (content, image_url, user_id, post_id) 
                  VALUES ($1, $2, $3, $4)
                  RETURNING *
                )
              SELECT  
              (SELECT user_id from posts WHERE post_id = $3) AS referenced_user_id,
              * 
              FROM inserted_row `;
      values = [comment, image_url, userId, postId];
    } else {
      // If no image is uploaded, update the comment without image
      query = ` WITH inserted_row AS (
                    INSERT INTO comments (content, user_id, post_id)
                    VALUES ($1, $2, $3)
                    RETURNING *
                )
                SELECT 
                    (SELECT user_id FROM posts WHERE post_id = $3) AS referenced_user_id,
                    *
                FROM inserted_row`;
      values = [comment, userId, postId];
    } 

    // Execute the query
    const result = await pool.query(query, values);
    const receiverId= result.rows[0].referenced_user_id;
    // Check if any rows were affected by the update
    if(result.rowCount === 0) {
      return res.status(404).json({ message: 'No comment found to add' });
    }else {
      const message = {
        noti_type: 'COMMENT_POST',
        item_id : postId,
        sender_id: userId,
        receiver_id: receiverId,
        date : new Date().toUTCString()
      };
      await producer.publishMessage(receiverId, message)
      res.status(201).json({ message: 'Comment added successfully' });;
    }
    // Send success response
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while Adding the comment: ' + error });
  }
};

//Not finished
const UpdateComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const comment = req.body.comment;
    const query = 'UPDATE comments SET comment_text = $1 WHERE id = $2';
    const values = [comment, commentId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No comment found to update' });
    }

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ message: 'An error occurred while updating the comment' });
  }
};


const GetPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const query = `SELECT c.comment_id, c.post_id, c.content, c.parent_comment_id, c.created_at, 
                  u.user_id, u.avatar_url , u.username
                  FROM comments c
                  LEFT JOIN  users u 
				          ON u.user_id = c.user_id
                  WHERE post_id = $1
                  ORDER BY c.created_at DESC`;
    const values = [postId]
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No comment found' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting comment:', error.message);
    res.status(500).json({ message: 'An error occurred while getting the comment: ' + error });
  }
};

const DeleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const commentId = req.body.commentId;
    const commentUserQuery = 'SELECT * FROM comments WHERE post_id = $1 AND comment_id = $2';
    const checkCommentOwnerResult = await pool.query(commentUserQuery, [postId, commentId]); 
    if(userId == checkCommentOwnerResult.rows[0].user_id)
    {
      const query = 'DELETE FROM comments WHERE post_id = $1 AND comment_id = $2'
      const values = [postId, commentId];
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No comment found to delete' });
      }
    };

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting the comment: ' + error });
  }
};


module.exports = { AddComment, UpdateComment, GetPostComments , DeleteComment }