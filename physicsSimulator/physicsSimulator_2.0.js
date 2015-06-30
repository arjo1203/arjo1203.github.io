//Global variables for THREE environment
var camera, scene, renderer, controls, min = -10, max = 10, axisRange = max - min;
var numParticles = 20, radius = 5, numOfDomain = 1, timeMult = 10;
var particles = [];
var G = 6.67384 * Math.pow(10,-11);//6.67384 × 10-11 m3 kg-1 s-2 gravitional constant
var lastTime = new Date().getTime();
var numParticles = 4;
var values = [];
var points = [], maxDis = 10;
var lastTime = new Date().getTime();
var mesh;
var size1  = 100;
var size12 = size1*size1;
var size13 = size1*size1*size1;




//Initial function called, passing animate
init(animate);




function init(onSuccess){
    //Creates THREE environment
    scene = new THREE.Scene();

    //Creates camera and sets position in the THREE environment, this allow use to view the THREE enviroment
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000);
    camera.position.z = 20;

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    //Creates renderer for THREE environment, sets the size of the renderer, and appends the renderer to html document
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Assigns the 'resize' eventListener to call the onWindowResize function whenever the window's size has changed
    window.addEventListener('resize', onWindowResize, false);

    // generate the list of 3D points
    for (var k = 0; k < size1; k++)
        for (var j = 0; j < size1; j++)
            for (var i = 0; i < size1; i++)
            {
                var x = min + axisRange * i / (size1 - 1);
                var y = min + axisRange * j / (size1 - 1);
                var z = min + axisRange * k / (size1 - 1);
                points.push( new THREE.Vector3(x,y,z) );
            }


    // initialize values
    for (var i = 0; i < size13; i++)
        values[i] = 0;

    createParticles();

    var geometry = marchingCubes( points, values, .5);

    var colorMaterial =  new THREE.MeshNormalMaterial( {side:THREE.DoubleSide} );
    mesh = new THREE.Mesh( geometry, colorMaterial );
    scene.add(mesh);

    //After all components have been created and added to the THREE enviroment, render the THREE environment
    render();

    //Called when init has completed
    onSuccess();
}




function createParticle(scale,radius, force, volume, mass, acceleration, velocity, position){
    var newParticle = {};

    //The new particle needs all of these properties so that the gravitional interaction is accurate and precise
    newParticle.scale = scale || new THREE.Vector3(1,1,1);;//Use the radius parameter or the default is 1
    newParticle.radius = radius || 1;//Use the radius parameter or the default is 1
    newParticle.volume = volume || 1;//Use the volume parameter or the default is 1
    newParticle.mass = mass || 1;//Use the mass parameter or the default is 1
    newParticle.force = force ||  new THREE.Vector3(0,0,0);//Use the force parameter or the default is "0" 3-dimensional vector
    newParticle.acceleration = acceleration || new THREE.Vector3(0,0,0);//Use the accleration parameter or the default is "0" 3-dimensional vector
    newParticle.velocity = velocity || new THREE.Vector3(0,0,0);//Use velocity parameter or the default is "0" 3-dimensional vector
    newParticle.position = position || new THREE.Vector3(0,0,0);//Use velocity parameter or the default is "0" 3-dimensional vector

    //Have the createParticle function return the newly created particle
    return newParticle;
}




