/**
 * Created by Jose Araujo on 07/22/15.
 */

paper.setup(NerdBoard.canvas[0]);


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


    function dynamicStroke(event) {
        var step, avgStep;

        step = new paper.Point({x: event.delta.x, y: event.delta.y});
        step.angle += 90;

        if(myPath.segments.length > 1) {
            var lastSegment = myPath.segments[myPath.segments.length - 1];
            var lastLength = new paper.Point({x: (lastSegment._handleIn.x - lastSegment._handleOut.x) / 2, y: (lastSegment._handleIn.y - lastSegment._handleOut.y) / 4});
            avgStep = addPoints(lastLength, new paper.Point({x: step.x / 2, y: step.y / 2}));
        }
        else {
            avgStep = step;
        }

        var thickness = .5;
        var top = new paper.Point({x: event.middlePoint.x + avgStep.x * thickness, y: event.middlePoint.y + avgStep.y * thickness});
        var bottom = new paper.Point({x: event.middlePoint.x - avgStep.x * thickness, y: event.middlePoint.y - avgStep.y * thickness});

        myPath.add(top);
        myPath.insert(0, bottom);
        myPath.smooth();
    }


    //Create arrays to store touches and paths
    var currentTouches = [];

    //Use the HTML5 Canvas API to track the touches
    //Use paper to draw the paths

    wbTools.tools.draw = new Tool();
    wbTools.tools.draw.onMouseDown = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mousedown') {
            //Create a new path for the trackedTouch
            new Path({
                strokeColor: NerdBoard.penColor, // NerdBoardOriginal is the global module from whiteboard.js
                strokeWidth: NerdBoard.penStroke,
                strokeCap: 'round',
                data: {
                    touchId: 0
                }
            });
        }

        if(paperEvent.event.type == 'touchstart') {
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
                    new Path({
                        strokeColor: NerdBoard.penColor, // NerdBoardOriginal is the global module from whiteboard.js
                        strokeWidth: NerdBoard.penStroke,
                        strokeCap: 'round',
                        data: {
                            touchId: touch.identifier
                        }
                    });
                }
            }
        }
    };
    wbTools.tools.draw.onMouseDrag = function(paperEvent) {
        //console.log(paperEvent.event.type);
        paperEvent.preventDefault();

        var currentItemIndex, currentItem;

        if(paperEvent.event.type == 'mousemove') {
            currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                currentItem = paper.project.activeLayer.children[currentItemIndex];
                currentItem.add(paperEvent.point);
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentItemIndex];

                    //Creates a paper point based on the currentTouch position.
                    var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.add(point);
                    //currentItem.smooth();

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

        var currentItemIndex, currentItem, dot;

        if(paperEvent.event.type == 'mouseup') {
            currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                currentItem = paper.project.activeLayer.children[currentItemIndex];

                if(currentItem._segments.length > 0) {
                    currentItem.data = {
                        name: NerdBoard.pathName
                    };
                    currentItem.smooth();
                    currentItem.simplify();
                }
                else {
                    currentItem.remove();
                    dot = new Path.Circle(paperEvent.point, NerdBoard.penStroke / 2);
                    dot.fillColor = NerdBoard.penColor;
                    dot.data.name = NerdBoard.pathName + 'dot';
                }
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    //Finds the path associated with the currentTouchIndex
                    var currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentItemIndex];

                    if(currentItem._segments.length > 0) {
                        currentItem.smooth();
                        currentItem.simplify();

                        currentItem.data = {
                            name: NerdBoard.pathName
                        };
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
                    console.log('Touch was not found!');
                }
            }
        }
    };
    wbTools.tools.draw.onKeyDown = function(paperEvent) {
        if(paperEvent.key == 'z') {
            NerdBoard.undo();
        }
        if(paperEvent.key == 'c') {
            NerdBoard.clear();
        }
    };
    wbTools.tools.draw.minDistance = 0;
    wbTools.tools.draw.maxDistance = 2;


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
            var currentItemIndex = findItemInPaper(touch.identifier);

            if (currentTouchIndex !== -1 && currentItemIndex !== -1 ) {
                // Remove the touch record and path record.
                currentTouches.splice(currentTouchIndex, 1);

                //Finds the path associated with the currentTouchIndex
                var currentItem = paper.project.activeLayer.children[currentItemIndex];

                if(currentItem.data.touchId) {
                    delete currentItem.data.touchId;
                }
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







    wbTools.tools.erase = new paper.Tool();
    wbTools.tools.erase.onMouseDown = function() {
        var hitResult = project.hitTest(event.point, hitOptions);

        if (hitResult) {
            pathHit = hitResult.item;
            if(pathHit.data.name !== 'bg') {
                pathHit.remove();
            }
        }
        else {
            return ;
        }
    };
    wbTools.tools.erase.onMouseDrag = function(event) {
        var hitResult = project.hitTest(event.point, hitOptions);

        if (hitResult) {
            pathHit = hitResult.item;
            if(pathHit.data.name !== 'bg') {
                pathHit.remove();
            }
        }
        else {
            return ;
        }
    };
    wbTools.tools.erase.minDistance = 1;
    wbTools.tools.erase.maxDistance = 3;


    wbTools.tools.shape = new paper.Tool();
    wbTools.tools.shape.onMouseDown = function(event) {
        wbTools.drawShape(event.point, NerdBoard.shape, $('#textInput')[0].value);
    };
    wbTools.tools.shape.onMouseDrag = function(event) {
        var last = paper.project.activeLayer.children[paper.project.activeLayer.children.length - 1];
        last.position = event.point;
    };
    wbTools.tools.shape.onMouseUp = function(event) {
        var state = $('#drawAfterCheckbox')[0].checked;

        if(state) {
            updateToDrawMode();
        }
    };
    wbTools.tools.shape.minDistance = 1;
    wbTools.tools.shape.maxDistance = 3;


    wbTools.tools.move = new paper.Tool();
    wbTools.tools.move.onMouseDown = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mousedown') {
            var mouseHit = project.hitTest(paperEvent.point, hitOptions);
            if (mouseHit) {
                var mouseItem = mouseHit.item;
                var mouseParent = mouseItem._parent;
                var mouseParentName = mouseParent.name;

                if(mouseParentName == 'layer1') {
                    mouseItem.data.touchId = 0;
                }
                else {
                    mouseParent.data.touchId = 0;
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

                    //Track the newly created touch
                    var trackedTouch = {
                        id: touch.identifier,
                        pageX: touch.pageX,
                        pageY: touch.pageY
                    };

                    //Store the trackedTouch
                    currentTouches.push(trackedTouch);

                    var point = new Point({x: touch.pageX, y: touch.pageY});
                    var touchHit = project.hitTest(point, hitOptions);
                    if (touchHit) {
                        var touchItem = touchHit.item;
                        var touchParent = touchItem._parent;
                        var touchParentName = touchParent.name;
                        console.log(touchParentName);

                        if(touchParentName == 'layer1') {
                            touchItem.data.touchId = 0;
                        }
                        else {
                            touchParent.data.touchId = 0;
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

        var currentItem, currentItemIndex, firstThree, id;


        if(paperEvent.event.type == 'mousemove') {
            currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                currentItem = paper.project.activeLayer.children[currentItemIndex];

                if (currentItem.data.name !== 'bg') {
                    currentItem.position.x += paperEvent.delta.x;
                    currentItem.position.y += paperEvent.delta.y;
                }
            }
        }


        if(paperEvent.event.type == 'touchmove') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    var currentTouch = currentTouches[currentTouchIndex];
                    currentItem = paper.project.activeLayer.children[currentItemIndex];

                    var point = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                    currentItem.position = point;

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
    wbTools.tools.move.onMouseUp = function(paperEvent) {
        paperEvent.preventDefault();

        if(paperEvent.event.type == 'mouseup') {
            var currentItemIndex = findItemInPaper(0);

            if (currentItemIndex !== -1) {
                var currentItem = paper.project.activeLayer.children[currentItemIndex];
                delete currentItem.data.touchId;
            }
        }

        if(paperEvent.event.type == 'touchend') {
            var touches = paperEvent.event.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var currentTouchIndex = findTrackedTouch(touch.identifier);
                var currentItemIndex = findItemInPaper(touch.identifier);

                if (currentTouchIndex !== -1 && currentItemIndex !== -1) {
                    //Finds the path associated with the currentTouchIndex
                    var currentItem = paper.project.activeLayer.children[currentItemIndex];
                    delete currentItem.data.touchId;

                    // Remove the record of the touch and path record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch was not found!');
                }
            }
        }
    };
    wbTools.tools.move.minDistance = 0;
    wbTools.tools.move.maxDistance = 2;


    wbTools.tools.pan = new paper.Tool();
    wbTools.tools.pan.onMouseDrag = function(event) {
        paper.project.activeLayer.position.x += event.delta.x;
        paper.project.activeLayer.position.y += event.delta.y;
    };
    wbTools.tools.pan.minDistance = 1;
    wbTools.tools.pan.maxDistance = 3;





    wbTools.drawBg= function () {
        new Path.Rectangle({
            center: paper.view.center,
            size: [NerdBoard.width, NerdBoard.height],
            fillColor: NerdBoard.colors.defaultBg,
            name: 'bg',
            data: {
                name: 'bg'
            }
        });

        paper.project.activeLayer.name = 'layer1';

        paper.view.update();
    };
    wbTools.drawBg();


    wbTools.resizeBg = function() {
        var SW = paper.project.activeLayer.children['bg']._segments[0],
            NW = paper.project.activeLayer.children['bg']._segments[1],
            NE = paper.project.activeLayer.children['bg']._segments[2],
            SE = paper.project.activeLayer.children['bg']._segments[3];

        NW._point._x = 0;
        NW._point._y = 0;

        SW._point._x = 0;
        SW._point._y = NerdBoard.height;

        NE._point._x = NerdBoard.width;
        NE._point._y = 0;

        SE._point._x = NerdBoard.width;
        SE._point._y = NerdBoard.height;
    };

    wbTools.loadRaster = function(image) {
        var raster = new paper.Raster({
            source: image,
            position: paper.view.center
        });
        raster.fitBounds(paper.view.bounds);
    };


    wbTools.undo = function() {
        var children = paper.project.activeLayer.children;
        var lastIndex = children.length - 1;

        if(children.length > 0 && children[lastIndex].data.name !== 'bg'){
            children[lastIndex].remove();
        }
        paper.view.draw();
    };


    wbTools.clear = function() {
        while(paper.project.activeLayer.children.length > 1){
            paper.project.activeLayer.children[paper.project.activeLayer.children.length - 1].remove();
        }
        paper.view.draw();
    };


    wbTools.changeBgColor = function() {
        var bg = paper.project.activeLayer.children['bg'];
        bg.fillColor = NerdBoard.bgColor;

        paper.view.draw();
    };


    wbTools.drawShape = function(location, shape, message) {

        switch(shape) {
            case 'Terminal':
                var terminal = createTerminal(location, message);
                terminal.name = 'group' + NerdBoard.numOfShapes.toString();
                break;
            case 'Process':
                var process = createProcess(location, message);
                process.name = 'group' + NerdBoard.numOfShapes.toString();
                break;
            case 'Decision':
                var decision = createDecision(location, message);
                decision.name = 'group' + NerdBoard.numOfShapes.toString();
                break;
            case 'Input':
                var input = createInput(location, message);
                input.name = 'group' + NerdBoard.numOfShapes.toString();
                break;
            case 'Text':
                var text = createText(location, message);
                text.data.name = 'plainText';
                break;
        }


        function createTerminal(pos, message) {
            var rect = new paper.Path.Rectangle({
                center: pos,
                size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 18)), NerdBoard.textSize + 10],
                fillColor: NerdBoard.colors.defaultBlue,
                strokeColor: NerdBoard.colors.defaultBlack,
                strokeWidth: 2,
                radius: NerdBoard.textSize / 2,
                data: {
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Terminal'
                }
            });

            var text = new PointText({
                content: message,
                data: {
                    name: 'text' + NerdBoard.numOfShapes.toString()
                }
            });
            text.style = {
                fontFamily: 'sans-serif',
                fontSize: NerdBoard.textSize,
                justification: 'center'
            };
            text.fitBounds(rect.bounds);

            var group = new Group(rect, text);

            return group;
        }


        function createProcess(pos, message) {
            var rect = new paper.Path.Rectangle({
                center: pos,
                size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 12)), NerdBoard.textSize + 10],
                fillColor: NerdBoard.colors.defaultYellow,
                strokeColor: NerdBoard.colors.defaultBlack,
                strokeWidth: 2,
                data: {
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Process'
                }
            });

            var text = new PointText({
                content: message,
                data: {
                    name: 'text' + NerdBoard.numOfShapes.toString()
                }
            });
            text.style = {
                fontFamily: 'sans-serif',
                fontSize: NerdBoard.textSize,
                justification: 'center'
            };
            text.fitBounds(rect.bounds);


            var group = new Group(rect, text);

            return group;
        }


        function createDecision(pos, message) {
            var rect = new paper.Path.Rectangle({
                center: pos,
                size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 5)), (NerdBoard.textSize * message.length) / ( 1 + (message.length / 5))],
                fillColor: NerdBoard.colors.defaultGreen,
                strokeColor: NerdBoard.colors.defaultBlack,
                strokeWidth: 2,
                data: {
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Decision'
                }
            });
            rect.rotate(45);

            var text = new PointText({
                content: message,
                data: {
                    name: 'text' + NerdBoard.numOfShapes.toString()
                }
            });
            text.style = {
                fontFamily: 'sans-serif',
                fontSize: NerdBoard.textSize,
                justification: 'center'
            };
            text.position = rect.position;

            var group = new Group(rect, text);

            return group;
        }


        function createInput(pos, message) {
            var rect = new paper.Path.Rectangle({
                center: pos,
                size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 3)), (NerdBoard.textSize * message.length) / ( 1 + (message.length / 3))],
                fillColor: NerdBoard.colors.defaultRed,
                strokeColor: NerdBoard.colors.defaultBlack,
                strokeWidth: 2,
                data: {
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Input'
                }
            });

            rect._segments[0].point._x -= NerdBoard.textSize;
            rect._segments[2].point._x += NerdBoard.textSize;

            var text = new PointText({
                content: message,
                data: {
                    name: 'text' + NerdBoard.numOfShapes.toString()
                }
            });
            text.style = {
                fontFamily: 'sans-serif',
                fontSize: NerdBoard.textSize,
                justification: 'center'
            };
            text.position = rect.position;
            var group = new Group(rect, text);

            return group;
        }


        function createText(pos, message) {
            var text = new PointText({
                point: pos,
                content: message,
                justification: 'center',
                fontSize: NerdBoard.textSize
            });
            text.fillColor = NerdBoard.colors.defaultBlack;
            text.strokeColor = NerdBoard.colors.defaultBlack;

            return text;
        }

        NerdBoard.numOfShapes++;

        paper.view.draw();
    };

    return wbTools;
}());
