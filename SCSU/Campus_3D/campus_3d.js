//*****EVENTLISTENERS & FUNCTIONS*****
var flyCamera = false,
    $Buildings = {},
    targets = new THREE.Object3D(),
    currentPos = new THREE.Vector3(0, 6000, 12000),
    endPos = new THREE.Vector3(0, 0, 0),
    distancePercent,
    percentage = 0,
    firstClick = true,
    flyBtn = $('#flyBtn'),
    zoomIn = $('#zoomIn'),
    zoomOut = $('#zoomOut'),
    all = $('#all'),
    ZOOMOUT = false,
    ZOOMIN = false,
    intersect;





var proirPos = {}, cameraUp = true;
proirPos.x = 0;
proirPos.y = 600;
proirPos.z = 12000;

window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'mouseup', onMouseUp, false );
window.addEventListener('resize', onWindowResize, false);




flyBtn.click(function() {
    flyCamera = true;
    distancePercent = Math.round(((intersect.distance - 5000) / intersect.distance) * 100);
});



zoomIn.click(function(evt) {
    evt.stopPropagation();
    distancePercent = 30;
    ZOOMIN = true;
});



zoomOut.click(function(evt) {
    evt.stopPropagation();
    distancePercent = 30;
    ZOOMOUT = true;
});


var activeLabel;
all.click(function(evt) {
    evt.stopPropagation();

    if(all[0].innerHTML == 'Show'){
        activeLabel = findActiveLabel();

        showLabels();

        all[0].innerHTML= 'Hide';
    }
    else{
        hideLabels(activeLabel);

        all[0].innerHTML= 'Show';
    }
});



function findActiveLabel(){
    var activeIndex;
    for(var i = 0; i < labels.length; i++){
        if(labels[i].visible == true){
            activeIndex = i;
        }
    }

    return activeIndex;
}




function showLabels(){
    for(var i = 0; i < labels.length; i++){
        labels[i].visible = true;
    }
}




function hideLabels(activeIndex){
    for(var i = 0; i < labels.length; i++){
        if(i !== activeIndex){
            labels[i].visible = false;
        }
    }
}




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
        //Intersected object
        intersect = intersects[0];

        //targetLabel is the closest label to the interested object
        var targetLabel = findLabel(intersect.point);

        //activeLabel keeps track of the label that is on
        activeLabel = targetLabel;

        //Turn activeLabel label on
        //Turn off all other labels beside the activeLabel one
        labels[activeLabel].visible = true;
        hideLabels(activeLabel);

        //Due to this intersection all labels will be reset
        //so reset the button as well
        all[0].innerHTML= 'Show';

        //Store the camera's position
        currentPos.x = camera.position.x;
        currentPos.y = camera.position.y;
        currentPos.z = camera.position.z;

        //Store the closest label's position from activeLabel
        endPos.x = labels[activeLabel].position.x;
        endPos.y = labels[activeLabel].position.y;
        endPos.z = labels[activeLabel].position.z;
    }
}


//When controls are used set the currentPos to the camera's position
//When the user has finished using the controls
function onMouseUp(){
    currentPos.x = camera.position.x;
    currentPos.y = camera.position.y;
    currentPos.z = camera.position.z;
}



//Finds the closest label to a point in space
//By figuring out the label with the shortest
//Distance from the point in space
function findLabel(point){
    var dis, minDis, dX, dY, dZ, index = 0;
    for(var i = 0; i < labels.length; i ++){
        dX = labels[i].position.x - point.x;
        dY = labels[i].position.y - point.y;
        dZ = labels[i].position.z - point.z;
        dis = Math.pow((Math.pow(dX, 2) + Math.pow(dY, 2) + Math.pow(dZ, 2)), .5);
        if(i == 0){
            minDis = dis;
            index = 0;
        }

        if(minDis > dis){
            minDis = dis;
            index = i;
        }
    }

    return index;
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
    mouse = new THREE.Vector2(),
    labels = [ ];




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

    //Prevents user from going under the scene
        var y, deltay;

        y = camera.position.y;
        deltay = proirPos.y - y;

        cameraUp = checkFn(deltay);

        if(cameraUp !== true){
            if(camera.position.y <= 10){
                camera.position.y = 0;
                camera.position.x = proirPos.x;
                camera.position.z = proirPos.z;
            }

        }

        proirPos.x = camera.position.x;
        proirPos.y = camera.position.y;
        proirPos.z = camera.position.z;
    //Prevents from going under the scene

    if(flyCamera){
        if(percentage < distancePercent){
            var nextPos = LERP(currentPos, endPos, percentage / 100, true);

            camera.position.set(nextPos.x, nextPos.y, nextPos.z);

            percentage += 1;
            render();
        }
        else{
            percentage = 0;
            flyCamera = false;
            currentPos.x = camera.position.x;
            currentPos.y = camera.position.y;
            currentPos.z = camera.position.z;
        }
    }

    if(ZOOMIN){
        if(percentage < distancePercent){
            var nextPos = LERP(currentPos, endPos, percentage / 100, true);

            camera.position.set(nextPos.x, nextPos.y, nextPos.z);

            percentage += 1;
            render();
        }
        else{
            percentage = 0;
            ZOOMIN = false;
            currentPos.x = camera.position.x;
            currentPos.y = camera.position.y;
            currentPos.z = camera.position.z;
        }
    }


    if(ZOOMOUT){
        if(percentage < distancePercent){
            var nextPos = LERP(currentPos, endPos, percentage / 100, false);

            camera.position.set(nextPos.x, nextPos.y, nextPos.z);

            percentage += 1;
            render();
        }
        else{
            percentage = 0;
            ZOOMOUT = false;
            currentPos.x = camera.position.x;
            currentPos.y = camera.position.y;
            currentPos.z = camera.position.z;
        }
    }

    //Makes camera look at the building that was hit
    camera.lookAt(endPos);

    //Makes labels follow the camera
    if(labels.length > 0){
        for(var i = 0; i < labels.length; i++){
            labels[i].lookAt(camera.position);
        }
    }

    //Resets the controls center and updates changes
    controls.center.set(endPos.x, endPos.y, endPos.z);
    controls.update();

    //Renders the THREE environment
    render();
}



