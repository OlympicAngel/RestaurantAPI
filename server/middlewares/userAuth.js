const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * will not permit further request handling if a user is not logged in using JWT
 * @param {String} redirectTo redirect to url instead of showing error
 */
module.exports = (redirectTo = false) => {

    /**
     * allows only logged in users & extracts their data into req.user
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * @return {undefined}
     */
    return (req, res, next) => {
        try {
            const rawToken = req.signedCookies?.token;
            if (!rawToken)
                throw new Error("Missing token - you need to login first");

            const data = jwt.verify(rawToken, process.env.PRIVATE_KEY, { "maxAge": "30d" })
            req.user = data;
            next()

        } catch (e) {
            //if ${redirectTo} is defined move the request to the url provided (usually will be a login page)
            if (redirectTo) {
                res.redirect(401, redirectTo)
                return;
            }

            //if invalid token delete cookies
            res.clearCookie("token");
            res.clearCookie("permission");

            //normal error throw
            res.status(401).json({ message: "Access denied.", error: e.message });
        }
    }
}