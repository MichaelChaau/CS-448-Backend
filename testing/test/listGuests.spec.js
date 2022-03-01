const chai = require('./chai.js');
const expect = chai.expect;
const { listGuests } = require('./api.js');

describe("listGuests (GET /guest/list)", function () {
    it("response matches openapi.yaml", async function () {
        const response = await listGuests();
        expect(response).to.matchApiSchema();
    });
});