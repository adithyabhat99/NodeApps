const path = require("path");
const express = require("express");
const hbs = require("hbs");


const geocode = require("./utils/geocode");
const weather = require("./utils/weather");


const app = express();
const port = process.env.PORT || 4000;

// Use templating engine
app.set("view engine","hbs");
// Set the path for templates
app.set("views",path.join(__dirname,"../templates/views"));
// Set partials folder
hbs.registerPartials(path.join(__dirname,"../templates/partials"));

// To serve files from Public folder
app.use(express.static(path.join(__dirname,"../public")));

app.get("/",(req,res)=>{
    res.render("index",{
        title:"Weather",
        text:"Use this to get your weather!",
        footerText:"Created by Adithya Bhat"
    });
});

app.get("/about",(req,res)=>{
    res.render("about",{
        title:"About me",
        name:"Adithya",
        footerText:"Created by Adithya Bhat"
    })
});

app.get("/help",(req,res)=>{
    res.render("help",{
        title:"Help Page",
        helpText:"This is some helpful text",
        footerText:"Created by Adithya Bhat"
    })
});

app.get("/weather",(req,res)=>{
    if(!req.query.address){
        res.send({
            error:"Please send address"
        })
    }
    const address = req.query.address;
    geocode(address,(error,data)=>{
        if(error){
            return res.send({
                error
            })
        }
        weather(data,(werror,wdata)=>{
            if(werror){
                return res.send({
                    error
                })
            }
            // console.log(data.placename);
            // console.log(wdata.weather_descriptions+". It is "+wdata.temperature+" degree celcius, feels like "+wdata.feelslike+" degree celcius");
            res.send({
                foreCast:wdata.weather_descriptions+". It is "+wdata.temperature+" degree celcius, feels like "+wdata.feelslike+" degree celcius",
                location:data.placename,
                address
            }) 
        });
    });
    
});

app.get("*",(req,res)=>{
    res.render("404",{
        text:"The page you are requesting is not found"
    })
});

app.listen(port,()=>{
    console.log("Server started at port 4000");
});