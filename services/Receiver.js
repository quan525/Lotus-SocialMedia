const amqp = require('amqplib');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

class Consumer {
  constructor(url = process.env.CLOUDAMQP_URL || 'amqp://localhost') {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange("notificationExchange", 'direct',{ durable: true });
      // await this.channel.assertQueue(queueString);
      // await this.channel.bindQueue(queueString, "notificationExchange", 'info'); 
      this.channel.on("error", (err) => {
          console.log(err);
          setTimeout(() => this.connect(), 10000);
      });

      this.connection.on("error", (err) => {
          console.log(err);
          setTimeout(() => this.connect(), 10000);
      });
      this.connection.on("close", () => {
          console.error("connection to RabbitQM closed!");
          setTimeout(() => this.connect(), 10000);
      });
    } catch (error) {
      console.error(error);
      setTimeout(() => this.connect(), 10000);
    }
  }

async consume(queue, waitTime = 5000) {
  if (!this.connection || !this.channel) {
    await this.connect(queue);
  }

  let messages = [];
  const queueString = new String(queue).toString();
  await this.channel.assertQueue(queueString, { durable: true });


  // Start consuming
  const consumeResponse = await this.channel.consume(queueString, (msg) => {
    messages.push(JSON.parse(msg.content.toString()));
    this.channel.ack(msg);
  }, { noAck: false });

  // Wait for a certain period of time to collect messages
  await new Promise(resolve => setTimeout(resolve, waitTime));

  // Stop consuming
  await this.channel.cancel(consumeResponse.consumerTag);
  const consumerTag = consumeResponse.consumerTag
  return { messages, consumerTag } ;
}

  async stopConsuming(consumerTag) {
    try {
      await this.channel.cancel(consumerTag);
    } catch (error) {
      console.error('Error stopping consumption:', error);
    }
  }


  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
}

const consumer = new Consumer()
consumer.connect()

module.exports = consumer;