const express = require('express');
const router = express.Router();

const userAuthMiddleware = require("../middlewares/userAuth"),
    adminONLY = require("../middlewares/adminAuth"),
    controller = require("../controllers/users.controller");

const usersOnly = userAuthMiddleware(), // if no user block req with error
    userOrRedirect = userAuthMiddleware("./login") //if no user redirect to login

//get a list of all users - allowed for ADMIN only.
router.get("/",
    usersOnly,
    adminONLY,
    controller.getAllUsers);

//registers an new user
router.post("/",
    controller.registerUser)

//login & creating jwt token
router.post("/login",
    controller.login);

//login & creating jwt token
router.get("/logout",
    (req, res) => { res.clearCookie("token"); res.clearCookie("permission"); res.end() });

//edit user info OR redirect to login (if not logged in)
router.put("/:id",
    userOrRedirect,
    controller.updateUser)

//delete a user OR redirect to login (if not logged in)
router.delete("/:id",
    userOrRedirect,
    controller.deleteUser)


module.exports = router;