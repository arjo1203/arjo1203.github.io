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
UICenter.onMouseDown = function(event) {
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


var toolsScale = .4, colorScale = .15;

var PencilToolIcon = new Raster('PencilIconView');
var UndoView = new Raster('UndoView');
var EraserView = new Raster('EraserView');
var MoveView = new Raster('MoveView');
var InsertView = new Raster('InsertView');
var PencilToolOptionsColors = new Raster('ColorView');
var PreferenceIconView = new Raster('PreferenceIconView');
var TrashIconView = new Raster('TrashIconView');



UndoView.position.x -= 60;
UndoView.position.y += 60;

TrashIconView.position.x -= 20;
TrashIconView.position.y += 75;


PencilToolOptionsColors.scale(colorScale);
UndoView.scale(.4);
TrashIconView.scale(.4);






/*
* PencilToolOptions UI
* */
var PencilToolOptionsRailMarker = new Path.Circle({
    center: new Point(0,PencilToolOptionsColors.bounds.topLeft.y),
    radius: NerdBoard.penStrokeRange / 20,
    fillColor: NerdBoard.penColor,
    strokeColor: NerdBoard.colors.defaultBg,
    strokeWidth: 2,
    data: {
        name: "PencilToolOptionsRailMarker"
    }
});
PencilToolOptionsRailMarker.onMouseDrag = function(event) {
    var totDis = PencilToolOptionsColors.bounds.topRight.x - PencilToolOptionsColors.bounds.topLeft.x;
    var currDis = event.point.x - PencilToolOptionsColors.bounds.topLeft.x;
    var disRatio = currDis / totDis;
    console.log(disRatio);

    if(disRatio <= 0) {
        this.position.x = PencilToolOptionsColors.bounds.topLeft.x;
    }
    else if(disRatio >= 1) {
        this.position.x = PencilToolOptionsColors.bounds.topRight.x;
    }
    else {
        //console.log(disRatio);
        this.position.x = event.point.x;
        NerdBoard.penStroke = Math.round(NerdBoard.penStrokeRange * disRatio);
        console.log(NerdBoard.penStroke);
        PencilToolOptionsRail.strokeWidth = NerdBoard.penStroke;
    }
};
var PencilToolOptionsRail = new Path({
    strokeColor: NerdBoard.penColor,
    strokeWidth: NerdBoard.penStroke,
    strokeCap: 'round',
    data: {
        name: "PencilToolOptionsRail"
    }
});
PencilToolOptionsRail.add(PencilToolOptionsColors.bounds.topLeft, PencilToolOptionsColors.bounds.topRight);
var LineStyleView = new Group(PencilToolOptionsRail, PencilToolOptionsRailMarker);
LineStyleView.position.y -= 1;
LineStyleView.data = {
    name: "LineStyleView"
};
PencilToolOptionsColors.onMouseMove = function(event) {
    if(PencilToolOptions.data.out) {
        UICenter.fillColor = this.getAverageColor(event.point);
        PencilToolOptionsRailMarker.fillColor = this.getAverageColor(event.point);
        PencilToolOptionsRail.strokeColor = this.getAverageColor(event.point);
        NerdBoard.penColor = UICenter.fillColor;
    }
};

PencilToolOptionsColors.onMouseUp = function(event) {
    PencilToolOptions.data.animate = true;
};
var PencilToolOptions = new Group(PencilToolOptionsColors, LineStyleView);
PencilToolOptions.opacity = 0;
/*
 * PencilToolOptions UI
 * */




var PencilTool = new Group(PencilToolOptions, PencilToolIcon);
PencilTool.data = {
    name: "PencilToolIcon",
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
    scales: [],
    optionsOut: false,
    closeOptions: function() {
        this.optionsOut = false;
        PencilToolOptions.data.animate = true;
    },
    openOptions: function() {
        this.optionsOut = true;
        if(!this.out) {
            if (!PencilToolOptions.data.out)
                PencilToolOptions.data.setDest();
            PencilToolOptions.data.animate = true;
        }
    },
    centerIcon: function() {
        PencilToolIcon.position = UICenter.position;
    },
    scaleIconSmall: function() {
        var xScale = 32 / PencilToolIcon.bounds.width;
        var yScale = 32 / PencilToolIcon.bounds.height;
        PencilToolIcon.scale(xScale, yScale);
    }
};
PencilTool.onMouseDown = function(event) {
    if(this.data.out && NerdUI.children[NerdUI.children.length-1].data.name != "PencilToolIcon") {
        NerdUI.children[NerdUI.children.length-1].data.active = false;
        NerdUI.data.animateToolsIn();
        this.data.active = true;
    }
};
PencilToolIcon.onMouseUp = function(event) {
    event.preventDefault();
    PencilTool.data.openOptions();
};
PencilToolOptions.data = {
    name: "PencilToolOptions",
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






var NerdUI = new Group(TrashIconView, UndoView, PreferenceIconView, InsertView, MoveView, EraserView, UICenter, PencilTool);
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
    activeTool: "draw",
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
        var lastChild = NerdUI.children[NerdUI.children.length-1];
        if(!lastChild.data.active) {
            if(lastChild.data.optionsOut) {
                lastChild.data.closeOptions();
                window.setTimeout(function() {
                    lastChild.data.centerIcon();
                }, 20);
                lastChild.data.scaleIconSmall();
            }
            else {
                this.scaleToolTo(lastChild, smallToolDimensions);
            }
            lastChild.data.scales = [];


            UICenter.bringToFront();
            for(var i = NerdUI.children.length - this.toolsStack.length - 1; i < NerdUI.children.length; i++) {
                if(NerdUI.children[i].data.active) {
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
        }
        icon.position.x += vector.x / delta;
        icon.position.y += vector.y / delta;

        if(icon.data.name == "PencilToolOptions") {
            this.scaleBig(2, {a: 1, b: 6}, vector, icon);
            icon.opacity = 1;
        }
    },
    animateIn: function(delta, vector, icon) {
        if(-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
            icon.data.out = false;
            icon.data.reset();
        }
        icon.position.x += vector.x / delta;
        icon.position.y += vector.y / delta;


        if(icon.data.name == "PencilToolOptions") {
            this.scaleSmall(icon);
            window.setTimeout(function(){
                icon.opacity = 0;
            }, 100);
        }

        if(icon.data.active) {
            this.scaleBig(2, {a: 1, b: 2}, vector, icon);
        }
    },
    scaleBig: function(delta, thres, vector, icon) {
        var mag = Math.pow(Math.pow(vector.x, 2) + Math.pow(vector.y, 2),.5);
        var scale = Math.abs(mag / delta);
        if( thres.a < scale && scale < thres.b) {
            icon.data.scales.push(scale);
            icon.scale(scale);
        }
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
    },
    scaleToolTo: function(icon, dimensions) {
        var xScale = dimensions.x / icon.bounds.width;
        var yScale = dimensions.y / icon.bounds.height;
        icon.scale(xScale, yScale);
    }
};
NerdUI.onMouseDown = function(event) {
    NerdBoard.Tools.tools.none.activate();
};
NerdUI.onMouseDrag = function(event) {
};
NerdUI.onMouseUp = function(event) {
    NerdBoard.Tools.tools.draw.activate();
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
    NerdUI.data.toggleIcon(PencilTool);
    NerdUI.data.toggleIcon(EraserView);
    NerdUI.data.toggleIcon(MoveView);
    NerdUI.data.toggleIcon(InsertView);
    NerdUI.data.toggleIcon(PencilToolOptions);
    NerdUI.data.toggleIcon(PreferenceIconView);
    //console.log(NerdUI.data.beingUsed);
};


console.log(NerdUI);
console.log(paper);


var bigToolDimensions = {x: 64,y: 64};
var smallToolDimensions = {x: 32,y: 32};
NerdUI.data.scaleToolTo(PencilToolIcon, bigToolDimensions);
NerdUI.data.scaleToolTo(EraserView, smallToolDimensions);
NerdUI.data.scaleToolTo(MoveView, smallToolDimensions);
NerdUI.data.scaleToolTo(InsertView, smallToolDimensions);
NerdUI.data.scaleToolTo(PreferenceIconView, smallToolDimensions);