var container, scene, camera, renderer, controls;
var numOfShape = 0, shapes = [], sideBarWidth = 350;
var R12Btn = $('#R12Button'), R12Animation = false, R12Interval,
    R13Btn = $('#R13Button'), R13Animation = false, R13Interval,
    R14Btn = $('#R14Button'), R14Animation = false, R14Interval,
    R23Btn = $('#R23Button'), R23Animation = false, R23Interval,
    R24Btn = $('#R24Button'), R24Animation = false, R24Interval,
    R34Btn = $('#R34Button'), R34Animation = false, R34Interval,
    wBtn = $('#wButton'), wAnimation = false, wInterval;

var A = [ [1, 0, 0, 0] , [0, 1, 0, 0] , [0, 0, -1, 0] , [0, 0, 0, 1] ];


init();
animate();


function init()
{
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');
    threejs.style.width = (window.innerWidth - sideBarWidth).toString() + 'px';

    //Creating a scene
    scene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight1.position.set(0, 35000, 0);

    var pointlight2 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight2.position.set(0, -35000, 0);

    scene.add(pointlight1);
    scene.add(pointlight2);

    var pointlight3 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight3.position.set(0, 0, 35000);

    var pointlight4 = new THREE.PointLight(0xffffff, 1, 70000);
    pointlight4.position.set(0, 0, -35000);

    scene.add(pointlight3);
    scene.add(pointlight4);

    //Creating camera, setting it's position, and then making it look at the scene position
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 100, 0);
    camera.lookAt(scene.position);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth - sideBarWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, threejs);
    controls.addEventListener('change', render);

    renderer.setClearColor('white', 1);

    window.addEventListener('resize', onWindowResize, false);

    var shape = graph4To3Graph(40, min, max, 0, 0, 0, 0, 0, 0,0);
    shape.name = 'graph';
    scene.add(shape);
    //shapes.push(shape);

    render();
}



function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth - sideBarWidth, window.innerHeight);
}



function graph4To3Graph(resolution, axisMin, axisMax, w, theta12, theta13, theta14, theta23, theta24, theta34){
    var points = [];
    var values = [];

    var axisRange = axisMax - axisMin;

    var U = passAngleToU(theta12, theta13, theta14, theta23, theta24, theta34),
        UTrans = numeric.transpose(U);

    // Generate a list of 3D points and values at those points
    for (var k = 0; k < resolution; k++)
        for (var j = 0; j < resolution; j++)
            for (var i = 0; i < resolution; i++)
            {
                // actual values
                var x = axisMin + axisRange * i / resolution;
                var y = axisMin + axisRange * j / resolution;
                var z = axisMin + axisRange * k / resolution;
                points.push( new THREE.Vector3(x,y,z) );

                var X = [ [x], [y], [z], [w]],
                    XTrans = numeric.transpose(X);

                var first = numeric.dot(XTrans, U),
                    second = numeric.dot(UTrans, X);

                var firstDone = numeric.dot(first, A),
                    secondDone = numeric.dot(firstDone, second);

                var value = secondDone[0];

                values.push( value );
            }


    var geometry = marchingCubes(points, values, resolution);
    var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    var graph = new THREE.Mesh( geometry, colorMaterial );

    return graph;
}




