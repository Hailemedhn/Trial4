const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser:true}).then(()=>{
    console.log("Connected to MongoDB");
});                                                                                              


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/",(req,res)=>{res.json("Good Morining!")})
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, ()=>{
    console.log("Backend running.")
})