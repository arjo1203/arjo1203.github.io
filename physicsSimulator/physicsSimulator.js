//Global variables for THREE environment
var camera, scene, renderer, controls;
var numParticles = 20, maxDis = 4000000, radius = 100000, numOfDomain = 1, timeMult = 10;
var particles = [];
var G = 6.67384 * Math.pow(10,-11);//6.67384 × 10-11 m3 kg-1 s-2 gravitional constant
var lastTime = new Date().getTime();




//Initial function called, passing animate
init(animate);




function init(onSuccess){
    //Creates THREE environment
    scene = new THREE.Scene();

    //Creates camera and sets position in the THREE environment, this allow use to view the THREE enviroment
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000);
    camera.position.z = 4000000;

    //Adds mouse/touch controls to the camera
    controls = new THREE.TrackballControls(camera);
    //Assigns the 'change' eventListener to render whenever you move the camera
    controls.addEventListener('change', render);

    //Creates the random particles for the THREE environment
    createParticles();

    //Creates renderer for THREE environment, sets the size of the renderer, and appends the renderer to html document
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Assigns the 'resize' eventListener to call the onWindowResize function whenever the window's size has changed
    window.addEventListener('resize', onWindowResize, false);

    //After all components have been created and added to the THREE enviroment, render the THREE environment
    render();

    //Called when init has completed
    onSuccess();
}




function createParticle(radius, mesh, force, volume, mass, acceleration, velocity){
    //In THREE.js any 3D object (the mesh) needs a geometry and material
    var geometry = new THREE.SphereGeometry(1,50,50);//Passing the dimensions of the sphere
    var material = new THREE.MeshNormalMaterial();//Personal favorite material

    var newParticle = {};
    
    //The new particle needs all of these properties so that the gravitional interaction is accurate and precise
    newParticle.radius = radius || 1;//Use the radius parameter or the default is 1
    newParticle.mesh = new THREE.Mesh(geometry, material);//Build the mesh, in this case a Sphere
    newParticle.volume = volume || 1;//Use the volume parameter or the default is 1
    newParticle.mass = mass || 1;//Use the mass parameter or the default is 1
    newParticle.force = force ||  new THREE.Vector3(0,0,0);//Use the force parameter or the default is "0" 3-dimensional vector 
    newParticle.acceleration = acceleration || new THREE.Vector3(0,0,0);//Use the accleration parameter or the default is "0" 3-dimensional vector 
    newParticle.velocity = velocity || new THREE.Vector3(0,0,0);//Use velocity parameter or the default is "0" 3-dimensional vector 

    //Have the createParticle function return the newly created particle
    return newParticle;
}




function createParticles(){
    //Creates n number of particles with random position, size, volume, mass
    //Then adds particle to THREE environment and to particles array
    for(var n = 0; n < numParticles; n++){
        var rand = Math.random();//Random number
        var scaleParticle = numOfDomain * rand;//Random number scaling the numOfDomain
        var particle = createParticle();//Create a particle

        //Sets random position
        particle.mesh.position.x = (Math.random() - 0.5) * maxDis;
        particle.mesh.position.y = (Math.random() - 0.5) * maxDis;
        particle.mesh.position.z = (Math.random() - 0.5) * maxDis;
        
        particle.mesh.geometry.dynamic = true;
        
        //Scales the particle with scaleParticle
        particle.mesh.scale.x = scaleParticle * radius;
        particle.mesh.scale.y = scaleParticle * radius;
        particle.mesh.scale.z = scaleParticle * radius;
        
        //Calculate the volume based on the scaled radius of the particle
        particle.volume = (4/3)*Math.PI*Math.pow(particle.mesh.scale.x, 3);
        
        //Sets the mass to equal the volume, density of the object is equal to 1
        particle.mass = particle.volume;

        //Add the newly created particle to the THREE enviroment
        scene.add(particle.mesh);

        //Add the newly created particle to the particles array
        particles[n] = particle;
    }
}




