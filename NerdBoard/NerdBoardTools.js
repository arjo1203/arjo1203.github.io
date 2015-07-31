/**
 * Created by Jose Araujo on 07/22/15.
 */

paper.setup(NerdBoard.canvas);


NerdBoard.Tools = window.onload = (function() {

    // Set up an event listener for when a touch leaves the canvas.
    NerdBoard.canvas.addEventListener('touchleave', function(e) {
        e.preventDefault();
        touchEnded(e);
    });

    // Set up an event listener to catch cancelled touches.
    NerdBoard.canvas.addEventListener('touchcancel', function(e) {
        touchCancelled(e);
    });

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
        tolerance: 2
    }, pathHit, myPath;



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

    // Used to keep track of active touches.
    var currentTouches = [];
    var currentPaths = [];

    wbTools.tools.draw = new paper.Tool();
    wbTools.tools.draw.onMouseDown = function(event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];

            currentTouches.push({
                id: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY
            });

            var newPath = new paper.Path({
                strokeColor: NerdBoard.theme.penColor, // NerdBoardOriginal is the global module from whiteboard.js
                strokeWidth: NerdBoard.penStroke,
                strokeCap: 'round',
                data: {
                    name: NerdBoard.theme.pathName
                }
            });

            currentPaths.push(newPath);
        }
    };
    wbTools.tools.draw.onMouseDrag = function(event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = currentTouches[currentTouchIndex];
                var currentPath = currentPaths[currentTouchIndex];

                var newPoint = new Point({x: currentTouch.pageX, y: currentTouch.pageY});
                currentPath.add(newPoint);
                currentPath.smooth();

                // Update the touch record.
                currentTouch.pageX = touch.pageX;
                currentTouch.pageY = touch.pageY;

                // Store the record.
                currentTouches.splice(currentTouchIndex, 1, currentTouch);
            } else {
                console.log('Touch was not found!');
            }

        }

        paper.view.draw();
    };
    wbTools.tools.draw.onMouseUp = function(event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentPath = currentPaths[currentTouchIndex];
                currentPath.simplify();

                // Remove the record.
                currentTouches.splice(currentTouchIndex, 1);
                currentPaths.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch was not found!');
            }

        }
        //if(myPath._segments == 0) {
        //    myPath = new paper.Path.Circle(event.point, NerdBoard.penStroke / 2);
        //    myPath.style = {
        //        fillColor: NerdBoard.theme.penColor,
        //        strokeColor: NerdBoard.theme.penColor
        //    };
        //    myPath.data.name = NerdBoard.theme.pathName + 'Dot';
        //}
        //else {
        //    myPath.simplify();
        //}
    };

    // Draws a line to the final touch position on the canvas and then
    // removes the touh from the currentTouches array.
    var touchEnded = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentPath = currentPaths[currentTouchIndex];
                currentPath.simplify();

                // Remove the record.
                currentTouches.splice(currentTouchIndex, 1);
                currentPaths.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch was not found!');
            }

        }
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
    wbTools.tools.draw.minDistance = 1;
    wbTools.tools.draw.maxDistance = 3;


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
    wbTools.tools.shape.minDistance = 1;
    wbTools.tools.shape.maxDistance = 3;


    wbTools.tools.move = new paper.Tool();
    wbTools.tools.move.onMouseDown = function(event) {
        var hitResult = project.hitTest(event.point, hitOptions);
        if (hitResult) {
            pathHit = hitResult.item;
        }
        else {
            return ;
        }
    };
    wbTools.tools.move.onMouseDrag = function(event) {
        var firstThree = pathHit.data.name[0] + pathHit.data.name[1]  + pathHit.data.name[2];
        var last = pathHit.data.name[pathHit.data.name.length - 1], numOfDigits, id;

        if (pathHit && pathHit.data.name !== 'bg') {
            if (firstThree == 'rec' || firstThree == 'tex')  {
                id = pathHit.data.name.slice(4, pathHit.data.name.length);
                paper.project.activeLayer.children['group' + id].position.x += event.delta.x;
                paper.project.activeLayer.children['group' + id].position.y += event.delta.y;
            }
            else{
                pathHit.position.x += event.delta.x;
                pathHit.position.y += event.delta.y;
            }
        }
    };
    wbTools.tools.move.minDistance = 1;
    wbTools.tools.move.maxDistance = 3;


    wbTools.tools.pan = new paper.Tool();
    wbTools.tools.pan.onMouseDrag = function(event) {
        paper.project.activeLayer.position.x += event.delta.x;
        paper.project.activeLayer.position.y += event.delta.y;
    };
    wbTools.tools.pan.minDistance = 1;
    wbTools.tools.pan.maxDistance = 3;





    wbTools.drawBackground = function () {
        //if(paper.project.activeLayer.children['bg']) {
        //    paper.project.activeLayer.children['bg'].remove();
        //}
        var rectangle = new paper.Path.Rectangle({
            center: paper.view.center,
            size: [NerdBoard.width, NerdBoard.height],
            fillColor: NerdBoard.theme.bg,
            name: 'bg',
            data: {
                name: 'bg'
            }
        });

        paper.view.update();
    };
    wbTools.drawBackground();


    wbTools.loadRaster = function(image) {
        new paper.Raster({
            source: image,
            position: paper.view.center
        });
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


    wbTools.convertTheme = function() {
        var paths = paper.project.activeLayer.children;

        for(var i = 0; i < paths.length; i++) {
            var name = paths[i].data.name;

            if(name == 'black') {
                paths[i].strokeColor = NerdBoard.theme.black;
            }

            if(name == 'blackDot') {
                paths[i].strokeColor = NerdBoard.theme.black;
                paths[i].fillColor = NerdBoard.theme.black;
            }
            if(name == 'green') {
                paths[i].strokeColor = NerdBoard.theme.green;
            }
            if(name == 'greenDot') {
                paths[i].strokeColor = NerdBoard.theme.green;
                paths[i].fillColor = NerdBoard.theme.green;
            }
            if(name == 'blue') {
                paths[i].strokeColor = NerdBoard.theme.blue;
            }
            if(name == 'blueDot') {
                paths[i].strokeColor = NerdBoard.theme.blue;
                paths[i].fillColor = NerdBoard.theme.blue;
            }
            if(name == 'red') {
                paths[i].strokeColor = NerdBoard.theme.red;
            }
            if(name == 'redDot') {
                paths[i].strokeColor = NerdBoard.theme.red;
                paths[i].fillColor = NerdBoard.theme.red;
            }
            if(name == 'yellow') {
                paths[i].strokeColor = NerdBoard.theme.yellow;
            }
            if(name == 'yellowDot') {
                paths[i].strokeColor = NerdBoard.theme.yellow;
                paths[i].fillColor = NerdBoard.theme.yellow;
            }
            if(name == 'plainText') {
                paths[i].fillColor = NerdBoard.theme.black;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(name == 'erase') {
                paths[i].strokeColor = NerdBoard.theme.bg;
            }
            if(paths[i].name) {
                if(paths[i].name == 'bg') {
                    paths[i].fillColor = NerdBoard.theme.bg;
                }
                else {
                    var fillColor, strokeColor, id = paths[i]._children[0].data.identifier;

                    if(id == 'Terminal') {
                        fillColor = NerdBoard.theme.blue;
                        strokeColor = NerdBoard.theme.black;
                    }
                    if(id == 'Process') {
                        fillColor = NerdBoard.theme.yellow;
                        strokeColor = NerdBoard.theme.black;
                    }
                    if(id == 'Input') {
                        fillColor = NerdBoard.theme.red;
                        strokeColor = NerdBoard.theme.black;
                    }
                    if(id == 'Decision') {
                        fillColor = NerdBoard.theme.green;
                        strokeColor = NerdBoard.theme.black;
                    }

                    paths[i]._children[0].fillColor = fillColor;
                    paths[i]._children[0].strokeColor = strokeColor;
                }
            }
        }

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
                fillColor: NerdBoard.theme.blue,
                strokeColor: NerdBoard.theme.black,
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
                fillColor: NerdBoard.theme.yellow,
                strokeColor: NerdBoard.theme.black,
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
                fillColor: NerdBoard.theme.green,
                strokeColor: NerdBoard.theme.black,
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
                fillColor: NerdBoard.theme.red,
                strokeColor: NerdBoard.theme.black,
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
            text.fillColor = NerdBoard.theme.black;
            text.strokeColor = NerdBoard.theme.black;

            return text;
        }

        NerdBoard.numOfShapes++;

        paper.view.draw();
    };

    return wbTools;
}());
