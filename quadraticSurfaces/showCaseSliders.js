var R12 = new Slider('#R12', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R12").on('slide', onSlide);

var R13 = new Slider('#R13', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R13").on('slide', onSlide);

var R14 = new Slider('#R14', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R14").on('slide', onSlide);

var R23 = new Slider('#R23', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R23").on('slide', onSlide);

var R24 = new Slider('#R24', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R24").on('slide', onSlide);

var R34 = new Slider('#R34', {
    formatter: function(value) {
        return value + "\u00B0";
    }
});
$("#R34").on('slide', onSlide);

var w = new Slider('#w');
w.on('slide', onSlide);


function onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);

    sliderValues[this.id] = slideEvt.value;

    makeNew4To3Graph();
}



function onAnimate(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);
}



function makeNew4To3Graph(){
    remove4To3Graph();

    getSliderValues();
}



var min = -20,
    max = 20,
    animationResolution = 30;

var sliderValues = {};

sliderValues.R12 = 0;
sliderValues.R13 = 0;
sliderValues.R14 = 0;
sliderValues.R23 = 0;
sliderValues.R24 = 0;
sliderValues.R34 = 0;
sliderValues.w = 0;



function getSliderValues(res){
    var resolution;
    if(!res){
        //console.log('nothing passed');
        resolution = animationResolution;
    }
    else{
        resolution = res;
    }
    var theta12 = degreesToRadian(sliderValues.R12),
        theta13 = degreesToRadian(sliderValues.R13),
        theta14 = degreesToRadian(sliderValues.R14),
        theta23 = degreesToRadian(sliderValues.R23),
        theta24 = degreesToRadian(sliderValues.R24),
        theta34 = degreesToRadian(sliderValues.R34);

    var shape = graph4To3Graph(resolution, min, max, sliderValues.w, theta12, theta13, theta14, theta23, theta24, theta34);
    shape.name = 'graph';
    scene.add(shape);
}



function degreesToRadian(degree){
    var radians = degree * (Math.PI / 180);
    return radians;
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