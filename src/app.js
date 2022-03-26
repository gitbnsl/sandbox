require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;

const dataBase = require("./mongoDB/conn");
const InfoWork = require("./mongoDB/models");
const async = require("hbs/lib/async");
const auth = require("./middleware/auth");

const viewsPath = path.join(__dirname, "templates/views");
const partialPath = path.join(__dirname, "templates/partials");




app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", viewsPath);


hbs.registerPartials(partialPath);


app.get("/",auth,(req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie("token");
        await req.user.save();
        res.render("login");

    } catch (error) {
        res.status(400).send(error);

    }

});


app.post("/login", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await InfoWork.findOne({ email: email });

        const matchPass = await bcrypt.compare(password, userEmail.password);

        const token = await userEmail.genAuthToken();
        console.log(`Token : ${token}`);

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 36000)
            // secure:true
        });


        if (matchPass) {
            res.status(201).render("index", {
                name: userEmail.name
            });
        }
        else {
            res.send("check Login Details");
        }

    } catch (error) {
        res.send("Invalid Login Details")
    }



});

app.post("/signup", async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const gender = req.body.gender;
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const securePass = await bcrypt.hash(password, 10);
            const newEmp = new InfoWork({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: securePass,
            });

            const token = await newEmp.genAuthToken();
            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 36000)
            });


            const oData = await newEmp.save();
            res.render("login");
        }
        else {
            res.send("Password is Not Match");
            alert("Password is Not Match");
        }

    } catch (error) {
        res.send("Invalid Sign up Details")

    }
});


app.get("/signup", (req, res) => {
    res.render("signup");
});


app.listen(port, () => {
    console.log(`Listeining on port no : http://localhost:${port}/ `)
});