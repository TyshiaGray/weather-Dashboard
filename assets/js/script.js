var apiKey ="ac1e7dcc53990d9a176a8400fd79a52b"
$("#search").click(function (){
    var citySearch = $("#citySearch").val()
    console.log (citySearch)
    getWeather(citySearch)
})
function getWeather(citySearch){
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`)
    .then(function(results){
        console.log(results)
        var newDiv = $("<div class='jumbotron'>")//creating a div to hold content
        var title = $("<h2>").text(results.name +" ("+ moment.unix(results.dt).format('L')+")")
        var img = $("<img>")
        img.attr('src', `http://openweathermap.org/img/wn/${results.weather[0].icon}.png`)
        title.append(img)
        var temperature = $("<div>").text("Temperature: "+results.main.temp+ "F")
        var humidity = $("<div>").text("Humidity: "+results.main.humidity+ "%")
        var windSpeed = $("<div>").text("Windspeed: "+results.wind.speed+ "mph")
        $.get(`http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${results.coord.lat}&lon=${results.coord.lon}`)
        .then(function(res){
            var UV =$("<div>").text("UV index: "+ res.value)
            newDiv.append(title, temperature, humidity, windSpeed, UV)
            $(".current").append(newDiv)

        })
    })
}