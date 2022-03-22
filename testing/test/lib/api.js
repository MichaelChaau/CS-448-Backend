const axios = require('./axios.js');

module.exports = {
    async listGuests() {
        return axios.get("/guest/list");
    },

    async getGuest(id){
        return axios.get("/guest/" + id)
    },

    async updateGuest(id, data) {
        if(id === undefined){
            id = "1234567";
        }
        if(data === undefined){
            data = {
                "studentID": id,
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
            }
        };
        return axios.put("/guest/" + id, data);
    }
};