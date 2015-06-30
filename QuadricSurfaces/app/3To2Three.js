
var threeScene, threeCamera, threeRenderer, threeControls;
var xBtn = $('#xButton'), xAnimation = false,
    yBtn = $('#yButton'), yAnimation = false,
    zBtn = $('#zButton'), zAnimation = false,
    zCrossBtn = $('#zCrossButton'), zCrossAnimation = false,
    threeScreenPercent = .5;



threeInit();
threeAnimate();


function threeInit(){
    //Creating a scene
    threeScene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight1.position.set(0, 35000, 0);

    var pointlight2 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight2.position.set(0, -35000, 0);

    threeScene.add(pointlight1);
    threeScene.add(pointlight2);

    var pointlight3 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight3.position.set(0, 0, 35000);

    var pointlight4 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight4.position.set(0, 0, -35000);

    threeScene.add(pointlight3);
    threeScene.add(pointlight4);

    //Creating camera, setting it's position, and then making it look at the scene position
    threeCamera = new THREE.PerspectiveCamera(45, leftView[0].clientWidth / (leftView[0].clientHeight * threeScreenPercent), 1, 1000);
    threeCamera.position.set(0, -170, 40);
    threeCamera.lookAt(threeScene.position);

    //Create renderer and linking it to threejs canvas
    threeRenderer = new THREE.WebGLRenderer({canvas: threeView[0]});
    threeRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight * threeScreenPercent);
    threeRenderer.setClearColor('white', 1);

    threeControls = new THREE.OrbitControls(threeCamera, threeView[0]);
    threeControls.addEventListener('change', threeRender);

    _3to2shape = graph3To2Graph(40, min, max, 0, 0, 0, 0);
    _3to2shape.name = '_3to2shape';
    threeScene.add(_3to2shape);

    var geo = new THREE.PlaneGeometry(60, 60, 1, 1);
    var mat = new THREE.MeshLambertMaterial( {color: 0x8B0000, side: THREE.DoubleSide} );
    plane = new THREE.Mesh(geo, mat);
    threeScene.add(plane);

    var conicLabel = createLabel('Conic Sections', 10);
    conicLabel.position.z = 30;
    conicLabel.position.x = -45;
    conicLabel.rotation.x = 90 * (Math.PI / 180);
    threeScene.add(conicLabel);
    label.labels.push(conicLabel);

    threeRender();
}




//Creates 3d text
function createLabel(message, size){
    var geo, mat, label;
    var geo = new THREE.TextGeometry( message, {
        size: size,
        height: 10,
        curveSegments: 10,
        font: 'helvetiker',
        bevelThickness: 5,
        bevelSize: 5
    });
    geo.computeBoundingBox();

    mat = new THREE.MeshBasicMaterial( { color: 0x0000ff, overdraw: 0.5 } );
    label = new THREE.Mesh(geo, mat);
    label.name = message;

    return label;
}



function threeAnimate(){
    requestAnimationFrame( threeAnimate );

    animateThreeSlidersByFrame();

    if(view.animateView){
        onThreeResize();
    }

    threeUpdate();
    threeRender();
}




function threeUpdate() {
    threeControls.update();
}




function threeRender()
{
    threeRenderer.render( threeScene, threeCamera );
}



function graph3To2Graph(resolution, axisMin, axisMax, theta12, theta13, theta23){
    var points = [];
    var values = [];

    var axisRange = axisMax - axisMin;

    var U = passAngleToThreeU(theta12, theta13, theta23),
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

                var X = [ [x], [y], [z] ],
                    XTrans = numeric.transpose(X);

                var first = numeric.dot(XTrans, U),
                    second = numeric.dot(UTrans, X);

                var firstDone = numeric.dot(first, threeA),
                    secondDone = numeric.dot(firstDone, second);

                var value = secondDone[0];

                values.push( value );
            }


    var geometry = marchingCubes(points, values, resolution);
    var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    var graph = new THREE.Mesh( geometry, colorMaterial );

    return graph;
}



function remove3To2Graph(string) {
    for (var i = 0; i < threeScene.children.length; i++) {
        if (threeScene.children[i].name == string) {
            threeScene.remove(threeScene.children[i]);
        }
    }
}



function animateThreeSlidersByFrame(){
    if(xAnimation){
        animateThreeSliderById(x, 'x', 0, 360, 1);
    }

    if(yAnimation){
        animateThreeSliderById(y, 'y', 0, 360, 1);
    }

    if(zAnimation){
        animateThreeSliderById(z, 'z', 0, 360, 1);
    }

    if(zCrossAnimation){
        animateThreeSliderById(zCross, 'zCross', -50, 50, .1);
    }
}