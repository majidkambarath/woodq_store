const mongoose = require('mongoose');
require("dotenv").config();

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://majidkambarth:${process.env.MONGOOES_PASS}@cluster0.7anwm9d.mongodb.net/woodQstore?retryWrites=true&w=majority`).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connected");
})

