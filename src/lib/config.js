/**
 * config.js supplies configuration to the rest of the system.
 * It pulls some of its values from environment variables, and sets defaults
 * values when they are not provided.
 *
 * Example Usage:
 *    const config = require("./config.js");
 *    const rootDirectory = config.ROOT_DIR;
 */

const path = require('path');
const yaml = require('js-yaml');
const { readFileSync } = require('fs');
const ROOT_DIR = path.join(__dirname, "..", "..");

/**
 * @typedef {Object} Config
 * @property {string} ROOT_DIR
 * @property {string} HOST_BASE_URL
 * @property {number} SERVER_PORT
 * @property {any} MONGO_URI
 * @property {any} OPENAPI_SCHEMA
 * @property {string} ENDPOINTS_DIR
 * @property {string} API_VERSION
 */

// Define config, a simple object that contains configuration values
// that will be use throughout the application.
/** @type {Config} config */
const config = {

  // The root directory of this project. Note that this will be some path
  // inside the Docker container.
  ROOT_DIR: ROOT_DIR,

  // The port to access this app from the host.
  HOST_BASE_URL: process.env.HOST_BASE_URL || "http://localhost:10001/",

  // The port the server listens on.
  // @ts-ignore
  SERVER_PORT: process.env.SERVER_PORT || 10001,

  ENDPOINTS_DIR: path.join(ROOT_DIR, "src", "endpoints"),

  // MongoDB connection string
  MONGO_URI: process.env.MONGO_URI,

  // OpenAPI schema object
  OPENAPI_SCHEMA: path.join(ROOT_DIR, 'lib', 'openapi.yaml')
};

/**
 * Load API version directly from openapi.yaml
 * @type {any} apiSchema
 */
const apiSchema = yaml.load(readFileSync(config.OPENAPI_SCHEMA, 'utf8'));
config.API_VERSION = apiSchema.info.version;

module.exports = config;