const mongodb = require('mongodb');
const {
  SUT_MONGO_COLLECTION,
  SUT_MONGO_DATABASE,
  SUT_MONGO_URL,
} = require('./lib/config.js');

const dbClient = new mongodb.MongoClient(
  SUT_MONGO_URL,
  { useUnifiedTopology: true }
);


// Connect to the database before running any tests.
before(async function () {
  await dbClient.connect();
});

// Empty the items collection before each test.
beforeEach(async function () {
  try {
    await dbClient.db(SUT_MONGO_DATABASE).dropCollection(SUT_MONGO_COLLECTION);
  } catch (e) {
    // We arrive here if collection doesn't exist. Ignore.
  }
});

// Close the database connection when all the tests complete.
after(async function () {
  await dbClient.close();
});
