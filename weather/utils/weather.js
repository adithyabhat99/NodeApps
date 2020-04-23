const request = require("request");

const weather = (data,callback) =>{
    const url=`http://api.weatherstack.com/current?access_key=a42f8d00a5f33ba66a38890859a80f44&query=${data.lat},${data.lan}`;

    request({ url:url,json:true },(error,response)=>{
        if(error)
        {
            callback("Unable to connect to weather services")
        }else if(response.body.error){
            callback("Weather data not found");
        }else{
            const data=response.body;
            const current=data.current;
            callback(undefined,{weather_descriptions:current["weather_descriptions"][0],temperature:current["temperature"],feelslike:current["feelslike"]});
        }
    });
}

module.exports=weather;