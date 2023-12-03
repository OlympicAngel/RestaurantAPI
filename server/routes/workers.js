const express = require('express');
const router = express.Router();

const usersOnly = require("../middlewares/userAuth")(),
    adminONLY = require("../middlewares/adminAuth"),
    controller = require("../controllers/workers.controller");

//get a list of all workers
router.get("/",
    usersOnly,
    adminONLY,
    controller.getAllWorkers);

//registers an new worker
router.post("/",
    usersOnly,
    adminONLY,
    controller.registerWorker)

//edit a worker
router.put("/:id",
    usersOnly,
    adminONLY,
    controller.updateWorker)

//delete a worker
router.delete("/:id",
    usersOnly,
    adminONLY,
    controller.deleteWorker)


module.exports = router;