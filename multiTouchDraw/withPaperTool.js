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

                //Create a new path for the trackedTouch
                var path = new Path();
                path.strokeColor = 'green';
                path.strokeWidth = 10;
                path.data = {
                    touchId: touch.identifier
                };
            }
        }

        counter++;
    };
    paperDrawTool.onMouseDrag = function(paperEvent) {
        console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        var touches = paperEvent.event.changedTouches;
        console.log('moving');

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);

            if (currentTouchIndex !== -1) {
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

                paper.view.draw();
            } else {
                console.log('Touch was not found!');
            }

        }
    };
    paperDrawTool.onMouseUp = function(paperEvent) {
        console.log(paperEvent.event.type);
        paperEvent.preventDefault();
        var touches = paperEvent.event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);

            if (currentTouchIndex !== -1) {
                // Remove the record of the touch and path record.
                currentTouches.splice(currentTouchIndex, 1);

                //Finds the path associated with the currentTouchIndex
                var currentItemIndex = findItemInPaper(touch.identifier);
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.simplify();
                currentItem.data = {};

                if(currentTouches.length > 0) {
                    paper.tool.__proto__._updateEvent('mousedrag', paperEvent.point, paperDrawTool.minDistance, paperDrawTool.maxDistance, true, false, false);
                }
                //console.log(currentItem);
            } else {
                console.log('Touch was not found!');
            }

        }
    };
    paperDrawTool.minDistance = 5;
    paperDrawTool.maxDistance = 10;


    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    }, hitItem;

    var moveTool = {
        onStart: function(event){
            console.log('move');
            event.preventDefault();
            var touches = event.touches;

            for(var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                var point = new Point({x: touch.pageX, y: touch.pageY});
                //console.log(point);
                console.log(paper);
                console.log(paper.project);
                var hitResult = paper.project.activeLayer._hitTest(point, hitOptions);
                //console.log(hitResult);

                //Track the newly created touch
                var trackedTouch = {
                    id: touch.identifier,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };


                //Store the trackedTouch
                currentTouches.push(trackedTouch);

                if (hitResult) {
                    hitItem = hitResult.item;
                    hitItem.data = {
                        touchId: touch.identifier
                    };
                    console.log(hitItem);
                }
                else {
                    hitItem = false;
                }
            }
        },
        onMove: function() {
            event.preventDefault();
            var touches = event.changedTouches;

            console.log(hitItem);
            if(hitItem) {
                console.log(paper.project.activeLayer.children);
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var currentTouchIndex = findTrackedTouch(touch.identifier);
                    var currentTouch = currentTouches[currentTouchIndex];
                    var currentItemIndex = findItemInPaper(touch.identifier);
                    //console.log(currentItemIndex);
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];
                    //console.log(currentItem.position);
                    //console.log(currentItem._position);

                    var point = new Point({x: touch.pageX, y: touch.pageY});

                    currentItem.setPosition(point);

                    // Update the trackedTouch record.
                    currentTouch.pageX = touch.pageX;
                    currentTouch.pageY = touch.pageY;

                    // Store the record of the trackedTouch.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);
                }
            }
        },
        onEnd: function() {
            event.preventDefault();
            var touches = event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                // Remove the record of the touch and path record.
                currentTouches.splice(currentTouchIndex, 1);

                //Finds the path associated with the currentTouchIndex
                var currentItemIndex = findItemInPaper(touch.identifier);
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.data = {};
                //console.log(currentItem);
            }
        }
    };

    $('#drawTool').on('click', function() {
    });


    $('#moveTool').on('click', function() {
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