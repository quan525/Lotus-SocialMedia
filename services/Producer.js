require('dotenv').config();
const amqp = require("amqplib");
// const config = require("./config");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

class Producer {
  constructor(){
    this.channel = null;
    this.connection = null;
  } 
  async createChannel() {
    try {
      this.connection = await amqp.connect(process.env.CLOUDAMQP_URL || 'amqp://localhost');        
      
      this.channel = await this.connection.createChannel();
      console.log("connected")
    }catch(err) {
      if (err.code === 'ECONNRESET') {
        console.error('Connection was reset. Attempting to reconnect...');
        setTimeout(() => this.createChannel(), 10000);
      } else {
        console.error('Error occurred:', err);
      }
      console.error(err);
      setTimeout(() => this.createChannel(), 10000);    
    }
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
        this.channel = await this.connection.createChannel(); // Fix: properly assign the channel
    }

    const routingKeyString = String(routingKey); // Fix: Use String() directly
    const exchangeName = "notificationExchange";

    // Ensure the exchange exists
    await this.channel.assertExchange(exchangeName, "direct", { durable: true });

    // Ensure the queue exists and is not exclusive (unless intended for temporary use)
    await this.channel.assertQueue(routingKeyString, {
        durable: true // Fix: Use durable queues for persistence if needed
    });

    // Bind the queue to the exchange with the routing key
    await this.channel.bindQueue(routingKeyString, exchangeName, routingKeyString); // Fix: Correct method usage

    const logDetails = {
        queue: routingKeyString,
        message: message,
        dateTime: new Date(),
    };

    // Publish the message
    await this.channel.publish(
        exchangeName,
        routingKeyString,
        Buffer.from(JSON.stringify(message)),
        { persistent: true } // Fix: Ensure message persistence if needed
    );

    console.log(`The new ${routingKey} log is sent to exchange ${exchangeName}`);
  }
}

const producer = new Producer();
producer.createChannel();

module.exports = producer;  