const logger = require("../lib/logger");
const Guests = require("../Data/guest");
const { API_VERSION } = require("../lib/config");
const MessageBroker = require("../lib/rabbitmq");

/** 
 * endpoints.js is responsible for responding to requests for each endpoint in the REST API.
 * @type {import("../lib/mount-endpoints").EndpointObject} 
 * */
const getAllGuests = {
  method: 'get',
  path: '/version',
  async handler(request, response) {
    try {
      response.status(200).send(API_VERSION);
      MessageBroker.sendMessage('guest-info', { name: 'Jared' });
    } catch (e) {
      logger.error("Endpoints.getAllGuests", e);
      response.status(500).json({
        status: 500,
        error: "Internal Server Error",
        message: "See server's logs."
      })
    }
  }
};

module.exports = getAllGuests