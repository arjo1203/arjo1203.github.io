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
    
    document.body.addEventListener('touchstart', function(e) {
        touchStart(e);
    }, false);
    //document.body.addEventListener('touchmove', function(e) {
    //    touchMove(e);
    //}, false);
    //document.body.addEventListener('touchend', function(e) {
    //    touchEnd(e);
    //}, false);
}



//Array to store new paths
var paths = [];
var currentTouches = [];

function touchStart(ev){
    console.log(ev);
    ev.preventDefault();
    //var touches = ev.changedTouches;
    //
    //for(var i = 0; i < touches.length; i++) {
    //    var touch = touches[i];
    //
    //    currentTouches.push({
    //        id: touch.identifier,
    //        pageX: touch.pageX,
    //        pageY: touch.pageY,
    //        color: '#3F3F3F',
    //        path: new Path()
    //    });
    //
    //
    //    //Create new path per touch
    //    //var path = new Path();
    //    currentTouches[i].path.strokeColor = 'red';
    //    currentTouches[i].path.strokeWidth = i * 4;
    //    //paths.push(path);
    //}
    //
    //console.log(touches);

}


function touchMove(ev){
    console.log(ev);
    ev.preventDefault();
    var touches = ev.changedTouches;

    //Prevents touch bubbling 
    //if(touches.length == paths.length){
    //    for(var i = 0; i < touches.length; i++){
    //        var path = paths[i];
    //        var touch = touches[i];
    //        var x1, y1;
    //        x1 = touch.pageX;
    //        y1 = touch.pageY;
    //        path.add(new Point(x1, y1));
    //        paper.view.draw();
    //    }
    //}

    for(var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

        if(currentTouchIndex >= 0) {
            var currentTouch = currentTouches[currentTouchIndex];
            currentTouch.path.add(new Point({x: currentTouch.pageX, y: currentTouch.pageY}));

            // Update the touch record.
            currentTouch.pageX = touch.pageX;
            currentTouch.pageY = touch.pageY;
            // Store the record.
            currentTouches.splice(currentTouchIndex, 1, currentTouch);
        }
        else {
            console.log('Touch not found!');
        }
    }
}


function touchEnd(ev){  
    ev.preventDefault(); 
    var touches = ev.touches;

    ////Empth paths array to start process over
    //if(touches.length == 0){
    //    paths.splice(0, paths.length);
    //}
}


// Finds the array index of a touch in the currentTouches array.
var findCurrentTouchIndex = function (id) {
    for (var i=0; i < currentTouches.length; i++) {
        if (currentTouches[i].id === id) {
            return i;
        }
    }

    // Touch not found! Return -1.
    return -1;
};