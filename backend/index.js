
const express = require("express");
const PORT = process.env.PORT || 3001
const { auth } = require('express-openid-connect');
const app = express();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios'); 

app.get('/api/testing', (req, res, next) => {
    try{
        
        res.status(200).json({message:"good"})
    }
    catch{
        res.status(400).json({message:"error"});
    }
});

app.get('/api/recipes' , (req, res,next) => {
    try{
        let returnData =[]
        if (req.query.search != undefined){
            search = req.query.search;
           
            if(search != undefined){
               
                let url = "https://api.edamam.com/api/recipes/v2?type=public&q="+search+"&app_id=388e1e79&app_key=%2033bf2f3c0efef80e1df276c6ef485756"
                console.log(url)
                axios.get(url)
                .then(response => {
                    if(response.data.hits.length){

                        for(let t in response.data.hits){
                            individualData = []
                            label = response.data.hits[t]['recipe']['label'];
                            ingredients = response.data.hits[t]['recipe']['ingredientLines'];
                            time = response.data.hits[t]['recipe']['totalTime'];
                            orginalUrl = response.data.hits[t]['recipe']['url'];
                            individualData.push('name:')
                            individualData.push(label);
                            // individualData.push('ingidients:')
                            // individualData.push(ingredients);
                            // individualData.push('time:')
                            // individualData.push(time);
                            individualData.push('url:')
                            individualData.push(orginalUrl);
                            returnData.push(individualData);
                           
                            
                        }
                        console.log(returnData)
                        
                        res.status(200).send(returnData);
                       
                    }else{
                        res.status(400).json({data:"No such recipes"})
                    }
                    
                })
                .catch(error => res.status(400).json({data:"error!"}))
                
            }
            else{
                res.status(400).json({data:"empty search"})
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