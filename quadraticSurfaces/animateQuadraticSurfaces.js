//Global variables for THREE environment
var camera, scene, renderer, controls, light, light2, PLANE, GRAPH;




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

    light = new THREE.PointLight( 0xffffff, 1, 100);
    light.position.set( 0, -50, 0 );
    light.lookAt(scene.position);
    scene.add(light);

    light2 = new THREE.PointLight( 0xffffff, 1, 100);
    light2.position.set( 0, 50, 0 );
    light2.lookAt(scene.position);
    scene.add(light2);

    //Creates renderer for THREE environment, sets the size of the renderer, and appends the renderer to html document
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('white',1);

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    GRAPH = makeCone(0);
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



var hyperbolicArray = [ ];
function makeHyperbolicParaboloid(w){
    var paraoloid = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 60, zPre, zPre2;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + (b * w), .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y);
        //console.log(z);
        if( isNaN(z) ){
            return new THREE.Vector3(x, y, zPre);
        }
        else{
            return new THREE.Vector3(x, y, z);
            zPre = z;
        }
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );

    //for (var i = 0, l = graphGeometry.vertices.length; i < l; i++) {
    //    if(graphGeometry.vertices[i].z == 0){
    //        graphGeometry.vertices[i].z = 3;
    //        graphGeometry.faces[i].vertexColors = new THREE.Color("rgb(255, 0, 0)");
    //        //hyperbolicArray.push(graphGeometry.vertices[i].z);
    //    }
    //}


    //for(var i = 0; i < hyperbolicArray.length; i++){
    //    var max = hyperbolicArray[0];
    //    if(hyperbolicArray[0].x <= hyperbolicArray[i].x){
    //        max =
    //    }
    //}

    var wireMaterial = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(0, 255, 0)"),
        wireframe: true
    } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    paraoloid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + (b * w), .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y);
        if( isNaN(z) ){
            return new THREE.Vector3(x, y, zPre2);
        }
        else{
            return new THREE.Vector3(x, y, z);
            zPre2 = z;
        }
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(0, 255, 0)"),
        wireframe: true
    } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    paraoloid.add(graphMesh2);

    paraoloid.id = 'paraoloid';
    return paraoloid;
}




//function makeHyperbolicParaboloid(w){
//    var x, y, xMin = -10, yMin = -10, xRange = 20, yRange = 20, segments = 40;
//    var zFunc = function(a, b){
//        var result = Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(w, 2);
//
//        return result;
//    };
//
//    meshFunction = function(u, v)
//    {
//        x = xRange * u + xMin;
//        y = yRange * v + yMin;
//        var z = zFunc(x,y);
//
//        return new THREE.Vector3(x, y, z);
//    };
//
//    // true => sensible image tile repeat...
//    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
//    var wireMaterial = new THREE.MeshNormalMaterial( { side:THREE.DoubleSide } );
//    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
//    graphMesh.doubleSided = true;
//
//    return graphMesh;
//}




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




function makeCone(w){
    var cone = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 40;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + w, .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x,y);

        return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    cone.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + w, .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y);

        return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    cone.add(graphMesh2);
    cone.id = 'cone';

    return cone;
}




function makeHyperboloid1(w){
    var hyperboloid = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 60, zPre;
    var zFunc = function(a, b){
        //console.log(a, b, w);
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(w, 2), .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x, y);
        //console.log(z);
        //if ( isNaN(z) ) {
        //    return new THREE.Vector3(x, y, 1);
        //}
        //else{
        //    zPre = z;
            return new THREE.Vector3(x, y, z);
        //}

        //return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    hyperboloid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(w, 2), .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y);

        return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    hyperboloid.add(graphMesh2);
    hyperboloid.id = 'Hyperboloid1';

    return hyperboloid;
}




function makeHyperboloid2(w){
    console.log(w, Math.pow(w, 2));
    var hyperboloid = new THREE.Object3D(), x, y, xMin = -20, yMin = -20, xRange = 40, yRange = 40, segments = 60;
    var zFunc = function(a, b){
        var result = Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(w, 2), .5);
        return result;
    };

    meshFunction = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc(x, y);

        return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
    var wireMaterial = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    hyperboloid.add(graphMesh);

    var zFunc2 = function(a, b){
        var result = -Math.pow(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(w, 2), .5);
        return result;
    };

    meshFunction2 = function(u, v)
    {
        x = xRange * u + xMin;
        y = yRange * v + yMin;
        var z = zFunc2(x,y);

        return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry2 = new THREE.ParametricGeometry( meshFunction2, segments, segments, true );
    var wireMaterial2 = new THREE.MeshLambertMaterial( {
        side:THREE.DoubleSide,
        color: new THREE.Color("rgb(255, 0, 0)")
    } );
    var graphMesh2 = new THREE.Mesh( graphGeometry2, wireMaterial2 );
    graphMesh2.doubleSided = true;
    hyperboloid.add(graphMesh2);
    hyperboloid.id = 'Hyperboloid2';

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
        var z = zFunc(x, y);

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
        var z = zFunc2(x,y);

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
var countingState = 'UP', clock = 0;
var x = 0;
function animate(){
    //Called every frame
    requestAnimationFrame(animate);

    //Update the controls for the camera
    controls.update();

    var rand1 = 4, rand2 = 4;

    if(clock % 20 == 0){
        countingState = toggleState(countingState);
    }

    if(animateaGARPH){
        scene.remove(GRAPH);

        if(countingState == 'UP'){
            x += .2;
        }
        else if(countingState == 'DOWN'){
            x -= .2;
        }

        switch (GRAPH.id){
            case 'cone':
                GRAPH = makeCone(x * 10);
                break;
            case 'Hyperboloid1':
                GRAPH = makeHyperboloid1(x);
                break;
            case 'Hyperboloid2':
                GRAPH = makeHyperboloid2(x);
                break;
            case 'paraoloid':
                GRAPH = makeHyperbolicParaboloid(x);
                break;
        }
        scene.add(GRAPH);
    }
    else{
        x = 0;
    }

    //Renders the THREE environment
    render();

    clock++;
}



function toggleState(state){
    if(state == 'UP'){
        state = 'DOWN'
    }
    else{
        state = 'UP';
    }

    return state;
}




function render(){
    //Renders the THREE environment
    renderer.render(scene, camera);
}