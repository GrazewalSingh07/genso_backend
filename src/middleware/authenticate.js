

require("dotenv").config();
const jwt=require("jsonwebtoken");
 
 
const verifyToken=(token)=>{
    return new Promise((resolve,reject)=>{
          jwt.verify(token ,process.env.SECRET_KEY,function(error, decoded){
            if(error){
                return reject(error)
            }
           
            return resolve(decoded)
        });
    });

}


const authenticate= async (req, res, next)=>{
     console.log(req.headers)
    if(!req.headers.authorization){
        return res.status(400).send({message1:"Authorization token not found or incorrect"})
        
    }
    if(!req.headers.authorization.startsWith("Bearer ")){
        
        return res.status(400).send({messageeeeeee:"Authorization token not found or incorrect"})
    }
    
    const token=req.headers.authorization.split(" ")[1]
    // const token=req.headers.authorization
    // console.log(token)
   var  decoded;

    try {
        decoded=await verifyToken(token)
    } catch (error) {
        console.log(decoded)

        return res.status(400).send({message3:"Authorization token not found or incorrect"})
    }
    
    req.user=decoded.user
    
    return next()
}
module.exports=authenticate