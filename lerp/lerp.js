var camera, scene, renderer, controls, SPHERES, MOVE = false, moveButton = $('#move');


init();

function init(){
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');

    //Creating a scene
    scene = new THREE.Scene();

    //Creating camera, setting it's position, and then making it look at the scene position
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(500, 0, 0);
    //camera.lookAt(scene.position);

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    var pointlight1 = new THREE.PointLight(0xffffff, 2.5, 70000);
    pointlight1.position.set(15000, 35000, 15000);

    var pointlight2 = new THREE.PointLight(0xffffff, 2.5, 70000);
    pointlight2.position.set(-15000, 35000, -15000);

    scene.add(pointlight1);
    scene.add(pointlight2);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('white',1);

    window.addEventListener('resize', onWindowResize, false);

    SPHERES = makeSpheres();
    console.log(SPHERES);
    scene.add(SPHERES);
    moveCamera();

    render();
    animate();
}




function makeSpheres(){
    var spheres = new THREE.Object3D(),
        sphere1,
        sphere2,
        material,
        geometry,
        geometry2;

    material = new THREE.MeshNormalMaterial();
    geometry = new THREE.SphereGeometry(50, 100, 100);
    geometry2 = new THREE.BoxGeometry(100, 100, 100);

    sphere1 = new THREE.Mesh(geometry, material);
    sphere1.position.x = -500;
    sphere2 = new THREE.Mesh(geometry2, material);
    sphere2.position.x = 500;

    spheres.add(sphere1);
    spheres.add(sphere2);

    return spheres;
}





function animate(){
    //Called every frame
    requestAnimationFrame(animate);

    //Update the controls for the camera
    controls.update();

    //Renders the THREE environment
    render();
}



function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}



function render(){
    renderer.render(scene, camera);
}



function moveCamera(){
    var initial = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
        final = new THREE.Vector3(SPHERES.children[0].position.x, SPHERES.children[0].position.y, SPHERES.children[0].position.z);
    console.log(initial, final);
    render();
}



function LERP(start, end, percent, forward) {
    var finalPos = new THREE.Vector3(0, 0, 0), dX = end.x - start.x, dY = end.y - start.y, dZ = end.z - start.z;

    if(forward){
        finalPos.x = start.x + percent * dX;
        finalPos.y = start.y + percent * dY;
        finalPos.z = start.z + percent * dZ;
    }
    else{
        finalPos.x = start.x - percent * dX;
        finalPos.y = start.y - percent * dY;
        finalPos.z = start.z - percent * dZ;
    }

    return finalPos;
}




moveButton.click(function(){
    percentage = 0;
    MOVE = true;
});