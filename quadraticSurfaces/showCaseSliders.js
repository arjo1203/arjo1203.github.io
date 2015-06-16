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
//console.log(w.on.value);
//w.on('slide', onAnimate);


function onSlide(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);
    makeNewGraph();
}



function onAnimate(slideEvt){
    $("#" + this.id + "Val").text(slideEvt.value);
}



function makeNewGraph(){
    removeOldGraph();

    getSliderValues();
}



var min = -20,
    max = 20,
    animationResolution = 25;



function getSliderValues(){
    var theta12 = 0,
        theta13 = 0,
        theta14 = 0,
        theta23 = 0,
        theta24 = 0,
        theta34 = 0;

    var R12Val = $('#R12Val')[0].innerHTML,
        R13Val = $('#R13Val')[0].innerHTML,
        R14Val = $('#R14Val')[0].innerHTML,
        R23Val = $('#R23Val')[0].innerHTML,
        R24Val = $('#R24Val')[0].innerHTML,
        R34Val = $('#R34Val')[0].innerHTML,
        wVal = $('#wVal')[0].innerHTML;

    theta12 = parseFloat(R12Val) * (Math.PI / 180);
    theta13 = parseFloat(R13Val) * (Math.PI / 180);
    theta14 = parseFloat(R14Val) * (Math.PI / 180);
    theta23 = parseFloat(R23Val) * (Math.PI / 180);
    theta24 = parseFloat(R24Val) * (Math.PI / 180);
    theta34 = parseFloat(R34Val) * (Math.PI / 180);

    var shape = graphFn(animationResolution, min, max, parseFloat(wVal), theta12, theta13, theta14, theta23, theta24, theta34);
    shape.name = 'graph';
    scene.add(shape);
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