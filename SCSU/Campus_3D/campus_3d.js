//*****EVENTLISTENERS & FUNCTIONS*****
var flyCamera = false,
    $Buildings = {},
    targets = new THREE.Object3D(),
    currentPos = new THREE.Vector3(0, 6000, 12000),
    endPos = new THREE.Vector3(0, 0, 0),
    distancePercent,
    percentage = 0,
    firstClick = true;


window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener('resize', onWindowResize, false);



function onMouseDown( event ) {
    event.preventDefault();

    if(firstClick == true){
        loadTargets();
        firstClick = false;
    }


    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( targets.children);

    if ( intersects.length > 0 ) {
        var intersect = intersects[0];

        currentPos.x = camera.position.x;
        currentPos.y = camera.position.y;
        currentPos.z = camera.position.z;
        endPos = intersect.point;

        distancePercent = Math.round(((intersect.distance - 3000) / intersect.distance) * 100);

        flyCamera = true;
    }
}



function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
//*****EVENTLISTENERS*****

//************************************************************************************************

//*******3D CAMPUS********
var camera,
    scene,
    renderer,
    controls,
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();



init();



function init(){
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');

    //Creating a scene
    scene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 2.5, 70000);
    pointlight1.position.set(15000, 35000, 15000);

    var pointlight2 = new THREE.PointLight(0xffffff, 2.5, 70000);
    pointlight2.position.set(-15000, 35000, -15000);

    scene.add(pointlight1);
    scene.add(pointlight2);

    //Creating camera, setting it's position, and then making it look at the scene position
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.set(0, 6000, 12000);
    camera.lookAt(endPos);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('white',1);


    loadScene();
    render();
    animate();
}




function animate(){
    requestAnimationFrame( animate );

    if(flyCamera){
        if(percentage < distancePercent){
            var nextPos = LERP(currentPos, endPos, percentage / 100);
            camera.position.set(nextPos.x, nextPos.y, nextPos.z);

            percentage += 1;
            render();
        }
        else{
            percentage = 0;
            flyCamera = false;
        }
    }

    controls.center.set(endPos.x, endPos.y, endPos.z);
    controls.update();

    camera.lookAt(endPos);

    //Renders the THREE environment
    render();
}



function render(){
    renderer.render(scene, camera);
}



function LERP(start, end, percent) {
    var finalPos = new THREE.Vector3(0, 0, 0), dX = end.x - start.x, dY = end.y - start.y, dZ = end.z - start.z;

    finalPos.x = start.x + percent * dX;
    finalPos.y = start.y + percent * dY;
    finalPos.z = start.z  + percent * dZ;

    return finalPos;
}



function loadTargets(){
    for(var child in $Buildings.Facade.children){
        targets.add($Buildings.Facade.children[child]);
    }


    for(var child in $Buildings.WSB_ext.children){
        targets.add($Buildings.WSB_ext.children[child]);
    }


    for(var child in $Buildings.ISELF_exterior.children){
        targets.add($Buildings.ISELF_exterior.children[child]);
    }


    scene.add(targets);
}




function loadObject(model, material, modelName, visbility) {
    var loader = new THREE.OBJMTLLoader();

    loader.load(model, material, function(myobject) {
        SetVisibility(myobject, visbility);

        myobject.name = modelName;
        $Buildings[modelName] = myobject;

        scene.add(myobject);
        render();
    });
}



function loadScene() {
    loadObject('campusBuildings/Terrain.obj', 'campusBuildings/Terrain.mtl', 'Terrain', true);
    loadObject('campusBuildings/Facade.obj', 'campusBuildings/Facade.mtl', 'Facade', true);
    loadObject('campusBuildings/ISELF_exterior.obj', 'campusBuildings/ISELF_exterior.mtl', 'ISELF_exterior', true);
    loadObject('campusBuildings/WSB_ext.obj', 'campusBuildings/WSB_ext.mtl', 'WSB_ext', true);
}


function SetVisibility(object, value) {
    // use this to set the visiblity of objects
    // in webgl, the model is a child of the object, and setting the visbility of the parent
    // doesn't autocamtically affect the visibility of the child.
    object.traverse(function (child) {

        child.visible = value;
    });

}
//*******3D CAMPUS********