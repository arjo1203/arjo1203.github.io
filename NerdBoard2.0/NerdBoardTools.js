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
        moveIcon: {},
        currentTouches: [],
        hitOptions: {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 15
        }
    };




    wbTools.toolsEvents.draw.onMouseDown = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex == -1) {
            var newPath = makePath();
            var trackedTouch = trackTouch(touch, newPath.index);
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.touchPoint, wbTools.hitOptions);
            if(touchHit.item.parent.data.name !== "BG"){
                trackedTouch.groupIndex = touchHit.item.parent.index;
            }
            wbTools.currentTouches.push(trackedTouch);
        }
    };
    wbTools.toolsEvents.draw.onMouseDrag = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            NerdBoard.layers.drawing.children[currentTouch.itemIndex].add(currentTouch.touchPoint);
            currentTouch = trackTouch(touch, currentTouch.itemIndex, currentTouch.groupIndex);
            wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
        }
    };
    wbTools.toolsEvents.draw.onMouseUp = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            var currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];
            if(currentItem.segments.length > 0) {
                currentItem.smooth();
                currentItem.simplify();
            }
            else {
                currentItem.remove();
                currentItem = new Path.Circle(currentTouch.touchPoint, NerdBoard.penStroke / 2);
                currentItem.fillColor = NerdBoard.penColor;
                currentItem.data.name = 'dot';
            }
            if(currentTouch.groupIndex) {
                NerdBoard.layers.drawing.children[currentTouch.groupIndex].addChild(currentItem);
            }
            wbTools.currentTouches.splice(currentTouchIndex, 1);
        }
    };




    wbTools.toolsEvents.eraser.onMouseDown = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex == -1) {
            var trackedTouch = trackTouch(touch, null);
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.touchPoint, wbTools.hitOptions);
            if (touchHit) {
                var touchItem = touchHit.item;
                if(touchItem.data.name != "BG") {//Prevent erasing BG and BGImg
                    touchItem.remove();
                }
                trackedTouch.itemIndex = touchItem.index;
                wbTools.currentTouches.push(trackedTouch);
            }
            else {
                return ;
            }
        }
    };
    wbTools.toolsEvents.eraser.onMouseDrag = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            var touchHit = NerdBoard.layers.drawing.hitTest(currentTouch.touchPoint, wbTools.hitOptions);
            if (touchHit) {
                var touchItem = touchHit.item;
                if(touchItem.data.name != "BG") {//Prevent erasing BG and BGImg
                    touchItem.remove();
                }
                currentTouch = trackTouch(touch, currentTouch.itemIndex);
                wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
            }
            else {
                return ;
            }
        }
    };
    wbTools.toolsEvents.eraser.onMouseUp = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1)
            wbTools.currentTouches.splice(currentTouchIndex, 1);
    };




    wbTools.createPaperTools = function() {
        makeDrawingTool();
        makeEraserTool();
        makeSelectingGroups();
        makeMoveTool();
        makeNoneTool();

        // Set up an event listener to catch cancelled touches.
        NerdBoard.canvas.addEventListener('touchcancel', function(e) {
            touchCancelled(e);
        });
    };




    function makeDrawingTool() {
        //Use the HTML5 Canvas API to track the touches
        //Use paper to draw the paths
        wbTools.tools.draw = new Tool();
        wbTools.tools.draw.onMouseDown = function(paperEvent) {
            paperEvent.preventDefault();
            NerdBoard.layers.drawing.activate();
            
            if (paperEvent.event.type == 'mousedown') {
                if (paperEvent.event.which == 1)//Capture only the left click when drawing
                    wbTools.toolsEvents.draw.onMouseDown(paperEvent.event);
            }

            if(paperEvent.event.type == 'touchstart') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.draw.onMouseDown(touch);
                }
            }
        };
        wbTools.tools.draw.onMouseDrag = function(paperEvent) {
            paperEvent.preventDefault();

            if (paperEvent.event.type == 'mousemove')
                wbTools.toolsEvents.draw.onMouseDrag(paperEvent.event);


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

            if (paperEvent.event.type == 'mouseup')
                wbTools.toolsEvents.draw.onMouseUp(paperEvent.event);

            if(paperEvent.event.type == 'touchend') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.draw.onMouseUp(touch);
                }
            }
        };
        wbTools.tools.draw.onKeyDown = function(paperEvent) {
            if(paperEvent.key == 'z')
                NerdBoard.undo();
            else if(paperEvent.key == 'c') {
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

            if(paperEvent.event.type == 'mousedown')
                wbTools.toolsEvents.eraser.onMouseDown(paperEvent.event);
            if(paperEvent.event.type == 'touchstart') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.eraser.onMouseDown(touch);
                }
            }
        };
        wbTools.tools.erase.onMouseDrag = function(paperEvent) {
            paperEvent.preventDefault();

            if(paperEvent.event.type == 'mousemove')
                wbTools.toolsEvents.eraser.onMouseDrag(paperEvent.event);

            if(paperEvent.event.type == 'touchmove') {
                var touches = paperEvent.event.changedTouches;

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.eraser.onMouseDrag(touch);
                }
            }
        };
        wbTools.tools.erase.onMouseUp = function(paperEvent) {
            paperEvent.preventDefault();

            if(paperEvent.event.type == 'mouseup')
                wbTools.toolsEvents.eraser.onMouseUp(paperEvent.event);

            if(paperEvent.event.type == 'touchend') {
                var touches = paperEvent.event.changedTouches;

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.eraser.onMouseUp(touch);
                }
            }
        };
        wbTools.tools.erase.minDistance = 0;
        wbTools.tools.erase.maxDistance = 2;
    }




    wbTools.toolsEvents.move.onMouseDown = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex == -1) {
            var trackedTouch = trackTouch(touch, null);
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.touchPoint, wbTools.hitOptions);

            if (touchHit) {
                var touchItem = touchHit.item;
                if(touchItem.data.name == "BG") {
                    wbTools.selectingArea.data.x0 = point.x;
                    wbTools.selectingArea.data.y0 = point.y;
                    wbTools.selectingArea.data.selecting = true;
                }
                else {
                    trackedTouch.itemIndex = touchItem.index;
                    wbTools.currentTouches.push(trackedTouch);
                }
            }
            else {
                return ;
            }
        }
    };




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

                var mouseHit = NerdBoard.layers.drawing.hitTest(paperEvent.point, wbTools.hitOptions);
                if (mouseHit) {
                    var mouseItem = mouseHit.item;

                    itemIndex = mouseItem.index;
                    if(mouseItem.parent.name !== "drawingLayer")
                        itemIndex = mouseItem.parent.index;

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
                        NerdBoard.layers.drawing.children[itemIndex].selected = true;
                        //Store the trackedTouch
                        wbTools.currentTouches.push(trackMouse);
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
                        var touchHit = NerdBoard.layers.drawing.hitTest(point, wbTools.hitOptions);

                        if (touchHit) {
                            var touchItem = touchHit.item;
                            
                            itemIndex = touchItem.index;
                            if(touchItem.parent.name !== "drawingLayer")
                                itemIndex = touchItem.parent.index;

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
                                NerdBoard.layers.drawing.children[itemIndex].selected = true;

                                //Store the trackedTouch
                                wbTools.currentTouches.push(trackedTouch);
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
                    currentTouch = wbTools.currentTouches[currentTouchIndex];

                    //console.log(wbTools.currentTouches);
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
                        wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
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
                        currentTouch = wbTools.currentTouches[currentTouchIndex];

                        if(currentTouch.itemIndex) {
                            currentItem = NerdBoard.layers.drawing.children[currentTouch.itemIndex];

                            currentItem.position = new Point({x: currentTouch.pageX, y: currentTouch.pageY});

                            // Update the trackedTouch record.
                            currentTouch.pageX = touch.pageX;
                            currentTouch.pageY = touch.pageY;

                            // Store the record of the trackedTouch.
                            wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
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
                    var currentTouch = wbTools.currentTouches[currentTouchIndex];
                    // Store the record of the trackedTouch.
                    NerdBoard.layers.drawing.children[currentTouch.itemIndex].selected = false;
                    wbTools.currentTouches.splice(currentTouchIndex, 1);
                }
            }

            if(paperEvent.event.type == 'touchend') {
                var touches = paperEvent.event.changedTouches;

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var currentTouchIndex = findTrackedTouch(touch.identifier);

                    if (currentTouchIndex !== -1) {
                        // Remove the record of the touch and path record.
                        NerdBoard.layers.drawing.children[currentTouch.itemIndex].selected = false;
                        wbTools.currentTouches.splice(currentTouchIndex, 1);
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




    function makeNoneTool() {
        wbTools.tools.none = new paper.Tool();
    }




    // Removes cancelled touches from the wbTools.currentTouches array.
    function touchCancelled(event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findTrackedTouch(touch.identifier);
            if (currentTouchIndex !== -1 && currentItemIndex !== -1 ) {
                // Remove the touch record and path record.
                wbTools.currentTouches.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch' + i.toString() + 'was not found!');
            }
        }
    }




    // Finds the array index of a trackedTouch in the wbTools.currentTouches array.
    function findTrackedTouch(touchId) {
        for (var i = 0; i < wbTools.currentTouches.length; i++)
            if (wbTools.currentTouches[i].id === touchId)
                return i;
        return -1; // Touch not found! Return -1.
    }



    function handleTouch(touch) {
        if(!touch.identifier)//Handles mouse
            touch.identifier = 0;
        return findTrackedTouch(touch.identifier);
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




    function trackTouch(touch, itemIndex, groupIndex) {
        return {
            id: touch.identifier,
            touchPoint: {x: touch.pageX, y: touch.pageY},
            itemIndex: itemIndex,
            groupIndex: groupIndex || null
        };
    }




    return wbTools;
}());
