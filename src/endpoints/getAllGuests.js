const logger = require("../lib/logger");
const Guests = require("../Data/guest");

/** 
 * endpoints.js is responsible for responding to requests for each endpoint in the REST API.
 * @type {import("../lib/mount-endpoints").EndpointObject} 
 * */
const getAllGuests = {
  method: 'get',
  path: '/guest/list',
  async handler(request, response) {
    try {
      const guests = await Guests.getAll();
      response.status(200).json(guests);
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