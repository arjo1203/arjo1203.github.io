paper.install(window);
paper.setup('myCanvas');

(function(){

    // Get the canvas.
    var canvas = document.getElementById('myCanvas');

    // Set the canvas to fill the screen.
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;

    // Get a 2d drawing context.
    //var ctx = canvas.getContext('2d');

    function switchTool(tool) {
        // Set up an event listener for new touches.
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            tool.onStart(event);
        });

        // Set up an event listener for when the touch instrument is moved.
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            tool.onMove(e);
        });

        // Set up an event listener for when a touch ends.
        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            tool.onEnd(e);
        });

        // Set up an event listener for when a touch leaves the canvas.
        canvas.addEventListener('touchleave', function(e) {
            e.preventDefault();
            tool.onEnd(e);
        });

    }

    // Set up an event listener to catch cancelled touches.
    canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });

    // Used to keep track of active touches.
    var currentTouches = [];
    var currentPaths = [];

    var drawTool = {
        onStart: function drawOnStart(event) {
            var touches = event.changedTouches;

            for (var i=0; i < touches.length; i++) {
                var touch = touches[i];

                currentTouches.push({
                    id: touch.identifier,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                });

                var newPath = new Path();
                newPath.strokeColor = 'green';
                newPath.strokeWidth = 4;

                currentPaths.push(newPath);
            }
        },
        onMove: function drawOnMove(event) {
            var touches = event.changedTouches;

            for (var i=0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

                if (currentTouchIndex >= 0) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    var currentPath = currentPaths[currentTouchIndex];

                    var newPoint = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentPath.add(newPoint);

                    // Update the touch record.
                    currentTouch.pageX = touch.pageX;
                    currentTouch.pageY = touch.pageY;

                    // Store the record.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);
                } else {
                    console.log('Touch was not found!');
                }

            }

            paper.view.draw();
        },
        onEnd: function drawOnEnd(event) {
            var touches = event.changedTouches;

            for (var i=0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

                if (currentTouchIndex >= 0) {
                    var currentPath = currentPaths[currentTouchIndex];
                    currentPath.simplify();

                    // Remove the record.
                    currentTouches.splice(currentTouchIndex, 1);
                    currentPaths.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };


    // Removes cancelled touches from the currentTouches array.
    function touchCancelled(event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var currentTouchIndex = findCurrentTouchIndex(touches[i].identifier);

            if (currentTouchIndex >= 0) {
                // Remove the touch record.
                currentTouches.splice(currentTouchIndex, 1);
                currentPaths.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch was not found!');
            }
        }
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


    switchTool(drawTool);

}());