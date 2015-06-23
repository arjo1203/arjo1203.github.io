var R12,
    R13,
    R14,
    R23,
    R24,
    R34,
    w,
    x,
    y,
    z,
    zCross,
    formatter = {
        formatter: function(value) {
            return value + "\u00B0";
        }
    };

R12 = new Slider('#R12', formatter);
$("#R12").on('slide', _4to3onSlide);


R13 = new Slider('#R13', formatter);
$("#R13").on('slide', _4to3onSlide);


R14 = new Slider('#R14', formatter);
$("#R14").on('slide', _4to3onSlide);


R23 = new Slider('#R23', formatter);
$("#R23").on('slide', _4to3onSlide);


R24 = new Slider('#R24', formatter);
$("#R24").on('slide', _4to3onSlide);


R34 = new Slider('#R34', formatter);
$("#R34").on('slide', _4to3onSlide);


w = new Slider('#w');
w.on('slide', _4to3onSlide);


x = new Slider('#x');
x.on('slide', _3to2onSlide);


y = new Slider('#y');
y.on('slide', _3to2onSlide);


z = new Slider('#z');
z.on('slide', _3to2onSlide);


zCross = new Slider('#zCross');
zCross.on('slide', _3to2onSlide);


var sliderArray = [R12, R13, R14, R23, R24, R34, w, x, y, z, zCross];

function _4to3onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);

    sliderValues[this.id] = slideEvt.value;

    makeNew4To3Graph();
}




function onAnimate(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);
}



function makeNew4To3Graph(){
    remove4To3Graph('_4to3shape');

    getSliderValues();
}



function _3to2onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);

    sliderValues[this.id] = slideEvt.value;

    if(slideEvt.target.id == 'zCross'){
        updatePlane(slideEvt.value);
        removeGraph('line');

        _2DGraph = getGraphPoints();
        //console.log(_2DGraph);

        var graph = graph2D(_2DGraph);
        graph.name = 'line';
        twoScene.add(graph);
    }
    else{
        updateRotation(this.id);
    }
}



function updateRotation(id){
    var radian = degreesToRadian(sliderValues[id]);
    switch(id){
        case 'x':
            _3to2shape.rotation.x = radian;
            break;
        case 'y':
            _3to2shape.rotation.y = radian;
            break;
        case 'z':
            _3to2shape.rotation.z = radian;
            break;

    }
}



function updatePlane(value){
    plane.position.z = value;
}



function getSliderValues(){
    var angle12 = degreesToRadian(sliderValues.R12),
        angle13 = degreesToRadian(sliderValues.R13),
        angle14 = degreesToRadian(sliderValues.R14),
        angle23 = degreesToRadian(sliderValues.R23),
        angle24 = degreesToRadian(sliderValues.R24),
        angle34 = degreesToRadian(sliderValues.R34);

    var _4to3shape = graph4To3Graph(animationResolution, min, max, sliderValues.w, angle12, angle13, angle14, angle23, angle24, angle34);
    _4to3shape.name = '_4to3shape';
    fourScene.add(_4to3shape);
}



function degreesToRadian(degree){
    var radians = degree * (Math.PI / 180);
    return radians;
}