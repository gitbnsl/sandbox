
const jwt = require("jsonwebtoken");
const InfoWork = require("../mongoDB/models");

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.token;
        const verify = jwt.verify(token, process.env.SECERT_KEY);

        const user = await InfoWork.findOne({ _id: verify._id });
        
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(404).render("login");

    }

};

module.exports = auth;