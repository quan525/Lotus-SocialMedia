const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authorization");
const { GetAllMessages, SendMessage } = require("../controllers/MessageController");

router.get('/:roomId', authenticateToken, GetAllMessages);
router.post('/:roomId', authenticateToken, SendMessage);


module.exports = router