const { Schema, model } = require("mongoose");

const client = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = model("users", client)