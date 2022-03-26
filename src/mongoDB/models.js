
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const async = require("hbs/lib/async");
const res = require("express/lib/response");

const infoWorkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

infoWorkSchema.methods.genAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECERT_KEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
        console.log(token);
    } catch (error) {
        res.status(400).send("ERROR : Failed To Generate Token" + err);
        console.log("ERROR : Failed To Generate Token");
    }

}

const InfoWork = new mongoose.model("InfoWork", infoWorkSchema);

module.exports = InfoWork;
