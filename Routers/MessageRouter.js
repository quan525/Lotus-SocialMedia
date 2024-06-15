const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authorization");
const { GetAllMessages, SendMessage, DeleteChatMessage } = require("../controllers/MessageController");

router.get('/:roomId', authenticateToken, GetAllMessages);

router.post('/:roomId', authenticateToken, SendMessage);

router.put('/:roomId/delete-messages', authenticateToken, DeleteChatMessage);

module.exports = router