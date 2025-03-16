// Add configuration setting for your server to this file
// uncomment for MONGO_URL for docker.
// uncomment 127.0.0.1 url for local testing.

// const MONGO_URL = "mongodb://mongodb:27017/fake_so";
// const CLIENT_URL = "http://localhost:3000";
// const port = 8000;

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

const your_secret_key = 'ee7a1576b724f4624a8adf6b6a4c25c15218665d6b577a5eb130b5ac5a5fcef5';

module.exports = {
    MONGO_URL,
    CLIENT_URL,
    port,
    your_secret_key
};