function createParticles(){
    //Creates n number of particles with random position, size, volume, mass
    //Then adds particle to THREE environment and to particles array
    for(var n = 0; n < numParticles; n++){
        var rand = Math.random();//Random number
        var scaleParticle = numOfDomain;//Random number scaling the numOfDomain
        //var scaleParticle = numOfDomain * rand;//Random number scaling the numOfDomain
        var particle = createParticle();//Create a particle

        //Sets random position
        particle.position.x = (Math.random() - 0.5) * maxDis;
        particle.position.y = (Math.random() - 0.5) * maxDis;
        particle.position.z = (Math.random() - 0.5) * maxDis;

        //Scales the particle with scaleParticle
        particle.scale.x = scaleParticle * radius;
        particle.scale.y = scaleParticle * radius;
        particle.scale.z = scaleParticle * radius;

        //Calculate the volume based on the scaled radius of the particle
        particle.volume = (4/3)*Math.PI*Math.pow(particle.scale.x, 3);

        //Sets the mass to equal the volume, density of the object is equal to 1
        particle.mass = particle.volume;

        //Add the newly created particle to the THREE enviroment
        scene.add(particle.mesh);

        //Add the newly created particle to the particles array
        particles[n] = particle;

        addBall( points, values, new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z) );
    }
}




function calcForces(){
    //Temporary holders for force and acceleration
    var F, A;
    var threshold = .8;//Used to adjust the threshold for merging particles

    //For loop to compare all particle
    for(var i = 0; i < numParticles; i++){

        //Position and mass of the particles[i]
        var x1 = particles[i].position;
        var mass1 = particles[i].mass;

        //Temp variable to calculate total force on the particles[i]
        var F_sum = new THREE.Vector3(0,0,0);

        for(var j = 0; j < numParticles; j++){

            //This prevent comparing the same particle to itself
            if(particles[i] != particles[j]){

                //Position and mass of the particles[j]
                var x2 = particles[j].position;
                var mass2 = particles[j].mass;

                //Distance between the two particles
                var d = Math.sqrt(Math.pow((x1.x-x2.x),2)+Math.pow((x1.y-x2.y),2)+Math.pow((x1.z-x2.z),2));

                F = calcForce(mass1,mass2,d);//Calculates the force between the two particles

                var Fx = F * ((x1.x-x2.x)/ Math.sqrt(d));//Force in the x direction
                var Fy = F * ((x1.y-x2.y)/ Math.sqrt(d));//Force in the y direction
                var Fz = F * ((x1.z-x2.z)/ Math.sqrt(d));//Force in the z direction

                F_sum.x += Fx;//Determining the sum of all forces in the x direction
                F_sum.y += Fy;//Determining the sum of all forces in the y direction
                F_sum.z += Fz;//Determining the sum of all forces in the z direction

            }//if

            //Sets particles[i].force property
            particles[i].force = F_sum;

        }//for j

        //Sets particles[i].acceleration property
        particles[i].acceleration = calcAcceleration(particles[i].force, particles[i].mass);

    }//for i

}//calcForces




function calcForce(mass1, mass2, distance){
    //Kinematic equation learned at the university for calculating force
    var force = -G*((mass1*mass2)/Math.pow(distance, 2));

    return force;
}




function calcAcceleration(force, mass){
    //Kinematic equation learned at the university
    var A_x = force.x/mass;
    var A_y = force.y/mass;
    var A_z = force.z/mass;

    var acceleration = new THREE.Vector3(A_x, A_y, A_z);

    return acceleration;
}




function moveParticles(T){
    //T being the variable that modify time, faster or slower
    //Kinematic equation learned at the university
    T = T * timeMult;

    for (var i = 0; i < size13; i++)
        values[i] = 0;

    for(var i = 0; i < particles.length; i++){
        particles[i].velocity.x += particles[i].acceleration.x * T;
        particles[i].velocity.y += particles[i].acceleration.y * T;
        particles[i].velocity.z += particles[i].acceleration.z * T;

        particles[i].position.x += particles[i].velocity.x * T;
        particles[i].position.y += particles[i].velocity.y * T;
        particles[i].position.z += particles[i].velocity.z * T;
        //console.log(particles[i].position);
        addBall( points, values, new THREE.Vector3(particles[i].position.x, particles[i].position.y, particles[i].position.z) );
    }

    var geometry = marchingCubes( points, values, .5);

    var colorMaterial =  new THREE.MeshNormalMaterial( {side:THREE.DoubleSide} );
    mesh = new THREE.Mesh( geometry, colorMaterial );
    scene.add(mesh);
}




