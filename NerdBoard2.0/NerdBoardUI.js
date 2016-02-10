paper.setup(NerdBoard.canvas[0]);

var BGLayer = paper.project.activeLayer;
BGLayer.name = "BGLayer";

var drawingLayer = new Layer();
var UILayer = new Layer();
UILayer.activate();




var UICenter = new Path.Circle({
    center: new Point(0,0),
    radius: 55,
    fillColor: NerdBoard.penColor,
    strokeColor: NerdBoard.colors.defaultBg,
    strokeWidth: 2,
    data: {
        name: "UICenter"
    }
});
UICenter.onMouseDrag = function(event) {
    event.preventDefault();
    NerdUI.position.x += event.delta.x;
    NerdUI.position.y += event.delta.y;
};
UICenter.onDoubleClick = function(event) {
    event.preventDefault();
    if(!NerdUI.animatingTools) {
        if(!NerdUI.data.out) {
            NerdUI.data.animateToolsOut();
        }
        else {
            NerdUI.data.animateToolsIn();
        }
    }
};


var toolsScale = .4, colorScale = .1;

var PencilIconView = new Raster('PencilIconView');
var UndoView = new Raster('UndoView');
var EraserView = new Raster('EraserView');
var MoveView = new Raster('MoveView');
var InsertView = new Raster('InsertView');
var ColorView = new Raster('ColorView');
var PreferenceIconView = new Raster('PreferenceIconView');
var TrashIconView = new Raster('TrashIconView');



UndoView.position.x -= 60;
UndoView.position.y += 60;

TrashIconView.position.x -= 20;
TrashIconView.position.y += 75;


UndoView.scale(.4);
TrashIconView.scale(.4);
EraserView.scale(toolsScale);
MoveView.scale(toolsScale);
InsertView.scale(toolsScale);
PencilIconView.scale(toolsScale);
ColorView.scale(colorScale);
PreferenceIconView.scale(.18);

var LineThickDot = new Path.Circle({
    center: new Point(0,ColorView.bounds.topLeft.y),
    radius: NerdBoard.penStrokeRange / 20,
    fillColor: NerdBoard.penColor,
    strokeColor: NerdBoard.colors.defaultBg,
    strokeWidth: 2,
    data: {
        name: "LineThickDot"
    }
});
LineThickDot.onMouseDrag = function(event) {
    var totDis = ColorView.bounds.topRight.x - ColorView.bounds.topLeft.x;
    var currDis = event.point.x - ColorView.bounds.topLeft.x;
    var disRatio = currDis / totDis;
    console.log(disRatio);

    if(disRatio <= 0) {
        this.position.x = ColorView.bounds.topLeft.x;
    }
    else if(disRatio >= 1) {
        this.position.x = ColorView.bounds.topRight.x;
    }
    else {
        //console.log(disRatio);
        this.position.x = event.point.x;
        NerdBoard.penStroke = Math.round(NerdBoard.penStrokeRange * disRatio);
        console.log(NerdBoard.penStroke);
        LineThickRail.strokeWidth = NerdBoard.penStroke;
    }
};
var LineThickRail = new Path({
    strokeColor: NerdBoard.penColor,
    strokeWidth: NerdBoard.penStroke,
    strokeCap: 'round',
    data: {
        name: "LineThickRail"
    }
});
LineThickRail.add(ColorView.bounds.topLeft, ColorView.bounds.topRight);
var LineStyleView = new Group(LineThickRail, LineThickDot);
LineStyleView.position.y -= 1;
LineStyleView.data = {
    name: "LineStyleView"
};
var PencilOptionsView = new Group(ColorView, LineStyleView);
PencilOptionsView.opacity = 0;
var PencilView = new Group(PencilOptionsView, PencilIconView);




