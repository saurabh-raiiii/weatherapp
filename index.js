const express = require(`express`);
const https = require(`https`);
const http = require(`http`)
const bodyParser = require(`body-parser`);
const ejs = require("ejs")



const app = express()
const port = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")



app.get(`/`, function (req, res) {

    const ipApiUrl = `http://ip-api.com/json/`;
    http.get(ipApiUrl, function (resp) {

        resp.on('data', function (data) {

            const ipInfo = JSON.parse(data);
            // console.log(ipInfo);

            const city = ipInfo.city;
            const countryCode = ipInfo.countryCode;

            // console.log(city, countryCode);

            // calling weatherReport for weather information
            const apiHost = `https://api.openweathermap.org/data/2.5/weather`
            const apiKey = `3025b175cc109cccbcf6298305cadc21`
            const units = `imperial`
            const url = `${apiHost}?q=${city},${countryCode}&units=${units}&appid=${apiKey}`

            weatherData(url, res);

        });

    });

})


// entered location weather 
app.post('/search', function (req, res) {

    const apiHost = `https://api.openweathermap.org/data/2.5/weather`
    const apiKey = `3025b175cc109cccbcf6298305cadc21`
    const units = `imperial`
    const city = req.body.cityName;

    // console.log(city);

    const url = `${apiHost}?q=${city}&units=${units}&appid=${apiKey}`

    weatherData(url, res);

})



function weatherData(url, res) {

    https.get(url, function (response) {

        // console.log(url);
        var status = response.statusCode
        // console.log(status)

        if (status != "200") {

            res.render(__dirname + '/notFound',{"status" : status})

        } else {

            response.on(`data`, function (data) {

                const weatherData = JSON.parse(data)
                // console.log(weatherData);
                const city = weatherData.name;
                const temprature = Math.round(((weatherData.main.temp - 32) * 5) / 9);
                const discription = weatherData.weather[0].description;
                const weatherImage = weatherData.weather[0].icon;
                const humidity = weatherData.main.humidity;
                const windSpeed = weatherData.wind.speed;

                res.render(__dirname + '/index', { "city": city, "temp": temprature, "disc": discription, "image": weatherImage, "humidity": humidity, "speed": windSpeed });

                // console.log(temprature, discription, humidity, windSpeed, weatherImage);

            })

        }

    })

}



app.listen(port, function () {
    console.log(`connection is establish through port : ${port}`)
})