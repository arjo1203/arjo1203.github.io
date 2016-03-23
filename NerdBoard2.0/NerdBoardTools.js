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
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.point, wbTools.hitOptions);
            if(touchHit.item.parent.data.name == "drawingLayer") {
                trackedTouch.groupIndex = null;
            }
            else if(touchHit.item.parent.data.name !== "BG"){
                trackedTouch.groupIndex = touchHit.item.parent.index;
            }
            wbTools.currentTouches.push(trackedTouch);
        }
    };
    wbTools.toolsEvents.draw.onMouseDrag = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            NerdBoard.layers.drawing.children[currentTouch.itemIndex].add(currentTouch.point);
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
                currentItem.simplify();
            }
            else {
                currentItem.remove();
                currentItem = new Path.Circle(currentTouch.point, NerdBoard.penStroke / 2);
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
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.point, wbTools.hitOptions);
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
            var touchHit = NerdBoard.layers.drawing.hitTest(currentTouch.point, wbTools.hitOptions);
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
            var touchHit = NerdBoard.layers.drawing.hitTest(trackedTouch.point, wbTools.hitOptions);

            if (touchHit) {
                var touchItem = touchHit.item;

                if(touchItem.data.name == "BG") {
                    wbTools.selectingArea.data.selecting = true;
                    wbTools.selectingArea.children[3].onMouseDown(trackedTouch);
                    wbTools.selectingArea.children[2].onMouseDown(trackedTouch);
                    wbTools.selectingArea.children[1].onMouseDown(trackedTouch);
                    wbTools.selectingArea.children[4].onMouseDown(trackedTouch);
                    trackedTouch.itemIndex = null;
                }
                else {
                    if(touchItem.parent.data.name !== "SelectedPaths") {
                        if(touchItem.data.name !== "SelectingAreaCorners") {
                            trackedTouch.itemIndex = touchItem.index;
                            if (touchItem.parent.data.name !== "drawingLayer")
                                trackedTouch.itemIndex = touchItem.parent.index;
                            //NerdBoard.layers.drawing.children[trackedTouch.itemIndex].selected = true;
                        }
                        else {
                            trackedTouch.itemIndex = null;
                        }
                    }
                }

                wbTools.currentTouches.push(trackedTouch);
            }
            else {
                return ;
            }
        }

        if(wbTools.selectedPaths.children.length > 0 && wbTools.moveIcon.opacity != 1) {//Prevents bubbling when wbTools.moveIcon is seen
            wbTools.selectedPaths.selected = false;
            NerdBoard.layers.drawing.addChildren(wbTools.selectedPaths.removeChildren());
            wbTools.moveIcon.position.x -= 2000;
            wbTools.moveIcon.opacity = 0;
        }
    };
    wbTools.toolsEvents.move.onMouseDrag = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];
            currentTouch.delta.x = touch.pageX - currentTouch.point.x;
            currentTouch.delta.y = touch.pageY - currentTouch.point.y;

            if (currentTouch.itemIndex) {
                NerdBoard.layers.drawing.children[currentTouch.itemIndex].position = NerdBoard.layers.drawing.children[currentTouch.itemIndex].position.add(currentTouch.delta);
            }

            if (wbTools.selectingArea.data.selecting) {
                wbTools.selectingArea.children[3].onMouseDown(currentTouch);
                showSelection();
                addSelectedToSelectedPaths();
            }

            currentTouch = trackTouch(touch, currentTouch.itemIndex);
            wbTools.currentTouches.splice(currentTouchIndex, 1, currentTouch);
        }
    };
    wbTools.toolsEvents.move.onMouseUp = function(touch) {
        var currentTouchIndex = handleTouch(touch);
        if (currentTouchIndex !== -1) {
            var currentTouch = wbTools.currentTouches[currentTouchIndex];

            //if (currentTouch.itemIndex) {
            //    NerdBoard.layers.drawing.children[currentTouch.itemIndex].selected = false;
            //}

            wbTools.currentTouches.splice(currentTouchIndex, 1);
        }

        if(wbTools.selectingArea.data.selecting) {
            if(wbTools.selectedPaths.children.length > 0) {
                wbTools.selectingArea.children[0].setBounds(wbTools.selectingArea.data.boundingBox);
                positionCorners();
                wbTools.moveIcon.position = wbTools.selectingArea.children[0].bounds.center;
                wbTools.moveIcon.opacity = 1;
            }
            else {
                wbTools.selectingArea.position.x -= 2000;
            }
            wbTools.selectingArea.data.selecting = false;
        }
    };




    wbTools.createPaperTools = function() {
        makeDrawingTool();
        makeEraserTool();
        makeMoveTool();
        makeNoneTool();
        makeSelectingGroups();

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
        wbTools.tools.draw.minDistance = 5;
        wbTools.tools.draw.maxDistance = 10;
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
        wbTools.tools.erase.minDistance = 5;
        wbTools.tools.erase.maxDistance = 10;
    }




    function makeMoveTool() {
        wbTools.tools.move = new paper.Tool();
        wbTools.tools.move.onMouseDown = function(paperEvent) {
            paperEvent.preventDefault();
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
        };
        wbTools.tools.move.minDistance = 5;
        wbTools.tools.move.maxDistance = 10;
    }




    function makeSelectingGroups() {
        NerdBoard.layers.drawing.activate();
        wbTools.selectingArea = makeSelectingRect();
        wbTools.selectingArea.position.x = -4000;

        wbTools.selectedPaths = new Group();
        wbTools.selectedPaths.data.name = "SelectedPaths";



        wbTools.moveIcon = new Raster('MoveIcon');
        wbTools.moveIcon.position.x -= 2000;
        wbTools.moveIcon.opacity = 0;
        wbTools.moveIcon.data.name = "SelectingAreaIcon";
        NerdBoard.scaleImg(wbTools.moveIcon, {width: 32, height: 32});

        wbTools.moveIcon.onMouseUp =  function() {
            if(wbTools.selectedPaths.children.length > 0 && wbTools.moveIcon.opacity == 1) {//Prevents bubbling when wbTools.moveIcon is seen
                wbTools.selectedPaths.selected = false;
                var children = wbTools.selectedPaths.removeChildren();
                children.selected = false;
                NerdBoard.layers.drawing.addChildren(children);

                wbTools.selectingArea.position.x -= 2000;
                wbTools.selectingArea.data.boundingBox = null;

                wbTools.moveIcon.position.x -= 2000;
                wbTools.moveIcon.opacity = 0;
            }
        };
        wbTools.moveIcon.onMouseDrag = function(event) {
            wbTools.selectingArea.position = wbTools.selectingArea.position.add(event.delta);
            wbTools.selectedPaths.position = wbTools.selectedPaths.position.add(event.delta);
        };
    }




    function makeSelectingRect() {
        var selectingRect = new paper.Path.Rectangle({
            center: new Point({x: 0,y: 0}),
            size: [200, 200],
            fillColor: NerdBoard.colors.selecting,
            strokeColor: NerdBoard.colors.selected,
            strokeWidth: 2,
            data: {
                name: "SelectingRect"
            }
        });
        var cornerSize = {width: 12, height: 12};
        var topRight = NerdBoard.UI.makeRect(selectingRect.bounds.topRight, cornerSize, NerdBoard.colors.selected, NerdBoard.colors.selected, {name: "SelectingAreaCorners"});
        var topLeft = NerdBoard.UI.makeRect(selectingRect.bounds.topLeft, cornerSize, NerdBoard.colors.selected, NerdBoard.colors.selected, {name: "SelectingAreaCorners"});
        var bottomRight = NerdBoard.UI.makeRect(selectingRect.bounds.bottomRight, cornerSize, NerdBoard.colors.selected, NerdBoard.colors.selected, {name: "SelectingAreaCorners"});
        var bottomLeft = NerdBoard.UI.makeRect(selectingRect.bounds.bottomLeft, cornerSize, NerdBoard.colors.selected, NerdBoard.colors.selected, {name: "SelectingAreaCorners"});

        topRight.onMouseDown = function(event) {
            cornersOnMouseDown(event, selectingRect, topRight, topLeft, bottomRight, {a: 1, b: 2, c: 3});
        };
        topRight.onMouseDrag = function(event) {
            cornersOnMouseDrag(event, selectingRect, topRight, topLeft, bottomRight, {a: 1, b: 2, c: 3});
        };

        topLeft.onMouseDown = function(event) {
            cornersOnMouseDown(event, selectingRect, topLeft, topRight, bottomLeft, {a: 2, b: 1, c: 0});
        };
        topLeft.onMouseDrag = function(event) {
            cornersOnMouseDrag(event, selectingRect, topLeft, topRight, bottomLeft, {a: 2, b: 1, c: 0});
        };

        bottomRight.onMouseDown = function(event) {
            cornersOnMouseDown(event, selectingRect, bottomRight, bottomLeft, topRight, {a: 0, b: 3, c: 2});
        };
        bottomRight.onMouseDrag = function(event) {
            cornersOnMouseDrag(event, selectingRect, bottomRight, bottomLeft, topRight, {a: 0, b: 3, c: 2});
        };

        bottomLeft.onMouseDown = function(event) {
            cornersOnMouseDown(event, selectingRect, bottomLeft, bottomRight, topLeft, {a: 3, b: 0, c: 1});
        };
        bottomLeft.onMouseDrag = function(event) {
            cornersOnMouseDrag(event, selectingRect, bottomLeft, bottomRight, topLeft, {a: 3, b: 0, c: 1});
        };

        var selectingArea = new Group(selectingRect, topRight, topLeft, bottomRight, bottomLeft);
        selectingArea.data = {
            name: "SelectingArea",
            width: 1,
            height: 1,
            x0: 0,
            y0: 0,
            selecting: false,
            boundingBox: null
        };
        selectingArea.opacity = .5;

        return selectingArea;
    }




    function cornersOnMouseDown(event, selectingRect, box1, box2, box3, segments) {
        box1.position = event.point;
        box2.position.y = box1.position.y;
        box3.position.x = box1.position.x;
        selectingRect.segments[segments.a].point.y = box1.position.y;
        selectingRect.segments[segments.b].point = box1.position;
        selectingRect.segments[segments.c].point.x = box1.position.x;
    }




    function cornersOnMouseDrag(event, selectingRect, box1, box2, box3, segments) {
        box1.position = box1.position.add(event.delta);
        box2.position.y = box1.position.y;
        box3.position.x = box1.position.x;
        selectingRect.segments[segments.a].point.y = box1.position.y;
        selectingRect.segments[segments.b].point = box1.position;
        selectingRect.segments[segments.c].point.x = box1.position.x;

        if(!wbTools.selectingArea.data.selecting) {
            wbTools.moveIcon.position = wbTools.selectingArea.children[0].bounds.center;
            wbTools.selectedPaths.setBounds(wbTools.selectingArea.children[0].bounds);
        }
    }




    function positionCorners() {
        wbTools.selectingArea.children[1].position = wbTools.selectingArea.children[0].segments[2].point;
        wbTools.selectingArea.children[2].position = wbTools.selectingArea.children[0].segments[1].point;
        wbTools.selectingArea.children[3].position = wbTools.selectingArea.children[0].segments[3].point;
        wbTools.selectingArea.children[4].position = wbTools.selectingArea.children[0].segments[0].point;
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
        for(var i = 4; i < NerdBoard.layers.drawing.children.length; i++) {
            NerdBoard.layers.drawing.children[i].selected = NerdBoard.layers.drawing.children[i].position.isInside(wbTools.selectingArea.children[0]);
            NerdBoard.layers.drawing.children[i].data.wasSelected = NerdBoard.layers.drawing.children[i].position.isInside(wbTools.selectingArea.children[0]);
        }
    }



    function addSelectedToSelectedPaths() {
        for(var i = 4; i < NerdBoard.layers.drawing.children.length; i++) {
            var item = NerdBoard.layers.drawing.children[i];
            if (item.data.wasSelected) {
                wbTools.selectedPaths.addChild(item);
                if(!wbTools.selectingArea.data.boundingBox) {
                    wbTools.selectingArea.data.boundingBox = item.bounds;
                }
                wbTools.selectingArea.data.boundingBox = wbTools.selectingArea.data.boundingBox.unite(item.bounds);
            }
        }
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
            point: {x: touch.pageX, y: touch.pageY},
            itemIndex: itemIndex || null,
            groupIndex: groupIndex || null,
            delta: delta || {x:0, y:0}
        };
    }




    return wbTools;
}());