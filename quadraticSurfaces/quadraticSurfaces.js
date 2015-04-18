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
        HyperbolicParaboloid.scale.x = 1 / Math.pow(slideEvt.value, 2);
        render();
    }
});

$("#yScale").slider();
$("#yScale").on('slide', function(slideEvt) {
    $("#yScaleVal").text(slideEvt.value);
    if(slideEvt.value != 0){
        HyperbolicParaboloid.scale.y = 1 / Math.pow(slideEvt.value, 2);
        render();
    }
});

//Global variables for THREE environment
var camera, scene, renderer, controls;
var PLANE, HyperbolicParaboloid;
var menu_toggle = $("#menu-toggle"), onOffCounter = 0, planeOnOff = 0, planeOnOffButton = $('#planeOnOff');
var passPos = [0];




//Initial function called, passing animate
init(animate);




function init(onSuccess){
    var threejs = document.getElementById('threejs');

    //Creates THREE environment
    scene = new THREE.Scene();

    //Creates camera and sets position in the THREE environment, this allow use to view the THREE enviroment
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000);
    camera.position.set(0, -400, 100);
    camera.lookAt(scene.position);

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    HyperbolicParaboloid = makeHyperbolicParaboloid();
    //HyperbolicParaboloid.position.x = 20;
    HyperbolicParaboloid.id = 'HyperbolicParaboloid';
    scene.add(HyperbolicParaboloid);

    //var EllipticParaboloid = makeEllipticParaboloid();
    //EllipticParaboloid.position.x = -20;
    //scene.add(EllipticParaboloid);

    //Creates renderer for THREE environment, sets the size of the renderer, and appends the renderer to html document
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Assigns the 'resize' eventListener to call the onWindowResize function whenever the window's size has changed
    window.addEventListener('resize', onWindowResize, false);


    //After all components have been created and added to the THREE enviroment, render the THREE environment
    render();

    //Called when init has completed
    onSuccess();
}



function makePlane(){
    var geo = new THREE.PlaneGeometry(100, 100, 50);
    var mat = new THREE.MeshNormalMaterial({ side:THREE.DoubleSide });

    var plane = new THREE.Mesh(geo, mat);
    plane.doubleSided = true;

    return plane;

}



function makeHyperbolicParaboloid(){
    var x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(a, 2) - Math.pow(b, 2);
        return result;
    };
    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;

    return graphMesh;
}



function makeEllipticParaboloid(){
    var x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 20;
    var zFunc = function(a, b){
        var result = Math.pow(a, 2) + Math.pow(b, 2);
        return result;
    };
    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;

    return graphMesh;
}



function degInRad(deg) {
    return deg * Math.PI / 180;
}




planeOnOffButton.click(function() {
    if(planeOnOff % 2 == 1){
        scene.remove(PLANE);
        render();
        planeOnOffButton[0].innerHTML = 'Turn Plane On';
    }
    else if(planeOnOff % 2 == 0){
        PLANE = makePlane();
        scene.add(PLANE);
        render()
        planeOnOffButton[0].innerHTML = 'Turn Plane Off';
    }
    planeOnOff++;
});




menu_toggle.click(function() {
    if(onOffCounter % 2 == 0){
        menu_toggle[0].innerHTML = 'Open';//change label of button when clicked
    }
    else{
        menu_toggle[0].innerHTML = 'Close';
    }

    onOffCounter++;
});


function onWindowResize(){
    //Update camera.aspect to the new window size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //Update renderer.setSize to the new window size
    renderer.setSize(window.innerWidth, window.innerHeight);
}



var i = 0;
function animate(){
    //Called every frame
    requestAnimationFrame(animate);

    //PLANE.position.z += -1;

    //Update the controls for the camera
    controls.update();

    //Renders the THREE environment
    render();
}




function render(){
    //Renders the THREE environment
    renderer.render(scene, camera);
}