//Install paper on the window to use javascript
paper.install(window);
//Sets up the screen graph on the canvas
paper.setup('myCanvas');

(function(){
    //Resize the canvas to the size of the window
    var canvas = $('#myCanvas')[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Create arrays to store touches and paths
    var currentTouches = [];

    //Use the HTML5 Canvas API to track the touches
    //Use paper to draw the paths

    var paperDrawTool = new Tool();
    paperDrawTool.onMouseDown = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mousedown') {
            //Create a new path for the trackedTouch
            var path = new Path({
                strokeColor: 'green',
                strokeWidth: 10,
                strokeCap: 'round',
                data: {
                    touchId: 0
                }
            });
        }

        if(paperEvent.event.type == 'touchstart') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                var currentIndex = findTrackedTouch(touch.identifier);
                if(currentIndex == -1) {

                    //Track the newly created touch
                    var trackedTouch = {
                        id: touch.identifier,
                        pageX: touch.pageX,
                        pageY: touch.pageY
                    };

                    //Store the trackedTouch
                    currentTouches.push(trackedTouch);

                    //Create a new path for the trackedTouch
                    var path = new Path({
                        strokeColor: 'green',
                        strokeWidth: 10,
                        strokeCap: 'round',
                        data: {
                            touchId: touch.identifier
                        }
                    });
                }
            }
        }
    };
    paperDrawTool.onMouseDrag = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mousemove') {
            var currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.add(paperEvent.point);
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                var currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];

                    //Creates a paper point based on the currentTouch position.
                    var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.add(point);
                    //currentItem.smooth();

                    // Update the trackedTouch record.
                    currentTouch.pageX = touch.pageX;
                    currentTouch.pageY = touch.pageY;

                    // Store the record of the trackedTouch.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };
    paperDrawTool.onMouseUp = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mouseup') {
            var currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.smooth();
                currentItem.simplify();
                currentItem.data = {};
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                var currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);

                    //Finds the path associated with the currentTouchIndex
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];
                    currentItem.smooth();
                    currentItem.simplify();
                    currentItem.data = {};
                    //console.log(currentItem);
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };
    paperDrawTool.minDistance = 0;
    paperDrawTool.maxDistance = 2;


    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 2
    };

    var paperMoveTool = new Tool();
    paperMoveTool.onMouseDown = function(paperEvent) {
        console.log(paperEvent.event.type);
        paperEvent.preventDefault();
        var touches = paperEvent.event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];

            var currentIndex = findTrackedTouch(touch.identifier);
            if(currentIndex == -1) {

                //Track the newly created touch
                var trackedTouch = {
                    id: touch.identifier,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };

                //Store the trackedTouch
                currentTouches.push(trackedTouch);

                var point = new Point({x: touch.pageX, y: touch.pageY});
                var hitResult = project.hitTest(point, hitOptions);
                if (hitResult) {
                    var hitItem = hitResult.item;
                    hitItem.data = {
                        touchId: touch.identifier
                    };
                    console.log(hitItem);
                }
                else {
                    return ;
                }
            }
        }
    };
    paperMoveTool.onMouseDrag = function(paperEvent) {
        console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        var touches = paperEvent.event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);
            var currentItemIndex = findItemInPaper(touch.identifier);

            if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                var currentTouch = currentTouches[currentTouchIndex];
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                console.log(currentItem);

                //Creates a paper point based on the currentTouch position.
                var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                currentItem.position = point;

                // Update the trackedTouch record.
                currentTouch.pageX = touch.pageX;
                currentTouch.pageY = touch.pageY;

                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);
            } else {
                console.log('Touch was not found!');
            }

        }

        paper.view.draw();
    };
    paperMoveTool.onMouseUp = function(paperEvent) {
        console.log(paperEvent.event.type);
        paperEvent.preventDefault();
        var touches = paperEvent.event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);
            var currentItemIndex = findItemInPaper(touch.identifier);

            if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                // Remove the record of the touch and path record.
                currentTouches.splice(currentTouchIndex, 1);

                //Finds the path associated with the currentTouchIndex
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.data = {};
                //console.log(currentItem);
            } else {
                console.log('Touch was not found!');
            }

        }
    };
    paperMoveTool.minDistance = 2;
    paperMoveTool.maxDistance = 4;



    $('#drawTool').on('click', function() {
        paperDrawTool.activate();
    });

    $('#moveTool').on('click', function() {
        paperMoveTool.activate();
    });


    // Set up an event listener to catch cancelled touches.
    canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });

    // Removes cancelled touches from the currentTouches array.
    function touchCancelled(event) {
        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);

            if (currentTouchIndex !== -1) {
                // Remove the touch record and path record.
                currentTouches.splice(currentTouchIndex, 1);

                //Finds the path associated with the currentTouchIndex
                var currentItemIndex = findItemInPaper(touch.identifier);
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.simplify();
                currentItem.data = {};
                //console.log(currentItem);
            } else {
                console.log('Touch was not found!');
            }
        }
    }

    // Finds the array index of a trackedTouch in the currentTouches array.
    function findTrackedTouch(touchId) {
        for (var i = 0; i < currentTouches.length; i++) {
            if (currentTouches[i].id === touchId) {
                return i;
            }
        }

        // Touch not found! Return -1.
        return -1;
    }



    function findItemInPaper(id) {
        var children = paper.project.activeLayer.children;

        for(var i = 0; i < children.length; i++) {
            if(children[i].data.touchId == id) {
                return i;
            }
        }

        return -1;
    }
}());