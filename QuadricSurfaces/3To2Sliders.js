var R12,
    R13,
    R23,
    z,
    formatter = {
        formatter: function(value) {
            return value + "\u00B0";
        }
    };

R12 = new Slider('#R12', formatter);
$("#R12").on('slide', _3to2onSlide);


R13 = new Slider('#R13', formatter);
$("#R13").on('slide', _3to2onSlide);


R23 = new Slider('#R23', formatter);
$("#R23").on('slide', _3to2onSlide);


z = new Slider('#z');
z.on('slide', _3to2onSlide);


function _3to2onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);

    sliderValues[this.id] = slideEvt.value;

    if(slideEvt.target.id == 'z'){
        updatePlane(slideEvt.value);
    }
    else{
        updateRotation(this.id);
    }
}



function updateRotation(id){
    var radian = degreesToRadian(sliderValues[id]);
    switch(id){
        case 'R12':
            _3to2shape.rotation.x = radian;
            break;
        case 'R13':
            _3to2shape.rotation.y = radian;
            break;
        case 'R23':
            _3to2shape.rotation.z = radian;
            break;

    }
}



function updatePlane(value){
    plane.position.z = value;
}



function onAnimate(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);
}



function makeNew3To2Graph(){
    remove3To2Graph('_3to2shape');

    getSliderValues();
}



function degreesToRadian(degree){
    var radians = degree * (Math.PI / 180);
    return radians;
}