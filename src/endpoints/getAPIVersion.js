const logger = require("../lib/logger");
const { API_VERSION } = require("../lib/config");

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