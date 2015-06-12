$("#R12").slider({
    formatter: function() {
        return '';
    }
});
$("#R12").on('slide', function(slideEvt) {
    $("#R12Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R13").slider({
    formatter: function() {
        return '';
    }
});
$("#R13").on('slide', function(slideEvt) {
    $("#R13Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R14").slider({
    formatter: function() {
        return '';
    }
});
$("#R14").on('slide', function(slideEvt) {
    $("#R14Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R23").slider({
    formatter: function() {
        return '';
    }
});
$("#R23").on('slide', function(slideEvt) {
    $("#R23Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R24").slider({
    formatter: function() {
        return '';
    }
});
$("#R24").on('slide', function(slideEvt) {
    $("#R24Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#R34").slider({
    formatter: function() {
        return '';
    }
});
$("#R34").on('slide', function(slideEvt) {
    $("#R34Val").text(slideEvt.value);

    removeOldGraph();

    getSliderValues();
});

$("#w").slider({
    formatter: function() {
        return '';
    }
});
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

    theta12 = (parseInt(R12Val) * Math.PI) / parition;
    theta13 = (parseInt(R13Val) * Math.PI) / parition;
    theta14 = (parseInt(R14Val) * Math.PI) / parition;
    theta23 = (parseInt(R23Val) * Math.PI) / parition;
    theta24 = (parseInt(R24Val) * Math.PI) / parition;
    theta34 = (parseInt(R34Val) * Math.PI) / parition;

    slidersCombo = R12Val + R13Val + R14Val + R23Val + '00';

    var shape = graphFn(animationResolution, min, max, parseInt(wVal), theta12, theta13, theta14, theta23, theta24, theta34);
    shape.name = 'graph';
    scene.add(shape);

    render();
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