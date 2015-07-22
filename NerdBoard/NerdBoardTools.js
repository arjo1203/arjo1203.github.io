/**
 * Created by alexpersian on 11/16/14.
 */

// This file handles the drawingMode functions for whiteboard.js
// Paper.js running through Javascript instead of Paperscript.
var NerdBoardTools = window.onload = (function() {
    paper.setup(NerdBoard.canvas);

    var wbTools = {
        tools: {}
    };
    wbTools.drawingMode = true;
    wbTools.shapeMode = false;

    var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        },
        pathHit, myPath, mousePoint = paper.view.center;



    // Covers the canvas in a white rectangle to prevent transparent background on save.
    // Drawings are created on top of this rectangle.
    wbTools.drawBackground = function () {
        //if(paper.project.activeLayer.children['bg']) {
        //    paper.project.activeLayer.children['bg'].remove();
        //}
        var rectangle = new paper.Path.Rectangle({
            center: paper.view.center,
            size: [NerdBoard.width, NerdBoard.height],
            fillColor: NerdBoard.theme.bg,
            name: 'bg'
        });

        paper.view.update();
    };
    wbTools.drawBackground();



    wbTools.tools.draw = new paper.Tool();
    wbTools.tools.draw.onMouseDown = function() {
        myPath = new paper.Path({
            strokeColor: NerdBoard.theme.penColor, // NerdBoard is the global module from whiteboard.js
            strokeWidth: NerdBoard.penStroke,
            strokeCap: 'round',
            name: NerdBoard.theme.pathName
        });
    };
    wbTools.tools.draw.onMouseDrag = function(event) {
        myPath.add(event.point);
    };
    wbTools.tools.draw.onMouseUp = function() {
        myPath.simplify();
    };
    wbTools.tools.draw.minDistance = 1;
    wbTools.tools.draw.maxDistance = 3;



    wbTools.tools.erase = new paper.Tool();
    wbTools.tools.erase.onMouseDown = function() {
        myPath = new paper.Path({
            strokeColor: NerdBoard.theme.bg, // NerdBoard is the global module from whiteboard.js
            strokeWidth: NerdBoard.eraseStroke,
            strokeCap: 'round',
            name: 'erase'
        });
    };
    wbTools.tools.erase.onMouseDrag = function(event) {
        myPath.add(event.point);
    };
    wbTools.tools.erase.onMouseUp = function() {
        myPath.simplify();
    };
    wbTools.tools.erase.minDistance = 1;
    wbTools.tools.erase.maxDistance = 3;


    wbTools.tools.shape = new paper.Tool();
    wbTools.tools.shape.onMouseDown = function(event) {
        mousePoint = event.point;
        wbTools.drawShape(mousePoint, NerdBoard.shape, $('#shapeText')[0].value);
    };
    wbTools.tools.shape.onMouseDrag = function(event) {
        var last = paper.project.activeLayer.children[paper.project.activeLayer.children.length - 1];

        if(NerdBoard.shape == 'Text') {
            last.position = event.point;
        }
        else {
            var secondlast = paper.project.activeLayer.children[paper.project.activeLayer.children.length - 2];

            last.position = event.point;
            secondlast.position = event.point;
        }
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
            return;
        }
    };
    wbTools.tools.move.onMouseDrag = function(event) {
        var firstThree = pathHit.name[0] + pathHit.name[1]  + pathHit.name[2];
        var last = pathHit.name[pathHit.name.length - 1], numOfDigits, id;

        if (pathHit && pathHit.name !== 'bg') {
            if (firstThree == 'rec' || firstThree == 'tex')  {
                id = pathHit.name.slice(4, pathHit.name.length);

                paper.project.activeLayer.children['rect' + id].position = event.point;
                paper.project.activeLayer.children['text' + id].position = event.point;
            }
            else{
                pathHit.position = event.point;
            }
        }
    };
    wbTools.tools.move.minDistance = 1;
    wbTools.tools.move.maxDistance = 3;



    wbTools.tools.pan = new paper.Tool();
    wbTools.tools.pan.onMouseDown = function(event) {
        paper.project.activeLayer.position = event.point;
    };
    wbTools.tools.pan.onMouseDrag = function(event) {
        paper.project.activeLayer.position = event.point;
    };
    wbTools.tools.pan.minDistance = 1;
    wbTools.tools.pan.maxDistance = 3;


    wbTools.undo = function() {
        var children = paper.project.activeLayer.children;
        var lastIndex = children.length - 1;
        var id, numOfDigits;


        if(children.length > 0){
            if(children[lastIndex].name !== 'bg') {
                var firstThree = children[lastIndex].name[0] + children[lastIndex].name[1] + children[lastIndex].name[2];

                if (firstThree == 'rec' || firstThree == 'tex')  {
                    NerdBoard.numOfShapes--;
                    numOfDigits = NerdBoard.numOfShapes.toString().length;
                    id = children[lastIndex].name.slice(children[lastIndex].name.length - numOfDigits, children[lastIndex].name.length);

                    children['rect' + id].remove();
                    children['text' + id].remove();
                }
                else {
                    children[lastIndex].remove();
                }
            }
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
            var firstThree = paths[i].name[0] + paths[i].name[1] + paths[i].name[2];

            if(paths[i].name == 'bg') {
                paths[i].fillColor = NerdBoard.theme.bg;
            }
            if(paths[i].name == 'black') {
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(paths[i].name == 'green') {
                paths[i].strokeColor = NerdBoard.theme.green;
            }
            if(paths[i].name == 'blue') {
                paths[i].strokeColor = NerdBoard.theme.blue;
            }
            if(paths[i].name == 'red') {
                paths[i].strokeColor = NerdBoard.theme.red;
            }
            if(paths[i].name == 'yellow') {
                paths[i].strokeColor = NerdBoard.theme.yellow;
            }
            if(paths[i].name == 'plainText') {
                paths[i].fillColor = NerdBoard.theme.black;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(paths[i].name == 'erase') {
                paths[i].strokeColor = NerdBoard.theme.bg;
            }
            if(paths[i].identifier == 'Terminal') {
                paths[i].fillColor = NerdBoard.theme.blue;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(paths[i].identifier == 'Process') {
                paths[i].fillColor = NerdBoard.theme.yellow;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(paths[i].identifier == 'Input') {
                paths[i].fillColor = NerdBoard.theme.red;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
            if(paths[i].identifier == 'Decision') {
                paths[i].fillColor = NerdBoard.theme.green;
                paths[i].strokeColor = NerdBoard.theme.black;
            }
        }

        paper.view.draw();
    };



    // Creates paths and options for each shape available for the canvas
    // Shapes are only created if the program is in shape mode
    wbTools.drawShape = function(location, shape, message) {
        var rect, text;

        switch(shape) {
            case 'Terminal':
                rect = new paper.Path.Rectangle({
                    center: location,
                    size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 18)), NerdBoard.textSize],
                    fillColor: NerdBoard.theme.blue,
                    strokeColor: NerdBoard.theme.black,
                    strokeWidth: 2,
                    radius: NerdBoard.textSize / 2,
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Terminal'
                });

                var text = new PointText({
                    content: message,
                    name: 'text' + NerdBoard.numOfShapes.toString()
                });
                text.style = {
                    fontFamily: 'sans-serif',
                    fontSize: NerdBoard.textSize,
                    justification: 'center'
                };

                text.fitBounds(rect.bounds);
                break;
            case 'Process':
                rect = new paper.Path.Rectangle({
                    center: location,
                    size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 12)), NerdBoard.textSize],
                    fillColor: NerdBoard.theme.yellow,
                    strokeColor: NerdBoard.theme.black,
                    strokeWidth: 2,
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Process'
                });

                var text = new PointText({
                    content: message,
                    name: 'text' + NerdBoard.numOfShapes.toString()
                });
                text.style = {
                    fontFamily: 'sans-serif',
                    fontSize: NerdBoard.textSize,
                    justification: 'center'
                };

                text.fitBounds(rect.bounds);
                break;
            case 'Decision':
                rect = new paper.Path.Rectangle({
                    center: location,
                    size: [(NerdBoard.textSize * message.length) / ( 1 + (message.length / 12)), (NerdBoard.textSize * message.length) / ( 1 + (message.length / 12))],
                    fillColor: NerdBoard.theme.green,
                    strokeColor: NerdBoard.theme.black,
                    strokeWidth: 2,
                    name: 'rect' + NerdBoard.numOfShapes.toString(),
                    identifier: 'Decision'
                });
                rect._segments[0].point._x += NerdBoard.textSize + 1;
                rect._segments[1].point._x += NerdBoard.textSize + 1;
                rect._segments[1].point._y += NerdBoard.textSize + 1;
                rect._segments[2].point._y += NerdBoard.textSize + 1;
                rect.rotate(45);

                var text = new PointText({
                    content: message,
                    name: 'text' + NerdBoard.numOfShapes.toString()
                });
                text.style = {
                    fontFamily: 'sans-serif',
                    fontSize: NerdBoard.textSize,
                    justification: 'center'
                };
                text.position = rect.position;
                break;
            case 'Input':
                rect = new Path.RegularPolygon(location, 4, (NerdBoard.textSize * message.length) / 2);
                rect.fillColor = NerdBoard.theme.red;
                rect.strokeColor = NerdBoard.theme.black;
                rect.strokeWidth = 2;
                rect.name = 'rect' + NerdBoard.numOfShapes.toString();
                rect._segments[1].point._x += NerdBoard.textSize;
                rect._segments[1].point._y += NerdBoard.textSize + 15;
                rect._segments[2].point._x += NerdBoard.textSize;
                rect._segments[2].point._y += NerdBoard.textSize + 15;
                rect.identifier = 'Input';


                var text = new PointText({
                    content: message,
                    name: 'text' + NerdBoard.numOfShapes.toString()
                });
                text.style = {
                    fontFamily: 'sans-serif',
                    fontSize: NerdBoard.textSize,
                    justification: 'center'
                };
                text.position = rect.position;
                break;
            case 'Text':
                text = new PointText({
                    point: location,
                    content: message,
                    justification: 'center',
                    fontSize: NerdBoard.textSize,
                    name: 'plainText'
                });
                text.fillColor = NerdBoard.theme.black;
                text.strokeColor = NerdBoard.theme.black;
                break;
        }

        NerdBoard.numOfShapes++;

        paper.view.draw();
    };



    // Loads the chosen image as a raster and places it in the center of the canvas.
    wbTools.loadRaster = function(image) {
        new paper.Raster({
            source: image,
            position: paper.view.center
        });
    };



    wbTools.drawText = function(text, x, y) {
        var color;
        if (NerdBoard.night) {
            color = "white";
        } else {
            color = "black";
        }
        new paper.PointText({
            point: [x, y],
            content: text,
            fillColor: color,
            fontFamily: 'Source Code Pro',
            fontSize: '24'
        });
    };

    return wbTools;
})();
