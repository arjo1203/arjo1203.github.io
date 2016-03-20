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
            tolerance: 4
        }
    };




    wbTools.toolsEvents.draw.onMouseDown = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex == -1) {
            var newPath = NerdBoard.makePath();
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
                currentItem.data.name = "Path";
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
            var trackedTouch = trackTouch(touch);
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.touchPoint, wbTools.hitOptions);
            if (touchHit) {
                var touchItem = touchHit.item;
                if(touchItem.data.name == "Path") {//Prevent erasing BG and BGImg
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
                if(touchItem.data.name == "Path") {//Prevent erasing BG and BGImg
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
        if (currentTouchIndex !== -1) {
            wbTools.currentTouches.splice(currentTouchIndex, 1);
        }
    };




    wbTools.toolsEvents.move.onMouseDown = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if(currentTouchIndex == -1) {
            var trackedTouch = trackTouch(touch);
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.touchPoint, wbTools.hitOptions);

            if (touchHit) {
                var touchItem = touchHit.item;

                if(touchItem.data.name == "BG") {
                    wbTools.selectingArea.data.x0 = trackedTouch.touchPoint.x;
                    wbTools.selectingArea.data.y0 = trackedTouch.touchPoint.y;
                    wbTools.selectingArea.data.selecting = true;
                }
                else {
                    trackedTouch.itemIndex = touchItem.index;
                    if(touchItem.parent.name !== "drawingLayer")
                        trackedTouch.itemIndex = touchItem.parent.index;
                    wbTools.currentTouches.push(trackedTouch);
                    NerdBoard.layers.drawing.children[trackedTouch.itemIndex].selected = true;
                }
            }
            else {
                return ;
            }
        }
    };
    wbTools.toolsEvents.move.onMouseDrag = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            if(currentTouch.itemIndex) {
                currentTouch.delta.x = touch.pageX - currentTouch.touchPoint.x;
                currentTouch.delta.y = touch.pageY - currentTouch.touchPoint.y;
                NerdBoard.layers.drawing.children[currentTouch.itemIndex].position = NerdBoard.layers.drawing.children[currentTouch.itemIndex].position.add(currentTouch.delta);
                currentTouch = trackTouch(touch, currentTouch.itemIndex);
                wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
            }
        }
    };
    wbTools.toolsEvents.move.onMouseUp = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            NerdBoard.layers.drawing.children[currentTouch.itemIndex].selected = false;
            wbTools.currentTouches.splice(currentTouchIndex, 1);
        }
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


            if(paperEvent.event.type == 'mousedown')
                wbTools.toolsEvents.move.onMouseDown(paperEvent.event);

            if(paperEvent.event.type == 'touchstart') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.move.onMouseDown(touch);
                }
            }
        };

        wbTools.tools.move.onMouseDrag = function(paperEvent) {
            paperEvent.preventDefault();
            if(paperEvent.event.type == 'mousemove')
                wbTools.toolsEvents.move.onMouseDrag(paperEvent.event);

            if(paperEvent.event.type == 'touchmove') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.move.onMouseDrag(touch);
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
            if(paperEvent.event.type == 'mouseup')
                wbTools.toolsEvents.move.onMouseUp(paperEvent.event);

            if(paperEvent.event.type == 'touchend') {
                var touches = paperEvent.event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    wbTools.toolsEvents.move.onMouseUp(touch);
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



    wbTools.makeCloseIcon = function() {
        var path1 = makePath(NerdBoard.colors.defaultRed, 4, "CloseIconPaths");
        path1.add({x: 0, y: 0}, {x: 150, y: 0});
        var path2 = path1.clone();
        path1.rotate(45);
        path2.rotate(-45);
        return new Group(path1, path2);
    };




    function trackTouch(touch, itemIndex, groupIndex, delta) {
        return {
            id: touch.identifier,
            touchPoint: {x: touch.pageX, y: touch.pageY},
            itemIndex: itemIndex || null,
            groupIndex: groupIndex || null,
            delta: delta || {}
        };
    }




    return wbTools;
}());
