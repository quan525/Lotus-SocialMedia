const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();

    connection.on("error", async function(err) {
        console.error("Error from RabbitMQ:", err);
        await reconnectRabbitMQ();
    });

    connection.on("close", async function() {
        console.error("Connection to RabbitMQ closed!");
        await reconnectRabbitMQ();
    });

    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    await reconnectRabbitMQ();
  }
}

const reconnectRabbitMQ = async () => {
  console.log("Attempting to reconnect to RabbitMQ...");
  setTimeout(connectRabbitMQ, 10000);
}

const sendMessageQueue = async (queue, message) => {
  try {    
    await channel.assertQueue(queue, { durable: true });
    const response = await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
    console.log(response, "response")
    console.log(`Message sent to queue '${queue}':`, message);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw error;
  }
}

const receiveMessageQueue = async (queue) => {
  const messages = [];
  try {
    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for messages in queue...");
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`Received message from queue '${queue}':`, msg.content.toString());
        channel.ack(msg);
        messages.push(msg.content.toString());
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error receiving message from RabbitMQ:', error);
  }
  return messages;
}

module.exports = { 
  connectRabbitMQ,
  sendMessageQueue,
  receiveMessageQueue,
};