$(document).ready(function () {

    $("#search-button").on("click", function () {
      var userInput = $("#citySearched").val();
      $("#citySearched").val("");
      citySearch(userInput);
    });
  
    $(".searchHistory").on("click", "li", function () {
      citySearch($(this).text());
    });
  
    function createRow(text) {
      var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
      $(".searchHistory").append(li);
    }

    function citySearch(userInput) {
      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=1ff7fbd63738265ee1be61eb61b41f68&units=imperial`,
        dataType: "json",
  
        success: function (data) {
          if (searchHistory.indexOf(userInput) === -1) {
            searchHistory.push(userInput);
            window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            createRow(userInput);
          }

          $("#current").empty();
  
          var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
          var card = $("<div>").addClass("card");
          var wind = $("<p>").addClass("card-text").text(`Wind Speed: ${data.wind.speed} MPH`);
          var humid = $("<p>").addClass("card-text").text(`Humidity: ${data.main.humidity} %`);
          var temp = $("<p>").addClass("card-text").text(`Temperature: ${data.main.temp} °F`);
          var cardBody = $("<div>").addClass("card-body");
          var img = $("<img>").attr("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
  
          title.append(img);
          cardBody.append(title, temp, humid, wind);
          card.append(cardBody);

          $("#current").append(card);
  
          currentWeather(userInput);
          TODO:

          UVIndex(data.coord.lat, data.coord.lon);
        }
      });
    }

    function currentWeather(userInput) {
      
      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=1ff7fbd63738265ee1be61eb61b41f68&units=imperial`,
        dataType: "json",
        success: function (data) {
        
          $("#fiveDay").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
          for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
              var col = $("<div>").addClass("col-md-2");
              var card = $("<div>").addClass("card bg-primary text-white");
              var body = $("<div>").addClass("card-body p-2");
              var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
              var img = $("<img>").attr("src", `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
              var p1 = $("<p>").addClass("card-text").text(`Temp: ${data.list[i].main.temp_max} °F`);
              var p2 = $("<p>").addClass("card-text").text(`Humidity: ${data.list[i].main.humidity} %`);
  
              col.append(card.append(body.append(title, img, p1, p2)));
              $("#fiveDay .row").append(col);
            }
          }
        }
      });
    }

    function UVIndex(lat, lon) {

      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=1ff7fbd63738265ee1be61eb61b41f68&lat=${lat}&lon=${lon}`,
        dataType: "json",

        success: function (data) {
          var uv = $("<p>").text("UV Index: ");
          var btn = $("<span>").addClass("btn btn-sm").text(data.value);
          
          if (data.value < 3) {
            btn.addClass("btn-success");
          }

          else if (data.value < 7) {
            btn.addClass("btn-warning");
          }
          
          else {
            btn.addClass("btn-danger");
          }

          $("#current .card-body").append(uv.append(btn));
        }
      });
    }

    var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory")) || [];

    if (searchHistory.length > 0) {
      citySearch(searchHistory[searchHistory.length - 1]);
    }

    for (var i = 0; i < searchHistory.length; i++) {
      createRow(searchHistory[i]);
    }
  });