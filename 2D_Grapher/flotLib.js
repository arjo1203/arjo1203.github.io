$(function () {

    var d1 = [];
    for (var i = -Math.PI; i < Math.PI; i += 0.01) {
        d1.push([i, circle(i)]);
    }
    var d2 = [];
    for (var i = -Math.PI * 2; i < Math.PI * 2; i += 0.01) {
        d2.push([i, -circle(i)]);
    }

    $.plot("#placeholder", [
        { data: d1 },
        { data: d2 }
    ], {
        series: {
            lines: { show: true }
        },
        xaxis: {
            min: -20,
            max: 20,
            ticks: 10
        },
        yaxis: {
            ticks: 10,
            min: -20,
            max: 20,
            tickDecimals: 3
        },
        grid: {
            backgroundColor: { colors: [ "#fff", "#eee" ] },
            borderWidth: {
                top: 1,
                right: 1,
                bottom: 2,
                left: 2
            }
        }
    });

    function circle(x) {
        var y = Math.sqrt(10 - Math.pow(x, 2));

        return y;
    }
});