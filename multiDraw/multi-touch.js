paper.install(window);

var paths = new Array();


startup();
            
function startup(){
    //PaperJS Installation
    paper.setup('canvas');
    paper.view.viewSize = [window.innerWidth, window.innerHeight];
    
    var soilMap = new Raster('img');
    soilMap.position = paper.view.center;
    console.log(paper.view);
    
    document.body.addEventListener('touchstart', touchStart, false);
    document.body.addEventListener('touchmove', touchmove, false);
    document.body.addEventListener('touchend', touchEnd, false);
}



//Array to store new paths
var paths = [];

function touchStart(ev){
    ev.preventDefault();
    var touches = ev.touches;

    //Create new path per touch
    var path = new Path();
    path.strokeColor = 'red';
    path.strokeWidth = 4;
    paths.push(path);
}


function touchmove(ev){  
    ev.preventDefault();
    var touches = ev.touches;

    //Prevents touch bubbling 
    if(touches.length == paths.length){
        for(var i = 0; i < touches.length; i++){
            var path = paths[i];
            var touch = touches[i];
            var x1, y1;
            x1 = touch.pageX;
            y1 = touch.pageY;
            path.add(new Point(x1, y1));
            paper.view.draw();  
        }
    } 
}


function touchEnd(ev){  
    ev.preventDefault(); 
    var touches = ev.touches

    //Empth paths array to start process over
    if(touches.length == 0){
        paths.splice(0, paths.length);
    }
}