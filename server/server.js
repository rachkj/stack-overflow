const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const {MONGO_URL, CLIENT_URL, port} = require('./config');

// const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
// const CLIENT_URL = "http://localhost:3000";
// const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();


app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '1kb', extended: true })); // Limit URL-encoded request size to 1KB
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(mongoSanitize());
app.use(bodyParser.json({ limit: '1kb' })); // Limit JSON request size to 1KB

app.use(express.json());





// Middleware to handle errors from express-rate-limit
app.use((err, req, res, next) => {
    if (err instanceof rateLimit.RateLimitExceeded) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    next(err); // Pass the error to the next middleware
});

// Middleware to handle errors from body-parser and express-mongo-sanitize
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    if (err.name === 'MongoError' && err.code === 2) {
        return res.status(400).json({ error: 'Invalid input. Please provide valid data' });
    }
    // Handle other errors...
    next(err);
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});




app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const userController = require("./controller/user");
const commentController = require("./controller/comment");


app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/user", userController);
app.use("/comment", commentController);
app.post('/test', (req, res) => {
    res.json({ input: req.body });
  });
  

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server
