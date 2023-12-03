const express = require("express");
const WorkerModel = require('../models/worker.model.js')

module.exports = {
    /**
     * Gets JSON of all workers
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async getAllWorkers(req, res) {
        try {
            const users = await WorkerModel.find({});
            const now = Date.now();
            //remove encrypted password viewing
            res.status(200).json(users)
        } catch (e) {
            res.status(500).json({
                message: "could not get data from database",
                error: e.message
            });
            console.warn(e, e.stack)
        }
    },

    /**
     * register workers using body args: name, salary, since
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async registerWorker(req, res) {
        try {
            let { name, salary, since } = req.body;
            since = new Date(since);

            //check args
            if (!name || !salary || !since)
                throw new Error("Missing arguments.")
            if (salary < 5000)
                throw new Error("Salary must be at least 5,000. this is not slavery..")
            if (isNaN(since))
                throw new Error("Invalid date in 'since' argument.")

            //create new worker & save
            const newUser = new WorkerModel({ name, salary, since })
            await newUser.save();

            res.status(201).json({
                message: `New Worker '${name}' - CREATED.`,
                id: newUser._id
            })

        } catch (e) {
            res.status(400).json({
                message: "Faild to add new Worker.",
                error: e.message
            })
        }
    },

    /**
     * Updates a worker using body args: name, salary
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async updateWorker(req, res) {
        try {
            const id = req.params.id;
            let { name, salary } = req.body;

            //check args
            if (!id)
                throw new Error("Missing ID.")
            if (!name && !salary)
                throw new Error("Missing argument.")
            if (salary < 5000)
                throw new Error("Salary must be at least 5,000. this is not slavery..")


            const worker = await WorkerModel.findById(id);
            if (name)
                worker.name = name;
            if (salary)
                worker.salary = salary;
            worker.save();

            res.status(200).json(worker);
        } catch (e) {
            res.status(400).json({
                message: "Faild to update Worker.",
                error: e.message
            })
        }
    },

    /**
    * Delete single User using param id
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async deleteWorker(req, res) {
        try {
            const id = req.params.id;

            //check args
            if (!id)
                throw new Error("Missing ID.")

            await WorkerModel.findByIdAndDelete(id)
            res.status(204).end();

        } catch (e) {
            res.status(400).json({
                message: "Failed to delete worker.",
                error: e.message
            })
        }
    }
}