function addBall(points, values, center) {
    for (var i = 0; i < values.length; i++)
    {
        var OneMinusD2 = 1.0 - center.distanceToSquared( points[i] );
        values[i] += Math.exp( -(OneMinusD2 * OneMinusD2) );
    }
}



function animate(){
    //Called every frame
    requestAnimationFrame(animate);

    //Calculating the amount of time bewteen frames
    var time = (new Date()).getTime();
    var deltaTime = (time - lastTime);
    lastTime = time;

    //Makes sure that all cubes have been created before calculating calcSumVector and before moving cubes
    if(particles.length === numParticles){
        scene.remove(mesh);

        //Calculate the forces
        calcForces();

        //Then move the particles
        moveParticles(deltaTime);
    }

    //Update the controls for the camera
    controls.update();

    //Renders the THREE environment
    render();
}




function render(){
    //Renders the THREE environment
    renderer.render(scene, camera);
}



function onWindowResize(){
    //Update camera.aspect to the new window size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //Update renderer.setSize to the new window size
    renderer.setSize(window.innerWidth, window.innerHeight);
}




function marchingCubes( points, values, isolevel )
{
    // assumes the following global values have been defined:
    //   THREE.edgeTable, THREE.triTable

    var size = Math.round(Math.pow(values.length, 1/3));
    var size2 = size * size;
    var size3 = size * size * size;

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
                var value0 = values[ p    ],
                    value1 = values[ px   ],
                    value2 = values[ py   ],
                    value3 = values[ pxy  ],
                    value4 = values[ pz   ],
                    value5 = values[ pxz  ],
                    value6 = values[ pyz  ],
                    value7 = values[ pxyz ];

                // place a "1" in bit positions corresponding to vertices whose
                //   isovalue is less than given constant.

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
                if ( bits & 1 )
                {
                    mu = ( isolevel - value0 ) / ( value1 - value0 );
                    vlist[0] = points[p].clone().lerp( points[px], mu );
                }
                if ( bits & 2 )
                {
                    mu = ( isolevel - value1 ) / ( value3 - value1 );
                    vlist[1] = points[px].clone().lerp( points[pxy], mu );
                }
                if ( bits & 4 )
                {
                    mu = ( isolevel - value2 ) / ( value3 - value2 );
                    vlist[2] = points[py].clone().lerp( points[pxy], mu );
                }
                if ( bits & 8 )
                {
                    mu = ( isolevel - value0 ) / ( value2 - value0 );
                    vlist[3] = points[p].clone().lerp( points[py], mu );
                }
                // top of the cube
                if ( bits & 16 )
                {
                    mu = ( isolevel - value4 ) / ( value5 - value4 );
                    vlist[4] = points[pz].clone().lerp( points[pxz], mu );
                }
                if ( bits & 32 )
                {
                    mu = ( isolevel - value5 ) / ( value7 - value5 );
                    vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 64 )
                {
                    mu = ( isolevel - value6 ) / ( value7 - value6 );
                    vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 128 )
                {
                    mu = ( isolevel - value4 ) / ( value6 - value4 );
                    vlist[7] = points[pz].clone().lerp( points[pyz], mu );
                }
                // vertical lines of the cube
                if ( bits & 256 )
                {
                    mu = ( isolevel - value0 ) / ( value4 - value0 );
                    vlist[8] = points[p].clone().lerp( points[pz], mu );
                }
                if ( bits & 512 )
                {
                    mu = ( isolevel - value1 ) / ( value5 - value1 );
                    vlist[9] = points[px].clone().lerp( points[pxz], mu );
                }
                if ( bits & 1024 )
                {
                    mu = ( isolevel - value3 ) / ( value7 - value3 );
                    vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
                }
                if ( bits & 2048 )
                {
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

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}