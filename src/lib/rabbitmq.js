// source: https://medium.com/swlh/communicating-using-rabbitmq-in-node-js-e63a4dffc8bb
const amqp = require('amqplib');
const amqplib = require('amqplib/callback_api');
const config = require('./config');
const logger = require('./logger');

class MessageBroker {
  // /** @type {import('amqplib/callback_api').Connection} */
  // static connection;

  /** @type {import('amqplib/callback_api').Channel} */
  static channel;

  /** @returns {Promise<import('amqplib/callback_api').Channel>} */
  static async getChannel() {
    if (MessageBroker.channel === undefined) {
      /** @type {import('amqplib/callback_api').Channel} */
      const result = await new Promise(function (resolve, reject) {
        amqplib.connect(config.RABBITMQ_URL, function (connectionError, connection) {
          if (connectionError)
            reject(connectionError)
          connection.createChannel((channelError, channel) => {
            if (channelError)
              reject(channelError)
            else {
              resolve(channel)
            }
          })
        })
      }).catch(err => { throw err })
      if (result)
        this.channel = result
      else
        throw new Error('Connection failed, channel not created')
    }
    return this.channel
  }

  /**
   * Send message to queue
   * @param {String} queue Queue name
   * @param {Object} data Message as Buffer
   */
  static async sendMessage(queue, data) {
    const _channel = await this.getChannel()

    _channel.assertQueue(queue);
    logger.info("Queue sent")
    _channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  }
}

module.exports = MessageBroker