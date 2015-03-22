//THREE.JS Globals
var camera, scene, renderer, controls, map, threeGUI;
var plane, groundWidth1, groundWidth2, groundLength1, groundLength2, bottomPlane, color = '#8A6707';
var heightData, _3dTerrain;




function createThreeEnviroment(){
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');

    //Creating a scene
    scene = new THREE.Scene();

    //Creating camera, setting it's position, and then making it look at the scene position
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 10000);
    camera.position.set(0,0, 1500);
    camera.lookAt(scene.position);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('white',1);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change', render);    

    render();
}




function setupThree(){
    window.addEventListener('resize', onWindowResize, false);

    var canvas = document.getElementById('paperjs');
    var Twidth, Wheight, Hwidth, Hheight;

    var img = new Image();
    img.src = paper.project.activeLayer.children[0].image.src;
    img.onload = function(){
        Twidth = this.width;
        Theight = this.height;

        var img = new Image();
        img.src = paper.project.activeLayer.children[1].image.src
        img.onload = function(){
            Hwidth = this.width;
            Hheight = this.height;

            _3dTerrain = create3dTerrain(Twidth, Theight, Hwidth, Hheight);
            var workSpace = viewWorkSpace();
            changeTerrainMap(workSpace);
            _3dTerrain.scale.z = .5;
            scene.add(_3dTerrain); 
            
            render();
            animate();
//            createThreeGUI(imgList);
        } 
    }
}





function create3dTerrain(terrainWidth, terrainHeight, imageWidth, imageHeight){
    var Terrain = new THREE.Object3D();

    var geometry = new THREE.PlaneGeometry(terrainWidth-1, terrainHeight-1, imageWidth - 1, imageHeight - 1);
    var mapofWork = viewWorkSpace();
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = heightData[i * 4];
    }

    var material = new THREE.MeshBasicMaterial({
        map: mapofWork
    });

    plane = new THREE.Mesh(geometry, material);
    Terrain.add(plane);

    var geometry1 = new THREE.PlaneGeometry(terrainWidth-1, 1, imageWidth - 1);
    for (var i = 0, l = geometry1.vertices.length; i < l; i++) {
        if(geometry1.vertices[i].y == .5){
            geometry1.vertices[i].y = heightData[i * 4];
        }
    }
    var mat1 = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.BackSide
    });

    groundWidth1 = new THREE.Mesh(geometry1,mat1);
    groundWidth1.rotation.x = (Math.PI / 180) * 90;
    groundWidth1.position.y = (terrainHeight/2)-.5;
    Terrain.add(groundWidth1);

    var geometry2 = new THREE.PlaneGeometry(terrainWidth-1, 1,imageWidth - 1);
    for (var j = 0, l = geometry2.vertices.length; j < l; j++) {
        if(geometry2.vertices[j].y == .5){
            geometry2.vertices[j].y = heightData[(j*4)+((imageHeight-1)*imageWidth*4)];
        }
    }
    var mat2 = new THREE.MeshBasicMaterial({
        color: color
    });

    groundWidth2 = new THREE.Mesh(geometry2,mat2);
    groundWidth2.rotation.x = (Math.PI / 180) * 90;
    groundWidth2.position.y = -(terrainHeight/2)+.5;
    Terrain.add(groundWidth2);

    var geometry3 = new THREE.PlaneGeometry(terrainHeight-1, 1, imageHeight - 1);
    for (var j = 0, l = geometry3.vertices.length; j < l; j++) {
        if(geometry3.vertices[j].y == .5){
            geometry3.vertices[j].y = heightData[j * 4 * imageWidth];
        }
    }
    var mat3 = new THREE.MeshBasicMaterial({
        color: color
    });

    groundLength1 = new THREE.Mesh(geometry3,mat3);
    groundLength1.rotation.x = (Math.PI / 180) * 90;
    groundLength1.rotation.y = (Math.PI / 180) * -90;
    groundLength1.position.x = -(terrainWidth/2) + .5;
    Terrain.add(groundLength1);

    var geometry4 = new THREE.PlaneGeometry(terrainHeight-1, 1, imageHeight - 1);
    for (var j = 0, l = geometry4.vertices.length; j < l; j++){
        if(geometry4.vertices[j].y == .5){
            geometry4.vertices[j].y = heightData[(j * imageWidth * 4)+(imageWidth * 4 - 3)];
        }
    }
    var mat4 = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.BackSide
    });

    groundLength2 = new THREE.Mesh(geometry4,mat4);
    groundLength2.rotation.x = (Math.PI / 180) * 90;
    groundLength2.rotation.y = (Math.PI / 180) * -90;
    groundLength2.position.x = (terrainWidth/2) - .5;
    Terrain.add(groundLength2);

    //Create a simple plane geometry to put under the Terrain object
    //Since it will be under the object we must render the backside
    var geometry5 = new THREE.PlaneGeometry(terrainWidth-1,terrainHeight-1);
    var material5 = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.BackSide
    });

    bottomPlane = new THREE.Mesh(geometry5, material5);
    bottomPlane.position.z = 0;
    Terrain.add(bottomPlane);

    return Terrain;
} 




