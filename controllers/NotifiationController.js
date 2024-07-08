const { GetQueueMessage, startConsuming, stopConsuming } = require('../services/Receiver');
const consumer = require('../services/Receiver');
const { getNotisByReceiverId } = require('../services/notification.service');
const {pushNotiToSystem} = require('../services/notification.service');

const pool = require('../config/postgresdb');
// const consumer = new Consumer()
// consumer.connect()

const GetNotificationOnLogin = async (req, res) => {
  const userId = req.userId;
  let messages = [];

  try {
    const result = await getNotisByReceiverId(userId);
    messages = messages.concat(result);

    // const consumeResult = await consumer.consume(userId);
    // if(consumeResult.messages && consumeResult.messages.length > 0){
    //   console.log(consumeResult)
    //   messages = messages.concat(consumeResult.messages);
    // }
    // console.log("consume:", consumeResult);
        // noti_type: 'LIKE_POST',
        // item_id : post_id,
        // sender_id: userId,
        // receiver_id: receiverId,
        // date : new Date().toUTCString()
        //  noti_type, item_id, sender_id, receiver_id
    if (messages.length > 0) {
      console.log(messages)
      const MessagesArray = await Promise.all(messages.map(async (message) => {
        await pushNotiToSystem(message.noti_type, message.item_id, message.sender_id, message.receiver_id);
        const result = await pool.query('SELECT avatar_url, profile_name FROM users WHERE user_id = $1', [message.sender_id]);
        return { ...message._doc, sender_name: result.rows[0].profile_name, avatar_url: result.rows[0].avatar_url };
      }));
      // await Promise.all(MessageArray => console.log(MessageArray))
      res.status(200).send(MessagesArray);
    } else {
      res.status(200).send(messages);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error receiving message");
  }
}
           await pushNotiToSystem('LIKE_POST', post_id, userId, receiverId);

const GetNotifications = async (req, res) => {
  console.log('getting notifications...')
  const userId = req.userId;
  let messages = [];
  let timeoutId;
  let consumerTag;
  const poll = async () => {
    try {
      await consumer.consume(userId).then((result) => {
        messages = messages.concat(result.messages);
        consumerTag = result.consumerTag;
      });

      if (messages.length > 0) {
        const newMessages = await Promise.all(messages.map(async (message) => {
                     await pushNotiToSystem('LIKE_POST', post_id, userId, receiverId);

          const result = await pool.query('SELECT avatar_url, profile_name FROM users WHERE user_id = $1', [message.sender_id]);
          message.avatar_url = result.rows[0].avatar_url;
          message.sender_name = result.rows[0].profile_name;
          return message;
        }));
        console.log("Messages received")
        console.log(messages)
        clearTimeout(timeoutId);
        res.status(200).send(newMessages);
      } else {        
        timeoutId = setTimeout(poll, 5000)
         // wait 5 seconds before polling again
      }
    } catch (err) {
      console.error(err);
      clearTimeout(timeoutId);
      res.status(500).send("Error receiving message");
    }
  };

  // Stop polling when the client disconnects
  res.on('close', async () => {
    console.log("res close consumer tag")
    await consumer.stopConsuming(consumerTag);
    clearTimeout(timeoutId);
  });
  res.on('close', async () => {
    console.log("req close consumer tag")
    await consumer.stopConsuming(consumerTag);
    clearTimeout(timeoutId);
  });
  req.on("end", async () => {
    console.log("Htpp request ended")
    await consumer.stopConsuming(consumerTag);
    clearTimeout(timeoutId);
  });
  poll();
}

module.exports = { GetNotifications, GetNotificationOnLogin }