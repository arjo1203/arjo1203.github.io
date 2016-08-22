var R12, R13, R14, R23, R24, R34, w, x, y, z, zCross, formatter = {
        formatter: function(value) {
            return value + "\u00B0";
        }
    },
    twoDCameraOffset = 30,
    shape = new THREE.Object3D(),
    shapes = {
        shape1: {
            crossSection: new THREE.Object3D(),
            data: {}
        },
        shape2: new THREE.Object3D(),
        shape3: new THREE.Object3D(),
        shape4: new THREE.Object3D(),
        shape5: new THREE.Object3D(),
        counter: 1
    },
    min = -20,
    max = 20,
    animationResolution = 28;



sliderValues.R12 = 0;
sliderValues.R13 = 0;
sliderValues.R14 = 0;
sliderValues.R23 = 0;
sliderValues.R24 = 0;
sliderValues.R34 = 0;
sliderValues.w = 0;
sliderValues.x = 0;
sliderValues.y = 0;
sliderValues.z = 0;
sliderValues.zCross = 0;



R12 = new Slider('#R12', formatter);
$("#R12").on('slide', _4to3onSlide);
$("#R12").on('slideStart', _4to3onSlide);


R13 = new Slider('#R13', formatter);
$("#R13").on('slide', _4to3onSlide);
$("#R13").on('slideStart', _4to3onSlide);


R14 = new Slider('#R14', formatter);
$("#R14").on('slide', _4to3onSlide);
$("#R14").on('slideStart', _4to3onSlide);


R23 = new Slider('#R23', formatter);
$("#R23").on('slide', _4to3onSlide);
$("#R23").on('slideStart', _4to3onSlide);


R24 = new Slider('#R24', formatter);
$("#R24").on('slide', _4to3onSlide);
$("#R24").on('slideStart', _4to3onSlide);


R34 = new Slider('#R34', formatter);
$("#R34").on('slide', _4to3onSlide);
$("#R34").on('slideStart', _4to3onSlide);


w = new Slider('#w');
w.on('slide', _4to3onSlide);
w.on('slideStop', _4to3onSlide);


x = new Slider('#x');
x.on('slide', _3to2onSlide);
x.on('slideStart', _3to2onSlide);


y = new Slider('#y');
y.on('slide', _3to2onSlide);
y.on('slideStart', _3to2onSlide);


z = new Slider('#z');
z.on('slide', _3to2onSlide);
z.on('slideStart', _3to2onSlide);


zCross = new Slider('#zCross');
zCross.on('slideStart', _3to2onSlide);
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
    fourScene.remove(shapes.shape1.crossSection);

    shapes.shape1.data = getSliderValues();
    shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
    fourScene.add(shapes.shape1.crossSection);

    //animateShapes();
}




