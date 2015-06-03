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
    ZOOMOUT = false,
    ZOOMIN = false;





var proirx = {}, cameraUp = true;
proirx.x = 0;
proirx.y = 600;
proirx.z = 12000;

window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'mouseup', onMouseUp, false );
window.addEventListener('resize', onWindowResize, false);




flyBtn.click(function() {
    flyCamera = true;
    distancePercent = Math.round(((intersect.distance - 3000) / intersect.distance) * 100);
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


var intersect;
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
        intersect = intersects[0];
        turnOffLabel();

        currentPos.x = camera.position.x;
        currentPos.y = camera.position.y;
        currentPos.z = camera.position.z;
        endPos = intersect.point;
        console.log(intersect.point);
         
        var targetLabel = findLabel(intersect.point);
        labels[targetLabel].visible = true;
    }
}



function onMouseUp( event ){
    currentPos.x = camera.position.x;
    currentPos.y = camera.position.y;
    currentPos.z = camera.position.z;
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

function checkFn(int){
    if(int > 0){
        return false;
    }
    else{
        return true;
    }
}




function animate(){
    requestAnimationFrame( animate );
    var y, deltay;
    y = camera.position.y;
    deltay = proirx.y - y;

    cameraUp = checkFn(deltay);

    if(cameraUp !== true){
        if(camera.position.y <= 10){
            camera.position.y = 0;
            camera.position.x = proirx.x;
            camera.position.z = proirx.z;
        }

    }

    proirx.x = camera.position.x;
    proirx.y = camera.position.y;
    proirx.z = camera.position.z;

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

    controls.center.set(endPos.x, endPos.y, endPos.z);
    controls.update();

    camera.lookAt(endPos);
    if(labels.length > 0){
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
        targets.add($Buildings.WSB_ext.children[child]);
    }


    for(var child in $Buildings.ISELF_exterior.children){
        targets.add($Buildings.ISELF_exterior.children[child]);
    }


    scene.add(targets);
    loadLabels();
}



function loadLabels(){
    var ISELFLabel,//ISELF
        WSBLabel,//Robert H. Wick Science Building 
        EdLabel,//Education Building 
        ECCLabel,//Engineering and Computing Center 
        RiverviewLabel,//Riverview 
        ShoeLabel,//Shoemaker Hall 
        EastmanLabel,//Eastman Hall 
        HeadleyLabel,//Headley Hall 
        BrownLabel,//Brown Hall 
        MillerLabel,//James W. Miller Learning Resources Center 
        AdminLabel,//Administrative Services 
        CentennialLabel,//Centennial Hall  
        ArtLabel,//Performing Arts Center 
        AtwoodLabel,//Atwood Memorial Center 
        MitchellLabel,//Mitchell Hall 
        WhitneyLabel,//Whitney House 
        KiehleLabel,//Kiehle Visual Arts Center 
        LawrenceLabel,//Lawrence Hall 
        StewartLabel,//Stewart Hall 
        FiftyOneLabel,//51 Building 
        NBentonLabel,//Benton Hall North 
        BentonLabel,//Benton Hall 
        ErvinLabel,//Ervin House
        ShurburneLabel,//Sherburne Hall
        GarveyLabel,//Garvey Commons 
        HillLabel,//Hill Hall 
        CaseLabel,//Case Hall
        StearnsLabel,//Stearns Hall 
        HolesLabel,//Holes Hall
        NStateviewLabel,//Stateview Apartments North 
        SStateviewLabel,//Stateview Apartments South
        ParkingLable,//Parking Ramp
        StuffLabel,//Stateview Apartments South
        HockeyLabel;//Hockey Center

    ISELFLabel = createLabel('ISELF');
    ISELFLabel.position.set(1000, 1250, 1000);
    ISELFLabel.lookAt(camera.position);
    labels.push(ISELFLabel);
    
    WSBLabel = createLabel('WSB');
    WSBLabel.position.set(5200, 1250, 1300);
    WSBLabel.lookAt(camera.position);
    labels.push(WSBLabel);
    
    EdLabel = createLabel('Education');
    EdLabel.position.set(-4000, 1250, 1600);
    EdLabel.lookAt(camera.position);
    labels.push(EdLabel);
    
    ECCLabel = createLabel('ECC');
    ECCLabel.position.set(300, 1250, 5162);
    ECCLabel.lookAt(camera.position);
    labels.push(ECCLabel);
    
    RiverviewLabel = createLabel('Riverview');
    RiverviewLabel.position.set(9175, 1250, 775);
    RiverviewLabel.lookAt(camera.position);
    labels.push(RiverviewLabel);
    
    ShoeLabel = createLabel('Shoemaker');
    ShoeLabel.position.set(3000, 1250, 7545);
    ShoeLabel.lookAt(camera.position);
    labels.push(ShoeLabel);
    
    EastmanLabel = createLabel('Eastman');
    EastmanLabel.position.set(8600, 1250, 3150);
    EastmanLabel.lookAt(camera.position);
    labels.push(EastmanLabel);
    
    HeadleyLabel = createLabel('Headley');
    HeadleyLabel.position.set(550, 1250, -2050);
    HeadleyLabel.lookAt(camera.position);
    labels.push(HeadleyLabel);
    
    BrownLabel = createLabel('Brown');
    BrownLabel.position.set(5100, 1250, -1730);
    BrownLabel.lookAt(camera.position);
    labels.push(BrownLabel);
    
    MillerLabel = createLabel('Miller Center');
    MillerLabel.position.set(-5430, 1250, -7450);
    MillerLabel.lookAt(camera.position);
    labels.push(MillerLabel);
    
    AdminLabel = createLabel('Administrative');
    AdminLabel.position.set(-1740, 1250, -4770);
    AdminLabel.lookAt(camera.position);
    labels.push(AdminLabel);
    
    CentennialLabel = createLabel('Centennial');
    CentennialLabel.position.set(3000, 1250, -4800);
    CentennialLabel.lookAt(camera.position);
    labels.push(CentennialLabel);
    
    ArtLabel = createLabel('Art');
    ArtLabel.position.set(820, 1250, -7880);
    ArtLabel.lookAt(camera.position);
    labels.push(ArtLabel);
    
    AtwoodLabel = createLabel('Atwood');
    AtwoodLabel.position.set(5460, 1250, -8080);
    AtwoodLabel.lookAt(camera.position);
    labels.push(AtwoodLabel);
    
    MitchellLabel = createLabel('Mitchell');
    MitchellLabel.position.set(9014, 1250, -14370);
    MitchellLabel.lookAt(camera.position);
    labels.push(MitchellLabel);
    
    WhitneyLabel = createLabel('Whitney');
    WhitneyLabel.position.set(8730, 1250, -11000);
    WhitneyLabel.lookAt(camera.position);
    labels.push(WhitneyLabel);
    
    KiehleLabel = createLabel('Kiehle');
    KiehleLabel.position.set(10500, 1250, -10500);
    KiehleLabel.lookAt(camera.position);
    labels.push(KiehleLabel);
    
    LawrenceLabel = createLabel('Lawrence');
    LawrenceLabel.position.set(10465, 1250, -7770);
    LawrenceLabel.lookAt(camera.position);
    labels.push(LawrenceLabel);
    
    StewartLabel = createLabel('Stewart');
    StewartLabel.position.set(8930, 1250, -5105);
    StewartLabel.lookAt(camera.position);
    labels.push(StewartLabel);
    
    FiftyOneLabel = createLabel('51');
    FiftyOneLabel.position.set(11200, 1250, -3400);
    FiftyOneLabel.lookAt(camera.position);
    labels.push(FiftyOneLabel);
    
    NBentonLabel = createLabel('N. Benton');
    NBentonLabel.position.set(4430, 1250, -19230);
    NBentonLabel.lookAt(camera.position);
    labels.push(NBentonLabel);
    
    BentonLabel = createLabel('Benton');
    BentonLabel.position.set(4910, 1250, -16180);
    BentonLabel.lookAt(camera.position);
    labels.push(BentonLabel);
    
    ErvinLabel = createLabel('Ervin');
    ErvinLabel.position.set(6130, 1250, -17410);
    ErvinLabel.lookAt(camera.position);
    labels.push(ErvinLabel);
    
    ShurburneLabel = createLabel('Sherburne');
    ShurburneLabel.position.set(2800, 1800, -13845);
    ShurburneLabel.lookAt(camera.position);
    labels.push(ShurburneLabel);
    
    GarveyLabel = createLabel('Garvey');
    GarveyLabel.position.set(5490, 1250, -12180);
    GarveyLabel.lookAt(camera.position);
    labels.push(GarveyLabel);
    
    HillLabel = createLabel('Hill');
    HillLabel.position.set(1525, 1250, -11520);
    HillLabel.lookAt(camera.position);
    labels.push(HillLabel);
    
    CaseLabel = createLabel('Case');
    CaseLabel.position.set(-70, 1250, -13360);
    CaseLabel.lookAt(camera.position);
    labels.push(CaseLabel);
    
    StearnsLabel = createLabel('Stearns');
    StearnsLabel.position.set(1730, 1250, -15960);
    StearnsLabel.lookAt(camera.position);
    labels.push(StearnsLabel);
    
    HolesLabel = createLabel('Holes');
    HolesLabel.position.set(-50, 1250, -18130);
    HolesLabel.lookAt(camera.position);
    labels.push(HolesLabel);
    
    NStateviewLabel = createLabel('N. Stateview');
    NStateviewLabel.position.set(-4470, 1250, -19060);
    NStateviewLabel.lookAt(camera.position);
    labels.push(NStateviewLabel);
    
    SStateviewLabel = createLabel('S. Stateview');
    SStateviewLabel.position.set(-4360, 1250, -16145);
    SStateviewLabel.lookAt(camera.position);
    labels.push(SStateviewLabel);

    ParkingLabel = createLabel('Parking');
    ParkingLabel.position.set(-3200, 1250, -12960);
    ParkingLabel.lookAt(camera.position);
    labels.push(ParkingLabel);

    StuffLabel = createLabel('Stuff');
    StuffLabel.position.set(1740, 1250, 11350);
    StuffLabel.lookAt(camera.position);
    labels.push(StuffLabel);

    HockeyLabel = createLabel('Hockey Center');
    HockeyLabel.position.set(-3280, 1250, 20540);
    HockeyLabel.lookAt(camera.position);
    labels.push(HockeyLabel);

    render();
}



function turnOffLabel(){
    for(var i= 0; i < labels.length; i++){
        if(labels[i].visible == true){
             labels[i].visible = false;  
        }
    }
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
    label.name = message;
    label.visible = false;
    scene.add(label);
    
    return label;
}



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