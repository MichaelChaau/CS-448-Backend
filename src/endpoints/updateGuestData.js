const logger = require("../lib/logger");
const Guests = require("../Data/guest");
const MessageBroker = require("../lib/rabbitmq");

/** 
 * endpoints.js is responsible for responding to requests for each endpoint in the REST API.
 * @type {import("../lib/mount-endpoints").EndpointObject} 
 */
const updateGuestData = {
  method: 'put',
  path: '/guest/:id',
  async handler(request, response) {
    try {
      /** @type {string} */
      const id = request.params.id;
      /** @type {import('../Data/guest').Guest} */
      const guestData = request.body;

      // update mongodb
      await Guests.update(id, guestData);
      const guest = await Guests.getOne(id);
      
      // send rabbitmq queue 
      MessageBroker.sendMessage('guest-info', guest);
      
      // http status
      const resourceUri = `${request.originalUrl}/${guest.studentID}`
      response.status(201).location(resourceUri).json(guest);
    } catch (e) {
      logger.error("Endpoints.updateGuestData", e);

      response.status(500).json({
        status: 500,
        error: "Internal Server Error",
        message: "See server's logs."
      });
    }
  }
}

module.exports = updateGuestData;