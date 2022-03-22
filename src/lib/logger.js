/**
 * Provides a winston.js logger object.
 * See https://github.com/winstonjs/winston for documentation.
 *
 * Usage:
 *    const logger = require("./logger.js");
 *
 *    logger.error("some error message");
 *    logger.info("some informative message");
 *    logger.warn("some warning message");
 *    logger.debug("some debug message");
 */
const { transports, createLogger, format } = require('winston');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
  ],
});


module.exports = logger;