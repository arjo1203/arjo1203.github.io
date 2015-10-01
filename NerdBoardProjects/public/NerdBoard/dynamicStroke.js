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