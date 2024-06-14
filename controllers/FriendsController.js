const pool = require("../config/postgresdb");
const { pushNotiToSystem } = require('../services/notification.service');
const producer = require('../services/Producer')

const AddFriend = async (req, res) => {
    const user1Id = req.userId;
    const user2Id = req.params.userId;
    // Check if users are already friends
    const checkQuery = "SELECT * FROM friends WHERE (person1_id = $1 AND person2_id = $2) OR (person1_id = $2 AND person2_id = $1)";
    const checkValues = [user1Id, user2Id];
    const checkResponse = await pool.query(checkQuery, checkValues);
    if (checkResponse.rows.length > 0) {
        return res.status(409).json({ error: "Unable to add friend" });
    }

    // Add friend
    const addQuery = "INSERT INTO friends (person1_id, person2_id,status) VALUES ($1, $2, $3) RETURNING *";
    const addValues = [user1Id, user2Id, "Pending"];
    try {
        // const query = ` WITH inserted_row AS (
        //             INSERT INTO likes (post_id, user_id)
        //             VALUES ($1, $2)
        //             RETURNING *
        //         )
        //         SELECT 
        //             (SELECT user_id FROM posts WHERE post_id = $3) AS referenced_user_id,
        //             *
        //         FROM inserted_row`;
        const addResponse = await pool.query(addQuery, addValues);
        const message = {
          noti_type: 'FRIEND_REQUEST',
          item_id : null,
          sender_id: user1Id,
          receiver_id: user2Id,
          created_at : new Date().toUTCString()
        };
        await producer.publishMessage(user2Id, message)
        if( addResponse.rows.length > 0){
            res.status(200).json("Friend request sent successfully");
        } else {
            res.status(400).json({ error: "Failed to send friend request" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const AcceptFriend = async (req, res) => {
    try {
        const userId1 = req.userId;
        const userId2 = req.params.userId;
        const query = "UPDATE friends SET status = $1 WHERE person2_id = $2 AND person1_id = $3 AND status = $4 RETURNING *";
        const values = ["Friends", userId1, userId2, "Pending"];
        const acceptResponse = await pool.query(query, values);
        if (acceptResponse.rows.length > 0) {        
            const message = {
              noti_type: 'ACCEPT_REQUEST',
              item_id : null,
              sender_id: userId1,
              receiver_id: userId2,
              created_at : new Date().toUTCString()
            };
            await producer.publishMessage(userId2, message)
            res.status(200).json({ status: "Request accepted" });
        } else {
            res.status(403).json({ error: "No friend request found" });        
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }
}

const RemoveFriend = async (req,res) => {
    try {
        const userId1 = req.userId;
        const userId2 = req.params.userId;
        // const query = "DELETE FROM friends WHERE (person1_id = $1 AND person2_id = $2) OR (person1_id = $2 AND person2_id = $1)";
        const query = "DELETE FROM friends WHERE status = 'Friends' AND (person1_id = $1 AND person2_id = $2) OR (person1_id = $2 AND person2_id = $1) RETURNING *";
        const values = [userId1, userId2];
        const removeResponse = await pool.query(query, values);
        if (removeResponse.rowCount > 0) {
            res.status(200).json({ status: "Friend removed" , removeResponse: removeResponse});
        } else {
            res.status(404).json({ error: "No friend found", removeResponse: removeResponse});
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error", err });
    }
}

const RemoveRequest = async ( req, res) => {
    const user1Id = req.userId;
    const user2Id = req.params.userId;
    const query = "DELETE FROM friends WHERE (person1_id = $1 AND person2_id = $2 AND status = $3) OR (person1_id = $2 AND person2_id = $3 AND status = $3)";
    const values = [user2Id, user1Id, 'Pending'];
    const removeResponse = await pool.query(query, values)
    if(removeResponse.rowCount > 0){
        res.status(200).json({ status: "Request removed" });
    }else{
        res.status(404).json({ error: "No request found" });
    }
}

const GetAllRequests = async (req, res) => {
    const userId = req.userId;
    const query = `SELECT friends.relationship_id, users.user_id, users.profile_name, users.avatar_url, users.created_at 
                    FROM users 
                    INNER JOIN friends ON friends.person1_id = users.user_id AND status = 'Pending'
                    WHERE friends.person2_id = $1 `;
    const values = [userId];
    const requests  = await pool.query(query, values);
    res.status(200).json(requests.rows);
}

const GetAllFriends = async (req, res) => {
    const userId = req.userId;
    const query = `SELECT f.relationship_id, u.user_id, u.profile_name, u.avatar_url, u.cover_url
    FROM users u
    INNER JOIN friends f ON (f.person1_id = u.user_id OR f.person2_id = u.user_id)
    WHERE ((f.person1_id = $1 AND f.person2_id = u.user_id) OR (f.person2_id = $1 AND f.person1_id = u.user_id)) AND f.status = 'Friends'`;
    const values = [ userId ]
    const friends = await pool.query(query, values);
    if(friends.rows.length > 0){
        res.status(200).json(friends.rows);
    }else {
        res.status(404).json({ error: "No friends found" });
    }
}

const GetPersonFriends = async (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT f.relationship_id, u.user_id, u.profile_name, u.avatar_url, u.cover_url
    from users u 
    INNER JOIN friends f ON (f.person1_id = u.user_id OR f.person2_id = u.user_id)
    WHERE ((f.person1_id = $1 AND f.person2_id = u.user_id) OR (f.person2_id = $1 AND f.person1_id = u.user_id)) AND f.status = 'Friends'`;
    const values = [ userId ]
    const friends = await pool.query(query, values);
    if(friends.rows.length > 0){
        res.status(200).json(friends.rows);
    }else {
        res.status(404).json({ error: "No friends found" });
    }
}

const GetRelationShip = async (req, res) => {
    const userId = req.userId;
    const secondUser = req.params.userId;
    
    if (userId === secondUser) {
        return res.status(403).json({ success: false, message: "You cannot check relationship with yourself." });
    }

    try {
        const query = `SELECT * FROM friends 
                        WHERE (person1_id = $1 AND person2_id = $2) OR 
                              (person1_id = $2 AND person2_id = $1)
                              LIMIT 1`;
        const values = [userId, secondUser];
        const result = await pool.query(query, values)
        // Assuming result.rows contains the rows fetched from the database
        res.status(200).json({relationship: result.rows });
    } catch (err) {
        console.error("Error retrieving relationship:", err);
        res.status(500).json({ success: false, message: "Unable to get relationship" });
    }
}

module.exports = { AddFriend, AcceptFriend, RemoveFriend, RemoveRequest, GetAllRequests, GetAllFriends, GetRelationShip, GetPersonFriends };