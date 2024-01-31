const app = require("./index")
require("dotenv").config();

const PORT=process.env.PORT || 8080
 const db= require("./config/db")

app.listen(PORT,async()=>{
   await  db()
    console.log("localhost listening")
})