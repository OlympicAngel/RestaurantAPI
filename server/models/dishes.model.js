const { Schema, model } = require("mongoose");

const dish = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    rate: {
        votes: {
            type: Number,
            default: 0
        }, sum: {
            type: Number,
            default: 0
        }
    },
    image: {
        type: String,
        required: true
    }
})

const dishModel = model("dishes", dish);

class Dishes extends dishModel {

    toJSON() {
        const modelJson = super.toJSON()
        modelJson.rate.avg = ~~(this.rate.sum / (Math.max(1, this.rate.votes)) * 10) / 10
        return modelJson;
    }

}


module.exports = Dishes