/**
 * Created by Jose Araujo on 07/22/15.
 */



NerdBoard.Tools = (function() {

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
    wbTools.tools.draw = new Tool();
    wbTools.tools.draw.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        NerdBoard.layers.drawing.activate();

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
                currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];

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
                currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];

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


    var selections = new Group();
    var selectingArea = new paper.Path.Rectangle({
        center: new Point({x: -2000,y: 0}),
        size: [2, 2],
        fillColor: '#e9e9ff',
        strokeWidth: 2,
        opacity: .5,
        selected: true,
        data: {
            name: "selectingArea",
            width: 1,
            height: 1,
            x0: 0,
            y0: 0,
            selecting: false
        }
    });


    var selectingCenter = new Raster('MoveIcon');
    selectingCenter.position.x -= 2000;
    selectingCenter.opacity = 0;
    NerdBoard.scaleImg(selectingCenter, smallIcon);
    selectingCenter.onMouseDown =  function() {
        selectingArea.data.selecting = false;
    };
    selectingCenter.onMouseUp =  function() {
        if(selections.children.length > 0) {
            selections.selected = false;
            var childrenRemoved = selections.removeChildren();
            NerdBoard.layers.drawing.addChildren(childrenRemoved);
        }
        selectingCenter.position.x -= 2000;
        selectingCenter.opacity = 0;
        if(selectingArea.data.selecting) {
            if(selections.children.length > 0) {
                selectingArea.fitBounds(selections.bounds);
                selectingCenter.position = selectingArea.position;
                selectingCenter.opacity = 1;
            }
            else {
                selectingArea.position.x -= 2000;
            }
            selectingArea.data.selecting = false;
        }
    };
    selectingCenter.onMouseDrag = function(event) {
        this.position = event.point;
        selectingArea.position = event.point;
        selections.position = event.point;
    };


    wbTools.tools.move = new paper.Tool();
    wbTools.tools.move.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();
        if(selections.children.length > 0 && selectingCenter.opacity != 1) {//Prevents bubbling when selectingCenter is seen
            selections.selected = false;
            var childrenRemoved = selections.removeChildren();
            NerdBoard.layers.drawing.addChildren(childrenRemoved);
            selectingCenter.position.x -= 2000;
            selectingCenter.opacity = 0;
        }

        var itemIndex;
        if(paperEvent.event.type == 'mousedown') {
            var x = paperEvent.event.x, y = paperEvent.event.y;

            var mouseHit = NerdBoard.layers.drawing.hitTest(paperEvent.point, hitOptions);
            if (mouseHit) {
                var mouseItem = mouseHit.item;
                itemIndex = mouseItem.index;
                if(mouseItem.data.name == "BG") {
                    selectingArea.data.x0 = x;
                    selectingArea.data.y0 = y;
                    selectingArea.data.selecting = true;
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
                            selectingArea.data.x0 = point.x;
                            selectingArea.data.y0 = point.y;
                            selectingArea.data.selecting = true;
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

        if(selectingArea.data.selecting && selectingCenter.opacity != 1) {
            var SW = selectingArea._segments[0],
                NW = selectingArea._segments[1],
                NE = selectingArea._segments[2],
                SE = selectingArea._segments[3];
            NW.point = new Point({x: selectingArea.data.x0, y: selectingArea.data.y0});
            SW.point = new Point({x: selectingArea.data.x0, y: paperEvent.point.y});
            NE.point = new Point({x: paperEvent.point.x, y: selectingArea.data.y0});
            SE.point = new Point({x: paperEvent.point.x, y: paperEvent.point.y});

            showSelecting();
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

        if(selectingArea.data.selecting) {
            if(selections.children.length > 0) {
                selectingArea.fitBounds(selections.bounds);
                selectingCenter.position = selectingArea.position;
                selectingCenter.opacity = 1;
            }
            else {
                selectingArea.position.x -= 2000;
            }
            selectingArea.data.selecting = false;
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

        //var state = $('#drawAfterCheckbox')[0].checked;
        //
        //if(state) {
        //    NerdBoard.activateDrawMode();
        //    toolIcon.attr('src', 'icons/pencil.png');
        //}
    };
    wbTools.tools.shape.minDistance = 0;
    wbTools.tools.shape.maxDistance = 2;

    wbTools.tools.none = new paper.Tool();


    // Set up an event listener to catch cancelled touches.
    NerdBoard.canvas.addEventListener('touchcancel', function(e) {
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
        for(var i = 1; i < NerdBoard.layers.drawing.children.length; i++) {
            if (NerdBoard.layers.drawing.children[i].position.isInside(selectingArea)) {
                NerdBoard.layers.drawing.children[i].selected = true;
                selections.addChild(NerdBoard.layers.drawing.children[i]);
            }
            else {
                NerdBoard.layers.drawing.children[i].selected = false;
            }
        }
    }


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
        NerdBoard.layers.drawing.children[1].sendToBack();
    };

    return wbTools;
}());
