const axios = require('axios');
const config = require('./config.js');


// get Weather
function getCurrentWeather(city, date){
    // if date is now or today
    if ((date.raw.match(/[Nn]ow/g)) != null || (date.raw.match(/[Tt]oday/g)) != null){
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.WEATHER_TOKEN}`
        ).then(results => {
            return [{
                type: 'text',
                content : `Here's what i found :\
                \n${results.data.name} : ${results.data.weather[0].description}, ${Math.floor(results.data.main.temp - 273.15)} °C`,
            }];
        }).catch(err =>{
            console.log(err);
            return [{
                type: 'text',
                content : `I'm sorry, i couldn't get the weather for ${city}...`,
            }];
        });
    }
    //if user asked for prediction
    else{
        return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${config.WEATHER_TOKEN}`
        ).then(results => {
            var list = results.data.list;
            var res = '';
            var tmp = null;
            var start = 8 - (40 - results.data.cnt);
            var date = new Date((list[Math.floor(start / 2)].dt * 1000)) + '';
            
            date = date.split(' ');
            date.splice(3, 6);
            date = date.join();
            res = `\n${date.replace(/,/g, " ")} ${list[Math.floor(start / 2)].weather[0].description} ${Math.floor(list[Math.floor(start / 2)].main.temp - 273.15)} °C`;
            //get the relevant datas for each days
            for (var i = start; i < 32; i += 8){
                date = new Date((list[i + 4].dt * 1000)) + '';
                console.log(date);
                date = date.split(' ');
                if (tmp == null || date[0] != tmp){
                    tmp = date[0];
                    date.splice(3, 6); 
                    date = date.join();  
                    res = `${res}\n${date.replace(/,/g, " ")} ${list[i + 4].weather[0].description} ${Math.floor(list[i + 4].main.temp - 273.15)} °C`;
                }
            }
            return [{
                type: 'text',
                content : `Here's what i found for the next days for ${results.data.city.name} :${res}`,
            }];
        }).catch(err =>{
            console.log(err);
            return [{
                type: 'text',
                content : `I'm sorry, i couldn't get the weather for ${city}...`,
            }];
        });
    }
}

module.exports = getCurrentWeather;