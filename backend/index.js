
const express = require("express");
const PORT = process.env.DEV_PORT || 3001
const { auth } = require('express-openid-connect');
require('dotenv').config({ path: './backend/.env' });
const app = express();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios'); // node
const path = require('path');

//https://auth0.com/blog/complete-guide-to-nodejs-express-user-authentication/ <--- tutorial 



app.set('client', path.join(__dirname, 'client'));
app.set('client engine', 'js');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET,
    authRequired: false,
    auth0Logout: true,
  }),
);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    next();
  });

app.get('/api/testing', (req, res, next) => {
    try{
        let temp= req.query.temp; 
        console.log(temp);
        res.status(200).json(temp);
    }
    catch{
        res.status(400).json({message:"error"});
    }
})
app.get('/api/recipes' , (req, res,next) => {
    try{
        if (req.query.search != undefined){
            search = req.query.search;
            console.log("inne i server," +search);

            // TODO, implement the external API to search for recipies! 
            
            if(search != undefined){
                let url = "https://api.edamam.com/api/recipes/v2?type=public&q="+search+"&app_id=388e1e79&app_key=%2033bf2f3c0efef80e1df276c6ef485756"
                console.log(url)
                axios.get(url)
                .then(response => {
                    console.log("making call")
                    console.log(response.data)
                    if(response.data.hits.length){
                        
                        res.status(200).json(response.data.hits);
                        
                    }else{
                        res.status(200).json({message:"No such recipes"})
                    }
                    
                })
                .catch(error => res.status(400).json({message:"error!"}))
                
                
            }
            else{
                res.status(400).json({message:"empty search"})
            }

           
        }
        else{
            return res.status(400).json({message:"no search"})
        }
    }
    catch (error){
        return res.status(400).json({message:error.message})
    }
   
});

app.listen(PORT, () => {
    console.log("server listening ", PORT)
});