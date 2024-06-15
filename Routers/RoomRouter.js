const { authenticateToken } = require("../middleware/authorization");
const { GetUserRooms, CreateSingleChat, CreateGroupChat, GetRoomById, UpdateRoomName, AddMember, DeleteRoom, QuitRoom, RemoveMember } = require("../controllers/RoomController");

const express = require("express")
const router = express.Router()
const { CreateMeetingRoom, ValidateMeeting } = require("../controllers/CallController");

router.get('/', authenticateToken, GetUserRooms);

router.post('/singlechat', authenticateToken, CreateSingleChat);

router.post('/group', authenticateToken, CreateGroupChat);

router.get('/:roomId', authenticateToken, GetRoomById);

router.put('/:roomId', authenticateToken, UpdateRoomName);
// router.delete('/:roomId', authenticateToken, DeleteRoom);

router.delete('/:roomId/users/:userId', authenticateToken, QuitRoom);

//Add member
// router.post('/:roomId/admin/users/:memberId', authenticateToken, AddMember);
router.post('/:roomId/users/add-members', authenticateToken, AddMembers);

router.delete('/:roomId/admin/users/:memberId', authenticateToken, RemoveMember);

router.get("/:roomId/validate", authenticateToken, ValidateMeeting)

router.post("/:roomId/create-meeting-room", authenticateToken, CreateMeetingRoom)
// router.get("/:roomId/metered-domain")
module.exports = router