const chai = require('./lib/chai.js');
const expect = chai.expect;
const { updateGuest } = require('./lib/api.js');

describe("update (PUT /guest/:studentID)", function () {
    context("ID exist", function() {
        async function updateExistingGuest(){
            let response = await updateGuest();
            let guest = response.data;
            guest.resident = false;
            return updateGuest(guest);
        }
    })

    context("ID does not exist", function() {
        async function updateNewGuest() {
            return updateGuest({id: "0132365"}, { 
                "resident": true,
                "zipCode": "01610",
                "unemployment": false,
                "assistance": {
                    "socSec": false,
                    "TANF": false,
                    "finAid": false,
                    "other": false,
                    "SNAP": false,
                    "WIC": false,
                    "breakfast": false,
                    "lunch": false,
                    "SFSP": false
                },
                "household": [
                    "1",
                    "4"
                ]
            })
        }

        it("matches spec", async function () {
            await expect(updateNewGuest())
                .to.eventually.be.rejected
                .with.property('response')
                .to.matchApiSchema();
        });

    })
})