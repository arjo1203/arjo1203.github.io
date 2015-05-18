//THREE.JS Globals
var camera, scene, renderer, controls;
var $Buildings = {};


createThreeEnviroment();

function createThreeEnviroment(){
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
    camera.position.set(0, 1200, 3000);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('white',1);

    loadScene();
    console.log($Buildings);

    window.addEventListener('resize', onWindowResize, false);

    render();
    animate();
}




function loadObject(model, material, modelName, visbility) {
    var loader = new THREE.OBJMTLLoader();



    loader.load(model, material, function (myobject) {

        SetVisibility(myobject, visbility);



        myobject.position.x = -1200;
        myobject.position.z = -1200;
        $Buildings[modelName] = myobject;

        scene.add(myobject);
        render();


    });



}function loadScene() {
    loadObject('campusBuildings/Terrain.obj', 'campusBuildings/Terrain.mtl', 'Terrain', true);
    loadObject('campusBuildings/Facade.obj', 'campusBuildings/Facade.mtl', 'Facade', true);
    loadObject('campusBuildings/ISELF_exterior.obj', 'campusBuildings/ISELF_exterior.mtl', 'ISLEF_exterior', true);
    loadObject('campusBuildings/WSB_ext.obj', 'campusBuildings/WSB_ext.mtl', 'Facade', true);
}


function SetVisibility(object, value) {
    // use this to set the visiblity of objects
    // in webgl, the model is a child of the object, and setting the visbility of the parent
    // doesn't autocamtically affect the visibility of the child.
    object.traverse(function (child) {

        child.visible = value;
    });

}



function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}


var i = 0;
var end = new THREE.Vector3(0, 0, 0);
moveCamera(camera, end);
function animate(){
    //
    //camera.position.x = currentPos.x;
    //camera.position.y = currentPos.y;
    //camera.position.z = currentPos.z;
    ////camera.position = lerp(start, end, i/5);
    //
    //if(camera.position.y <= 10){
    //    camera.position.y = 10;
    //}

    requestAnimationFrame( animate );
    controls.update();

    //Renders the THREE environment
    render();
    i++;
}


function moveCamera(mesh, end) {
    //console.log(a, b);
    //console.log('hello');
    var f = 0;

    while(f < 300){
        mesh.x = mesh.x + f * (end.x - mesh.x);
        mesh.x = mesh.x + f * (end.y - mesh.y);
        mesh.z = mesh.z + f * (end.z - mesh.z);

        f++;
    }
}



function render(){
    renderer.render(scene, camera);
}