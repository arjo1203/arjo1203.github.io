//Global variables for THREE environment
var camera, scene, renderer, controls, PLANE, GRAPH;




//Initial function called, passing animate
init(animate);




function init(onSuccess){
    var threejs = document.getElementById('threejs');

    //Creates THREE environment
    scene = new THREE.Scene();

    //Creates camera and sets position in the THREE environment, this allow use to view the THREE enviroment
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(0, -400, 100);
    camera.lookAt(scene.position);

    //Creates renderer for THREE environment, sets the size of the renderer, and appends the renderer to html document
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    GRAPH = makeHyperbolicParaboloid();
    scene.add(GRAPH);

    //Assigns the 'resize' eventListener to call the onWindowResize function whenever the window's size has changed
    window.addEventListener('resize', onWindowResize, false);

    //After all components have been created and added to the THREE enviroment, render the THREE environment
    render();

    //Called when init has completed
    onSuccess();
}




function makePlane(){
    var geo = new THREE.PlaneGeometry(100, 100, 50);
    var mat = new THREE.MeshNormalMaterial({ side:THREE.DoubleSide });

    var plane = new THREE.Mesh(geo, mat);
    plane.doubleSided = true;

    return plane;

}




function makeHyperbolicParaboloid(){
    var x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(a, 2) - Math.pow(b, 2);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;

    return graphMesh;
}




function makeEllipticParaboloid(){
    var x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 20;
    var zFunc = function(a, b){
        var result = Math.pow(a, 2) + Math.pow(b, 2);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;

    return graphMesh;
}




function makeCone(){
    var cone = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    cone.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2), .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    cone.add(graphMesh2);

    return cone;
}




function makeHyperboloid1(){
    var hyperboloid = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2) - 1, .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x, y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    hyperboloid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2) - 1, .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    hyperboloid.add(graphMesh2);

    return hyperboloid;
}




function makeHyperboloid2(){
    var hyperboloid = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + 1, .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x, y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    hyperboloid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + 1, .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    hyperboloid.add(graphMesh2);

    return hyperboloid;
}




function makeEllipsoid(){
    var ellipsoid = new THREE.Object3D(), x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(-Math.pow(a, 2) - Math.pow(b, 2), .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x, y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    ellipsoid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(-Math.pow(a, 2) - Math.pow(b, 2), .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y); //= Math.cos(x) * Math.sqrt(y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    ellipsoid.add(graphMesh2);

    return ellipsoid;
}




function degInRad(deg) {
    return deg * Math.PI / 180;
}




function onWindowResize(){
    //Update camera.aspect to the new window size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //Update renderer.setSize to the new window size
    renderer.setSize(window.innerWidth, window.innerHeight);
}



var animateaGARPH = false;
function animate(){
    //animateaGARPH = flag || false;
    //console.log(animateaGARPH);
    var rand1 = 4, rand2 = 4;

    //Called every frame
    requestAnimationFrame(animate);

    //Update the controls for the camera
    controls.update();

    if(animateaGARPH){
        GRAPH.scale.x += (1 / Math.pow(rand1, 2));
        GRAPH.scale.y += (1 / Math.pow(rand1, 2));
    }

    //Renders the THREE environment
    render();
}




function render(){
    //Renders the THREE environment
    renderer.render(scene, camera);
}