//Renders the scene
function render(){
    renderer.render(scene, camera);
}



//Used to determing if the camera is moving up or down
function checkFn(int){
    if(int > 0){
        return false;
    }
    else{
        return true;
    }
}



//Linear Interpolation
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



//Adds all building assets to an array format versus an object format
//so that the raycaster can recognize the buildings
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



//Adds the label on top of the buildings
function loadLabels(){
    var buildingInfo = labelData();

    for(var i = 0; i < buildingInfo.length; i++){
        var label = createLabel(buildingInfo[i][0]);
        label.position.set(buildingInfo[i][1].x, buildingInfo[i][1].y, buildingInfo[i][1].z);
        label.lookAt(camera.position);
        labels.push(label);
    }

    render();
}



//Hard coded info
function labelData(){
    var info = [
        ['ISELF', new THREE.Vector3(1000, 1250, 1000)],
        ['WSB', new THREE.Vector3(5200, 1250, 1300)],
        ['Education', new THREE.Vector3(-4000, 1250, 1600)],
        ['ECC', new THREE.Vector3(300, 1250, 5162)],
        ['Riverview', new THREE.Vector3(9175, 1250, 775)],
        ['Shoemaker', new THREE.Vector3(3000, 1250, 7545)],
        ['Eastman', new THREE.Vector3(8600, 1250, 3150)],
        ['Headley', new THREE.Vector3(550, 1250, -2050)],
        ['Brown', new THREE.Vector3(5100, 1250, -1730)],
        ['Miller', new THREE.Vector3(-5430, 1250, -7450)],
        ['Admin', new THREE.Vector3(-1740, 1250, -4770)],
        ['Centennial', new THREE.Vector3(3000, 1250, -4800)],
        ['Art', new THREE.Vector3(820, 1250, -7880)],
        ['Atwood', new THREE.Vector3(5460, 1250, -8080)],
        ['Mitchell', new THREE.Vector3(9014, 1250, -14370)],
        ['Whitney', new THREE.Vector3(8730, 1250, -11000)],
        ['Kiehle', new THREE.Vector3(10500, 1250, -10500)],
        ['Lawrence', new THREE.Vector3(10465, 1250, -7770)],
        ['Stewart', new THREE.Vector3(8930, 1250, -5105)],
        ['51', new THREE.Vector3(11200, 1250, -3400)],
        ['NBenton', new THREE.Vector3(4430, 1250, -19230)],
        ['Benton', new THREE.Vector3(4910, 1250, -16180)],
        ['Ervin', new THREE.Vector3(6130, 1250, -17410)],
        ['Sherburne', new THREE.Vector3(2800, 1800, -13845)],
        ['Garvey', new THREE.Vector3(5490, 1250, -12180)],
        ['Hill', new THREE.Vector3(1525, 1250, -11520)],
        ['Case', new THREE.Vector3(-70, 1250, -13360)],
        ['Stearns', new THREE.Vector3(1730, 1250, -15960)],
        ['Holes', new THREE.Vector3(-50, 1250, -18130)],
        ['N. Stateview', new THREE.Vector3(-4470, 1250, -19060)],
        ['S. Stateview', new THREE.Vector3(-4360, 1250, -16145)],
        ['Parking', new THREE.Vector3(-3200, 1250, -12960)],
        ['Stuff', new THREE.Vector3(1740, 1250, 11350)],
        ['Hockey Center', new THREE.Vector3(-3280, 1250, 20540)]
    ];

    return info;
}



//Creates 3d text
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
    label.name = message;
    label.visible = false;
    scene.add(label);
    
    return label;
}



//Loader fn for the building and terrain
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



//Creates the scene objects
function loadScene() {
    loadObject('campusBuildings/Terrain.obj', 'campusBuildings/Terrain.mtl', 'Terrain', true);
    loadObject('campusBuildings/Facade.obj', 'campusBuildings/Facade.mtl', 'Facade', true);
    loadObject('campusBuildings/ISELF_exterior.obj', 'campusBuildings/ISELF_exterior.mtl', 'ISELF_exterior', true);
    loadObject('campusBuildings/WSB_ext.obj', 'campusBuildings/WSB_ext.mtl', 'WSB_ext', true);

    loadLabels();
}



//Changes the visible property of an object
function SetVisibility(object, value){
    object.traverse(function (child) {
        child.visible = value;
    });

}
//*******3D CAMPUS********