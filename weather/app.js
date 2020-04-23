const request = require("request");
const geocode = require("./utils/geocode");
const weather = require("./utils/weather");

const address = process.argv[2];
if(!address){
    console.log("Address required as a command line argument");
}else{
    geocode(address,(error,data)=>{
        if(error){
            return console.log(error);
        }
        weather(data,(werror,wdata)=>{
            if(werror){
                return console.log(werror);
            }
            console.log(data.placename);
            console.log(wdata.weather_descriptions+". It is "+wdata.temperature+" degree celcius, feels like "+wdata.feelslike+" degree celcius");
        });
    });
}