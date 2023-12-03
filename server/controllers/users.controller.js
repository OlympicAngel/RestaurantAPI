const express = require("express");
const UserModel = require('../models/users.model.js'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

module.exports = {
    /**
     * Gets JSON of all users
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({});

            //remove encrypted password viewing
            res.status(200).json(users.map(u => { u.password = undefined; return u }))
        } catch (e) {
            res.status(500).json({
                message: "could not get data from database",
                error: e.message
            });
            console.warn(e, e.stack)
        }
    },

    /**
     * register user using body args: name, email, password, confirm_password
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async registerUser(req, res) {
        try {
            const { name, email, password, confirm_password } = req.body;
            //check args
            if (!name || !email || !password || !confirm_password)
                throw new Error("Missing arguments.")
            if (password != confirm_password)
                throw new Error("Password verify failure.")
            if (password.length < 8)
                throw new Error("Password too short.")

            const encrypted_password = await bcrypt.hash(password, 10);

            const newUser = new UserModel({ name, email, password: encrypted_password })
            await newUser.save();

            res.status(201).json({
                message: `New User '${name}' - CREATED.`,
                id: newUser._id
            })

        } catch (e) {
            res.status(400).json({
                message: "Faild to add new User.",
                error: e.message
            })
        }
    },

    /**
    * login user using body args: email, password
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async login(req, res) {
        const { email, password } = req.body;
        try {
            //check args
            if (!email || !password)
                throw new Error("Missing arguments.")
            if (password.length < 8)
                throw new Error("Password too short.")
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
                throw new Error("Invalid email.")

            //attempt find a user with that mail
            const user = await UserModel.findOne({ email });
            if (!user)
                throw new Error("User not found.")

            //make sure password is the same
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch)
                throw new Error("Incorrect password.");

            const expireDate = user.isAdmin ? 1 : 7;
            //generate jwt
            const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, //data inside the token
                process.env.PRIVATE_KEY, // private key for token generation
                {
                    "expiresIn": expireDate + "d",  // 1d token for admin & 7d for other users
                })

            //save it to cookie (will be sent to server in each new user request)
            res.cookie("token", token, {
                httpOnly: true, //allow browser only access (prevent js)
                maxAge: 1000 * 60 * 60 * 24 * expireDate, //set timeout in days
                signed: true
            });

            //add cookie for permission viewing client side
            res.cookie("permission", user.isAdmin);

            let admin = true;
            if (!user.isAdmin)
                admin = undefined;

            res.status(200).json({ message: `logged in as '${user.name}', yay.`, name: user.name })
        } catch (e) {
            res.status(400).json({
                message: "Log-in failed.",
                error: e.message
            })
        }


    },

    /**
     * Updates a User using body args: name, isAdmin, newPassword & params id
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async updateUser(req, res) {
        try {
            const id = req.params.id;
            let { name, isAdmin, newPassword } = req.body;

            //check args
            if (!id)
                throw new Error("Missing ID.")
            if (!name && !isAdmin && !newPassword)
                throw new Error("Missing argument.")

            //if password change - encrypt it
            if (newPassword)
                newPassword = await bcrypt.hash(newPassword, 10);

            //if attempt to change admin privileges && not admin request
            if (isAdmin !== undefined && !req.user.isAdmin)
                throw new Error("User lacks the necessary permissions to access the requested resource.")

            await UserModel.findByIdAndUpdate(id, { name, isAdmin, newPassword })
            res.status(204).end();
        } catch (e) {
            res.status(400).json({
                message: "Faild to update User.",
                error: e.message
            })
        }
    },

    /**
    * Delete single User using param id
    * @param {express.Request} req 
    * @param {express.Response} res 
    */
    async deleteUser(req, res) {
        try {
            const id = req.params.id;

            //if user attempt to delete OTHER user AND its not an admin
            if (id != req.user._id && !req.user.isAdmin)
                throw new Error("User lacks the necessary permissions to access the requested resource.")

            //check args
            if (!id)
                throw new Error("Missing ID.")

            await DishModel.findByIdAndDelete(id)
            res.status(204).end();

        } catch (e) {
            res.status(400).json({
                message: "Failed to delete User.",
                error: e.message
            })
        }
    }
}