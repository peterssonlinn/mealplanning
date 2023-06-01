
const express = require("express");
const axios = require('axios'); 

const PORT =  3001
const app = express();
const secret = require('./secret.json')

/**
 * Endpoint for retrieving recipes from an external API based on a search query.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns an array of recipe objects that match the search query.
 * @throws {Error} - Throws an error if there is an issue with the API request.
 */
app.get('/api/recipes' , (req, res) => {
    try {
        let returnData =[];
        if(req.query.search === null){
            return res.status(400).json({data:"empty search"});
        }
        else{
            let url = "https://api.edamam.com/api/recipes/v2?type=public&q="+req.query.search+"&app_id="+secret.app_id+"&app_key="+secret.app_key;
            axios.get(url).then(response => {
                if(response.data.hits.length === 0 ){
                    return res.status(404).json({data:"No such recipes"})
                }
                else{
                    for(let t in response.data.hits){
                        individualData = []
                        label = response.data.hits[t]['recipe']['label'];
                        ingredients = response.data.hits[t]['recipe']['ingredientLines'];
                        time = response.data.hits[t]['recipe']['totalTime'];
                        orginalUrl = response.data.hits[t]['recipe']['url'];
                        imgLink = response.data.hits[t]['recipe']['image'];
                        individualData.push('name:')
                        individualData.push(label);
                        individualData.push('url:')
                        individualData.push(orginalUrl);
                        individualData.push('imgLink:');
                        individualData.push(imgLink);
                        returnData.push(individualData);
                    }
                    return res.status(200).send(returnData);
                }
            }); 
        }
    } catch (error) {
        throw error;  
    }
});

app.listen(PORT, () => {
    console.log("server listening ", PORT)
});