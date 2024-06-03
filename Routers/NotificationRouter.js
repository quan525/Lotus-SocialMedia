const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/authorization');
const { GetNotifications, GetNotificationOnLogin } = require('../controllers/NotifiationController') 

router.post('/', async (req, res) => {
  const { senderId, receiverId, notiType, content} = req.body;
  const message = {
    sender_id : senderId,
    receiver_id : receiverId,
    noti_type : notiType,
    content : content
  }

  // rabbitMq.sendMessageQueue(channel, receiverId, message)
  res.send('Message sent');
});

router.get('/notiLogin', authenticateToken, GetNotificationOnLogin)

router.get('/', authenticateToken,  GetNotifications);

module.exports = router