function calcForces(){
    //Temporary holders for force and acceleration
    var F, A;
    var threshold = .8;//Used to adjust the threshold for merging particles

    //For loop to compare all particle
    for(var i = 0; i < numParticles; i++){
        
        //Position and mass of the particles[i]
        var x1 = particles[i].mesh.position;
        var mass1 = particles[i].mass;

        //Temp variable to calculate total force on the particles[i]
        var F_sum = new THREE.Vector3(0,0,0);

        for(var j = 0; j < numParticles; j++){
            
            //This prevent comparing the same particle to itself 
            if(particles[i] != particles[j]){
                
                //Position and mass of the particles[j]
                var x2 = particles[j].mesh.position;
                var mass2 = particles[j].mass;

                //Distance between the two particles
                var d = Math.sqrt(Math.pow((x1.x-x2.x),2)+Math.pow((x1.y-x2.y),2)+Math.pow((x1.z-x2.z),2));

                //Calculate the force between the particle, but if the two particles are close enough the particles will merge
                if(d > (particles[i].mesh.scale.x + particles[j].mesh.scale.x) * threshold){
                    F = calcForce(mass1,mass2,d);//Calculates the force between the two particles

                    var Fx = F * ((x1.x-x2.x)/ Math.sqrt(d));//Force in the x direction
                    var Fy = F * ((x1.y-x2.y)/ Math.sqrt(d));//Force in the y direction
                    var Fz = F * ((x1.z-x2.z)/ Math.sqrt(d));//Force in the z direction

                    F_sum.x += Fx;//Determining the sum of all forces in the x direction
                    F_sum.y += Fy;//Determining the sum of all forces in the y direction
                    F_sum.z += Fz;//Determining the sum of all forces in the z direction
                }
                else{
                    //Modifies particles[i] so that it has both itself and particles[j] properties
                    merging(particles[i], particles[j]);

                    //Moves particles[j] far from all other particles
                    //Gives the illusion of merging
                    particles[j].mesh.position.x = (Math.random() - 0.5) * maxDis * 1000;
                    particles[j].mesh.position.y = (Math.random() - 0.5) * maxDis * 1000;
                    particles[j].mesh.position.z = (Math.random() - 0.5) * maxDis * 1000; 
                }

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




function merging(particle1, particle2){
    //If two particle are close enough, they should merge becoming one new particle
    //The new particle will have the porperties of the prior two particles
    var radius1Cubed, radius2Cubed, scaleRadius, massSum;

    //Getting the radius for both particle
    radius1Cubed = Math.pow(particle1.mesh.scale.x, 3);
    radius2Cubed = Math.pow(particle2.mesh.scale.x, 3);

    //Calculate the scale for the new particle
    scaleRadius = Math.pow(radius1Cubed + radius2Cubed, 1/3);

    //Add masses for the new particle
    particle1.mass =  particle1.mass + particle2.mass;
    
    //Scale the particle
    particle1.mesh.scale.x = scaleRadius;
    particle1.mesh.scale.y = scaleRadius;
    particle1.mesh.scale.z = scaleRadius;

    //Used momentum to calculate the velocity for the new particle
    particle1.velocity.x = (particle1.mass * particle1.velocity.x + particle2.mass * particle2.velocity.x) / (particle1.mass + particle2.mass);
    particle1.velocity.y = (particle1.mass * particle1.velocity.y + particle2.mass * particle2.velocity.y) / (particle1.mass + particle2.mass);
    particle1.velocity.z = (particle1.mass * particle1.velocity.z + particle2.mass * particle2.velocity.z) / (particle1.mass + particle2.mass);
}




function moveParticles(T){
    //T being the variable that modify time, faster or slower
    //Kinematic equation learned at the university
    T = T * timeMult;

    for(var i = 0; i < particles.length; i++){
        particles[i].velocity.x += particles[i].acceleration.x * T;
        particles[i].velocity.y += particles[i].acceleration.y * T;
        particles[i].velocity.z += particles[i].acceleration.z * T;

        particles[i].mesh.position.x += particles[i].velocity.x * T;
        particles[i].mesh.position.y += particles[i].velocity.y * T;
        particles[i].mesh.position.z += particles[i].velocity.z * T;
    }
}




function onWindowResize(){
    //Update camera.aspect to the new window size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //Update renderer.setSize to the new window size
    renderer.setSize(window.innerWidth, window.innerHeight);
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