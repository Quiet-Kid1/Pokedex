const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const fetch = require('node-fetch');
var _ = require('lodash');


const urlPoke = [];
const allPoke = [];

const resultPoke = [];
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res){


const url = "https://pokeapi.co/api/v2/pokemon?limit=51";

https.get(url, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        var allPokemon = JSON.parse(body.toString());
        allPokemon.results.forEach(pokemon => {
            urlPoke.push(pokemon.url);
        });

        urlPoke.forEach(pokemon => {
            fetch(pokemon)
            .then(res => res.json())
            .then(json => {

                        const dataPoke = {
                            name: json.name,
                            pict: json.sprites.front_default,
                            weight: json.weight,
                            height: json.height
                            
                        };
    
                        
                        allPoke.push(dataPoke);


                        
                       
            });
         
        });
        
    });
     
});

if (allPoke.length >= 52){
    allPoke.splice(0, allPoke.length);
}

res.render("home");

})

app.get("/pokedex", function(req, res){

    if(allPoke.length == 0){
        res.render("error");
    }else{
        res.render("pokedex", {allPoke: allPoke});
    }
})

app.post("/pokedex", function(req, res){

    const searchPoke = _.lowerCase(req.body.searchPoke);
    const searchUrl = "https://pokeapi.co/api/v2/pokemon/" + searchPoke;

    const request = https.request(searchUrl, function(response){

        if(response.statusCode === 200){
        
            fetch(searchUrl)
            .then(res => res.json())
            .then(json => {
        
                const getPoke = {
                    name: json.name,
                    pict: json.sprites.front_default,
                    weight: json.weight,
                    height: json.height
                    
                };
        
                
                
            res.render("search", {getPoke: getPoke});
            });
            
        }else{
            
            res.render("errSearch");
         
        }

    })
    request.end();


})

app.get("/search" , function(req, res){
    
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});