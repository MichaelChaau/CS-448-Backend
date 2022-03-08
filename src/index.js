/**
 * index.js is the entrypoint. It creates and starts the server.
 */

// Load builtin libraries.
const http = require('http');
const path = require('path');

// Load 3rd-party libraries.
const express = require('express');
const cors = require('cors');
const OpenApiValidator = require('express-openapi-validator');

// Load our libraries.
const config = require('./lib/config');
const logger = require('./lib/logger');
const mountEndpoints = require('./lib/mount-endpoints.js');
const { Type } = require('js-yaml');
const MessageBroker = require('./lib/rabbitmq');

async function main() {
  let app = await buildApp();
  let server = http.createServer(app)
  server.listen(config.SERVER_PORT);
}

async function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    OpenApiValidator.middleware({
      apiSpec: config.OPENAPI_SCHEMA,
      validateRequests: true,
      validateResponses: false,
    }),
  );

  mountEndpoints(app);

  //@ts-ignore
  app.use((err, req, res, next) => {
    console.log("WE ARE HERE");
    if (res.headersSent) {
      return next(err);
    }
    logger.error(__filename, err);
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  return app;
}

main()
  .then(async () => {
    setTimeout(async () => {
      const broker = await MessageBroker.getInstance()
        .catch(err => { logger.info(err) });
      if (broker)
        broker.send('test', { name: 'Jared ' })
          .catch(err => { logger.info(err) });
    }, 10000)
    logger.info(`Sever running on http://localhost:${config.SERVER_PORT}`)
  })
  .catch(e => logger.error(e))