/**
 * Created by Jose Araujo on 07/22/15.
 */



NerdBoard.Tools = window.onload = (function() {

    function addPoints(point1, point2) {
        var afterMath = new paper.Point({x: point1.x + point2.x, y: point1.y + point2.y});

        return afterMath;
    }

    var wbTools = {
        tools: {}
    };

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 15
    };


    //Create arrays to store touches and paths
    var currentTouches = [];

    //Use the HTML5 Canvas API to track the touches
    //Use paper to draw the paths
    var startTime, lastTime = 0, deltaTime;
    wbTools.tools.draw = new Tool();
    wbTools.tools.draw.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        drawingLayer.activate();

        var newPath, hitItemIndex, hit, hitItem, hitItemParent, hitItemParentName;
        if (paperEvent.event.type == 'mousedown') {
            //Capture only the left click when drawing
            if (paperEvent.event.which == 1) {
                newPath = new Path({
                    strokeColor: NerdBoard.penColor,
                    strokeWidth: NerdBoard.penStroke,
                    strokeCap: 'round',
                    data: {
                        name: NerdBoard.pathName
                    }
                });


                //Track the newly created touch
                var trackMouse = {
                    id: 0,
                    pageX: paperEvent.event.x,
                    pageY: paperEvent.event.y,
                    itemIndex: newPath._index
                };

                //Store the trackedTouch
                currentTouches.push(trackMouse);
            }
        }

        if(paperEvent.event.type == 'touchstart') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                var currentIndex = findTrackedTouch(touch.identifier);
                if(currentIndex == -1) {
                    var touchPoint = {x: touch.pageX, y: touch.pageY};
                    hit = project.hitTest(touchPoint, hitOptions);
                    if (hit) {
                        hitItem = hit.item;
                        hitItemParent = hitItem._parent;
                        hitItamParentName = hitItemParent.data.name;

                        if(hitItamParentName == 'layer1') {
                            if(hitItem.data.name !== 'bg') {
                                hitItemIndex = hitItem._index;
                            }
                        }
                        else {
                            hitItemIndex = hitItemParent._index;
                        }
                    }
                    else {
                        return ;
                    }
                    //Create a new path for the trackedTouch
                    newPath = new Path({
                        strokeColor: NerdBoard.penColor, // NerdBoardOriginal is the global module from whiteboard.js
                        strokeWidth: NerdBoard.penStroke,
                        strokeCap: 'round'
                    });

                    //Track the newly created touch
                    var trackedTouch = {
                        id: touch.identifier,
                        pageX: touch.pageX,
                        pageY: touch.pageY,
                        itemIndex: newPath._index,
                        hitItemIndex: hitItemIndex
                    };

                    //Store the trackedTouch
                    currentTouches.push(trackedTouch);
                }
            }
        }
    };
    wbTools.tools.draw.onMouseDrag = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        var currentItem, currentTouch, currentTouchIndex, point;

        if (paperEvent.event.type == 'mousemove') {
            currentTouchIndex = findTrackedTouch(0);
            if (currentTouchIndex !== -1) {
                var x = paperEvent.event.x,
                    y = paperEvent.event.y;
                currentTouch = currentTouches[currentTouchIndex];
                currentItem = drawingLayer.children[currentTouch.itemIndex];

                //Creates a paper point based on the currentTouch position.
                point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                currentItem.add(point);

                // Update the trackedTouch record.
                currentTouch.pageX = x;
                currentTouch.pageY = y;

                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentTouch.itemIndex];

                    //Creates a paper point based on the currentTouch position.
                    point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.add(point);

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
    wbTools.tools.draw.onMouseUp = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        var currentItem;

        if (paperEvent.event.type == 'mouseup') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                currentTouch = currentTouches[currentTouchIndex];
                currentItem = drawingLayer.children[currentTouch.itemIndex];

                if (currentItem._segments.length > 0) {
                    currentItem.smooth();
                    currentItem.simplify();
                }
                else {
                    currentItem.remove();
                    var dot = new Path.Circle(paperEvent.point, NerdBoard.penStroke / 2);
                    dot.fillColor = NerdBoard.penColor;
                    dot.data.name = NerdBoard.pathName + 'dot';
                }

                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1);
            } else {
                console.log('Mouse was not found!');
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    //Finds the path associated with the currentTouchIndex
                    var currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentTouch.itemIndex];

                    if(currentItem._segments.length > 0) {
                        currentItem.smooth();
                        currentItem.simplify();
                    }
                    else {
                        currentItem.remove();
                        var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                        dot = new Path.Circle(point, NerdBoard.penStroke / 2);
                        dot.fillColor = NerdBoard.penColor;
                        dot.data.name = NerdBoard.pathName + 'dot';
                    }

                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch' + i.toString() + 'was not found!');
                }
            }
        }
    };
    wbTools.tools.draw.onKeyDown = function(paperEvent) {
        if(paperEvent.key == 'z') {
            NerdBoard.Tools.undo();
        }
        if(paperEvent.key == 'c') {
            var c = confirm('Are you sure you want to clear the canvas?');
            if (c) {
                NerdBoardUI.data.beingUsed = false;
                NerdBoard.Tools.clear();
            }
        }
    };
    wbTools.tools.draw.minDistance = 0;
    wbTools.tools.draw.maxDistance = 2;


    wbTools.tools.erase = new paper.Tool();
    wbTools.tools.erase.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mousedown') {
            var x = paperEvent.event.x, y = paperEvent.event.y;

            //Track the newly created touch
            var trackMouse = {
                id: 0,
                pageX: x,
                pageY: y
            };
            //Store the trackedTouch
            currentTouches.push(trackMouse);

            var mouseHit = drawingLayer.hitTest(paperEvent.point, hitOptions);
            if (mouseHit) {
                var mouseItem = mouseHit.item;
                if(mouseItem.data.name != "BG") {
                    mouseItem.remove();
                }
            }
            else {
                return ;
            }
        }
        if(paperEvent.event.type == 'touchstart') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                var currentIndex = findTrackedTouch(touch.identifier);
                if(currentIndex == -1) {
                    var point = new Point({x: touch.pageX, y: touch.pageY});
                    var touchHit = drawingLayer.hitTest(point, hitOptions);

                    if (touchHit) {
                        var touchItem = touchHit.item;

                        if(touchItem.data.name !== 'BG') {
                            touchItem.remove();
                        }

                        //Track the newly created touch
                        var trackedTouch = {
                            id: touch.identifier,
                            pageX: touch.pageX,
                            pageY: touch.pageY
                        };

                        //Store the trackedTouch
                        currentTouches.push(trackedTouch);
                    }
                    else {
                        return ;
                    }
                }
            }
        }
    };
    wbTools.tools.erase.onMouseDrag = function(paperEvent) {
        paperEvent.preventDefault();
        var point, currentTouch, currentTouchIndex;

        if(paperEvent.event.type == 'mousemove') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                var x = paperEvent.event.x, y = paperEvent.event.y;
                currentTouch = currentTouches[currentTouchIndex];

                // Update the trackedTouch record.
                currentTouch.pageX = x;
                currentTouch.pageY = y;

                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);

                //Creates a paper point based on the currentTouch position.
                point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});

                var mouseHit = drawingLayer.hitTest(point, hitOptions);
                if (mouseHit) {
                    var mouseItem = mouseHit.item;
                    if(mouseItem.data.name != "BG") {
                        mouseItem.remove();
                    }
                }
                else {
                    return ;
                }

            } else {
                console.log('Mouse was not found!');
            }
        }

        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                currentTouchIndex = findTrackedTouch(touch.identifier);

                if(currentTouchIndex !== -1) {
                    console.log('found and moving');
                    currentTouch = currentTouches[currentTouchIndex];

                    // Update the trackedTouch record.
                    currentTouch.pageX = touch.pageX;
                    currentTouch.pageY = touch.pageY;

                    // Store the record of the trackedTouch.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);

                    point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    var touchHit = drawingLayer.hitTest(point, hitOptions);

                    if (touchHit) {
                        var touchItem = touchHit.item;

                        if(touchItem.data.name !== 'bg') {
                            touchItem.remove();
                        }
                    }
                    else {
                        return ;
                    }
                }
            }
        }
    };
    wbTools.tools.erase.onMouseUp = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mouseup') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1);
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch' + i.toString() + 'was not found!');
                }
            }
        }
    };
    wbTools.tools.erase.minDistance = 0;
    wbTools.tools.erase.maxDistance = 2;


    //var rectangle = new Rectangle(new Point(50, 50), new Point(150, 100));
    //var path = new Path.Rectangle(rectangle);
    //path.fillColor = '#e9e9ff';
    //path.selected = true;
    var selectingArea = {};
    selectingArea.data = {selecting: false};

    wbTools.tools.move = new paper.Tool();
    wbTools.tools.move.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        var itemIndex;
        if(paperEvent.event.type == 'mousedown') {
            var x = paperEvent.event.x, y = paperEvent.event.y;

            var mouseHit = drawingLayer.hitTest(paperEvent.point, hitOptions);
            if (mouseHit) {
                var mouseItem = mouseHit.item;
                itemIndex = mouseItem.index;
                if(mouseItem.data.name == "BG") {
                    selectingArea = new paper.Path.Rectangle({
                        center: new Point({x: x + 1,y: y + 1}),
                        size: [2, 2],
                        fillColor: '#e9e9ff',
                        strokeWidth: 2,
                        opacity: .5,
                        selected: true,
                        data: {
                            name: "selectingArea",
                            width: 1,
                            height: 1,
                            x0: x,
                            y0: y,
                            selecting: true
                        }
                    });
                }
            }

            //Track the newly created touch
            var trackMouse = {
                id: 0,
                pageX: x,
                pageY: y,
                itemIndex: itemIndex
            };
            //Store the trackedTouch
            currentTouches.push(trackMouse);

        }

        if(paperEvent.event.type == 'touchstart') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                var currentIndex = findTrackedTouch(touch.identifier);
                if(currentIndex == -1) {
                    var point = new Point({x: touch.pageX, y: touch.pageY});
                    var touchHit = drawingLayer.hitTest(point, hitOptions);

                    if (touchHit) {
                        var touchItem = touchHit.item;
                        var touchParent = touchItem._parent;
                        var touchParentName = touchParent.data.name;

                        if(touchParentName == 'drawingLayer') {
                            if(touchItem.data.name !== 'BG') {
                                itemIndex = touchItem._index;
                            }
                        }
                        else {
                            itemIndex = touchParent._index;
                        }

                        //Track the newly created touch
                        var trackedTouch = {
                            id: touch.identifier,
                            pageX: touch.pageX,
                            pageY: touch.pageY,
                            itemIndex: itemIndex
                        };

                        //Store the trackedTouch
                        currentTouches.push(trackedTouch);
                    }
                    else {
                        return ;
                    }
                }
            }
        }
    };
    wbTools.tools.move.onMouseDrag = function(paperEvent) {
        paperEvent.preventDefault();

        var currentItem, currentTouch, currentTouchIndex, point;
        var x = paperEvent.event.x,
            y = paperEvent.event.y;

        if(selectingArea.data.selecting) {
            var SW = selectingArea._segments[0],
                NE = selectingArea._segments[2],
                SE = selectingArea._segments[3];
            SW.point = new Point({x: selectingArea.data.x0, y: y});
            NE.point = new Point({x: x, y: selectingArea.data.y0});
            SE.point = new Point({x: x, y: y});
            showSelecting();
        }

        if(paperEvent.event.type == 'mousemove') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                currentTouch = currentTouches[currentTouchIndex];

                //console.log(currentTouches);
                if(currentTouch.itemIndex) {
                    currentItem = drawingLayer.children[currentTouch.itemIndex];

                    //Creates a paper point based on the currentTouch position.
                    point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.position = point;

                    // Update the trackedTouch record.
                    currentTouch.pageX = x;
                    currentTouch.pageY = y;

                    // Store the record of the trackedTouch.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);
                }
            } else {
                console.log('Mouse was not found!');
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    currentTouch = currentTouches[currentTouchIndex];

                    if(currentTouch.itemIndex) {
                        currentItem = drawingLayer.children[currentTouch.itemIndex];

                        currentItem.position = new Point({x: currentTouch.pageX, y: currentTouch.pageY});

                        // Update the trackedTouch record.
                        currentTouch.pageX = touch.pageX;
                        currentTouch.pageY = touch.pageY;

                        // Store the record of the trackedTouch.
                        currentTouches.splice(currentTouchIndex, 1, currentTouch);
                    }
                } else {
                    console.log('Touch was not found!');
                }

            }
        }
    };
    wbTools.tools.move.onMouseUp = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mouseup') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                var currentTouch = currentTouches[currentTouchIndex];
                // Store the record of the trackedTouch.
                drawingLayer.children[currentTouch.itemIndex].selected = false;
                currentTouches.splice(currentTouchIndex, 1);
            }
        }
        if(selectingArea.data.selecting) {
            selectingArea.remove();
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch' + i.toString() + 'was not found!');
                }
            }
        }
    };
    wbTools.tools.move.minDistance = 0;
    wbTools.tools.move.maxDistance = 2;


    wbTools.tools.shape = new paper.Tool();
    wbTools.tools.shape.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        var itemIndex, value = $('#leftTextInputUIInput')[0].value;

        if(paperEvent.event.type == 'mousedown') {
            itemIndex = wbTools.drawShape(paperEvent.point, NerdBoard.shape, value);
            var x = paperEvent.event.x, y = paperEvent.event.y;

            //Track the newly created touch
            var trackMouse = {
                id: 0,
                pageX: x,
                pageY: y,
                itemIndex: itemIndex
            };
            //Store the trackedTouch
            currentTouches.push(trackMouse);
        }
    };
    wbTools.tools.shape.onMouseDrag = function(paperEvent) {
        paperEvent.preventDefault();

        var currentItem, currentTouch, currentTouchIndex, point;

        if(paperEvent.event.type == 'mousemove') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                var x = paperEvent.event.x,
                    y = paperEvent.event.y;
                currentTouch = currentTouches[currentTouchIndex];
                currentItem = paper.project.activeLayer.children[currentTouch.itemIndex];

                //Creates a paper point based on the currentTouch position.
                point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                currentItem.position = point;

                // Update the trackedTouch record.
                currentTouch.pageX = x;
                currentTouch.pageY = y;

                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);
            } else {
                console.log('Mouse was not found!');
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentTouch.itemIndex];

                    currentItem.position = new Point({x: currentTouch.pageX, y: currentTouch.pageY});

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
    wbTools.tools.shape.onMouseUp = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mouseup') {
            currentTouchIndex = findTrackedTouch(0);

            if (currentTouchIndex !== -1) {
                // Store the record of the trackedTouch.
                currentTouches.splice(currentTouchIndex, 1);
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);

                if (currentTouchIndex !== -1) {
                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch' + i.toString() + 'was not found!');
                }
            }
        }

        var state = $('#drawAfterCheckbox')[0].checked;

        if(state) {
            NerdBoard.activateDrawMode();
            toolIcon.attr('src', 'icons/pencil.png');
        }
    };
    wbTools.tools.shape.minDistance = 0;
    wbTools.tools.shape.maxDistance = 2;

    wbTools.tools.none = new paper.Tool();


    // Set up an event listener to catch cancelled touches.
    NerdBoard.canvas[0].addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });

    // Removes cancelled touches from the currentTouches array.
    function touchCancelled(event) {
        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);

            if (currentTouchIndex !== -1 && currentItemIndex !== -1 ) {
                // Remove the touch record and path record.
                currentTouches.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch' + i.toString() + 'was not found!');
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


    function showSelecting() {
        for(var i = 0; i < drawingLayer.children.length - 1; i++) {
            //console.log(drawingLayer.children[i].position.isInside(selectingArea));
            if(drawingLayer.children[i].position.isInside(selectingArea)) {
                drawingLayer.children[i].selected = true;
            }
            else {
                drawingLayer.children[i].selected = false;
            }
        }
    }










    wbTools.drawBg= function () {
        drawingLayer.activate();
        new Path.Rectangle({
            center: paper.view.center,
            size: [NerdBoard.width, NerdBoard.height],
            fillColor: NerdBoard.bgColor,
            data: {
                name: 'BG'
            }
        });
    };
    wbTools.drawBg();

    wbTools.resizeBg = function() {
        var bg = drawingLayer.children[0];
        var SW = bg._segments[0],
            NW = bg._segments[1],
            NE = bg._segments[2],
            SE = bg._segments[3];

        NW._point._x = 0;
        NW._point._y = 0;

        SW._point._x = 0;
        SW._point._y = NerdBoard.height;

        NE._point._x = NerdBoard.width;
        NE._point._y = 0;

        SE._point._x = NerdBoard.width;
        SE._point._y = NerdBoard.height;
    };


    wbTools.resizeRect = function(rect, x0, y0, width, height) {
        var SW = rect._segments[0],
            NW = rect._segments[1],
            NE = rect._segments[2],
            SE = rect._segments[3];

        NW._point._x = x0;
        NW._point._y = y0;

        SW._point._x = x0;
        SW._point._y = y0 + height;

        NE._point._x = x0 + width;
        NE._point._y = y0;

        SE._point._x = x0 + width;
        SE._point._y = y0 + height;
    };

    wbTools.loadRaster = function(image) {
        var raster = new paper.Raster({
            source: image,
            position: paper.view.center
        });
        raster.fitBounds(paper.view.bounds);
        raster.sendToBack();
        drawingLayer.children[1].sendToBack();
    };


    wbTools.undo = function() {
        var children = drawingLayer.children;
        //console.log(children);
        var lastIndex = children.length - 1;

        if(children.length > 0 && children[lastIndex].data.name !== 'bg'){
            lastItem = children[lastIndex];
            lastItemClass = children[lastIndex].__proto__._class;

            if(lastItemClass == "Group") {
                var groupLength = lastItem.children.length;

                if(groupLength == 1) {
                    lastItem.remove();
                }

                if(groupLength > 1) {
                    lastItem.children[groupLength - 1].remove();
                }
            }

            if(lastItemClass == "Path") {
                lastItem.remove();
            }

            if(lastItemClass == "Raster") {
                lastItem.remove();
            }
        }
        paper.view.draw();
    };


    wbTools.clear = function() {
        while(drawingLayer.children.length > 1){
            drawingLayer.children[drawingLayer.children.length - 1].remove();
        }
        //paper.view.draw()
    };


    wbTools.changeBgColor = function() {
        BGLayer.fillColor = NerdBoard.bgColor;
    };

    return wbTools;
}());
