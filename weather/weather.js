//var Weather = $('#weather');
$(function(){
    Weather.getCurrent('Chicago', function(current) {
        $('.weather .temperature').text(Weather.kelvinToFahrenheit(current.temperature()).toFixed() + '°');
        $('.weather .icon').addClass('icon-weather-' + current.data.list[0].weather[0].id);
        $('.weather .conditions').text(current.conditions());
    });
});