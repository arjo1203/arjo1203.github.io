$("#R12").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R12").on('slide', function(slideEvt) {
    $("#R12Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R13").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R13").on('slide', function(slideEvt) {
    $("#R13Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R14").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R14").on('slide', function(slideEvt) {
    $("#R14Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R23").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R23").on('slide', function(slideEvt) {
    $("#R23Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R24").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R24").on('slide', function(slideEvt) {
    $("#R24Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R34").slider({
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R34").on('slide', function(slideEvt) {
    $("#R34Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#w").slider();
$("#w").on('slide', function(slideEvt) {
    $("#wVal").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});



var min = -20,
    max = 20,
    animationResolution = 25,
    parition = 6;



function getSliderValues(){
    var theta12 = 0, theta13 = 0, theta14 = 0, theta23 = 0, theta24 = 0, theta34 = 0;

    var R12Val = $('#R12Val')[0].innerHTML,
        R13Val = $('#R13Val')[0].innerHTML,
        R14Val = $('#R14Val')[0].innerHTML,
        R23Val = $('#R23Val')[0].innerHTML,
        R24Val = $('#R24Val')[0].innerHTML,
        R34Val = $('#R34Val')[0].innerHTML,
        wVal = $('#wVal')[0].innerHTML;

    theta12 = parseInt(R12Val) * (Math.PI / 180);
    theta13 = parseInt(R13Val) * (Math.PI / 180);
    theta14 = parseInt(R14Val) * (Math.PI / 180);
    theta23 = parseInt(R23Val) * (Math.PI / 180);
    theta24 = parseInt(R24Val) * (Math.PI / 180);
    theta34 = parseInt(R34Val) * (Math.PI / 180);


    //theta12 = (parseInt(R12Val) * Math.PI) / parition;
    //theta13 = (parseInt(R13Val) * Math.PI) / parition;
    //theta14 = (parseInt(R14Val) * Math.PI) / parition;
    //theta23 = (parseInt(R23Val) * Math.PI) / parition;
    //theta24 = (parseInt(R24Val) * Math.PI) / parition;
    //theta34 = (parseInt(R34Val) * Math.PI) / parition;

    slidersCombo = R12Val + R13Val + R14Val + R23Val + '00';

    var shape = graphFn(animationResolution, min, max, parseInt(wVal), theta12, theta13, theta14, theta23, theta24, theta34);
    shape.name = 'graph';
    scene.add(shape);

    render();
}




function removeSliders(){
    var R12Div = $('#R12Div')[0], R13Div = $('#R13Div')[0], R14Div = $('#R14Div')[0], R23Div = $('#R23Div')[0], R24Div = $('#R24Div')[0], R34Div = $('#R34Div')[0], wDiv = $('#wDiv');

    $('#R12').slider('destory');
    //while(R12Div.firstChild){
    //    R12Div.removeChild(R12Div.firstChild);
    //}
    //
    //while(R13Div.firstChild){
    //    R13Div.removeChild(R13Div.firstChild);
    //}
    //
    //while(R14Div.firstChild){
    //    R14Div.removeChild(R14Div.firstChild);
    //}
    //while(R23Div.firstChild){
    //    R23Div.removeChild(R23Div.firstChild);
    //}
    //while(R24Div.firstChild){
    //    R24Div.removeChild(R24Div.firstChild);
    //}
    //while(R34Div.firstChild){
    //    R34Div.removeChild(R34Div.firstChild);
    //}
}



function createSliders(max){
    var sliders = [
        'R12',
        'R13',
        'R14',
        'R23',
        'R24',
        'R34',
    ];

    for(var i = 0; i < sliders.length; i++){
        createSlider($('#' + sliders[i] + 'Div')[0], sliders[i], max);
        $('#' + sliders[i]).slider({
            formatter: function() {
                return '';
            }
        });
    }

    //for(var i = 0; i < sliders.length; i++){
    //
    //    $('#' + sliders[i]).on('slide', function(slideEvt) {
    //        $('#' + sliders[i] + 'Val').text(slideEvt.value);
    //
    //        removeOldGraph();
    //
    //        getSliderValues();
    //    });
    //}
}




function createSlider(div, R__, max){
    var span1 = document.createElement("span");
    span1.setAttribute("class", "params");
    span1.innerHTML = R__;

    var span2 = document.createElement("span");
    span2.id = R__ + "Val";
    span2.innerHTML = "0";
    span1.appendChild(span2);

    var input = document.createElement("input");
    input.id = R__;
    input.setAttribute("type", "text");
    input.setAttribute("data-slider-min", "0");
    input.setAttribute("data-slider-step", "1");
    input.setAttribute("data-slider-max", max);
    input.setAttribute("data-slider-value", "0");
    input.setAttribute("data", "value: '0'");
    input.setAttribute("value", "0");
    input.setAttribute("style", "display: none;");
    span1.appendChild(input);

    div.appendChild(span1);
}




function shadeShapes(array){
    var lowestId, priorId = 0, ids = [], shapeToRemove;

    for(var i = 0; i < scene.children.length; i++){
        if(scene.children[i].name == 'graph'){
            ids.push(parseInt(scene.children[i].id));
            console.log('graph');
        }
    }

    if(ids.length > 5){
        shapeToRemove = Math.min.apply(Math, ids);
        removeThreeObj(shapeToRemove);
        ids.pop();
    }


    for(var i = 0; i < ids.length; i++){
        //scene.children[ids[i]].material.opacity = .5;
        //scene.children[ids[i]].material.opacity = .5;
        changeOpacity(ids[i]);

        console.log(scene.children[ids[i]]);
    }
}




function removeThreeObj(objId){
    for(var i = 0; i < scene.children.length; i++){
        if(scene.children[i].id == objId.toString()){
            scene.remove(scene.children[i]);
            render();
        }
    }
}




function changeOpacity(objId){
    var findIndex;
    for(var i = 0; i < scene.children.length; i++){
        if(scene.children[i].id == objId.toString()){
            findIndex = i;
        }
    }

    scene.children[findIndex].material.opacity = .5;
    render();
}