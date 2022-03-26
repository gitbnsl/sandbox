
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/infobox").then(()=>{
    console.log("DataBase is Connected 😁😁 ");
}).catch((err)=>{
    console.log(`ERROR : DataBase is Not Connected 😭😭 : ${err}`);
});