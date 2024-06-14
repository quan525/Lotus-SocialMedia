const { authenticateToken } = require("../middleware/authorization");
const { GetUserRooms, CreateSingleChat, CreateGroupChat, GetRoomById, UpdateRoomName, DeleteRoom, QuitRoom } = require("../controllers/RoomController");

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

router.get("/:roomId/validate", authenticateToken, ValidateMeeting)
router.post("/:roomId/create-meeting-room", authenticateToken, CreateMeetingRoom)
// router.get("/:roomId/metered-domain")
module.exports = router