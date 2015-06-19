var fourContainer, fourScene, fourCamera, fourRenderer, fourControls;
var R12Btn = $('#R12Button'), R12Animation = false,
    R13Btn = $('#R13Button'), R13Animation = false,
    R14Btn = $('#R14Button'), R14Animation = false,
    R23Btn = $('#R23Button'), R23Animation = false,
    R24Btn = $('#R24Button'), R24Animation = false,
    R34Btn = $('#R34Button'), R34Animation = false,
    wBtn = $('#wButton'), wAnimation = false;
var GraphFlag = false;



fourInit();
fourAnimate();


function fourInit()
{
    //Creating a scene
    fourScene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight1.position.set(0, 35000, 0);

    var pointlight2 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight2.position.set(0, -35000, 0);

    fourScene.add(pointlight1);
    fourScene.add(pointlight2);

    var pointlight3 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight3.position.set(0, 0, 35000);

    var pointlight4 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight4.position.set(0, 0, -35000);

    fourScene.add(pointlight3);
    fourScene.add(pointlight4);

    //Creating camera, setting it's position, and then making it look at the scene position
    fourCamera = new THREE.PerspectiveCamera(45, fourView[0].clientWidth / fourView[0].clientHeight, 1, 1000);
    fourCamera.position.set(0, 100, 20);
    fourCamera.lookAt(fourScene.position);

    //Create renderer and linking it to threejs canvas
    fourRenderer = new THREE.WebGLRenderer({canvas: fourView[0]});
    fourRenderer.setSize(fourView[0].clientWidth, fourView[0].clientHeight);
    fourRenderer.setClearColor('white', 1);

    fourControls = new THREE.OrbitControls(fourCamera, fourView[0]);
    fourControls.addEventListener('change', fourRender);

    window.addEventListener('resize', onWindowResize, false);

    var _4to3shape = graph4To3Graph(40, min, max, 0, 0, 0, 0, 0, 0,0);
    _4to3shape.name = '_4to3shape';
    fourScene.add(_4to3shape);

    fourRender();
}



function fourAnimate(){
    requestAnimationFrame( fourAnimate );

    GraphFlag = animateSlidersByFrame();

    if(view.animateView){
        onFourResize();
    }

    if(GraphFlag){
        makeNew4To3Graph();
    }

    fourUpdate();
    fourRender();
}




function fourUpdate() {
    fourCamera.lookAt(0, 0, 0);

    fourControls.center.set(0, 0, 0);
    fourControls.update();
}




function fourRender()
{
    fourRenderer.render( fourScene, fourCamera );
}



function graph4To3Graph(resolution, axisMin, axisMax, w, theta12, theta13, theta14, theta23, theta24, theta34){
    var points = [];
    var values = [];

    var axisRange = axisMax - axisMin;

    var U = passAngleToU(theta12, theta13, theta14, theta23, theta24, theta34),
        UTrans = numeric.transpose(U);

    // Generate a list of 3D points and values at those points
    for (var k = 0; k < resolution; k++)
        for (var j = 0; j < resolution; j++)
            for (var i = 0; i < resolution; i++)
            {
                // actual values
                var x = axisMin + axisRange * i / resolution;
                var y = axisMin + axisRange * j / resolution;
                var z = axisMin + axisRange * k / resolution;
                points.push( new THREE.Vector3(x,y,z) );

                var X = [ [x], [y], [z], [w]],
                    XTrans = numeric.transpose(X);

                var first = numeric.dot(XTrans, U),
                    second = numeric.dot(UTrans, X);

                var firstDone = numeric.dot(first, A),
                    secondDone = numeric.dot(firstDone, second);

                var value = secondDone[0];

                values.push( value );
            }


    var geometry = marchingCubes(points, values, resolution);
    var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    var graph = new THREE.Mesh( geometry, colorMaterial );

    return graph;
}



function remove4To3Graph(string) {
    for (var i = 0; i < fourScene.children.length; i++) {
        if (fourScene.children[i].name == string) {
            fourScene.remove(fourScene.children[i]);
        }
    }
}



function animateSlidersByFrame(){
    var bool = false;

    if(R12Animation){
        animateSliderById(R12, 'R12', 0, 360, 1);
        bool = true;
    }

    if(R13Animation){
        animateSliderById(R13, 'R13', 0, 360, 1);
        bool = true;
    }

    if(R14Animation){
        animateSliderById(R14, 'R14', 0, 360, 1);
        bool = true;
    }

    if(R23Animation){
        animateSliderById(R23, 'R23', 0, 360, 1);
        bool = true;
    }

    if(R24Animation){
        animateSliderById(R24, 'R24', 0, 360, 1);
        bool = true;
    }

    if(R34Animation){
        animateSliderById(R34, 'R34', 0, 360, 1);
        bool = true;
    }

    if(wAnimation){
        animateSliderById(w, 'w', -50, 50, .5);
        bool = true;
    }

    return bool;
}


function animateSliderById(slider, sliderId, min, max, step){
    var nextValue;

    if(sliderValues[sliderId] >= max){
        nextValue = min;
    }
    else{
        nextValue = sliderValues[sliderId] + step;
    }

    slider.setValue(nextValue, true);

    sliderValues[sliderId] = nextValue;
}