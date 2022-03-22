// Axios
//   - Used to make HTTP request to the SUT (system under test).
//   - Related identifiers: axios, get, post, and response.
//   - <https://github.com/axios/axios>
const axios_ = require("axios");
const {SUT_BASE_URL} = require('./config.js');
const axios = axios_.create({ baseURL: SUT_BASE_URL });

module.exports = axios;