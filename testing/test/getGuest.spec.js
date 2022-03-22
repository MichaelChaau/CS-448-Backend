const chai = require('./lib/chai.js');
const expect = chai.expect;
const {updateGuest, getGuest} = require('./lib/api.js');

describe("getGuest (GET /guest/{studentID}", function () {
    context("id exist", function () {
        async function getExistingGuest(){
            let updateResponse = await updateGuest();
            let id = updateResponse.data.studentID;
            return await getGuest(id)
        }

        it("return 200", async function () {
            await expect(getExistingGuest()).to.eventually.have.property("status", 200);
        })
    })
})