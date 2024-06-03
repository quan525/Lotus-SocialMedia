'use strict';

const rabbitMq = require('./messageQueue/rabbitMq');

let channel;

const initializeRabbitMQ = async () => {
  try {
    channel = await rabbitMq.connectRabbitMQ();
  } catch (error) {
    console.error('Error initializing RabbitMQ:', error);
  }
};

initializeRabbitMQ();

const PushNotiToSystem = async ({
  noti_type,
  sender_id,
  receiver_id,
}) => {      
  let noti_content;
  if (noti_type === 'LIKE_POST') {
    console.log("liked a post");
    noti_content = `${sender_id} has liked your post`; // Fixed placeholder
  }
  const message = {
    noti_type,
    sender_id,
    receiver_id,
    noti_content,
    timestamp: Date.now()
  };
  const stringReceiverId = new String(receiver_id).toString();

  // Assuming you want to send this message to a RabbitMQ queue
  if (channel) {
    try {
      await rabbitMq.sendMessageQueue(stringReceiverId, message);
      console.log(`Notification sent to user '${stringReceiverId}'`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  } else {
    console.error('RabbitMQ channel is not initialized');
  }
};

const GetQueueMessage = async (userId) => {
  const stringUserId = new String(userId).toString();
  let messages = [];
  if (channel) {
    try {
      messages = await rabbitMq.receiveMessageQueue(stringUserId);
      console.log(`Received messages for user '${stringUserId}'`);
    } catch (error) {
      console.error('Error receiving message from RabbitMQ:', error);
    }
  } else {
    console.error('RabbitMQ channel is not initialized');
  }
  return messages;
};

const startConsuming = async (queue) => {
  const stringQueue = new String(queue).toString();
  try {
    console.log("Starting to consume messages...");   
    await channel.assertQueue(stringQueue, { durable: false });
    const response = await channel.consume(stringQueue, (msg) => {
      // process the message
    }, { noAck: false });

    // Return the consumer tag
    return response.consumerTag;
  } catch (error) {
    console.error('Error starting to consume messages:', error);
    throw error;
  }
};

const stopConsuming = async (consumerTag) => {
  try {
    await channel.cancel(consumerTag);
    console.log(`Stopped consuming messages with consumer tag '${consumerTag}'`);
  } catch (error) {
    console.error(`Error stopping consuming messages with consumer tag '${consumerTag}':`, error);
    throw error;
  }
};

module.exports = { PushNotiToSystem, GetQueueMessage, startConsuming, stopConsuming };