const { Schema, model } = require("mongoose");

const event = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        default: "אין תיאור זמין כרגע"
    },
    at: {
        type: Date,
        required: true
    }
})


module.exports = model("events", event);
