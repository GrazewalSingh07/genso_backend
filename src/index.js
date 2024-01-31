const express = require('express')

const app=express()
app.use(express.json())

var cors = require('cors');
app.use(cors())

const whitelist = [
    '*'
  ];
  
app.use((req, res, next) => {
    console.log("first")
    const origin = req.get('referer');
    const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    if (isWhitelisted) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
      res.setHeader('Access-Control-Allow-Credentials', true);
    }
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
  });

  function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    }
    next();
  }
 
app.use(ignoreFavicon);
const setContext = (req, res, next) => {
    if (!req.context) req.context = {};
    next();
  };
app.use(setContext);
 
app.get('/',(req,res)=>{
    return res.send("Hello! Gensians")
})



const sketchfab_login = require('./controller/sketchfab.controller')
const userController = require('./controller/user.controller')
app.use("/sketchfab_login",sketchfab_login)
app.use("/user",userController)

module.exports =app