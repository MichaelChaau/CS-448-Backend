// Chai-as-Promised
//   - A plugin for Chai that helps us work with promisses.
//   - Related identifiers: rejected, rejectedWith, eventually, ...
//   - <https://github.com/domenic/chai-as-promised#readme>
const chaiAsPromised = require('chai-as-promised');

// API-Contract-Validator
//   - Is a plugin for chai, which works with axios responses, that provides
//     validation of responses against an OpenAPI specification. It also
//     provides coverage reports that detail which parts of the OpenAPI
//     specification have been covered by at least one unit test.
//   - Related identifiers: matchApiSchema
//   - <https://www.chaijs.com/plugins/api-contract-validator/>
const apiContractValidator = require("api-contract-validator");
const apiContractValidatorChaiPlugin = apiContractValidator.chaiPlugin({
  // The path to the OpenAPI specification. (Created in entrypoint.sh)
  apiDefinitionsPath: "/tmp/openapi.yaml",
  // Produce coverage reports.
  reportCoverage: true,
});

// Chai
//   - Provides a plugable fluent assertion library. We use its expect BDD style.
//   - Related identifiers: expect, use, to, be, have, equal, ...
//   - <https://www.chaijs.com/api/bdd/>
const chai = require('chai');
chai.use(apiContractValidatorChaiPlugin);
chai.use(chaiAsPromised);

module.exports = chai;