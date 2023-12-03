const express = require("express");
const EventModel = require('../models/events.model.js');

module.exports = {
    /**
     * Gets JSON of all events
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async getAllEvents(req, res) {
        try {
            const events = await EventModel.find({});
            res.status(200).json(events);
        } catch (e) {
            res.status(500).json({
                message: "could not get data from database",
                error: e.message
            });
            console.warn(e, e.stack)
        }
    },

    /**
     * adds new event using body args: name, description, at
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async addEvent(req, res) {
        try {
            let { name, description, at } = req.body;
            at = new Date(at);

            //check args
            if (!name || !at)
                throw new Error("Missing arguments.")
            if (isNaN(at))
                throw new Error("Invalid date in 'at' argument.")

            const newEvent = new EventModel({ name, description, at })
            await newEvent.save();

            res.status(201).json({
                message: `New Event '${name}' - CREATED.`,
                id: newEvent._id
            })

        } catch (e) {
            res.status(400).json({
                message: "Failed to add new Event.",
                error: e.message
            })
        }
    },

    /**
     * Updates an Event using body args: name, at, description.
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async updateEvent(req, res) {
        try {
            const id = req.params.id;
            let { name, at, description } = req.body;

            //check args
            if (!id)
                throw new Error("Missing ID.")
            if (!name && !at && !description)
                throw new Error("Missing argument.")

            await EventModel.findByIdAndUpdate(id, { name, at, description })
            res.status(204).end();
        } catch (e) {
            res.status(400).json({
                message: "Faild to update Event.",
                error: e.message
            })
        }
    },

    /**
    * Delete single Event using param id
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async deleteEvent(req, res) {
        try {
            const id = req.params.id;

            //check args
            if (!id)
                throw new Error("Missing ID.")

            await EventModel.findByIdAndDelete(id)
            res.status(204).end();

        } catch (e) {
            res.status(400).json({
                message: "Failed to delete Event.",
                error: e.message
            })
        }
    }
}