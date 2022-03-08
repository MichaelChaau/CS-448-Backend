// source: https://medium.com/swlh/communicating-using-rabbitmq-in-node-js-e63a4dffc8bb
const amqp = require('amqplib');
const logeer = require('./logger');

class MessageBroker {
  /**
   * @type {Promise<MessageBroker>}
   */
  static instance;

  /**
   * Initialize connection to rabbitMQ
   */
  async init() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  /**
   * @return {Promise<MessageBroker>}
   */
  static async getInstance() {
    if (!this.instance) {
      const broker = new MessageBroker()
      //@ts-ignore
      this.instance = broker.init();
    }
    return this.instance
  };

  /**
   * Send message to queue
   * @param {String} queue Queue name
   * @param {Object} msg Message as Buffer
   */
  async send(queue, msg) {
    if (!this.connection)
      await this.init();
    if (!this.channel)
      throw new Error('RabbitMQ Connection failed')
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))
  }
}

module.exports = MessageBroker