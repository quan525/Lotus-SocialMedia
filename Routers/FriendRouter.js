const express = require("express");
const { AddFriend, AcceptFriend, RemoveFriend, RemoveRequest, GetAllRequests, GetAllFriends, GetRelationShip, GetPersonFriends} = require("../controllers/FriendsController");
const { authenticateToken } = require("../middleware/authorization")
const router = express.Router();

//Retrieve friend requests
router.get("/friend-requests", authenticateToken, GetAllRequests)

//Get all friend
router.get("/",authenticateToken, GetAllFriends)

//Add friend
router.post("/:userId", authenticateToken, AddFriend)

//Get An User Friends
router.get("/:userId/friends", authenticateToken, GetPersonFriends)

//Get Single Relationship
router.get("/:userId", authenticateToken, GetRelationShip)

//Accept
router.put("/:userId/accept", authenticateToken, AcceptFriend)

//Remove friend
router.delete("/:userId/remove", authenticateToken, RemoveFriend)


//Remove request
router.delete("/:userId/remove-request", authenticateToken, RemoveRequest)

module.exports = router

