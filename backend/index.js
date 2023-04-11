
const express = require("express");
const PORT = process.env.PORT || 3001
const { auth } = require('express-openid-connect');
const app = express();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios'); // node



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

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'LbJM3Nckyt467aKYkezEesLkJoYLowqa',
    issuerBaseURL: 'https://dev-fs27qqhb2a2171p5.eu.auth0.com'
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});



app.listen(PORT, () => {
    console.log("server listening ", PORT)
});