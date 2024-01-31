const express= require('express')
const router =express.Router();
const axios = require('axios');
require('dotenv').config()
const authenticate = require('../middleware/authenticate');
const User = require('../model/user.model');


const exchangeCodeForToken = async (authorizationCode) => {
  const clientId = process.env.clientId
  const clientSecret = process.env.clientSecret
  const redirectUri = process.env.redirectUri

  const url =process.env.url

  const requestBody ={
    'grant_type':'authorization_code',
    'code': authorizationCode,
    'client_id': clientId,
    'client_secret': clientSecret,
    'redirect_uri': redirectUri
  }
//   requestBody.append('grant_type', 'authorization_code');
//   requestBody.append('code', authorizationCode);
//   requestBody.append('client_id', clientId);
//   requestBody.append('client_secret', clientSecret);
//   requestBody.append('redirect_uri', redirectUri);
// console.log({requestBody})
try {
  const response = await axios.post(
    url,
    new URLSearchParams(requestBody), // Use URLSearchParams to encode the request body
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  return response.data;
} catch (error) {
  return error
}
   
  };
  router.post('/', authenticate, async (req, res) => {
    try {
     
       
      const tokenExchangeResult = await  exchangeCodeForToken(req.body.code); // Wait for the promise to resolve
  
  const update = {
    access_token: tokenExchangeResult.access_token,
    expires_in: tokenExchangeResult.expires_in,
    token_type: tokenExchangeResult.token_type,
    scope: tokenExchangeResult.scope,
    refresh_token: tokenExchangeResult.refresh_token,
  };

  // Update and fetch the user in a single operation
  const updatedUser = await User.findByIdAndUpdate(
    req.body.userId,
    update,
    { new: true } // Return the updated document
  );

  

  // Send the updated user in the response
  return res.status(200).send({ message: 'User updated', user: updatedUser });
} catch (error) {
  // console.error('Error:', error);
  return res.status(500).send({ error: 'Internal Server Error' });
}
  });
module.exports = router