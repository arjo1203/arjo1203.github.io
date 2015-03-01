paper.install(window);

var target = document.getElementById('canvas');
var img = document.getElementById('img');
var SCALE = 1, drawing;
var paths = new Array();

startup();
            
function startup(){
    //Install paper on 2d canvas
    paper.setup('canvas');
    paper.view.viewSize = [window.innerWidth, window.innerHeight];
    
    var soilMap = new Raster('img');
    soilMap.position = paper.view.center;
    console.log(paper.view);
    
    //Create Drawing Tool
    drawing = new Tool();
    drawing.onMouseDown = onMouseDown;
    drawing.onMouseDrag = onMouseDrag;
    drawing.onMouseUp = onMouseUp;
    drawing.minDistance = 5;
    drawing.maxDistance = 10;
}



//Array to store new paths
var path;


//Creats a path on Mouse Down and stores them in an array
function onMouseDown(event) {
//    console.log('start');
//    console.log(event);
    
    if(event.event.type == 'mousedown'){
//        console.log('MouseEvent');

        path = new Path();
        path.strokeColor = 'red';
        path.strokeWidth = 4;

    }
    else if(event.event.type == 'touchstart'){
//        console.log('TouchEvent');
        event.event.preventDefault();

        //adds segments to path
        var touches = event.event.touches;
        var touch = touches[0];
        var pX, pY, s, cX, cY, dX, dY, transX, transY;

        s = paper.view.zoom;

        cX = paper.view.center.x;
        cY = paper.view.center.y;

        if(touches.length == 1){
            pX = touch.pageX;
            pY = touch.pageY;

            dX = pX - cX;
            dY = pY - cY;

            transX = dX/s;
            transY = (dY-92)/s;


            path = new Path();
            path.strokeColor = 'red';
            path.strokeWidth = 4;
        }
        else{
//            console.log('panZoom');
        }
    }
}




//Makes the path created on Mouse Down with a thickness and fills the thickness with color
 function onMouseDrag(event){
//     console.log('moving');
//     console.log(event);
     
    path.add(event.point);
}




function onMouseUp(event){
//    console.log('up');
    path.simplify();
    paths.push(path);
}


interact(target).gesturable({
  onstart: function(event){
      drawing.off('mousedown', onMouseDown);
      drawing.off('mouseup', onMouseUp);
      drawing.off('mousedrag', onMouseDrag);
  },
  onmove: function(event){
            if(SCALE * (1 + event.ds) >= 1 && SCALE * (1 + event.ds) <= 5){
                SCALE = SCALE * (1 + event.ds);
                paper.view.zoom = SCALE;
                var x = (paper.project.activeLayer.position.x || 0) + event.dx;
                var y = (paper.project.activeLayer.position.y || 0) + event.dy;
//                console.log(paper.project);
                
                for(var i = 0; i < paper.project.layers.length; i++){
                    paper.project.layers[i].position.x = x;
                    paper.project.layers[i].position.y = y;
                    paper.view.draw();
                }
            }
  },
  onend: function(event){
      drawing.on('mousedown', onMouseDown);
      drawing.on('mousedrag', onMouseDrag);
      drawing.on('mouseup', onMouseUp);
  }
});