var apiKey ="ac1e7dcc53990d9a176a8400fd79a52b"
// added local storage
var pCities = JSON.parse(localStorage.getItem("weather")) || []
$("#search").click(function (){
    var citySearch = $("#citySearch").val()
    console.log (citySearch)
    getWeather(citySearch)
    pCities.unshift(citySearch)
    // saves city searched, converts array to string
    localStorage.setItem("weather", JSON.stringify(pCities))
    renderList()
})
function getWeather(citySearch){
    $(".current").empty()
    // added empty to prevent results from stacking 
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
            fiveDay(citySearch)
        })
    })
}
function fiveDay(city){
    // five day forecast
    $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
    .then(function(results){
        console.log(results)
        $(".future").empty()
        for (let i = 0; i < results.list.length; i++){
            let currentSection = results.list[i]
            
            if (currentSection.dt_txt.includes("12:00")){
                var newDiv = $("<div class = 'card col-md-2 bg-primary text-light' style='font-size:.5em'>").text(moment.unix(currentSection.dt).format('L'))
                var img = $("<img width='50px'>")
                img.attr('src', `http://openweathermap.org/img/wn/${currentSection.weather[0].icon}.png`)
                var temperature = $("<div>").text("Temp: "+currentSection.main.temp+ "F")
                var humidity = $("<div>").text("Humidity: "+currentSection.main.humidity+ "%")
                newDiv.append(img, temperature, humidity)
                $(".future").append(newDiv)
            }
        }

    })
}

function renderList(){
    // this saves cities searched by user
    $("#previousCities").empty()
    for (var i = 0; i < pCities.length; i++){
        var divList = $("<div class='card text-center previousCity'>").text(pCities[i])
        divList.attr("data-name", pCities[i])
        $("#previousCities").append(divList)
    }
}
$("#previousCities").on("click", ".previousCity", function (){
    var cityClicked = $(this).attr("data-name")
    getWeather(cityClicked)
})

function init(){
    renderList()
    getWeather(pCities[0])
}
init()