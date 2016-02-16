paper.setup(NerdBoard.canvas[0]);

var drawingLayer = new Layer();
drawingLayer.name = "drawingLayer";
var UILayer = new Layer();
UILayer.name = "UILayer";
UILayer.activate();




var NerdBoardUI;

var PencilToolIcon, PencilToolOptionsColors, EraserToolIcon, MoveToolIcon, MenuIcon, SaveIcon, UploadIcon, UndoIcon, TrashIcon;

PencilToolIcon = new Raster('PencilIcon');
PencilToolIcon.onLoad = function() {
    UILayer.activate();
    PencilToolOptionsColors = new Raster('ColorIcon');
    UILayer.activate();
    PencilToolOptionsColors.onLoad = function() {
        UILayer.activate();
        EraserToolIcon = new Raster('EraserIcon');
        EraserToolIcon.onLoad = function() {
            UILayer.activate();
            MoveToolIcon = new Raster('MoveIcon');
            MoveToolIcon.onLoad = function() {
                UILayer.activate();
                MenuIcon = new Raster('MenuIcon');
                MenuIcon.onLoad = function() {
                    UILayer.activate();
                    SaveIcon = new Raster('SaveIcon');
                    SaveIcon.onLoad = function() {
                        UILayer.activate();
                        UploadIcon = new Raster('UploadIcon');
                        UploadIcon.onLoad = function() {
                            UILayer.activate();
                            UndoIcon = new Raster('UndoIcon');
                            UndoIcon.onLoad = function() {
                                UILayer.activate();
                                TrashIcon = new Raster('TrashIcon');
                                TrashIcon.onLoad = createUI;
                            };
                        }
                    };
                };
            }
        }
    };
};

