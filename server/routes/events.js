const express = require('express');
const router = express.Router();

const usersOnly = require("../middlewares/userAuth")(),
    adminONLY = require("../middlewares/adminAuth"),
    controller = require("../controllers/events.controller");

//get a list of all events
router.get("/",
    controller.getAllEvents);

//adds a new event
router.post("/",
    usersOnly,
    adminONLY,
    controller.addEvent)

//edit event
router.put("/:id",
    usersOnly,
    adminONLY,
    controller.updateEvent)

//delete event
router.delete("/:id",
    usersOnly,
    adminONLY,
    controller.deleteEvent)


module.exports = router;