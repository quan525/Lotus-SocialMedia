const e = require('cors');
const pool = require('../config/postgresdb')
const asyncHandler = require('express-async-handler')

const GetUserRooms = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const query = `SELECT
            r.room_id,
            r.name,
            r.room_type,
            r.admin,
            JSON_AGG(JSON_BUILD_OBJECT(
            'profile_name', u.profile_name,
            'user_id', u.user_id,
            'avatar_url', u.avatar_url
            )) AS users
            FROM
            user_room ur
            INNER JOIN
            chat_rooms r ON ur.room_id = r.room_id
            INNER JOIN
            users u ON ur.user_id = u.user_id
            WHERE
            ur.room_id IN (
                SELECT room_id FROM user_room WHERE user_id = $1
            )
            GROUP BY
            r.room_id,
            r.name,
            r.room_type,
            r.admin
            ORDER BY r.created_at DESC`;
        const values = [userId];
        const { rows }  = await pool.query(query, values);
        res.json({ success: true, rooms: rows });
    } catch (error) {
        console.error('Error fetching user rooms:', error);
        res.status(500).json({ success: false, message: 'Error fetching user rooms' });
    }
});

const CreateSingleChat = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const personId = req.body.personId;

        if (!personId) {
            return res.status(400).json({ success: false, message: 'second person is required' });
        }

        // Check if a chat room already exists between these two users
        const existingRoomQuery = `
            SELECT room_id 
            FROM user_room 
            WHERE room_id IN (
                SELECT room_id 
                FROM user_room 
                WHERE user_id IN ($1, $2) 
                GROUP BY room_id 
                HAVING COUNT(*) = 2
            )
            GROUP BY room_id 
            HAVING COUNT(*) = 2`;
        const existingRoomResult = await pool.query(existingRoomQuery, [userId, personId]);
        console.log(existingRoomResult.rows)
        if (existingRoomResult.rows.length > 0) {
            return res.status(400).json({ success: true, message: 'Chat room already exists', roomId: existingRoomResult.rows[0].room_id });
        }

        const roomQuery = `INSERT INTO chat_rooms (room_type) VALUES ($1) RETURNING room_id`;
        const roomValues = ['1'];
        const roomResult = await pool.query(roomQuery, roomValues);
        const roomId = roomResult.rows[0].room_id;

        const userRoomQuery = `INSERT INTO user_room (user_id, room_id) VALUES ($1, $2), ($3, $2)`;
        const userRoomValues = [userId, roomId, personId];
        await pool.query(userRoomQuery, userRoomValues);

        res.status(200).json({ success: true, message: 'Single chat created successfully' });
    } catch (error) {
        console.error('Error creating single chat:', error);
        res.status(500).json({ success: false, message: 'Error creating single chat' });
    }
});

const CreateGroupChat = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const { name, members } = req.body;
        console.log(name)
        console.log(members)
        console.log(req.body)
        // Validate request body
        if (name === null || !members || members.length < 2) {
            return res.status(400).json({ success: false, message: 'Name and at least two members are required' });
        }

        // Get all rooms of the current user
        const userRoomsQuery = `SELECT room_id FROM user_room WHERE user_id = $1`;
        const userRoomsResult = await pool.query(userRoomsQuery, [userId]);
        const userRooms = userRoomsResult.rows.map(row => row.room_id);

        // Check if a chat room already exists with these members
        for (let roomId of userRooms) {
            const roomMembersQuery = `SELECT user_id FROM user_room WHERE room_id = $1`;
            const roomMembersResult = await pool.query(roomMembersQuery, [roomId]);
            const roomMembers = roomMembersResult.rows.map(row => row.user_id);

            if (roomMembers.sort().join(',') === [userId, ...members].sort().join(',')) {
                return res.status(400).json({ success: true, message: 'Chat room already exists', roomId });
            }
        }

        // Start a transaction to ensure atomicity
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert the chat room
            const roomQuery = 'INSERT INTO chat_rooms (name, room_type, admin) VALUES ($1, $2, $3) RETURNING room_id';
            const roomValues = [name, '2', userId]; // Assuming room_type 2 represents group chat
            const roomResult = await client.query(roomQuery, roomValues);
            const roomId = roomResult.rows[0].room_id;

            // Associate members with the chat room
            const allMembers = [userId, ...members]; // Include the userId in the members array
            const placeholders = allMembers.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
            const userRoomQuery = `INSERT INTO user_room (user_id, room_id) VALUES ${placeholders}`;
            const userRoomValues = [].concat(...allMembers.map(memberId => [memberId, roomId]));
            await client.query(userRoomQuery, userRoomValues);

            // Commit the transaction
            await client.query('COMMIT');

            res.json({ success: true, message: 'Group chat created successfully' });
        } catch (error) {
            // Rollback the transaction on error
            await client.query('ROLLBACK');
            throw error; // Re-throw the error to be caught by the outer catch block
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (error) {
        console.error('Error creating group chat:', error);
        res.status(500).json({ success: false, message: 'Error creating group chat' });
    }
});

const GetRoomById = asyncHandler(async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const query = 'SELECT * FROM chat_rooms WHERE room_id = $1';
        const values = [roomId];
        const { rows } = await pool.query(query, values);
        res.json({ success: true, room: rows[0] });
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ success: false, message: 'Error fetching room by ID' });
    }
});

const UpdateRoomName = asyncHandler(async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { name } = req.body;
        const query = 'UPDATE chat_rooms SET name = $1 WHERE room_id = $2';
        const values = [name, roomId];
        await pool.query(query, values);
        res.json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ success: false, message: 'Error updating room' });
    }
});

const DeleteRoom = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const roomId = req.params.roomId;
        const query = 'DELETE FROM chat_rooms WHERE room_id = $1';
        const values = [roomId];
        const result = await pool.query(query, values);
        if(result.rowCount == 1){
            res.status(200).json({ success: true, message: 'Room deleted successfully' });
        }else {
            res.status(404).json({ success: false, message: 'Room not found' });
        }
    }
    catch(error) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Error deleting room' })
    }
});

const QuitRoom = async (req, res) => {
    
    try{
        const userId = req.userId;
        const roomId = req.params.roomId;
        const query = 'DELETE FROM user_room WHERE user_id = $1 AND room_id = $2';
        const values = [userId, roomId];
        const result = await pool.query(query, values);
        if(result.rowCount == 1){
            res.status(200).json({ success: true, message: 'Room deleted successfully' });
        }else {
            res.status(404).json({ success: false, message: 'Room not found' });
        }
    } catch(err){
        res.status(500).json({ success: false, message: 'Error deleting room' })
    }
    
}

module.exports = {
    GetUserRooms,
    CreateSingleChat,
    CreateGroupChat,
    GetRoomById,
    UpdateRoomName,
    DeleteRoom,
    QuitRoom
}