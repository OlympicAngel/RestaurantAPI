
/**
 * will not permit further request handling if an ADMIN is not logged in using JWT
* @param {express.Request} req 
* @param {express.Response} res 
* @param {express.NextFunction} next 
 */
module.exports = (req, res, next) => {
    try {
        //if there is no connected user
        if (!req.user)
            throw new Error("Invalid request.")

        //if connected user is not an admin
        if (!req.user.isAdmin)
            throw new Error("User lacks the necessary permissions to access the requested resource.");

        next();

    } catch (e) {
        res.status(403).json({ message: "Access denied.", error: e.message });
    }

}