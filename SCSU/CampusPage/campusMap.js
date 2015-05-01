//THREE.JS Globals
var camera, scene, renderer, controls, campusMap;


createThreeEnviroment();

function createThreeEnviroment(){
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');

    //Creating a scene
    scene = new THREE.Scene();

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

    campusMap = makeCampusMap();
    scene.add(campusMap);

    window.addEventListener('resize', onWindowResize, false);

    render();
    animate();
}


function makeCampusMap(){
    var img = THREE.ImageUtils.loadTexture('map_Main13.jpg', THREE.UVMapping, render);
    var geometry = new THREE.PlaneGeometry(700, 1421, 100, 100);
    var material = new THREE.MeshBasicMaterial({
        map: img
    });
    var map = new THREE.Mesh(geometry, material);

    return map;
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