function marchingCubes(arrayOfPoints, arrayOfValues, resolution){
    // Marching Cubes Algorithm

    var resolution2 = Math.pow(resolution, 2);

    // Vertices may occur along edges of cube, when the values at the edge's endpoints
    //   straddle the isolevel value.
    // Actual position along edge weighted according to function values.
    var vlist = new Array(12);

    var geometry = new THREE.Geometry();
    var vertexIndex = 0;

    for (var z = 0; z < resolution - 1; z++)
        for (var y = 0; y < resolution - 1; y++)
            for (var x = 0; x < resolution - 1; x++)
            {
                // index of base point, and also adjacent points on cube
                var p    = x + resolution * y + resolution2 * z,
                    px   = p   + 1,
                    py   = p   + resolution,
                    pxy  = py  + 1,
                    pz   = p   + resolution2,
                    pxz  = px  + resolution2,
                    pyz  = py  + resolution2,
                    pxyz = pxy + resolution2;

                // store scalar values corresponding to vertices
                var value0 = arrayOfValues[ p ],
                    value1 = arrayOfValues[ px ],
                    value2 = arrayOfValues[ py ],
                    value3 = arrayOfValues[ pxy ],
                    value4 = arrayOfValues[ pz ],
                    value5 = arrayOfValues[ pxz ],
                    value6 = arrayOfValues[ pyz ],
                    value7 = arrayOfValues[ pxyz ];

                // place a "1" in bit positions corresponding to vertices whose
                //   isovalue is less than given constant.

                var isolevel = 0;

                var cubeindex = 0;
                if ( value0 < isolevel ) cubeindex |= 1;
                if ( value1 < isolevel ) cubeindex |= 2;
                if ( value2 < isolevel ) cubeindex |= 8;
                if ( value3 < isolevel ) cubeindex |= 4;
                if ( value4 < isolevel ) cubeindex |= 16;
                if ( value5 < isolevel ) cubeindex |= 32;
                if ( value6 < isolevel ) cubeindex |= 128;
                if ( value7 < isolevel ) cubeindex |= 64;

                // bits = 12 bit number, indicates which edges are crossed by the isosurface
                var bits = THREE.edgeTable[ cubeindex ];

                // if none are crossed, proceed to next iteration
                if ( bits === 0 ) continue;

                // check which edges are crossed, and estimate the point location
                //    using a weighted average of scalar values at edge endpoints.
                // store the vertex in an array for use later.
                var mu = 0.5;

                // bottom of the cube
                if ( bits & 1 ){
                    mu = ( isolevel - value0 ) / ( value1 - value0 );
                    vlist[0] = arrayOfPoints[p].clone().lerp( arrayOfPoints[px], mu );
                }
                if ( bits & 2 ){
                    mu = ( isolevel - value1 ) / ( value3 - value1 );
                    vlist[1] = arrayOfPoints[px].clone().lerp( arrayOfPoints[pxy], mu );
                }
                if ( bits & 4 ){
                    mu = ( isolevel - value2 ) / ( value3 - value2 );
                    vlist[2] = arrayOfPoints[py].clone().lerp( arrayOfPoints[pxy], mu );
                }
                if ( bits & 8 ){
                    mu = ( isolevel - value0 ) / ( value2 - value0 );
                    vlist[3] = arrayOfPoints[p].clone().lerp( arrayOfPoints[py], mu );
                }
                // top of the cube
                if ( bits & 16 ){
                    mu = ( isolevel - value4 ) / ( value5 - value4 );
                    vlist[4] = arrayOfPoints[pz].clone().lerp( arrayOfPoints[pxz], mu );
                }
                if ( bits & 32 ){
                    mu = ( isolevel - value5 ) / ( value7 - value5 );
                    vlist[5] = arrayOfPoints[pxz].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 64 ){
                    mu = ( isolevel - value6 ) / ( value7 - value6 );
                    vlist[6] = arrayOfPoints[pyz].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 128 ){
                    mu = ( isolevel - value4 ) / ( value6 - value4 );
                    vlist[7] = arrayOfPoints[pz].clone().lerp( arrayOfPoints[pyz], mu );
                }
                // vertical lines of the cube
                if ( bits & 256 ){
                    mu = ( isolevel - value0 ) / ( value4 - value0 );
                    vlist[8] = arrayOfPoints[p].clone().lerp( arrayOfPoints[pz], mu );
                }
                if ( bits & 512 ){
                    mu = ( isolevel - value1 ) / ( value5 - value1 );
                    vlist[9] = arrayOfPoints[px].clone().lerp( arrayOfPoints[pxz], mu );
                }
                if ( bits & 1024 ){
                    mu = ( isolevel - value3 ) / ( value7 - value3 );
                    vlist[10] = arrayOfPoints[pxy].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 2048 ){
                    mu = ( isolevel - value2 ) / ( value6 - value2 );
                    vlist[11] = arrayOfPoints[py].clone().lerp( arrayOfPoints[pyz], mu );
                }

                // construct triangles -- get correct vertices from triTable.
                var i = 0;
                cubeindex <<= 4;  // multiply by 16...
                // "Re-purpose cubeindex into an offset into triTable."
                //  since each row really isn't a row.

                // the while loop should run at most 5 times,
                //   since the 16th entry in each row is a -1.
                while ( THREE.triTable[ cubeindex + i ] != -1 )
                {
                    var index1 = THREE.triTable[cubeindex + i];
                    var index2 = THREE.triTable[cubeindex + i + 1];
                    var index3 = THREE.triTable[cubeindex + i + 2];

                    geometry.vertices.push( vlist[index1].clone() );
                    geometry.vertices.push( vlist[index2].clone() );
                    geometry.vertices.push( vlist[index3].clone() );

                    var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
                    geometry.faces.push( face );

                    geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

                    vertexIndex += 3;
                    i += 3;
                }
            }

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}



function remove4To3Graph() {
    for (var i = 0; i < scene.children.length; i++) {
        if (scene.children[i].name == 'graph') {
            scene.remove(scene.children[i]);
        }
    }
}



function animate(){
    requestAnimationFrame( animate );

    animateSlidersByFrame();

    update();
    render();
}

function update() {
    camera.lookAt(0, 0, 0);

    controls.center.set(0, 0, 0);
    controls.update();
}

function render()
{
    renderer.render( scene, camera );
}



function animateSlidersByFrame(){
    if(R12Animation){
        animateSliderById(R12, 'R12', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(R13Animation){
        animateSliderById(R13, 'R13', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(R14Animation){
        animateSliderById(R14, 'R14', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(R23Animation){
        animateSliderById(R23, 'R23', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(R24Animation){
        animateSliderById(R24, 'R24', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(R34Animation){
        animateSliderById(R34, 'R34', 0, 360, 1);
        makeNew4To3Graph();
    }

    if(wAnimation){
        animateSliderById(w, 'w', -50, 50, .5);
        makeNew4To3Graph();
    }
}


function animateSliderById(slider, sliderId, min, max, step){
    var nextValue;

    if(sliderValues[sliderId] == max){
        nextValue = min;
    }
    else{
        nextValue = sliderValues[sliderId] + step;
    }

    slider.setValue(nextValue, true);

    sliderValues[sliderId] = nextValue;
}