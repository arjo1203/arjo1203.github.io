//Buttons
var menu_toggle = $("#menu-toggle"), planeOnOffButton = $('#planeOnOff'), Hyperboloid1Button = $('#Hyperboloid1'),
    Hyperboloid2Button = $('#Hyperboloid2'), ConeButton = $('#Cone'), EllipticParaboloidButton = $('#EllipticParaboloid'),
    HyperbolicParaboloidButton = $('#HyperbolicParaboloid'), animateButton = $('#animate');

//Divs
var graphName = $('#graphName'), graphFn = $('#graphFn');



$("#planeTilt").slider();
$("#planeTilt").on('slide', function(slideEvt) {
    $("#planeTiltVal").text(slideEvt.value);
    PLANE.rotation.x = degInRad(slideEvt.value);
    render();
});

$("#planePos").slider();
$("#planePos").on('slide', function(slideEvt) {
    $("#planePosVal").text(slideEvt.value);
    PLANE.position.z = slideEvt.value;
    render();
});

$("#xScale").slider();
$("#xScale").on('slide', function(slideEvt) {
    $("#xScaleVal").text(slideEvt.value);
    if(slideEvt.value != 0){
        GRAPH.scale.x = 1 / Math.pow(slideEvt.value, 2);
        render();
    }
});

$("#yScale").slider();
$("#yScale").on('slide', function(slideEvt) {
    $("#yScaleVal").text(slideEvt.value);
    if(slideEvt.value != 0){
        GRAPH.scale.y = 1 / Math.pow(slideEvt.value, 2);
        render();
    }
});




HyperbolicParaboloidButton.click(function() {
    var xScale = GRAPH.scale.x, yScale = GRAPH.scale.y;

    graphName[0].innerHTML = 'Hyperbolic Paraboloid';
    graphFn[0].innerHTML = 'z = (x^2/a^2) - (y^2/b^2)';

    scene.remove(GRAPH);

    GRAPH = makeHyperbolicParaboloid();
    GRAPH.scale.x = xScale;
    GRAPH.scale.y = yScale;
    scene.add(GRAPH);

    render();
});




ConeButton.click(function() {
    var xScale = GRAPH.scale.x, yScale = GRAPH.scale.y;

    graphName[0].innerHTML = 'Cone';
    graphFn[0].innerHTML = 'z^2 = (x^2/a^2) + (y^2/b^2)';


    scene.remove(GRAPH);

    GRAPH = makeCone(0);
    GRAPH.scale.x = xScale;
    GRAPH.scale.y = yScale;
    scene.add(GRAPH);

    render();
});




Hyperboloid1Button.click(function() {
    var xScale = GRAPH.scale.x, yScale = GRAPH.scale.y;

    graphName[0].innerHTML = 'Hyperboloid 1 Sheet';
    graphFn[0].innerHTML = '(x^2/a^2) + (y^2/b^2) - z^2 = 1';

    scene.remove(GRAPH);

    GRAPH = makeHyperboloid1(1);
    GRAPH.scale.x = xScale;
    GRAPH.scale.y = yScale;
    scene.add(GRAPH);

    render();
});




Hyperboloid2Button.click(function() {
    var xScale = GRAPH.scale.x, yScale = GRAPH.scale.y;

    graphName[0].innerHTML = 'Hyperboloid 2 Sheet';
    graphFn[0].innerHTML = '-(x^2/a^2) - (y^2/b^2) + z^2 = 1';

    scene.remove(GRAPH);

    GRAPH = makeHyperboloid2(1);
    GRAPH.scale.x = xScale;
    GRAPH.scale.y = yScale;
    scene.add(GRAPH);

    render();
});




EllipticParaboloidButton.click(function() {
    var xScale = GRAPH.scale.x, yScale = GRAPH.scale.y;

    graphName[0].innerHTML = 'Elliptic Paraboloid';
    graphFn[0].innerHTML = 'z = (x^2/a^2) + (y^2/b^2)';

    scene.remove(GRAPH);

    GRAPH = makeEllipticParaboloid();
    GRAPH.scale.x = xScale;
    GRAPH.scale.y = yScale;
    scene.add(GRAPH);

    render();
});




planeOnOffButton.click(function() {
    var currentState = planeOnOffButton[0].innerHTML;

    if(currentState == 'Turn Plane On') {
        PLANE = makePlane();
        scene.add(PLANE);
        render();
        planeOnOffButton[0].innerHTML = 'Turn Plane Off';
    }
    else {
        scene.remove(PLANE);
        render();
        planeOnOffButton[0].innerHTML = 'Turn Plane On';
    }
});




menu_toggle.click(function() {
    var currentState = menu_toggle[0].innerHTML;

    if(currentState == 'Close'){
        menu_toggle[0].innerHTML = 'Open';
    }
    else{
        menu_toggle[0].innerHTML = 'Close';
    }
});



animateButton.click(function() {
    var currentState = animateButton[0].innerHTML;

    if(currentState == 'Animate Off'){
        animateaGARPH = true;
        animateButton[0].innerHTML = 'Animate On';
    }
    else{
        animateaGARPH = false;
        animateButton[0].innerHTML = 'Animate Off';
    }
});