const { Schema, model } = require("mongoose");

const worker = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        default: 6000
    },
    since: {
        type: Date,
        required: true
    }
})


const workerModel = model("workers", worker);

class Worker extends workerModel {

    toJSON() {
        const modelJson = super.toJSON()
        modelJson.earnings = this.earnings
        return modelJson;
    }

    get earnings() {
        const now = new Date();
        const yearMonths = (now.getFullYear() - this.since.getFullYear()) * 12,
            monthDiff = now.getMonth() - this.since.getMonth();
        return (yearMonths + monthDiff) * this.salary;
    }
}

module.exports = Worker
