const mongoose = require("mongoose");

const uri = process.env.DATABASE_URL;

module.exports = async () => {
    try {
        await mongoose.connect(uri)
        console.log("mongoose Connected!")
    } catch (error) {
        console.log(error)
    }
};
