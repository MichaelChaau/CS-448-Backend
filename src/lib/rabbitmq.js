// source: https://medium.com/swlh/communicating-using-rabbitmq-in-node-js-e63a4dffc8bb



class MessageBroker {
  /**
   * Initialize connection to rabbitMQ
   */
  async init() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await this.connection.createChannel();
  }
}