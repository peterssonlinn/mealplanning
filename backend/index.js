
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
             
                axios.get(url)
                .then(response => {
                    if(response.data.hits.length){
                        console.log(response.data)


                        for(let t in response.data.hits){
                            individualData = []
                           // console.log(response.data.hits[t]['images']);
                            label = response.data.hits[t]['recipe']['label'];
                            ingredients = response.data.hits[t]['recipe']['ingredientLines'];
                            time = response.data.hits[t]['recipe']['totalTime'];
                            orginalUrl = response.data.hits[t]['recipe']['url'];
                            imgLink = response.data.hits[t]['recipe']['image'];
                            individualData.push('name:')
                            individualData.push(label);
                            // individualData.push('ingidients:')
                            // individualData.push(ingredients);
                            // individualData.push('time:')
                            // individualData.push(time);
                            individualData.push('url:')
                            individualData.push(orginalUrl);
                            individualData.push('imgLink:');
                            individualData.push(imgLink);
                          

                            returnData.push(individualData);
                           
                           
                            
                        }
                        //console.log(returnData)
                        
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

app.listen(PORT, () => {
    console.log("server listening ", PORT)
});