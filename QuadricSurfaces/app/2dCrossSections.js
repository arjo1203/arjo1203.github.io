var twoScene, twoCamera, twoRenderer, twoControls;
var _2DGraph;



twoInit();
twoAnimate();


function twoInit(){
    //ToDo Find a way to detect whe all 3 scene have been created to animate to the view to the left
    L.click();

    //Creating a scene
    twoScene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight1.position.set(0, 35000, 0);

    var pointlight2 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight2.position.set(0, -35000, 0);

    twoScene.add(pointlight1);
    twoScene.add(pointlight2);

    var pointlight3 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight3.position.set(0, 0, 35000);

    var pointlight4 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight4.position.set(0, 0, -35000);

    twoScene.add(pointlight3);
    twoScene.add(pointlight4);

    //Creating camera, setting it's position, and then making it look at the scene position
    twoCamera = new THREE.PerspectiveCamera(45, leftView[0].clientWidth / (leftView[0].clientHeight *.5), twoDCameraOffset, twoDCameraOffset + .1);
    twoCamera.position.set(0, 0, twoDCameraOffset);
    threeScene.add(twoCamera);

    //Create renderer and linking it to threejs canvas
    twoRenderer = new THREE.WebGLRenderer({canvas: twoView[0]});
    twoRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight *.5);
    twoRenderer.setClearColor('white', 1);

    _2DGraph = graph3To2Graph(40, min, max, 0, 0, 0, 0);
    _2DGraph.name = '_2DGraph';
    twoScene.add(_2DGraph);

    twoRender();
}



function twoAnimate(){
    requestAnimationFrame( twoAnimate );

    if(view.animateView){
        onTwoResize();
    }

    //twoUpdate();
    twoRender();
}



function twoUpdate() {
    twoControls.update();
}




function twoRender() {
    twoRenderer.render( twoScene, twoCamera );
}




function getGraphPoints(){
    var points = [ ];

    for(var i = 0; i < _3to2shape.geometry.vertices.length; i++){
        if(_3to2shape.geometry.vertices[i].z == Math.round(sliderValues.zCross)){
           points.push(_3to2shape.geometry.vertices[i]);
        }
    }

    return points;
}




function graph2D(points){
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var geometry = new THREE.Geometry();

    for(var i = 0; i < points.length; i++){
        geometry.vertices.push(points[i]);
    }

    var line = new THREE.Line( geometry, material );

    return line;
}



function removeGraph(string) {
    for (var i = 0; i < twoScene.children.length; i++) {
        if (twoScene.children[i].name == string) {
            twoScene.remove(twoScene.children[i]);
        }
    }
}