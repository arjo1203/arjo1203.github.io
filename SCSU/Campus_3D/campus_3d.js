//*****EVENTLISTENERS & FUNCTIONS*****
var flyCamera = false,
    $Buildings = {},
    targets = new THREE.Object3D(),
    currentPos = new THREE.Vector3(0, 6000, 12000),
    endPos = new THREE.Vector3(0, 0, 0),
    distancePercent,
    percentage = 0,
    firstClick = true,
    start,
    deltaTime,
    firstHover = false;


window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'mousemove', onMouseMove, false );
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

    if ( intersects.length > 0 ){
        start = new Date().getTime();
        var intersect = intersects[0];

        currentPos.x = camera.position.x;
        currentPos.y = camera.position.y;
        currentPos.z = camera.position.z;
        endPos = intersect.point;

        distancePercent = Math.round(((intersect.distance - 3000) / intersect.distance) * 100);
        console.log(intersect.point);

        flyCamera = true;
    }
}



function onMouseMove( event ) {
    event.preventDefault();

    if(firstClick == true){
        loadTargets();
        firstClick = false;
    }


    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//    console.log(event.clientX);

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( targets.children),
        text;

    if ( intersects.length > 0 ){
        var intersect = intersects[0];
        console.log(intersect.object.name);
        if(intersect.object.name == 'ISELF'){
//            addLabel(intersect.object.name);
        }
    }
}



function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}



//addLabel();
// add 3D text
function addLabel(){
	var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
	var materialArray = [ materialFront, materialSide ];
	var textGeom = new THREE.TextGeometry( 'hellow world', 
	{
		size: 100, height: 4, curveSegments: 3,
        weight: "bold", style: "normal",
		bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
		material: 0, extrudeMaterial: 1
	});
	
	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial );
	
	textGeom.computeBoundingBox();
    textMesh.poisition.set(0,0,100);
	scene.add(textMesh)
}
//*****EVENTLISTENERS*****

//************************************************************************************************

//*******3D CAMPUS********
var camera,
    scene,
    renderer,
    controls,
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2(),
    labels = [];



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
        var dX = endPos.x - currentPos.x,
            dY = endPos.y - currentPos.y,
            dZ = endPos.z - currentPos.z,
            totDis = new THREE.Vector3(dX * (distancePercent/100), dY * (distancePercent/100), dZ * (distancePercent/100)),
            finalPos = new THREE.Vector3(),
            range = 0;

        finalPos.x = currentPos.x + totDis.x - range;
        finalPos.y = currentPos.y + totDis.y - range;
        finalPos.z = currentPos.z + totDis.z - range;

        deltaTime = (new Date().getTime()) - start;
        //console.log(deltaTime);
        //console.log(finalPos);

        if(percentage < distancePercent){
            //var nextPos = LERP(currentPos, endPos, percentage / 100);
            var nextPos = LERP(currentPos, endPos, percentage / 100);
            //console.log(nextPos);
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
    if(labels.length > 0){
//        plane.lookAt(camera.position);
        for(var i = 0; i < labels.length; i++){
            labels[i].lookAt(camera.position);
        }
    }

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




function calcAcceleration(force, mass){
    //Kinematic equation learned at the university
    var A_x = force.x/mass;
    var A_y = force.y/mass;
    var A_z = force.z/mass;

    var acceleration = new THREE.Vector3(A_x, A_y, A_z);

    return acceleration;
}




function loadTargets(){
    for(var child in $Buildings.Facade.children){
        targets.add($Buildings.Facade.children[child]);
    }


    for(var child in $Buildings.WSB_ext.children){
        $Buildings.WSB_ext.children[child].name = 'WSB';
        targets.add($Buildings.WSB_ext.children[child]);
    }


    for(var child in $Buildings.ISELF_exterior.children){
        $Buildings.ISELF_exterior.children[child].name = 'ISELF';
        targets.add($Buildings.ISELF_exterior.children[child]);
    }


    scene.add(targets);
    loadLabels();
}



function loadLabels(){
    var ISELF_Label, WSB_Label, Ed_Label, ECC_Label, RV_Label;
    
    ISELF_Label = createLabel('ISELF');
    ISELF_Label.position.set(1000, 1250, 1000);
    ISELF_Label.lookAt(camera.position);
    labels.push(ISELF_Label);
    scene.add(ISELF_Label);
    
    WSB_Label = createLabel('WSB');
    WSB_Label.position.set(5200, 1250, 1300);
    WSB_Label.lookAt(camera.position);
    labels.push(WSB_Label);
    scene.add(WSB_Label);
    
    Ed_Label = createLabel('Education');
    Ed_Label.position.set(-4000, 1250, 1600);
    Ed_Label.lookAt(camera.position);
    labels.push(Ed_Label);
    scene.add(Ed_Label);
    
    ECC_Label = createLabel('ECC');
    ECC_Label.position.set(300, 1250, 5162);
    ECC_Label.lookAt(camera.position);
    labels.push(ECC_Label);
    scene.add(ECC_Label);
    
    RV_Label = createLabel('River View');
    RV_Label.position.set(9175, 1250, 775);
    RV_Label.lookAt(camera.position);
    labels.push(RV_Label);
    scene.add(RV_Label);

    render();
    console.log(labels);
}



function createLabel(message){
    var geo, mat, label;
    var geo = new THREE.TextGeometry( message, {
            size: 300,
            height: 20,
            curveSegments: 10,
            font: 'helvetiker',
            bevelThickness: 30,
            bevelSize: 20
        });
    geo.computeBoundingBox();
    mat = new THREE.MeshBasicMaterial( { color: new THREE.Color( 0x1eb7d9 ), overdraw: 0.5 } );
    label = new THREE.Mesh(geo, mat);
    
    return label;
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


//Work on
var FMag = 0,
    cam = {};
cam.acceleration = new THREE.Vector3(0, 0, 0);
cam.velocity = new THREE.Vector3(0, 0, 0);
cam.position = new THREE.Vector3(0, 0, 0);
function SLERP(start, end, percentOfDis){
    var dX = end.x - start.x,
        dY = end.y - start.y,
        dZ = end.z - start.z,
        dis = Math.pow(Math.pow(dX, 2) + Math.pow(dY, 2) + Math.pow(dZ, 2), .5),
        dir,
        A;

    if(percentOfDis <= 50){
        FMag = -50000;
    }
    else{
        FMag = 50000;
    }

    //FMag = 3;

    dir = new THREE.Vector3((dX/dis) * FMag, (dY/dis) * FMag, (dZ/dis) * FMag);

    A = calcAcceleration(dir, 1);
    //console.log(dir);

    cam.acceleration = A;
    cam.velocity = new THREE.Vector3(0, 0, 0);
    cam.position = new THREE.Vector3(0, 0, 0);

    cam.velocity.x += cam.acceleration.x;
    cam.velocity.y += cam.acceleration.y;
    cam.velocity.z += cam.acceleration.z;

    ///Vector3.add(cam.velocity,cam.acceleration);

    cam.position.x = start.x + cam.velocity.x;
    cam.position.y = start.y + cam.velocity.y;
    cam.position.z = start.z + cam.velocity.z;

    console.log(cam);
    return cam.position;
}
//*******3D CAMPUS********