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

    //if(MOVE){
    //    if(percentage < 100){
    //        var a = LERP(SPHERES.children[0].position, SPHERES.children[1].position, percentage / 100);
    //        camera.position.set(a.x, a.y, a.z);
    //        //console.log(camera.position);
    //    }
    //}

    //Update the controls for the camera
    controls.update();

    //Renders the THREE environment
    render();

    //percentage += .5;
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


var percentage = 0;
function moveCamera(){
    requestAnimationFrame(moveCamera);


    if(percentage < 100){
        var a = LERP(SPHERES.children[0].position, SPHERES.children[1].position, percentage / 100);
        camera.position.set(a.x, a.y, a.z);
        //console.log(camera.position);
    }

    percentage += .5;

    render();
}



function LERP2 (a,b) {
    var ret = new THREE.Vector3();
    var d = 0;

    while(d < 100){
        ret.x = a.x + (d/100) * b.x - a.x;
        ret.y = a.y + (d/100) * b.y - a.y;
        ret.z = a.z + (d/100) * b.z - a.z;
        //console.log(ret);
        camera.position.set(ret.x, ret.y, ret.z);
        render();

        d += .1;
    }
}



function LERP (a,b,p) {
    var ret = new THREE.Vector3();

    ret.x = a.x + p * b.x - a.x;
    ret.y = a.y + p * b.y - a.y;
    ret.z = a.z + p * b.z - a.z;

    //console.log(a, b, ret);
    return ret;
}




moveButton.click(function(){
    percentage = 0;
    MOVE = true;
});