function animateShapes(){
    if(shapes.counter % 5 == 1){
        //console.log('1');
        fourScene.remove(shapes.shape1.crossSection);

        shapes.shape1.data = getSliderValues();
        shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
        applyOpacity(shapes.shape1.object3D, 1);
        fourScene.add(shapes.shape1.crossSection);
    }

    if(shapes.counter % 5 == 2){
        //console.log('2');
        fourScene.remove(shapes.shape1.crossSection);

        shapes.shape2.data = shapes.shape1.data;

        shapes.shape1.data = getSliderValues();
        shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
        applyOpacity(shapes.shape1.crossSection, 1);
        fourScene.add(shapes.shape1.crossSection);

        shapes.shape2.crossSection = drawQuadricSurface(shapes.shape2.data);
        applyOpacity(shapes.shape2.crossSection, .85);
        fourScene.add(shapes.shape2.crossSection);
    }

    if(shapes.counter % 5 == 3){
        //console.log('3');
        fourScene.remove(shapes.shape1.crossSection);
        fourScene.remove(shapes.shape2.crossSection);

        shapes.shape3.data = shapes.shape2.data;
        shapes.shape2.data = shapes.shape1.data;

        shapes.shape1.data = getSliderValues();
        shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
        applyOpacity(shapes.shape1.crossSection, 1);
        fourScene.add(shapes.shape1.crossSection);

        shapes.shape2.crossSection = drawQuadricSurface(shapes.shape2.data);
        applyOpacity(shapes.shape2.crossSection, .85);
        fourScene.add(shapes.shape2.crossSection);

        shapes.shape3.crossSection = drawQuadricSurface(shapes.shape3.data);
        applyOpacity(shapes.shape3.crossSection, .7);
        fourScene.add(shapes.shape3.crossSection);
    }

    if(shapes.counter % 5 == 4){
        //console.log('4');
        fourScene.remove(shapes.shape1.crossSection);
        fourScene.remove(shapes.shape2.crossSection);
        fourScene.remove(shapes.shape3.crossSection);

        shapes.shape4.data = shapes.shape3.data;
        shapes.shape3.data = shapes.shape2.data;
        shapes.shape2.data = shapes.shape1.data;

        shapes.shape1.data = getSliderValues();
        shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
        applyOpacity(shapes.shape1.crossSection, 1);
        fourScene.add(shapes.shape1.crossSection);

        shapes.shape2.crossSection = drawQuadricSurface(shapes.shape2.data);
        applyOpacity(shapes.shape2.crossSection, .85);
        fourScene.add(shapes.shape2.crossSection);

        shapes.shape3.crossSection = drawQuadricSurface(shapes.shape3.data);
        applyOpacity(shapes.shape3.crossSection, .7);
        fourScene.add(shapes.shape3.crossSection);

        shapes.shape4.crossSection = drawQuadricSurface(shapes.shape4.data);
        applyOpacity(shapes.shape4.crossSection, .55);
        fourScene.add(shapes.shape4.crossSection);
    }

    if(shapes.counter % 5 == 0){
        //console.log('5');
        fourScene.remove(shapes.shape1.crossSection);
        fourScene.remove(shapes.shape2.crossSection);
        fourScene.remove(shapes.shape3.crossSection);
        fourScene.remove(shapes.shape4.crossSection);

        if(shapes.shape5.crossSection){
            fourScene.remove(shapes.shape5.crossSection);
        }

        shapes.shape5.data = shapes.shape4.data;
        shapes.shape4.data = shapes.shape3.data;
        shapes.shape3.data = shapes.shape2.data;
        shapes.shape2.data = shapes.shape1.data;

        shapes.shape1.data = getSliderValues();
        shapes.shape1.crossSection = drawQuadricSurface(shapes.shape1.data);
        applyOpacity(shapes.shape1.crossSection, 1);
        fourScene.add(shapes.shape1.crossSection);

        shapes.shape2.crossSection = drawQuadricSurface(shapes.shape2.data);
        applyOpacity(shapes.shape2.crossSection, .85);
        fourScene.add(shapes.shape2.crossSection);

        shapes.shape3.crossSection = drawQuadricSurface(shapes.shape3.data);
        applyOpacity(shapes.shape3.crossSection, .7);
        fourScene.add(shapes.shape3.crossSection);

        shapes.shape4.crossSection = drawQuadricSurface(shapes.shape4.data);
        applyOpacity(shapes.shape4.crossSection, .55);
        fourScene.add(shapes.shape4.crossSection);

        shapes.shape5.crossSection = drawQuadricSurface(shapes.shape5.data);
        applyOpacity(shapes.shape5.crossSection, .4);
        fourScene.add(shapes.shape5.crossSection);
    }

    if(shapes.counter < 5){
        shapes.counter++;
    }
}


function applyOpacity(obj, opacity){
    if(obj) {
        for(var i = 0; i < obj.children.length; i++) {
            obj.children[i].material.opacity = opacity;
        }
    }
}



function _3to2onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);

    sliderValues[this.id] = slideEvt.value;

    if(slideEvt.target.id == 'zCross'){
        updatePlane(slideEvt.value);
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
            _2DGraph.rotation.x = radian;
            break;
        case 'y':
            _3to2shape.rotation.y = radian;
            _2DGraph.rotation.y = radian;
            break;
        case 'z':
            _3to2shape.rotation.z = radian;
            _2DGraph.rotation.z = radian;
            break;

    }
}



function updatePlane(value){
    plane.position.z = value;
    twoCamera.position.z = value + twoDCameraOffset;
}




function drawQuadricSurface(data, resolution) {
    var crossSection = new THREE.Object3D();

    var _4to3shape = graph4To3Graph(resolution || animationResolution, min, max, 1, data.w, data.a12, data.a13, data.a14, data.a23, data.a24, data.a34);
    _4to3shape.name = '_4to3shape';
    crossSection.add(_4to3shape);

    var _4to3shape2 = graph4To3Graph(resolution || animationResolution, min, max, 2, data.w, data.a12, data.a13, data.a14, data.a23, data.a24, data.a34);
    _4to3shape2.name = '_4to3shape2';
    crossSection.add(_4to3shape2);
    crossSection.name = 'crossSection';

    return crossSection;
}



function getSliderValues(){
    var angle12 = degreesToRadian(sliderValues.R12),
        angle13 = degreesToRadian(sliderValues.R13),
        angle14 = degreesToRadian(sliderValues.R14),
        angle23 = degreesToRadian(sliderValues.R23),
        angle24 = degreesToRadian(sliderValues.R24),
        angle34 = degreesToRadian(sliderValues.R34);

    var obj = {};
    obj.a12 = angle12;
    obj.a13 = angle13;
    obj.a14 = angle14;
    obj.a23 = angle23;
    obj.a24 = angle24;
    obj.a34 = angle34;
    obj.w = sliderValues.w;

    return obj;
}





function degreesToRadian(degree) {
    var radians = degree * (Math.PI / 180);
    return radians;
}