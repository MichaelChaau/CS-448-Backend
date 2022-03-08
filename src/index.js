/**
 * index.js is the entrypoint. It creates and starts the server.
 */

// Load builtin libraries.
const http = require('http');

// Load 3rd-party libraries.
const express = require('express');
const cors = require('cors');
const OpenApiValidator = require('express-openapi-validator');

// Load our libraries.
const config = require('./lib/config');
const logger = require('./lib/logger');
const mountEndpoints = require('./lib/mount-endpoints.js');
const MessageBroker = require('./lib/rabbitmq');
const Database = require('./lib/database');

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

const getServerStatus = () => {
  // wait to check status becasue rabbitmq
  // takes several seconds to load
  setTimeout(async () => {
    let mongoConnected = false, rabbitConnected = false;
    await Database.get()
      .then(() => mongoConnected = true)
      .catch((err) => logger.info(err))
    await MessageBroker.getInstance()
      .then(() => rabbitConnected = true)
      .catch(err => logger.info(err))
    logger.info({
      "Server Running On": config.HOST_BASE_URL,
      "DB Connected": mongoConnected,
      "Rabbit Connected": rabbitConnected
    })
  }, 7000)
}

main()
  .then(getServerStatus)
  .catch(e => logger.info(e))