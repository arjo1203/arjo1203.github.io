paper.install(window);

var canvas = $('#myCanvas')[0], GRID;


//Install paper on 2d canvas
paper.setup('myCanvas');
paper.view.viewSize = [canvas.clientWidth, canvas.clientHeight];
paper.view.zoom = 2;


//draw2DFunction();

function draw2DFunction(){
    var fnLinePos = new Path();
    var fnLineNeg = new Path();
    fnLinePos.strokeColor = 'black';
    fnLineNeg.strokeColor = 'black';

    for(var x = 360; -360 <= x; x-=.01) {
        var point = new Point(x, graph2DFunction(x));
        var pointFromCenter = referenceCenter(point);

        fnLinePos.add(pointFromCenter);
    }

    for(var x = 360; -360 <= x; x-=.01) {
        var point2 = new Point(x, -graph2DFunction(x));
        var pointFromCenter2 = referenceCenter(point2);

        fnLineNeg.add(pointFromCenter2);
    }

    paper.view.update();
}


function referenceCenter(point) {
    var x = point.x + canvas.clientWidth / 2,
        y = point.y + canvas.clientHeight / 2,
        point = new Point(x, y);

    return point;
}


function graph2DFunction(x) {
    var y = Math.sqrt(10000 - Math.pow(x, 2));

    return -y;
}



function drawGridLines() {
    var lines = [],
        grid = new CompoundPath(),
        numOfPixels = 100,
        halfWidth = Math.round(canvas.clientWidth / 2);

    for(var x = 0; x < halfWidth; x -= numOfPixels) {
        var line = new Path.Line();
        line.strokeColor = 'black';
        var top = new Point(x, 0);
        var bottom = new Point(x, canvas.clientHeight);

        line.add(top);
        line.add(bottom);

        lines.push(line);
    }
    //
    //for(var y = 0; y < canvas.clientHeight; y += numOfPixels) {
    //    var line = new Path.Line();
    //    line.strokeColor = 'black';
    //    var left = new Point(0, y);
    //    var right = new Point(canvas.clientWidth, y);
    //
    //    line.add(left);
    //    line.add(right);
    //
    //    lines.push(line);
    //}

    for(var i = 0; i < lines.length; i++){
        grid.children[i] = lines[i];
    }

    //Return the object
    return grid;
}

var shape = new CompoundPath();


animate(1, 40);
//animation();


function animate(radius, theta) {
    var plot = getMarchingSquaresData(1200, -100, 100, radius, theta);

    for(var i = 0; i < plot.length; i++){
        shape.children[i] = plot[i];
    }

    shape.position = paper.view.center;
    paper.view.update();
}


var radiusCounter = 1,
    thetaCounter = 1;

function animation() {
    setInterval(function() {
        animate(radiusCounter, thetaCounter);
        thetaCounter += 1;
    }, 50);
}



function getMarchingSquaresData(resolution, axisMin, axisMax, r, theta){
    var points = [],
        values = [];

    var axisRange = axisMax - axisMin;

    // Generate a list of 3D points and values at those points
        for (var j = 0; j < resolution; j++) {
            points[j] = [];

            for (var i = 0; i < resolution; i++) {
                // actual values
                var x = axisMin + axisRange * i / resolution;
                var y = axisMin + axisRange * j / resolution;
                points[j].push(new Point(x, y));

                var value = 2 * Math.cos2(theta) * Math.pow(x, 2) + 4 * Math.cos(theta) * Math.sin(theta) * x - 2 * Math.cos2(theta) - Math.pow(x, 2) + Math.pow(y, 2) + r;
                //var value = Math.pow(x, 2) + 2 * Math.pow(y, 2) - r;

                //console.log(value);

                values.push(value);
            }
        }

    //console.log(points);
    //console.log(values);

    var graph = marchingSquares(points, values, 1);

    return graph;
}


function marchingSquares(points, values, isoSurface) {
    var graphLines = [];

    for(var j = 0; j < points.length - 1; j++) {

        for(var i = 0; i < points[j].length - 1; i++) {
            var bit_4 = 0;//Used for edge look up table

            // The samples at the 4 corners of the current cell
            var NW = points[j][i];
            var NE = points[j][i+1];
            var SW = points[j+1][i];
            var SE = points[j+1][i+1];

            var NWValue = values[(j * points.length) + i];
            var NEValue = values[(j * points.length) + (i + 1)];
            var SWValue = values[((j + 1) * points.length) + i];
            var SEValue = values[((j + 1) * points.length) + (i + 1)];

            //console.log(NWValue, NEValue, SWValue, SEValue);

            if(NWValue > isoSurface) {
                bit_4 += 1;
            }

            if(NEValue > isoSurface) {
                bit_4 += 2;
            }

            if(SWValue > isoSurface) {
                bit_4 += 4;
            }

            if(SEValue > isoSurface) {
                bit_4 += 8;
            }

            //console.log(bit_4);

            if(bit_4 !== 0) {
                if(bit_4 !== 15) {
                    var line = lookUpTable(bit_4, NW, NE, SW, SE);
                    graphLines.push(line);
                }
            }
        }
    }

    //console.log(graphLines);

    return graphLines;
}



function lookUpTable(index, topLeft, topRight, bottomLeft, bottomRight) {
    if(index == 1 || index == 14) {
        var point1 = LERP(bottomLeft, topLeft, .5);
        var point2 = LERP(bottomLeft, bottomRight, .5);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 2 || index == 13) {
        var point1 = LERP(bottomRight, bottomLeft, .5);
        var point2 = LERP(bottomRight, topRight, .5);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 3 || index == 12) {
        var point1 = LERP(bottomLeft, topLeft, .5);
        var point2 = LERP(bottomRight, topRight, .5);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 4 || index == 11) {
        var point1 = LERP(topRight, topLeft, .5);
        var point2 = LERP(topRight, bottomRight, .5);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 5) {
        var lines = new CompoundPath();

        var point1 = LERP(topLeft, topRight, .25);
        var point2 = LERP(topLeft, bottomLeft, .25);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        lines.children[0] = line;

        var point3 = LERP(bottomRight, topRight, .25);
        var point4 = LERP(bottomRight, bottomLeft, .25);
        var line2 = new Path();
        line2.strokeColor = 'black';
        line2.add(point3);
        line2.add(point4);

        lines.children[1] = line2;

        return lines;
    }
    if(index == 6 || index == 9) {
        var point1 = LERP(bottomRight, bottomLeft, .5);
        var point2 = LERP(topRight, topLeft, .5);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 7 || index == 8) {
        var point1 = LERP(topLeft, topRight, .25);
        var point2 = LERP(topLeft, bottomLeft, .25);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        return line;
    }
    if(index == 10) {
        var lines = new CompoundPath();

        var point1 = LERP(topRight, topLeft, .25);
        var point2 = LERP(topRight, bottomRight, .25);
        var line = new Path();
        line.strokeColor = 'black';
        line.add(point1);
        line.add(point2);

        lines.children[0] = line;

        var point3 = LERP(bottomLeft, topLeft, .25);
        var point4 = LERP(bottomLeft, bottomRight, .25);
        var line2 = new Path();
        line2.strokeColor = 'black';
        line2.add(point3);
        line2.add(point4);

        lines.children[1] = line2;

        return lines;
    }
}




//Linear Interpolation
function LERP(start, end, percent) {
    var finalPos, dX = end.x - start.x, dY = end.y - start.y;

    finalPos = new Point(start.x + percent * dX, start.y + percent * dY);

    return finalPos;
}