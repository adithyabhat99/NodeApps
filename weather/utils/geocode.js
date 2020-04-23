const request = require("request");

const geocode = (address,callback) =>{
    const url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYWRpdGh5YWJoYXQ5OSIsImEiOiJjazliM3huNHowMGw1M2x0MHVpbmJlanUwIn0.qe8DOG90iBzOhBdyOWI3ew&limit=1`;

    request({url:url,json:true},(error,response)=>{
        if(error){
            callback("Unable to connect to location services");
        }
        else if(response.body.features.length===0){
            callback("Unable to find location, try another term")
        }else{
            const data=response.body;
            const lat=data.features[0].center[1];
            const lan=data.features[0].center[0];
            const placename=data.features[0].place_name;
            callback(undefined,{lat,lan,placename})
        }
    });
}

module.exports=geocode;