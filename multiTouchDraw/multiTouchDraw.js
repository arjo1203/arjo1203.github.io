//Install paper on the window to use javascript
paper.install(window);
//Sets up the screen graph on the canvas
paper.setup('myCanvas');

(function(){
    //Resize the canvas to the size of the window
    var canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Create arrays to store touches and paths
    var currentTouches = [];

    //Use the HTML5 Canvas API to track the touches
    //Use paper to draw the paths
    var drawTool = {
        onStart: function (event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
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
                path.strokeWidth = 10;

                //Associate the path with the touch
                path.data = {
                    touchId: touch.identifier
                };
            }
        },
        onMove: function (event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex >= 0) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    var currentItemIndex = findItemInPaper(touch.identifier);
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];

                    //Creates a paper point based on the currentTouch position.
                    var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.add(point);
                    currentItem.smooth();

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
        onEnd: function (event) {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex >= 0) {
                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);

                    //Finds the path associated with the currentTouchIndex
                    var currentItemIndex = findItemInPaper(touch.identifier);
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];
                    currentItem.simplify();

                    //Remove the record of the touch.
                    currentItem.data = {};
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };

    // Set up an event listener for new touches.
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        drawTool.onStart(e);
    });

    // Set up an event listener for when the touch instrument is moved.
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        drawTool.onMove(e);
    });

    // Set up an event listener for when a touch ends.
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        drawTool.onEnd(e);
    });

    // Set up an event listener for when a touch leaves the canvas.
    canvas.addEventListener('touchleave', function(e) {
        e.preventDefault();
        drawTool.onEnd(e);
    });


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


    // Finds the array index of an item in the activeLayer.children array.
    function findItemInPaper(id) {
        var children = paper.project.activeLayer.children;

        for(var i = 0; i < children.length; i++) {
            if(children[i].data.touchId == id) {
                return i;
            }
        }

        // Item not found! Return -1.
        return -1;
    }
}());