function createUI() {
/*
 * NerdBoardUICenter is used to keep track of the center of the UI
 * NerdBoardUICenter is also used to toggle tools
 * */
    var NerdBoardUICenter = new Path.Circle({
        center: new Point(0,0),
        radius: 55,
        fillColor: NerdBoard.penColor,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "NerdBoardUICenter"
        }
    });
    NerdBoardUICenter.onMouseDrag = function(event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
    };
    NerdBoardUICenter.onMouseUp = function(event) {
        event.preventDefault();

        if(!NerdBoardUI.data.wasDragged) {//Prevents tools animation after being dragged
            if(!NerdBoardUI.animatingTools) {//Prevents interrupting animation during an double clicks
                NerdBoardUI.data.toggleTools();
            }
        }
    };
    /*
     *   NerdBoardUICenter
     * */




    /*
     * PencilToolOptions UI
     * */
    var PencilToolOptionsPenColor = new paper.Path.Rectangle({
        center: new Point(PencilToolOptionsColors.bounds.topLeft.x - 40, PencilToolOptionsColors.bounds.topLeft.y + 15),
        size: [30, 30],
        fillColor: NerdBoard.penColor,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsPenColor"
        }
    });
    PencilToolOptionsPenColor.onMouseUp = function() {
        PencilToolOptions.data.choosingPenColor = true;
        PencilToolOptionsBGColor.sendToBack();
    };
    var PencilToolOptionsBGColor = new paper.Path.Rectangle({
        center: new Point(PencilToolOptionsColors.bounds.topLeft.x - 25, PencilToolOptionsColors.bounds.topLeft.y + 30),
        size: [30, 30],
        fillColor: NerdBoard.bgColor,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsBGColor"
        }
    });
    PencilToolOptionsBGColor.onMouseUp = function() {
        PencilToolOptions.data.choosingPenColor = false;
        PencilToolOptionsPenColor.sendToBack();
    };
    var PencilToolOptionsRedBox = new paper.Path.Rectangle({
        center: new Point(PencilToolOptionsColors.bounds.topLeft.x - 30, PencilToolOptionsColors.bounds.topLeft.y + 75),
        size: [45, 30],
        fillColor: NerdBoard.colors.defaultRed,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsRed"
        }
    });
    var PencilToolOptionsRedText = new PointText({
        content: "0",
        fontFamily: 'sans-serif',
        fontSize: NerdBoard.textSize,
        justification: 'center',
        fillColor: NerdBoard.colors.defaultBg,
        data: {
            name: "PencilToolOptionsRedText"
        }
    });
    PencilToolOptionsRedText.fitBounds(PencilToolOptionsRedBox.bounds);
    var PencilToolOptionsRed = new Group(PencilToolOptionsRedBox, PencilToolOptionsRedText);
    var PencilToolOptionsGreenBox = new paper.Path.Rectangle({
        center: new Point(PencilToolOptionsColors.bounds.topLeft.x - 30, PencilToolOptionsColors.bounds.topLeft.y + 115),
        size: [45, 30],
        fillColor: NerdBoard.colors.defaultGreen,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsGreenBox"
        }
    });
    var PencilToolOptionsGreenText = new PointText({
        content: "0",
        fontFamily: 'sans-serif',
        fontSize: NerdBoard.textSize,
        justification: 'center',
        fillColor: NerdBoard.colors.defaultBg,
        data: {
            name: "PencilToolOptionsGreenText"
        }
    });
    PencilToolOptionsGreenText.fitBounds(PencilToolOptionsGreenBox.bounds);
    var PencilToolOptionsGreen = new Group(PencilToolOptionsGreenBox, PencilToolOptionsGreenText);
    var PencilToolOptionsBlueBox = new paper.Path.Rectangle({
        center: new Point(PencilToolOptionsColors.bounds.topLeft.x - 30, PencilToolOptionsColors.bounds.topLeft.y + 155),
        size: [45, 30],
        fillColor: NerdBoard.colors.defaultBlue,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsBlueBox"
        }
    });
    var PencilToolOptionsBlueText = new PointText({
        content: "0",
        fontFamily: 'sans-serif',
        fontSize: NerdBoard.textSize,
        justification: 'center',
        fillColor: NerdBoard.colors.defaultBg,
        data: {
            name: "PencilToolOptionsBlueText"
        }
    });
    PencilToolOptionsBlueText.fitBounds(PencilToolOptionsBlueBox.bounds);
    var PencilToolOptionsBlue = new Group(PencilToolOptionsBlueBox, PencilToolOptionsBlueText);
    var PencilToolOptionsRailMarker = new Path.Circle({
        center: new Point(0, PencilToolOptionsColors.bounds.topLeft.y),
        radius: (NerdBoard.penStrokeRange + 15) / 4,
        fillColor: NerdBoard.penColor,
        strokeColor: NerdBoard.colors.defaultBg,
        strokeWidth: 2,
        data: {
            name: "PencilToolOptionsRailMarker",
            radiusOffset: 30
        }
    });
    PencilToolOptionsRailMarker.onMouseDrag = function(event) {
        var totDis = PencilToolOptionsColors.bounds.topRight.x - PencilToolOptionsColors.bounds.topLeft.x;
        var currDis = event.point.x - PencilToolOptionsColors.bounds.topLeft.x;
        var disRatio = currDis / totDis;

        if(disRatio <= .06) {
            this.position.x = PencilToolOptionsColors.bounds.topLeft.x + (PencilToolOptionsRailMarker.bounds.width / 2);
        }
        else if(disRatio >= .9) {
            this.position.x = PencilToolOptionsColors.bounds.topRight.x - (PencilToolOptionsRailMarker.bounds.width / 2);
        }
        else {
            this.position.x = event.point.x;
            NerdBoard.penStroke = Math.round(NerdBoard.penStrokeRange * disRatio);
            PencilToolOptionsRail.strokeWidth = NerdBoard.penStroke;
            var scaleMarker = (NerdBoard.penStrokeRange + PencilToolOptionsRailMarker.data.radiusOffset) * disRatio;
            NerdBoardUI.data.scaleIconTo(PencilToolOptionsRailMarker, {x: scaleMarker,y: scaleMarker});
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
    LineStyleView.position.y -= 25;
    LineStyleView.data = {
        name: "LineStyleView"
    };
    PencilToolOptionsColors.onMouseDown = function(event) {
        PencilToolOptionsColors.data.dragging = false;
    };
    PencilToolOptionsColors.onMouseDrag = function(event) {
        PencilToolOptionsColors.data.dragging = true;
        if(PencilToolOptions.data.out) {
            var avgColor = this.getAverageColor(event.point);
            PencilToolOptionsRedBox.fillColor = new Color(avgColor.red * 256, 0, 0);
            PencilToolOptionsRedText.content = Math.round(avgColor.red * 256);
            PencilToolOptionsGreenBox.fillColor = new Color(0, avgColor.green * 256, 0);
            PencilToolOptionsGreenText.content = Math.round(avgColor.green * 256);
            PencilToolOptionsBlueBox.fillColor = new Color(0, 0, avgColor.blue * 256);
            PencilToolOptionsBlueText.content = Math.round(avgColor.blue * 256);
            //console.log(avgColor.red);
            //console.log(avgColor.green);
            //console.log(avgColor.blue);
            //console.log(avgColor);
            if(PencilToolOptions.data.choosingPenColor) {
                NerdBoard.penColor = avgColor;
                NerdBoardUICenter.fillColor = NerdBoard.penColor;
                PencilToolOptionsRailMarker.fillColor = NerdBoard.penColor;
                PencilToolOptionsRail.strokeColor = NerdBoard.penColor;
                PencilToolOptionsPenColor.fillColor = NerdBoard.penColor;
            }
            else {
                NerdBoard.bgColor = avgColor;
                PencilToolOptionsBGColor.fillColor = avgColor;
                drawingLayer.children[0].fillColor = avgColor;
            }
        }
    };
    PencilToolOptionsColors.onMouseUp = function(event) {
        if(!PencilToolOptionsColors.data.dragging) {
            window.setTimeout(function () {
                if (PencilToolIcon.data.optionsOut)
                    PencilToolIcon.data.closeOptions();
            }, 10);
        }
    };
    var PencilToolOptions = new Group(PencilToolOptionsBGColor, PencilToolOptionsPenColor, PencilToolOptionsRed, PencilToolOptionsGreen, PencilToolOptionsBlue, PencilToolOptionsColors, LineStyleView);
    PencilToolOptions.opacity = 0;
    /*
     * PencilToolOptions UI
     * */




    /*
     *   NerdBoardUI manages all of the event for the UI
     *   NerdBoardUI will interface with NerdBoard
     * */
    var NerdBoardUI = new Group(TrashIcon, UndoIcon, UploadIcon, SaveIcon, PencilToolOptions, MenuIcon, MoveToolIcon, EraserToolIcon, NerdBoardUICenter, PencilToolIcon);
    NerdBoardUI.position = paper.view.center;
    NerdBoardUI.bringToFront();
//NerdBoardUI.selected = true;
    NerdBoardUI.data = {
        name: "NerdBoardUI",
        wasDragged: false,
        animate: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        toolsOut: false,
        animatingTools: false,
        toolsStack: [7, 6, 5],
        toolsToAnimate: {tool2: 50, tool3: 100, tool4: 150},
        toolsAngle: {angle1: 175,angle2: 145, angle3: 115, angle4: 85},
        activeTool: "draw",
        animateToolsIn: function() {
            this.animatingTools = true;
            this.out = false;
            //console.log(NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]]);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.animate = true;
            this.checkToolsOrder();
        },
        animateToolsOut: function() {
            this.animatingTools = false;
            this.out = true;
            if(!NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle1);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.animate = true;

            if(!NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle2);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.animate = true;

            if(!NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle3);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.animate = true;
        },
        toggleTools: function() {
            if(!this.toolsOut) {
                this.animateToolsOut();
            }
            else {
                this.animateToolsIn();
            }
        },
        checkToolsOrder: function() {
            var childLength = NerdBoardUI.children.length;
            var lastChild = NerdBoardUI.children[childLength - 1];
            if(!lastChild.data.active) {
                this.scaleIconTo(lastChild, smallIcon);
                if(lastChild.data.optionsOut)
                    lastChild.data.closeOptions();
                NerdBoardUICenter.bringToFront();
                for(var i = childLength - NerdBoardUI.data.toolsStack.length - 2; i < childLength; i++) {
                    if(NerdBoardUI.children[i].data.active) {
                        NerdBoardUI.children[i].bringToFront();
                        break;
                    }
                }
            }
        },
        updateTool: function() {
            var childLength = NerdBoardUI.children.length;
            for(var i = childLength - NerdBoardUI.data.toolsStack.length - 2; i < childLength; i++) {
                if(NerdBoardUI.children[i].data.active) {
                    //console.log(NerdBoardUI.children[i]);
                    NerdBoardUI.children[i].data.activateTool();
                    break;
                }
            }
        },
        vectorThres: 1,
        destinationPoint: function(dist, angle) {
            var dir = new Point(dist * Math.cos(angle * (Math.PI / 180)), dist * Math.sin(angle * (Math.PI / 180)));
            var dest = new Point(NerdBoardUICenter.position.x + dir.x, NerdBoardUICenter.position.y - dir.y);
            return dest;
        },
        destinationVector: function(destination, icon) {
            var vector = new Point(destination.x - icon.position.x, destination.y - icon.position.y);
            return vector;
        },
        centerVector: function(icon) {
            return new Point(NerdBoardUICenter.position.x - icon.position.x, NerdBoardUICenter.position.y - icon.position.y);
        },
        animateIconOut: function(delta, vector, icon) {
            if(-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = true;
                icon.data.reset();
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;
        },
        animateIconIn: function(delta, vector, icon) {
            if(-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = false;
                icon.data.reset();
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;

            if(icon.data.active) {
                this.scaleIconTo(icon, mediumIcon);
            }
        },
        toggleIcon: function(icon) {
            if(icon.data.animate) {
                if(!icon.data.out) {
                    var vector = NerdBoardUI.data.destinationVector(icon.data.destination, icon);
                    NerdBoardUI.data.animateIconOut(icon.data.delta, vector, icon);
                }
                else {
                    var vector = NerdBoardUI.data.centerVector(icon);
                    NerdBoardUI.data.animateIconIn(icon.data.delta, vector, icon);
                }
            }
        },
        scaleIconTo: function(icon, dimensions) {
            var xScale = dimensions.x / icon.bounds.width;
            var yScale = dimensions.y / icon.bounds.height;
            icon.scale(xScale, yScale);
        }
    };
    /*
     *   This handles deactivating the current tool when using the NerdBoardUI
     * */
    NerdBoardUI.onMouseDown = function(event) {
        console.log(event);
        this.data.wasDragged = false;
        NerdBoard.Tools.tools.none.activate();
    };
    NerdBoardUI.onMouseDrag = function(event) {
        this.data.wasDragged = true;
    };
    NerdBoardUI.onMouseUp = function(event) {
        NerdBoardUI.data.updateTool();
    };
    /*
     *   NerdBoardUI
     * */




    /*
     *   Positioning and scaling icons
     * */

    var smallIcon = {x: 32,y: 32};
    var smallMediumIcon = {x: 48,y: 48};
    var mediumIcon = {x: 64,y: 64};
    var largeIcon = {x: 256,y: 288};

    var smallToolOptions = {x: 16,y: 16};
    var largeToolOptions = {x: 288,y: 288};

    UndoIcon.position.x -= 60;
    UndoIcon.position.y += 60;
    TrashIcon.position.x -= 20;
    TrashIcon.position.y += 75;

    NerdBoardUI.data.scaleIconTo(PencilToolIcon, mediumIcon);
    NerdBoardUI.data.scaleIconTo(PencilToolOptions, smallIcon);
    NerdBoardUI.data.scaleIconTo(EraserToolIcon, smallIcon);
    NerdBoardUI.data.scaleIconTo(MoveToolIcon, smallIcon);
    NerdBoardUI.data.scaleIconTo(MenuIcon, smallIcon);

    NerdBoardUI.data.scaleIconTo(SaveIcon, mediumIcon);
    NerdBoardUI.data.scaleIconTo(UploadIcon, mediumIcon);
    NerdBoardUI.data.scaleIconTo(UndoIcon, smallMediumIcon);
    NerdBoardUI.data.scaleIconTo(TrashIcon, smallMediumIcon);
    /*
     *   Positioning and scaling icons
     * */







    /*
     *   PencilToolIcon
     * */
    PencilToolIcon.data = {
        name: "PencilToolIcon",
        optionsOut: false,
        active: true,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        closeOptions: function() {
            this.optionsOut = false;
            PencilToolOptions.data.animate = true;
            NerdBoardUI.data.scaleIconTo(PencilToolOptions, smallToolOptions);
            window.setTimeout(function() {
                PencilToolOptions.opacity = 0;
            }, 50);//Prevent displaying under other icons
        },
        openOptions: function() {
            this.optionsOut = true;
            if(!this.out) {
                if (!PencilToolOptions.data.out)
                    PencilToolOptions.data.setDest(270, -50);
                PencilToolOptions.data.animate = true;
                window.setTimeout(function() {
                    NerdBoardUI.data.scaleIconTo(PencilToolOptions, largeToolOptions);
                    PencilToolOptions.opacity = 1;
                }, 20);//For animation
            }
        },
        toggleOptions: function() {
            if(!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        },
        activateTool: function() {
            NerdBoard.activateDrawMode();
        }
    };
    PencilToolIcon.onMouseUp = function(event) {
        if(NerdBoardUI.children[NerdBoardUI.children.length-1].data.name != "PencilToolIcon") {
            NerdBoardUI.children[NerdBoardUI.children.length-1].data.active = false;
            this.data.active = true;
            NerdBoardUI.data.animateToolsIn();
            NerdBoardUI.data.updateTool();
        }
        else {
            PencilToolIcon.data.toggleOptions();
        }
    };
    /*
     *   PencilToolIcon
     * */





    /*
     *   PencilToolOptionsColors
     * */
    PencilToolOptions.data = {
        name: "PencilToolOptions",
        dragging: false,
        choosingPenColor: true,
        active: true,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        }
    };
    PencilToolOptions.onMouseDown = function() {
        console.log("hit");
        /*
         * NerdBoardUI deactivates the current tool onMouseDown
         * This will reset the active tool to draw after a color is choosen
         * */
        window.setTimeout(function() {
            PencilToolIcon.data.activateTool();
        }, 10);
    };
    /*
     *   PencilToolOptionsColors
     * */





    /*
     *   EraserToolIcon
     * */
    EraserToolIcon.data = {
        name: "EraserToolIcon",
        active: false,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        activateTool: function() {
            NerdBoard.activateEraseMode();
        }
    };
    EraserToolIcon.onMouseUp = function(event) {
        if(NerdBoardUI.children[NerdBoardUI.children.length-1].data.name != "EraserToolIcon") {
            NerdBoardUI.children[NerdBoardUI.children.length-1].data.active = false;
            this.data.active = true;
            NerdBoardUI.data.animateToolsIn();
            NerdBoardUI.data.updateTool();
        }
    };
    /*
     *   EraserToolIcon
     * */





    /*
     *   MoveToolIcon
     * */
    MoveToolIcon.data = {
        name: "MoveToolIcon",
        active: false,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        activateTool: function() {
            NerdBoard.activateMoveMode();
        }
    };
    MoveToolIcon.onMouseUp = function(event) {
        if(NerdBoardUI.children[NerdBoardUI.children.length-1].data.name != "MoveToolIcon") {
            NerdBoardUI.children[NerdBoardUI.children.length-1].data.active = false;
            this.data.active = true;
            NerdBoardUI.data.animateToolsIn();
            NerdBoardUI.data.updateTool();
        }
    };
    /*
     *   MoveToolIcon
     * */





    /*
     *   MenuIcon
     * */
    MenuIcon.data = {
        name: "MenuIcon",
        optionsOut: false,
        active: false,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        activateTool: function() {
        },
        closeOptions: function() {
            this.optionsOut = false;
            SaveIcon.data.animate = true;
            NerdBoardUI.data.scaleIconTo(SaveIcon, smallToolOptions);
            UploadIcon.data.animate = true;
            NerdBoardUI.data.scaleIconTo(UploadIcon, smallToolOptions);
            window.setTimeout(function() {
                SaveIcon.opacity = 0;
                UploadIcon.opacity = 0;
            }, 50);//Prevent displaying under other icons
        },
        openOptions: function() {
            this.optionsOut = true;
            if(!this.out) {
                SaveIcon.data.setDest(100, 22.5);
                SaveIcon.data.animate = true;
                UploadIcon.data.setDest(100, -22.5);
                UploadIcon.data.animate = true;
                window.setTimeout(function() {
                    NerdBoardUI.data.scaleIconTo(SaveIcon, mediumIcon);
                    SaveIcon.opacity = 1;
                    NerdBoardUI.data.scaleIconTo(UploadIcon, mediumIcon);
                    UploadIcon.opacity = 1;
                }, 20);//For animation
            }
        },
        toggleOptions: function() {
            if(!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        }
    };
    MenuIcon.onMouseDown = function(event) {
        if(NerdBoardUI.children[NerdBoardUI.children.length-1].data.name != "MenuIcon") {
            NerdBoardUI.children[NerdBoardUI.children.length-1].data.active = false;
            this.data.active = true;
            NerdBoardUI.data.animateToolsIn();
            NerdBoardUI.data.updateTool();
        }
        else {
            MenuIcon.data.toggleOptions();
        }
    };
    /*
     *   MenuIcon
     * */





    /*
     *   SaveIcon
     * */
    SaveIcon.data = {
        name: "SaveIcon",
        active: true,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        }
    };
    SaveIcon.onMouseDown = function() {
        var link = document.createElement("a");
        var name = window.prompt("Please name your Image: ");
        if(name != null) {
            NerdBoardUI.opacity = 0;
            paper.view.draw();

            link.href = NerdBoard.canvas[0].toDataURL('image/png');
            link.download = name;
            link.click();

            NerdBoardUI.opacity = 1;
            paper.view.draw();

            window.alert("Image was saved!");
        }
        else{
            window.alert("Image was NOT saved!!");
        }
    };
    /*
     *   SaveIcon
     * */





    /*
     *   ProjectIcon
     * */
    UploadIcon.data = {
        name: "ProjectIcon",
        active: true,
        animate: false,
        out: false,
        destination: {},
        delta: 2,
        reset: function() {
            this.animate = false;
        },
        setDest: function(range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        }
    };
    UploadIcon.onMouseDown = function() {
        var file = document.createElement('input');

        file.type = 'file';
        file.click();

        file.addEventListener('change', function () {
                var reader = new FileReader();

                reader.onload = function (e) {
                    //console.log(e.target.result);
                    //NerdBoard.clear();
                    NerdBoard.Tools.loadRaster(e.target.result);

                    //paper.project.activeLayer.position = paper.view.center;
                    //NerdBoard.Tools.resizeBg();
                    //paper.view.draw();
                };
                reader.readAsDataURL(file.files[0]);
            },
            false);
    };
    /*
     *   ProjectIcon
     * */





    UndoIcon.onMouseDown = function() {
        NerdBoard.Tools.undo();
    };
    TrashIcon.onMouseUp = function(event) {
        var c = confirm('Are you sure you want to clear the canvas?');
        if (c) {
            NerdBoardUI.data.beingUsed = false;
            NerdBoard.Tools.clear();
        }
    };



    paper.view.onFrame = function(event) {
        NerdBoardUI.data.toggleIcon(PencilToolIcon);
        NerdBoardUI.data.toggleIcon(PencilToolOptions);
        NerdBoardUI.data.toggleIcon(EraserToolIcon);
        NerdBoardUI.data.toggleIcon(MoveToolIcon);
        NerdBoardUI.data.toggleIcon(MenuIcon);
        NerdBoardUI.data.toggleIcon(SaveIcon);
        NerdBoardUI.data.toggleIcon(UploadIcon);
    };


    /**
     * Prevents default page scrolling action; fixes iOS 8 drawing bug.
     */
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
console.log(paper);
//console.log(PencilToolOptionsRailMarker);
//console.log(PencilToolOptionsRailMarker.intersects(NerdBoardUICenter.position));
}