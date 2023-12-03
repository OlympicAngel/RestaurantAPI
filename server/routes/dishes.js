const express = require('express');
const router = express.Router();

const usersONLY = require("../middlewares/userAuth")(),
    adminONLY = require("../middlewares/adminAuth"),
    controller = require("../controllers/dishes.controller");

//get all dishes
router.get("/", controller.getAllDishes)

//get specific dish
router.get("/:id", controller.getOneDish)

// add a dish - admins only
router.post("/",
    usersONLY,
    adminONLY,
    controller.addDish)

// update a dish - admins only
router.put("/:id",
    usersONLY,
    adminONLY,
    controller.updateDish)

// update a dish - admins only
router.post("/:id/vote/:score",
    usersONLY,
    controller.addDishVote)

// delete a dish - admins only
router.delete("/:id",
    usersONLY,
    adminONLY,
    controller.deleteDish)



module.exports = router;