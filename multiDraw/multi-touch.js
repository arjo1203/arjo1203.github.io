paper.install(window);
paper.setup('myCanvas');

var canvasCodeBehind = (function(){

    var codeBehind = {
        currentTouches: [],
        currentPaths: [],
        canvas: document.getElementById('myCanvas'),
        switchTool:  function switchTool(tool) {
            // Set up an event listener for new touches.
            codeBehind.canvas.addEventListener('touchstart', function(e) {
                e.preventDefault();
                tool.onStart(event);
            });

            // Set up an event listener for when the touch instrument is moved.
            codeBehind.canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                tool.onMove(e);
            });

            // Set up an event listener for when a touch ends.
            codeBehind.canvas.addEventListener('touchend', function(e) {
                e.preventDefault();
                tool.onEnd(e);
            });

            // Set up an event listener for when a touch leaves the canvas.
            codeBehind.canvas.addEventListener('touchleave', function(e) {
                e.preventDefault();
                tool.onEnd(e);
            });
        },
        tools: {
            draw: {
                onStart: function drawOnStart(event) {
                    var touches = event.changedTouches;

                    for (var i=0; i < touches.length; i++) {
                        var touch = touches[i];

                        codeBehind.currentTouches.push({
                            id: touch.identifier,
                            pageX: touch.pageX,
                            pageY: touch.pageY
                        });

                        var newPath = new Path();
                        newPath.strokeColor = 'green';
                        newPath.strokeWidth = 4;

                        codeBehind.currentPaths.push(newPath);
                    }
                },
                onMove: function drawOnMove(event) {
                    var touches = event.changedTouches;

                    for (var i=0; i < touches.length; i++) {
                        var touch = touches[i];
                        var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

                        if (currentTouchIndex >= 0) {
                            var currentTouch = codeBehind.currentTouches[currentTouchIndex];
                            var currentPath = codeBehind.currentPaths[currentTouchIndex];

                            var newPoint = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                            currentPath.add(newPoint);

                            // Update the touch record.
                            currentTouch.pageX = touch.pageX;
                            currentTouch.pageY = touch.pageY;

                            // Store the record.
                            codeBehind.currentTouches.splice(currentTouchIndex, 1, currentTouch);
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
                            var currentPath = codeBehind.currentPaths[currentTouchIndex];
                            currentPath.simplify();

                            // Remove the record.
                            codeBehind.currentTouches.splice(currentTouchIndex, 1);
                            codeBehind.currentPaths.splice(currentTouchIndex, 1);
                        } else {
                            console.log('Touch was not found!');
                        }

                    }
                }
            },
            move: {
                onStart: function drawOnStart(event) {
                    var touches = event.changedTouches;

                    for (var i=0; i < touches.length; i++) {
                        var touch = touches[i];

                        codeBehind.currentTouches.push({
                            id: touch.identifier,
                            pageX: touch.pageX,
                            pageY: touch.pageY
                        });

                        var currentPoint = new Point({x: touch.pageX, y: touch.pageY});
                        var hitResult = paper.project.hitTest(currentPoint, hitOptions);
                        if (hitResult) {
                            codeBehind.currentPaths.push(hitResult.item);
                            console.log(hitResult.item);
                        }
                        else {
                            return ;
                        }
                    }
                },
                onMove: function drawOnMove(event) {
                },
                onEnd: function drawOnEnd(event) {
                }
            }
        }
    };
    codeBehind.switchTool(codeBehind.tools.draw);

    // Set the canvas to fill the screen.
    codeBehind.canvas.width = window.outerWidth;
    codeBehind.canvas.height = window.outerHeight;



    // Set up an event listener to catch cancelled touches.
    codeBehind.canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });


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

    return codeBehind;
}());