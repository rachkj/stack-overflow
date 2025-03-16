// Setup database with initial test data.
const mongoose = require("mongoose");
const populate = require("./populate_db");
const { MONGO_URL } = require("./config");

mongoose.connect(MONGO_URL);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const init = async () => {
    console.log('Inserting test data into the database...');
    try {
        await populate();
        console.log('Test data inserted successfully.');
    } catch (error) {
        console.error('Error while inserting test data:', error);
    } finally {
        if (db) db.close();
    }
};


init().catch((err) => {
    console.log("ERROR: " + err);
    if (db) db.close();
});

console.log("processing ...");