var NerdUI = new Group(TrashIconView, UndoView, PreferenceIconView, InsertView, MoveView, EraserView, UICenter, PencilView);
NerdUI.position = paper.view.center;
//NerdUI.scale(1.2);
//NerdUI.selected = true;
NerdUI.data = {
    name: "NerdUI",
    beingUsed: false,
    animate: false,
    out: false,
    animatingTools: false,
    toolsStack: [2, 3, 4, 5],
    toolsAnimation: {tool2: 50, tool3: 100, tool4: 150},
    toolsAngle: {angle1: 175,angle2: 145, angle3: 115, angle4: 85},
    animateToolsIn: function() {
        this.animatingTools = true;
        NerdUI.children[NerdUI.data.toolsStack[0]].data.animate = true;

        window.setTimeout(function() {
            NerdUI.children[NerdUI.data.toolsStack[1]].data.animate = true;
        }, this.toolsAnimation.tool2);

        window.setTimeout(function() {
            NerdUI.children[NerdUI.data.toolsStack[2]].data.animate = true;
        }, this.toolsAnimation.tool3);

        window.setTimeout(function() {
            this.animatingTools = false;
            this.out = false;
            NerdUI.children[NerdUI.data.toolsStack[3]].data.animate = true;
            NerdUI.data.checkToolsOrder();
        }, this.toolsAnimation.tool4);
    },
    animateToolsOut: function() {
        this.animatingTools = true;
        if(!NerdUI.children[NerdUI.data.toolsStack[3]].data.out)
            NerdUI.children[NerdUI.data.toolsStack[3]].data.setDest(100, NerdUI.data.toolsAngle.angle1);
        NerdUI.children[NerdUI.data.toolsStack[3]].data.animate = true;

        window.setTimeout(function() {
            if(!NerdUI.children[NerdUI.data.toolsStack[2]].data.out)
                NerdUI.children[NerdUI.data.toolsStack[2]].data.setDest(100, NerdUI.data.toolsAngle.angle2);
            NerdUI.children[NerdUI.data.toolsStack[2]].data.animate = true;
        }, this.toolsAnimation.tool2);

        window.setTimeout(function() {
            if(!NerdUI.children[NerdUI.data.toolsStack[1]].data.out)
                NerdUI.children[NerdUI.data.toolsStack[1]].data.setDest(100, NerdUI.data.toolsAngle.angle3);
            NerdUI.children[NerdUI.data.toolsStack[1]].data.animate = true;
        }, this.toolsAnimation.tool3);

        window.setTimeout(function() {
            this.animatingTools = false;
            this.out = true;
            if(!NerdUI.children[NerdUI.data.toolsStack[0]].data.out)
                NerdUI.children[NerdUI.data.toolsStack[0]].data.setDest(100, NerdUI.data.toolsAngle.angle4);
            NerdUI.children[NerdUI.data.toolsStack[0]].data.animate = true;
        }, this.toolsAnimation.tool4);
    },
    checkToolsOrder: function() {
        if(!NerdUI.children[NerdUI.children.length-1].data.active) {
            UICenter.bringToFront();
            for(var i = 2; i < NerdUI.children.length; i++) {
                if(NerdUI.children[i].data.active) {
                    //console.log( NerdUI.children[i].data.name);
                    NerdUI.children[i].bringToFront();
                }

            }

        }
    },
    vectorThres: 1,
    destPoint: function(dist, angle) {
        var dir = new Point(dist * Math.cos(angle * (Math.PI / 180)), dist * Math.sin(angle * (Math.PI / 180)));
        var dest = new Point(UICenter.position.x + dir.x, UICenter.position.y - dir.y);
        return dest;
    },
    destVector: function(destination, icon) {
        var vector = new Point(destination.x - icon.position.x, destination.y - icon.position.y);
        return vector;
    },
    vectorToCenter: function(icon) {
        return new Point(UICenter.position.x - icon.position.x, UICenter.position.y - icon.position.y);
    },
    animateOut: function(delta, vector, icon) {
        if(-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
            icon.data.out = true;
            icon.data.reset();
            //console.log(" animateOut --> " + icon.data.name + " --> " + icon.data.out);
        }
        icon.position.x += vector.x / delta;
        icon.position.y += vector.y / delta;

        if(icon.data.name == "PencilOptionsView") {
            this.scaleBig(2, {a: 1, b: 5}, vector, icon);
            icon.opacity = 1;
        }
        else {
            this.scaleSmall(icon);
        }
    },
    animateIn: function(delta, vector, icon) {
        if(-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
            icon.data.out = false;
            icon.data.reset();
        }
        icon.position.x += vector.x / delta;
        icon.position.y += vector.y / delta;


        if(icon.data.name == "PencilOptionsView") {
            this.scaleSmall(icon);
            window.setTimeout(function(){
                icon.opacity = 0;
            }, 100);
        }
        else {
            this.scaleBig(2, {a:1, b: 3}, vector, icon);
        }
    },
    scaleBig: function(delta, thres, vector, icon) {
        var mag = Math.pow(Math.pow(vector.x, 2) + Math.pow(vector.y, 2),.5);
        var scale = Math.abs(mag / delta);
        if( thres.a < scale && scale < thres.b) {
            icon.data.scales.push(scale);
            icon.scale(scale);
        }
        //console.log(icon.data.scales);
    },
    scaleSmall: function(icon) {
        if(icon.data.scales.length > 0) {
            icon.scale(1 / icon.data.scales.shift());
        }
    },
    toggleIcon: function(icon) {
        if(icon.data.animate) {
            if(!icon.data.out) {
                var vector = NerdUI.data.destVector(icon.data.Destination, icon);
                NerdUI.data.animateOut(icon.data.delta, vector, icon);
            }
            else {
                var vector = NerdUI.data.vectorToCenter(icon);
                NerdUI.data.animateIn(icon.data.delta, vector, icon);
            }
        }
    }
};
NerdUI.onMouseDown = function(event) {
    NerdUI.data.beingUsed = true;
};
NerdUI.onMouseDrag = function(event) {
    NerdUI.data.beingUsed = true;
};
NerdUI.onMouseUp = function(event) {
    window.setTimeout(function() {
        NerdUI.data.beingUsed = false;
    }, 50);
};




