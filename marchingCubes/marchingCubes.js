// standard global variables
var container, scene, camera, renderer, controls;

// custom global variables
var x = -50, graphSelection = 2;


init();
animate();

// FUNCTIONS
function init()
{
    //Getting existing canvas and setting it to threejs
    var threejs = document.getElementById('threejs');

    //Creating a scene
    scene = new THREE.Scene();

    var pointlight1 = new THREE.PointLight(0xffffff, 2.5, 70000);
    pointlight1.position.set(15000, 35000, 15000);

    scene.add(pointlight1);

    //Creating camera, setting it's position, and then making it look at the scene position
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.set(0, 100, 0);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    //Create renderer and linking it to threejs canvas
    renderer = new THREE.WebGLRenderer({canvas: threejs});
    renderer.setSize(window.innerWidth, window.innerHeight);

    var graph = graphFn(40, -20, 20, 3, 'Ellipsoid');
    graph.name = 'graph';
    scene.add(graph);

    renderer.setClearColor('white',1);

    render();
}


function getValue(x, y, z, w, equ){
    var value;
    switch(equ){
        case '1':
            value = x*x + y*y + z*z + w*w;
            break;
        case '2':
            value = x*x + y*y + z*z - w*w;
            break;
        case '3':
            value = x*x + y*y - z + w*w;
            break;
        case '4':
            value = x*x + y*y - z*z - w*w;
            break;
        case '5':
            value = x*x - y*y + z*z + w*w;
            break;
        case '6':
            value = x*x - y*y + z*z - w*w;
            break;
        case '7':
            value = x*x - y*y - z*z + w*w;
            break;
        case '8':
            value = x*x - y*y - z*z - w*w;
            break;
        case '9':
            value = - x*x + y*y + z*z + w*w;
            break;
        case '10':
            value = - x*x + y*y + z*z - w*w;
            break;
        case '11':
            value = - x*x + y*y - z*z + w*w;
            break;
        case '12':
            value = - x*x + y*y - z*z - w*w;
            break;
        case '13':
            value = - x*x - y*y + z*z + w*w;
            break;
        case '14':
            value = - x*x - y*y + z*z - w*w;
            break;
        case '15':
            value = - x*x - y*y - z*z + w*w;
            break;
        case '16':
            value = - x*x - y*y - z*z - w*w;
            break;
        case 'HyperbolicParaboloid':
            value = x*x - y*y + z + w*w;
            break;
        case 'EllipticParaboloid':
            value = x*x + y*y + z + w*w;
            break;
        case 'Hyperboloid1':
            value = x*x + y*y - z*z - w*w;
            break;
        case 'Hyperboloid2':
            value = x*x + y*y - z*z + w*w;
            break;
        case 'Ellipsoid':
            value = x*x + y*y + z*z - w*w;
            break;
    }

    return value;
}



function graphFn(resolution, minNum, maxNum, w, equ){
    var points = [];
    var values = [];

    // number of cubes along a side
    size = resolution;

    var axisMin = minNum;
    var axisMax =  maxNum;
    var axisRange = axisMax - axisMin;

    // Generate a list of 3D points and values at those points
    for (var k = 0; k < size; k++)
        for (var j = 0; j < size; j++)
            for (var i = 0; i < size; i++)
            {
                // actual values
                var x = axisMin + axisRange * i / size;
                var y = axisMin + axisRange * j / size;
                var z = axisMin + axisRange * k / size;
                points.push( new THREE.Vector3(x,y,z) );
                var value = getValue(x, y, z, w, equ);

                values.push( value );
            }

    // Marching Cubes Algorithm

    var size2 = size * size;

    // Vertices may occur along edges of cube, when the values at the edge's endpoints
    //   straddle the isolevel value.
    // Actual position along edge weighted according to function values.
    var vlist = new Array(12);

    var geometry = new THREE.Geometry();
    var vertexIndex = 0;

    for (var z = 0; z < size - 1; z++)
        for (var y = 0; y < size - 1; y++)
            for (var x = 0; x < size - 1; x++)
            {
                // index of base point, and also adjacent points on cube
                var p    = x + size * y + size2 * z,
                    px   = p   + 1,
                    py   = p   + size,
                    pxy  = py  + 1,
                    pz   = p   + size2,
                    pxz  = px  + size2,
                    pyz  = py  + size2,
                    pxyz = pxy + size2;

                // store scalar values corresponding to vertices
                var value0 = values[ p ],
                    value1 = values[ px ],
                    value2 = values[ py ],
                    value3 = values[ pxy ],
                    value4 = values[ pz ],
                    value5 = values[ pxz ],
                    value6 = values[ pyz ],
                    value7 = values[ pxyz ];

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
                    vlist[0] = points[p].clone().lerp( points[px], mu );
                }
                if ( bits & 2 ){
                    mu = ( isolevel - value1 ) / ( value3 - value1 );
                    vlist[1] = points[px].clone().lerp( points[pxy], mu );
                }
                if ( bits & 4 ){
                    mu = ( isolevel - value2 ) / ( value3 - value2 );
                    vlist[2] = points[py].clone().lerp( points[pxy], mu );
                }
                if ( bits & 8 ){
                    mu = ( isolevel - value0 ) / ( value2 - value0 );
                    vlist[3] = points[p].clone().lerp( points[py], mu );
                }
                // top of the cube
                if ( bits & 16 ){
                    mu = ( isolevel - value4 ) / ( value5 - value4 );
                    vlist[4] = points[pz].clone().lerp( points[pxz], mu );
                }
                if ( bits & 32 ){
                    mu = ( isolevel - value5 ) / ( value7 - value5 );
                    vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 64 ){
                    mu = ( isolevel - value6 ) / ( value7 - value6 );
                    vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 128 ){
                    mu = ( isolevel - value4 ) / ( value6 - value4 );
                    vlist[7] = points[pz].clone().lerp( points[pyz], mu );
                }
                // vertical lines of the cube
                if ( bits & 256 ){
                    mu = ( isolevel - value0 ) / ( value4 - value0 );
                    vlist[8] = points[p].clone().lerp( points[pz], mu );
                }
                if ( bits & 512 ){
                    mu = ( isolevel - value1 ) / ( value5 - value1 );
                    vlist[9] = points[px].clone().lerp( points[pxz], mu );
                }
                if ( bits & 1024 ){
                    mu = ( isolevel - value3 ) / ( value7 - value3 );
                    vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 2048 ){
                    mu = ( isolevel - value2 ) / ( value6 - value2 );
                    vlist[11] = points[py].clone().lerp( points[pyz], mu );
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

    var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    var mesh = new THREE.Mesh( geometry, colorMaterial );

    return mesh;
}



function animate(){
    requestAnimationFrame( animate );

    //for(var i = 0; i < scene.children.length; i++){
    //    if(scene.children[i].name == 'graph'){
    //        scene.remove(scene.children[i]);
    //        var selection = graphSelection.toString();
    //        var graph = graphFn(40, -20, 20, x, 'Ellipsoid');
    //        graph.name = 'graph';
    //        scene.add(graph);
    //    }
    //}
    //
    //if( x == 50){
    //    x = -50;
    //    graphSelection++;
    //    //console.log(graphSelection);
    //}
    //
    //x += .5;

    render();
    update();
}

function update()
{
    controls.update();
}

function render()
{
    renderer.render( scene, camera );
}
