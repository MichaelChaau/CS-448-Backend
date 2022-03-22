const config = {
    SUT_BASE_URL: process.env.SUT_BASE_URL,
    SUT_MONGO_URL: process.env.SUT_MONGO_URL,
    SUT_MONGO_DATABASE: process.env.SUT_MONGO_DATABASE,
    SUT_MONGO_COLLECTION: process.env.SUT_MONGO_COLLECTION,
    TEST_TIMEOUT_MS: process.env.TEST_TIMEOUT_MS
}

module.exports = config;