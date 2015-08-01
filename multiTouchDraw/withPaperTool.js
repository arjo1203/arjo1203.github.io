//Install paper on the window to use javascript
paper.install(window);
//Sets up the screen graph on the canvas
paper.setup('myCanvas');

(function(){
    //Resize the canvas to the size of the window
    var canvas = $('#myCanvas')[0];
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;

    //Create arrays to store touches and paths
    var currentTouches = [];
    //var currentItems = [];

    //Use the HTML5 Canvas API to track the touches
    //Use paper to draw the paths
    var drawTool = {
        onStart: function(event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i=0; i < touches.length; i++) {
                var touch = touches[i];

                //Track the newly created touch
                var trackedTouch = {
                    id: touch.identifier,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };

                //Store the trackedTouch
                currentTouches.push(trackedTouch);

                //Create a new path for the trackedTouch
                var path = new Path();
                path.strokeColor = 'green';
                path.strokeWidth = 4;
                path.data = {
                    touchId: touch.identifier
                };

                //Store the new path
                //currentItems.push(path);
            }
        },
        onMove: function(event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i=0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex >= 0) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    var currentPathIndex = findItemInPaper(currentTouch.identifier);
                    var currentPath = paper.project.activeLayer.children[currentPathIndex];
                    console.log(currentPath);

                    //Creates a paper point based on the currentTouch position.
                    var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentPath.add(point);
                    currentPath.smooth();

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
        },
        onEnd: function(event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex >= 0) {
                    //Finds the path associated with the currentTouchIndex
                    var currentPath = currentItems[currentTouchIndex];
                    currentPath.simplify();

                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                    currentItems.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };
    bindToolToCanvas(drawTool);


    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 2
    };

    var moveTool = {
        onStart: function(event){
            event.preventDefault();
            var touches = event.changedTouches;

            for(var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                //Track the newly created touch
                var trackedTouch = {
                    id: touch.identifier,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };

                var point = new Point({x: trackedTouch.pageX, y: trackedTouch.pageY});
                var hitResult = project.hitTest(point, hitOptions);

                if (hitResult) {
                    currentItems.push(hitResult.item);
                }
                else {
                    return ;
                }

                //Store the trackedTouch
                currentTouches.push(trackedTouch);
            }
        },
        onMove: function() {
            event.preventDefault();
            var touches = event.changedTouches;

            if(currentItems.length > 0) {
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var currentTouchIndex = findTrackedTouch(touch.identifier);

                    if (currentTouchIndex >= 0) {
                        var currentTouch = currentTouches[currentTouchIndex];
                        var currentItem = currentItems[currentTouchIndex];
                        //console.log(currentItem);
                        console.log(paper.project.activeLayer.children[currentItem.id]);

                        currentItem.position.x = currentTouch.pageX;
                        currentItem.position.y = currentTouch.pageY;

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
        },
        onEnd: function() {
            event.preventDefault();
        }
    };

    $('#drawTool').on('click', function() {
        unbindToolToCanvas(moveTool);
        bindToolToCanvas(drawTool);
    });


    $('#moveTool').on('click', function() {
        unbindToolToCanvas(drawTool);
        bindToolToCanvas(moveTool);
    });

    function bindToolToCanvas(Tool) {
        // Set up an event listener for new touches.
        canvas.addEventListener('touchstart', Tool.onStart);

        // Set up an event listener for when the touch instrument is moved.
        canvas.addEventListener('touchmove', Tool.onMove);

        // Set up an event listener for when a touch ends.
        canvas.addEventListener('touchend', Tool.onEnd);

        // Set up an event listener for when a touch leaves the canvas.
        canvas.addEventListener('touchleave', Tool.onEnd);
    }

    function unbindToolToCanvas(Tool) {
        // Set up an event listener for new touches.
        canvas.removeEventListener('touchstart', Tool.onStart);

        // Set up an event listener for when the touch instrument is moved.
        canvas.removeEventListener('touchmove', Tool.onMove);

        // Set up an event listener for when a touch ends.
        canvas.removeEventListener('touchend', Tool.onEnd);

        // Set up an event listener for when a touch leaves the canvas.
        canvas.removeEventListener('touchleave', Tool.onEnd);
    }


    // Set up an event listener to catch cancelled touches.
    canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });


    // Removes cancelled touches from the currentTouches array.
    function touchCancelled(event) {
        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var currentTouchIndex = findTrackedTouch(touches[i].identifier);

            if (currentTouchIndex >= 0) {
                // Remove the touch record and path record.
                currentTouches.splice(currentTouchIndex, 1);
                currentItems.splice(currentTouchIndex, 1);
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
        console.log(children);

        for(var i = 0; i < children.length; i++) {
            console.log(children[i].data.id);
            if(children[i].data.id == id) {
                return i;
            }
        }

        return -1;
    }
}());