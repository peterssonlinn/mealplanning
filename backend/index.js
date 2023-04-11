const express = require("express");
const PORT = process.env.PORT || 3001
const app = express();


app.get('/api/recipes' , (req, res,next) => {
    try{
        if (req.query.search != undefined){
            search = req.query.search;
            console.log("inne i server," +search);

            // TODO, implement the external API to search for recipies! 

            res.status(200).json(search); 
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