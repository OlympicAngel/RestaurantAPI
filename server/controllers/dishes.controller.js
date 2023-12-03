const express = require("express");
const DishModel = require('../models/dishes.model.js');

module.exports = {
    /**
     * Gets JSON of all dishes
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async getAllDishes(req, res) {
        try {
            const dishes = await DishModel.find({});
            res.status(200).json(dishes)
        } catch (e) {
            res.status(500).json({
                message: "could not get data from database",
                error: e.message
            });
            console.warn(e, e.stack)
        }
    },

    /**
   * Delete single Dish using param id
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
    async getOneDish(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                throw new Error("Missing ID.")

            const dish = await DishModel.findById(id);
            res.status(200).json(dish);
        } catch (e) {
            res.status(400).json({
                message: "Failed to get Dish.",
                error: e.message
            })
        }
    },

    /**
     * Adds single Dish using body args: name,image
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async addDish(req, res) {
        try {
            const { name, image } = req.body;
            if (!name || !image)
                throw new Error("Missing arguments.")

            const newDish = new DishModel({ name, image })
            await newDish.save();

            res.status(201).json({
                message: `New Dish '${name}' - CREATED.`,
                id: newDish._id
            })

        } catch (e) {
            res.status(400).json({
                message: "Faild to add new Dish.",
                error: e.message
            })
            console.log(e)
        }
    },

    /**
 * Updates single Dish using body args: name,image & param id
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
    async updateDish(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                throw new Error("Missing ID.")

            const { name, image } = req.body;
            if (!name && !image)
                throw new Error("Missing argument.")

            await DishModel.findByIdAndUpdate(id, { name, image })
            res.status(204).end();
        } catch (e) {
            res.status(400).json({
                message: "Faild to update Dish.",
                error: e.message
            })
        }
    },

    /**
    * Add a single rate to a dish
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async addDishVote(req, res) {
        try {
            const { id, score } = req.params;
            if (!id)
                throw new Error("Missing ID")

            const cookieName = `r_d:${id}`;
            if (req.cookies[cookieName])
                throw new Error("You cannot vote that fast");

            if (score == undefined)
                throw new Error("Missing score. Please use:\n../dishes/:id/vote/:score");
            if (isNaN(score) || score < 0 || score > 5)
                throw new Error("Score value must be a number in the range from 0 to 5.")

            const dish = await DishModel.findById(id);
            dish.rate.votes++;
            dish.rate.sum += ~~(score * 10) / 10;
            await dish.save();

            //create a cookie for 1 day preventing the user to vote again
            res.cookie(cookieName, 1, {
                httpOnly: true, //allow browser only access (prevent js)
                maxAge: 1000 * 60 * 60 * 24 * 1, //set timeout of 1 days
            })

            res.status(204).end();
        } catch (e) {
            res.status(400).json({
                message: "Faild to add vote for dish.",
                error: e.message
            })
        }
    },

    /**
    * Delete single Dish using param id
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async deleteDish(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                throw new Error("Missing ID.")

            await DishModel.findByIdAndDelete(id)
            res.status(204).end();

        } catch (e) {
            res.status(400).json({
                message: "Failed to delete Dish.",
                error: e.message
            })
        }
    }
}