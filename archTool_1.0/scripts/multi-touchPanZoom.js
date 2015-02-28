var target = document.getElementById('paperjs');
var scale = 1;
startup();
            
function startup() {
    target.addEventListener('touchstart', touchStart, false);
    target.addEventListener('touchmove', touchmove, false);
    target.addEventListener('touchend', touchEnd, false);
    //PaperJS Installation
    paper.install(window);
    paper.setup('paperjs');
    var soilMap = new Raster('SoilType4.jpg');
    soilMap.position = paper.view.center;
    console.log(paper.view);
}



//Array to store new paths
var path;

function empty(){
    //use to draw lines
}


function touchStart(ev){
    //Create a new path w/ props controlled by GUI
    path = new Path();
    path.strokeColor = 'red';
    path.strokeWidth = 4;
}


function touchmove(ev) {  
    //adds segments to path
    var touches = ev.touches;
    var touch = touches[0];
    var pX, pY, s, cX, cY, dX, dY, transX, transY;
    cX = paper.view.center.x;
    cY = paper.view.center.y;
    s = paper.view.zoom;
    pX = touch.pageX;
    pY = touch.pageY;
    dX = pX - cX;
    dY = pY - cY;
    transX = dX/s;
    transY = dY/s;
    path.add(new Point(cX+transX, cY+transY));
}


function touchEnd(ev){
    //use to draw area and fill in color
}


interact(target).gesturable({
  onstart: function(event){
      project.activeLayer.lastChild.remove();
  },
  onmove: function(event){
            if(scale * (1 + event.ds) >= 1 && scale * (1 + event.ds) <= 5){
                scale = scale * (1 + event.ds);
                paper.view.zoom = scale;
                var x = (paper.project.activeLayer.position.x || 0) + event.dx;
                var y = (paper.project.activeLayer.position.y || 0) + event.dy;
                paper.project.activeLayer.position.x = x;
                paper.project.activeLayer.position.y = y;

                window.paper.view.draw();
            }
  },
  onend: function(event){
  }
});