function getImageData(onSuccess){
    var heightImg = new Image();
    heightImg.src = programData.mapInputTags.Height.files[0].name;
    heightImg.onload = function(){
        // create an empty canvas element
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        //Set canvas size is same as the picture
        canvas.width = this.width;
        canvas.height = this.height;

        // draw image into canvas element
        ctx.drawImage(this, 0, 0, this.width, this.height);

        // get imageData from canvas
        var imageData = ctx.getImageData(0, 0, this.width, this.height);
        heightData = imageData.data;

        onSuccess();
    }
}




//function createThreeGUI(imgList){
////    console.log('createThreeGUI');
//    var mapList = document.getElementById("mapOptions");
//    
//    for(var i = 0; i < imgList.length; i++){
//        var li = document.createElement("li");
//        
//        var link = document.createElement("a");
//        link.href = '#';
//        link.innerHTML = imgList[i];
//        link.onclick = function(){
//            changeTerrainMap(this.innerHTML);
//        }
//        
//        li.appendChild(link);
//        
//        mapList.appendChild(li);
//    }
//}





function changeTerrainMap(geoMap){
    var map = geoMap || 'change';
//                console.log(map);
    if(typeof map == 'string'){ 
        if(map == 'change'){
            _3dTerrainMapofWorkSpace()
        }
        else{
            var textureMap = THREE.ImageUtils.loadTexture(geoMap, THREE.UVMapping, render);
            _3dTerrain.children[0].material.map = textureMap;
        }
    }
    else{
        _3dTerrain.children[0].material.map = geoMap;   
    }

    render();
}





function viewWorkSpace(){
    var paperjs = document.getElementById("paperjs");
    var context = paperjs.getContext('2d');
    
    var w, h, sP, sX, sY, cP, cX, cY, dX, dY, s;
    var transX, transY;
    
    s = paper.view.zoom;
    
    var sP = paper.project.activeLayer.children[0].bounds.topLeft;
//    console.log(sP);
    sX = Math.round(sP.x);
    sY = Math.round(sP.y);
//    console.log(sX);
//    console.log(sY);
    
    var cP = paper.project.activeLayer.children[0].bounds.center;
//    console.log(cP);
    cX = Math.round(cP.x);
    cY = Math.round(cP.y);
    
    
    dX = Math.round(sX - cX);
    dY = Math.round(sY - cY);
    
    transX = Math.round(dX*s);
    transY = Math.round(dY*s);
    
    w = Math.round(1024*s);
    h = Math.round(512*s);
    
    var paperImageData = context.getImageData(cX+transX, cY+transY, w, h);
    var newData = new Uint8Array(paperImageData.data);
    
    var paperTexture = new THREE.DataTexture(newData, w, h, THREE.RGBAFormat);
    paperTexture.needsUpdate = true;

    return paperTexture;
}




function _3dTerrainMapofWorkSpace(){
    var workSpace = viewWorkSpace();
    _3dTerrain.children[0].material.map = workSpace;
    render();
}




function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();
}




function animate(){

    requestAnimationFrame( animate );
    controls.update();
}



function render(){
    renderer.render(scene, camera);
}