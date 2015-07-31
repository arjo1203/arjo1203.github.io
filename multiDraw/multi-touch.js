paper.install(window);
paper.setup('myCanvas');

(function(){

    // Get the canvas.
    var canvas = document.getElementById('myCanvas');

    // Set the canvas to fill the screen.
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;

    // Get a 2d drawing context.
    var ctx = canvas.getContext('2d');

    // Set up an event listener for new touches.
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStarted(event);
    });

    // Set up an event listener for when the touch instrument is moved.
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        touchMoved(e);
    });

    // Set up an event listener for when a touch ends.
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        touchEnded(e);
    });

    // Set up an event listener for when a touch leaves the canvas.
    canvas.addEventListener('touchleave', function(e) {
        e.preventDefault();
        touchEnded(e);
    });

    // Set up an event listener to catch cancelled touches.
    canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });


    // Used to keep track of active touches.
    var currentTouches = [];
    var currentPaths = [];

    // The rest of the code goes here...

    // Creates a new touch in the currentTouches array and draws the starting
    // point on the canvas.
    var touchStarted = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var touchColor = randomColor();

            currentTouches.push({
                id: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY,
                color: touchColor
            });

            var newPath = new Path();
            newPath.strokeColor = 'red';
            newPath.strokeWidth = 4;

            currentPaths.push(newPath);

            ctx.beginPath();
            ctx.arc(touch.pageX, touch.pageY, 2.5, Math.PI*2, false);
            ctx.fillStyle = touchColor;
            ctx.fill();
        }
        console.log(currentTouches);
        console.log(currentPaths);
    };

    // Draws a line on the canvas between the previous touch location and
    // the new location.
    var touchMoved = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = currentTouches[currentTouchIndex];

                ctx.beginPath();
                ctx.moveTo(currentTouch.pageX, currentTouch.pageY);
                ctx.lineTo(touch.pageX, touch.pageY);
                ctx.lineWidth = 4;
                ctx.strokeStyle = currentTouch.color;
                ctx.stroke();

                // Update the touch record.
                currentTouch.pageX = touch.pageX;
                currentTouch.pageY = touch.pageY;

                // Store the record.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);
            } else {
                console.log('Touch was not found!');
            }

        }
        console.log(currentTouches);
        console.log(currentPaths);
    };

    // Draws a line to the final touch position on the canvas and then
    // removes the touh from the currentTouches array.
    var touchEnded = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = currentTouches[currentTouchIndex];

                ctx.beginPath();
                ctx.moveTo(currentTouch.pageX, currentTouch.pageY);
                ctx.lineTo(touch.pageX, touch.pageY);
                ctx.lineWidth = 4;
                ctx.strokeStyle = currentTouch.color;
                ctx.stroke();

                // Remove the record.
                currentTouches.splice(currentTouchIndex, 1);
                currentPaths.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch was not found!');
            }

        }

        console.log(currentTouches);
        console.log(currentPaths);
    };

    // Removes cancelled touches from the currentTouches array.
    var touchCancelled = function (event) {
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
    };

    // Returns a random color from an array.
    var randomColor = function () {
        var colors = ['#3F3F3F', '#929292', '#00A3EE', '#F5D908', '#D80351'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

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

}());