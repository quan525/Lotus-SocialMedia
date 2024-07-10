const pool = require('../config/postgresdb');
const asyncHandler = require('express-async-handler');

const GetAllMessages = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const roomId = req.params.roomId;

    // Input validation
    if (!userId || !roomId) {
        return res.status(400).json({ error: 'User ID and Room ID are required' });
    }

    const query = `SELECT messages.*
                    FROM messages
                    INNER JOIN user_room ON messages.room_id = user_room.room_id
                    WHERE messages.room_id = $1
                    AND user_room.user_id = $2
                    AND messages.created_at >= user_room.joined_at
                    ORDER BY messages.created_at ASC`;
    const values = [roomId, userId];

    try {
        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
});

const DeleteChatMessage = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const roomId = req.params.roomId;
        const query = 'UPDATE user_room SET joined_at = CURRENT_TIMESTAMP WHERE user_id = $1 and room_id = $2';
        const values = [userId, roomId];
        const result = await pool.query(query, values);
        if (result.rowCount === 1) {
            res.status(200).json({ success: true, message: 'Message deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Unable to delete message' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting room' });
    }
});

const SendMessage = async (req, res) => {
    const userId = req.userId;
    const roomId = req.params.roomId;
    const content = req.body.content;
    if(req.body.sender_id != userId){
        res.status(403).send({sucess: false, message: "You do not have permission to perform this action."})
    }
    const checkRights = 'SELECT * FROM user_room WHERE room_id = $1 AND user_id = $2';
    const checkValues = [roomId, userId];
    const checkResult = await pool.query(checkRights, checkValues);
    if( checkResult.rows.length === 1)
    {
        const query = 'INSERT INTO messages (room_id, sender_id, content) VALUES ($1, $2, $3)';
        const values = [roomId, userId, content];
        const result = await pool.query(query, values);
        if(result.rowCount === 1){
            res.send({ success: true, message: 'Message sent' });
        }else{
            res.status(500).send({ success: false, message: 'Error sending message' });
        }
    }else {
        res.status(403).send({ success: false, message: 'You are not allowed to send messages to this room' });
    }
}

module.exports = { SendMessage, GetAllMessages, DeleteChatMessage}