PencilView.data = {
    name: "PencilIconView",
    active: true,
    animate: false,
    out: false,
    Destination: {},
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function(range, angle) {
        this.Destination = NerdUI.data.destPoint(range, angle);
    },
    scales: []
};
PencilView.onMouseDown = function(event) {
    if(this.data.out && NerdUI.children[NerdUI.children.length-1].data.name != "PencilIconView") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        NerdUI.data.animateToolsIn();
        this.data.active = true;
    }
};
PencilIconView.onMouseUp = function(event) {
    event.preventDefault();

    if(!PencilView.data.out) {
        if (!PencilOptionsView.data.out)
            PencilOptionsView.data.setDest();
        PencilOptionsView.data.animate = true;
    }
};




EraserView.data = {
    name: "EraserView",
    active: false,
    animate: false,
    out: false,
    Destination: {},
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function(range, angle) {
        this.Destination = NerdUI.data.destPoint(range, angle);
    },
    scales: []
};
EraserView.onMouseDown = function(event) {
    if(NerdUI.children[NerdUI.children.length-1].data.name != "EraserView") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        this.data.active = true;
        NerdUI.data.animateToolsIn();
    }
};




MoveView.data = {
    name: "MoveView",
    active: false,
    animate: false,
    out: false,
    Destination: {},
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function(range, angle) {
        this.Destination = NerdUI.data.destPoint(range, angle);
    },
    scales: []
};
MoveView.onMouseDown = function(event) {
    if(NerdUI.children[NerdUI.children.length-1].data != "MoveView") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        NerdUI.data.animateToolsIn();
        this.data.active = true;
    }
};




InsertView.data = {
    name: "InsertView",
    active: false,
    animate: false,
    out: false,
    Destination: {},
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function(range, angle) {
        this.Destination = NerdUI.data.destPoint(range, angle);
    },
    scales: []
};
InsertView.onMouseDown = function(event) {
    if(NerdUI.children[NerdUI.children.length-1].data.name != "InsertView") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        NerdUI.data.animateToolsIn();
        this.data.active = true;
    }
};




PreferenceIconView.data = {
    name: "PreferenceIconView",
    animate: false,
    out: false,
    Destination: new Point(0, 0),
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function(range, angle) {
        this.Destination = NerdUI.data.destPoint(range, angle);
    },
    scales: []
};
PreferenceIconView.onMouseDown = function(event) {
    if(NerdUI.children[NerdUI.children.length-1].data.name != "PreferenceIconView") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        NerdUI.data.animateToolsIn();
        this.data.active = true;
    }
};




PencilOptionsView.data = {
    name: "PencilOptionsView",
    animate: false,
    out: false,
    Destination: new Point(0, 0),
    delta: 2,
    reset: function() {
        this.animate = false;
    },
    setDest: function() {
        this.Destination = NerdUI.data.destPoint(250, -50);
    },
    scales: []
};

ColorView.onMouseMove = function(event) {
    if(PencilOptionsView.data.out) {
        UICenter.fillColor = this.getAverageColor(event.point);
        LineThickDot.fillColor = this.getAverageColor(event.point);
        LineThickRail.strokeColor = this.getAverageColor(event.point);
        NerdBoard.penColor = UICenter.fillColor;
    }
};

ColorView.onMouseUp = function(event) {
    PencilOptionsView.data.animate = true;
};




//UI Functions
UndoView.onMouseDown = function() {
    NerdBoard.Tools.undo();
};
TrashIconView.onMouseUp = function(event) {
    var c = confirm('Are you sure you want to clear the canvas?');
    if (c) {
        NerdUI.data.beingUsed = false;
        NerdBoard.Tools.clear();
    }
};




paper.view.onFrame = function(event) {
    NerdUI.data.toggleIcon(PencilView);
    NerdUI.data.toggleIcon(EraserView);
    NerdUI.data.toggleIcon(MoveView);
    NerdUI.data.toggleIcon(InsertView);
    NerdUI.data.toggleIcon(PencilOptionsView);
    NerdUI.data.toggleIcon(PreferenceIconView);
    //console.log(NerdUI.data.beingUsed);
};


console.log(NerdUI);
console.log(paper);