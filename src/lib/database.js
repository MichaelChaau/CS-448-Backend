// @ts-nocheck
/*

  database.js provides a connected MongoClient that should be reused across
  all requests. It uses the connection string given by MONGO_URI in config.js.

  Usage example:

    const Database = require("./database");

    async function myFunction() {
      const database = await Database.get();
      const db = database.db("database_name");
      const col = db.collection("collection_name");
      const cursor = await col.find();
      ...
    }

  In the example above, Database.get() returns a connected `MongoClient` object.
  Do not call `connect()` or `close()` on it. It will be reused across requests.

  See MongoDB Node Driver documentation for more information about MongoClient
  objects: <https://docs.mongodb.com/drivers/node/>

*/

const MongoClient = require("mongodb").MongoClient;

const config = require("./config");


class Database {
  /** @type {import("mongodb").MongoClient} */
  static #singleton;

  /**
   * Return a connected MongoClient object. This object is already connected,
   * so don't call connect() on it. This object should be reused across all
   * requests, so don't call close() on it.
   *
   * @returns MongoClient - See https://docs.mongodb.com/drivers/node/
   */
  static async get() {
    if (Database.#singleton === undefined) {
      Database.#singleton =
          new MongoClient(config.MONGO_URI, { useUnifiedTopology: true });
      await Database.#singleton.connect();
    }
    return Database.#singleton;
  }
}


module.exports = Database;
