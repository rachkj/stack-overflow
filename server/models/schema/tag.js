const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        name:{type: String, reqired: true},
        description: {type: String}
    },
    { collection: "Tag" }
);

