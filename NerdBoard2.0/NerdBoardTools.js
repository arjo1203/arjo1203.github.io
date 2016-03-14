/**
 * Created by Jose Araujo on 07/22/15.
 */



NerdBoard.Tools = (function() {
    var wbTools = {
        tools: {},
        toolsEvents: {
            draw: {},
            eraser: {},
            move: {}
        },
        selectingArea: {},
        selectedPaths: {},
        moveIcon: {}
    };

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 15
    };


    //Create arrays to store touches and paths
    var currentTouches = [];

    wbTools.createTools = function() {
        makeDrawingTool();
        makeEraserTool();
        makeSelectingGroups();
        makeMoveTool();
        makeNoneTool();
    };


    wbTools.toolsEvents.draw.onMouseDrag = function(touch) {
        var currentTouchIndex = findTrackedTouch(touch.identifier);
        if (currentTouchIndex !== -1) {
            var currentTouch = currentTouches[currentTouchIndex];
            var segment = {x: currentTouch.pageX, y: currentTouch.pageY};
            var item = NerdBoard.layers.drawing.children[currentTouch.itemIndex];
            item.add(segment);

            currentTouch.pageX = touch.pageX;
            currentTouch.pageY = touch.pageY;

            currentTouches.splice(currentTouchIndex, 1, currentTouch);
        }
    };




    function makeDrawingTool() {
        //Use the HTML5 Canvas API to track the touches
        //Use paper to draw the paths
        wbTools.tools.draw = new Tool();
        wbTools.tools.draw.onMouseDown = function(paperEvent) {
            paperEvent.preventDefault();
            NerdBoard.layers.drawing.activate();

            var newPath, hitItemIndex, hit, hitItem, hitItemParent, hitItemParentName;
            if (paperEvent.event.type == 'mousedown') {
                //Capture only the left click when drawing
                if (paperEvent.event.which == 1) {
                    newPath = makePath();
                    var trackMouse = trackTouch(0, paperEvent.event, newPath.index);
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
                        newPath = makePath();
                        var trackedTouch = trackTouch(touch.identifier, touchPoint, newPath.index);
                        currentTouches.push(trackedTouch);
                    }
                }
            }
        };
        wbTools.tools.draw.onMouseDrag = function(paperEvent) {
            paperEvent.preventDefault();

            if (paperEvent.event.type == 'mousemove') {
                paperEvent.event.identifier = 0;
                wbTools.toolsEvents.draw.onMouseDrag(paperEvent.event);
            }


            if(paperEvent.event.type == 'touchmove') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.draw.onMouseDrag(touch);
                }
            }
        };
        wbTools.tools.draw.onMouseUp = function(paperEvent) {
            //console.log(paperEvent.event.type);
            paperEvent.preventDefault();

            var currentItem, currentTouch, currentTouchIndex;

            if (paperEvent.event.type == 'mouseup') {
                currentTouchIndex = findTrackedTouch(0);

                if (currentTouchIndex !== -1) {
                    currentTouch = currentTouches[currentTouchIndex];
                    currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];
                    if (currentItem.segments.length > 0) {
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
                }
            }

            if(paperEvent.event.type == 'touchend') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    currentTouchIndex = findTrackedTouch(touch.identifier);

                    if (currentTouchIndex !== -1) {
                        currentTouch = currentTouches[currentTouchIndex];
                        currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];
                        if(currentItem.segments.length > 0) {
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
                    }
                }
            }
        };
        wbTools.tools.draw.onKeyDown = function(paperEvent) {
            console.log(paperEvent);
            if(paperEvent.key == 'z') {
                NerdBoard.undo();
            }
            if(paperEvent.key == 'c') {
                var c = confirm('Are you sure you want to clear the canvas?');
                if (c) {
                    NerdBoardUI.data.beingUsed = false;
                    NerdBoard.clear();
                }
            }
        };
        wbTools.tools.draw.minDistance = 0;
        wbTools.tools.draw.maxDistance = 2;
    }




    function makeEraserTool() {
        wbTools.tools.erase = new paper.Tool();
        wbTools.tools.erase.onMouseDown = function(paperEvent) {
            paperEvent.preventDefault();
            console.log(paperEvent);

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

                var mouseHit = NerdBoard.layers.drawing.hitTest(paperEvent.point, hitOptions);
                if (mouseHit) {
                    var mouseItem = mouseHit.item;
                    console.log(mouseItem.data.name);
                    if(mouseItem.data.name != "BG") {//Prevent erasing BG and BGImg
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
                        var touchHit = NerdBoard.layers.drawing.hitTest(point, hitOptions);

                        if (touchHit) {
                            var touchItem = touchHit.item;

                            if(touchItem.data.name != "BG") {//Prevent erasing BG and BGImg
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

                    var mouseHit = NerdBoard.layers.drawing.hitTest(point, hitOptions);
                    if (mouseHit) {
                        var mouseItem = mouseHit.item;
                        if(mouseItem.data.name != "BG") {//Prevent erasing BG and BGImg
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
                        var touchHit = NerdBoard.layers.drawing.hitTest(point, hitOptions);

                        if (touchHit) {
                            var touchItem = touchHit.item;
                            if(touchItem.data.name != "BG") {//Prevent erasing BG and BGImg
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
    }


    function makeSelectingGroups() {
        wbTools.selectingArea = new paper.Path.Rectangle({
            center: new Point({x: -2000,y: 0}),
            size: [2, 2],
            fillColor: '#e9e9ff',
            strokeWidth: 2,
            opacity: .5,
            selected: true,
            data: {
                name: "wbTools.selectingArea",
                width: 1,
                height: 1,
                x0: 0,
                y0: 0,
                selecting: false
            }
        });


        wbTools.selectedPaths = new Group();


        wbTools.moveIcon = new Raster('MoveIcon');
        wbTools.moveIcon.position.x -= 2000;
        wbTools.moveIcon.opacity = 0;
        NerdBoard.scaleImg(wbTools.moveIcon, {width: 32, height: 32});
        wbTools.moveIcon.onMouseDown =  function() {
            wbTools.selectingArea.data.selecting = false;
        };
        wbTools.moveIcon.onMouseUp =  function() {
            if(wbTools.selectedPaths.children.length > 0) {
                wbTools.selectedPaths.selected = false;
                var childrenRemoved = wbTools.selectedPaths.removeChildren();
                NerdBoard.layers.drawing.addChildren(childrenRemoved);
            }
            wbTools.moveIcon.position.x -= 2000;
            wbTools.moveIcon.opacity = 0;
            if(wbTools.selectingArea.data.selecting) {
                if(wbTools.selectedPaths.children.length > 0) {
                    wbTools.selectingArea.fitBounds(wbTools.selectedPaths.bounds);
                    wbTools.moveIcon.position = wbTools.selectingArea.position;
                    wbTools.moveIcon.opacity = 1;
                }
                else {
                    wbTools.selectingArea.position.x -= 2000;
                }
                wbTools.selectingArea.data.selecting = false;
            }
        };
        wbTools.moveIcon.onMouseDrag = function(event) {
            this.position = event.point;
            wbTools.selectingArea.position = event.point;
            wbTools.selectedPaths.position = event.point;
        };
    }




    function makeMoveTool() {
        wbTools.tools.move = new paper.Tool();
        wbTools.tools.move.onMouseDown = function(paperEvent) {
            paperEvent.preventDefault();
            if(wbTools.selectedPaths.children.length > 0 && wbTools.moveIcon.opacity != 1) {//Prevents bubbling when wbTools.moveIcon is seen
                wbTools.selectedPaths.selected = false;
                var childrenRemoved = wbTools.selectedPaths.removeChildren();
                NerdBoard.layers.drawing.addChildren(childrenRemoved);
                wbTools.moveIcon.position.x -= 2000;
                wbTools.moveIcon.opacity = 0;
            }

            var itemIndex;
            if(paperEvent.event.type == 'mousedown') {
                var x = paperEvent.event.x, y = paperEvent.event.y;

                var mouseHit = NerdBoard.layers.drawing.hitTest(paperEvent.point, hitOptions);
                if (mouseHit) {
                    var mouseItem = mouseHit.item;
                    itemIndex = mouseItem.index;
                    if(mouseItem.data.name == "BG") {
                        wbTools.selectingArea.data.x0 = x;
                        wbTools.selectingArea.data.y0 = y;
                        wbTools.selectingArea.data.selecting = true;
                    }
                    else {
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
                }

            }

            if(paperEvent.event.type == 'touchstart') {
                var touches = paperEvent.event.changedTouches;

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];

                    var currentIndex = findTrackedTouch(touch.identifier);
                    if(currentIndex == -1) {
                        var point = new Point({x: touch.pageX, y: touch.pageY});
                        var touchHit = NerdBoard.layers.drawing.hitTest(point, hitOptions);

                        if (touchHit) {
                            var touchItem = touchHit.item;
                            var touchParent = touchItem._parent;
                            var touchParentName = touchParent.data.name;

                            //if(touchParentName == 'NerdBoard.layers.drawing') {
                            //    if(touchItem.data.name !== 'BG') {
                                    itemIndex = touchItem._index;
                            //    }
                            //}
                            //else {
                            //    itemIndex = touchParent._index;
                            //}
                            if(touchItem.data.name == "BG") {
                                wbTools.selectingArea.data.x0 = point.x;
                                wbTools.selectingArea.data.y0 = point.y;
                                wbTools.selectingArea.data.selecting = true;
                            }
                            else {
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

            if(paperEvent.event.type == 'mousemove') {
                currentTouchIndex = findTrackedTouch(0);

                if (currentTouchIndex !== -1) {
                    currentTouch = currentTouches[currentTouchIndex];

                    //console.log(currentTouches);
                    if(currentTouch.itemIndex) {
                        currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];

                        //Creates a paper point based on the currentTouch position.
                        //point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                        //currentItem.position= point;
                        currentItem.position.x += paperEvent.delta.x;
                        currentItem.position.y += paperEvent.delta.y;

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
                            currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];

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

            if(wbTools.selectingArea.data.selecting && wbTools.moveIcon.opacity != 1) {
                var SW = wbTools.selectingArea._segments[0],
                    NW = wbTools.selectingArea._segments[1],
                    NE = wbTools.selectingArea._segments[2],
                    SE = wbTools.selectingArea._segments[3];
                NW.point = new Point({x: wbTools.selectingArea.data.x0, y: wbTools.selectingArea.data.y0});
                SW.point = new Point({x: wbTools.selectingArea.data.x0, y: paperEvent.point.y});
                NE.point = new Point({x: paperEvent.point.x, y: wbTools.selectingArea.data.y0});
                SE.point = new Point({x: paperEvent.point.x, y: paperEvent.point.y});
                showSelection();
                addSelectedToSelectedPaths();
            }
        };
        wbTools.tools.move.onMouseUp = function(paperEvent) {
            paperEvent.preventDefault();

            if(paperEvent.event.type == 'mouseup') {
                currentTouchIndex = findTrackedTouch(0);

                if (currentTouchIndex !== -1) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    // Store the record of the trackedTouch.
                    NerdBoard.layers.drawing.children[currentTouch.itemIndex].selected = false;
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

            if(wbTools.selectingArea.data.selecting) {
                if(wbTools.selectedPaths.children.length > 0) {
                    wbTools.selectingArea.fitBounds(wbTools.selectedPaths.bounds);
                    wbTools.moveIcon.position = wbTools.selectingArea.position;
                    wbTools.moveIcon.opacity = 1;
                }
                else {
                    wbTools.selectingArea.position.x -= 2000;
                }
                wbTools.selectingArea.data.selecting = false;
            }
        };
        wbTools.tools.move.minDistance = 0;
        wbTools.tools.move.maxDistance = 2;
    }




    function makeNoneTool() {
        wbTools.tools.none = new paper.Tool();
    }




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




    function showSelection() {
        for(var i = 1; i < NerdBoard.layers.drawing.children.length; i++) {
            NerdBoard.layers.drawing.children[i].selected = NerdBoard.layers.drawing.children[i].position.isInside(wbTools.selectingArea);
        }
    }



    function addSelectedToSelectedPaths() {
        for(var i = 0; i < NerdBoard.layers.drawing.children.length; i++)
            if (NerdBoard.layers.drawing.children[i].selected)
                wbTools.selectedPaths.addChild(NerdBoard.layers.drawing.children[i]);
    }




    // Set up an event listener to catch cancelled touches.
    NerdBoard.canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });




    function makePath() {
        NerdBoard.pathCount++;
        return new Path({
            strokeColor: NerdBoard.penColor,
            strokeWidth: NerdBoard.penStroke,
            strokeCap: 'round',
            data: {
                name: NerdBoard.pathName
            }
        });
    }




    function trackTouch(id, point, itemIndex) {
        return {
            id: id,
            pageX: point.x,
            pageY: point.y,
            itemIndex: itemIndex
        };
    }




    return wbTools;
}());
