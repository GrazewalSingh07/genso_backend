const mongoose= require("mongoose");
require("dotenv").config();

 const DB = process.env.DB 
module.exports=()=>{
    return mongoose.connect(DB).then((res)=>{
            console.log('connection established')
        }).catch((err)=>{
            console.log(err)
        })
   
}
 