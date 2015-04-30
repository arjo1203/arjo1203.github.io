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
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 1200, 3000);
    camera.lookAt(scene.position);

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('white',1);

    loadBuildings();
    //console.log($Buildings);

    window.addEventListener('resize', onWindowResize, false);

    render();
    animate();
}




function loadBuilding(model, material, modelName, visbility) {
    var loader = new THREE.OBJMTLLoader();



    loader.load(model, material, function (myobject) {

        SetVisibility(myobject, visbility);



        myobject.position.x = -1200;
        myobject.position.z = -1200;
        $Buildings[modelName] = myobject;

        scene.add(myobject);
        render();


    });



}function loadBuildings() {
    loadBuilding('ISELF_Floors/ISELF_1stfloor.obj', 'ISELF_Floors/ISELF_1stfloor.mtl', 'ISELF_1stfloor', true);
    loadBuilding('ISELF_Floors/ISELF_2ndfloor.obj', 'ISELF_Floors/ISELF_2ndfloor.mtl', 'ISELF_2ndfloor', true);
    loadBuilding('ISELF_Floors/ISELF_3rdfloor.obj', 'ISELF_Floors/ISELF_3rdfloor.mtl', 'ISELF_3rdfloor', true);
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



function animate(){

    requestAnimationFrame( animate );
    controls.update();

    //Renders the THREE environment
    render();
}



function render(){
    renderer.render(scene, camera);
}