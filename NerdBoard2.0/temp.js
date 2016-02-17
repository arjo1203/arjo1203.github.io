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
    var NerdBoardUICenter = makeCircle({x: 0, y: 0}, 55, NerdBoard.penColor, NerdBoard.colors.defaultBg, "NerdBoardUICenter");
    NerdBoardUICenter.onMouseDrag = function (event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
    };
    NerdBoardUICenter.onMouseUp = function (event) {
        event.preventDefault();
        if (!NerdBoardUI.data.wasDragged) {//Prevents tools animation after being dragged
            if (!NerdBoardUI.animatingTools) {//Prevents interrupting animation during an double clicks
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
    var PencilToolOptionsPenColor = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 40,
        y: PencilToolOptionsColors.bounds.topLeft.y + 15
    }, {x: 30, y: 30}, NerdBoard.penColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsPenColor"});
    PencilToolOptionsPenColor.onMouseUp = function () {
        PencilToolOptions.data.choosingPenColor = true;
        PencilToolOptionsBGColor.sendToBack();
    };

    var PencilToolOptionsBGColor = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 25,
        y: PencilToolOptionsColors.bounds.topLeft.y + 30
    }, {x: 30, y: 30}, NerdBoard.bgColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBGColor"});
    PencilToolOptionsBGColor.onMouseUp = function () {
        PencilToolOptions.data.choosingPenColor = false;
        PencilToolOptionsPenColor.sendToBack();
    };
    var PencilToolOptionsRedBox = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 30,
        y: PencilToolOptionsColors.bounds.topLeft.y + 75
    }, {x: 45, y: 30}, NerdBoard.colors.defaultRed, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsRed"});
    var PencilToolOptionsRedText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsRedText"});
    PencilToolOptionsRedText.fitBounds(PencilToolOptionsRedBox.bounds);
    var PencilToolOptionsRed = new Group(PencilToolOptionsRedBox, PencilToolOptionsRedText);

    var PencilToolOptionsGreenBox = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 30,
        y: PencilToolOptionsColors.bounds.topLeft.y + 115
    }, {x: 45, y: 30}, NerdBoard.colors.defaultGreen, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsGreenBox"});
    var PencilToolOptionsGreenText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsGreenText"});
    PencilToolOptionsGreenText.fitBounds(PencilToolOptionsGreenBox.bounds);
    var PencilToolOptionsGreen = new Group(PencilToolOptionsGreenBox, PencilToolOptionsGreenText);

    var PencilToolOptionsBlueBox = makeRect({x: PencilToolOptionsColors.bounds.topLeft.x - 30, y: PencilToolOptionsColors.bounds.topLeft.y + 155}, {x: 45, y: 30}, NerdBoard.colors.defaultBlue, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBlueBox"});
    var PencilToolOptionsBlueText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBlueText"});
    PencilToolOptionsBlueText.fitBounds(PencilToolOptionsBlueBox.bounds);
    var PencilToolOptionsBlue = new Group(PencilToolOptionsBlueBox, PencilToolOptionsBlueText);

    var PencilToolOptionsRailMarker = makeCircle({x: 0, y: PencilToolOptionsColors.bounds.topLeft.y}, (NerdBoard.penStrokeRange + 15) / 4, NerdBoard.penColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsRailMarker", radiusOffset: 30});
    PencilToolOptionsRailMarker.onMouseDrag = function (event) {
        var totDis = PencilToolOptionsColors.bounds.topRight.x - PencilToolOptionsColors.bounds.topLeft.x;
        console.log(PencilToolOptionsColors.bounds.topRight);
        console.log(PencilToolOptionsColors.bounds.topLeft);
        console.log(totDis);
        var currDis = event.point.x - PencilToolOptionsColors.bounds.topLeft.x;
        console.log(currDis);
        var disRatio = currDis / totDis;
        console.log(disRatio);

        if (disRatio <= .06) {
            this.position.x = PencilToolOptionsColors.bounds.topLeft.x + (PencilToolOptionsRailMarker.bounds.width / 2);
        }
        else if (disRatio >= .9) {
            this.position.x = PencilToolOptionsColors.bounds.topRight.x - (PencilToolOptionsRailMarker.bounds.width / 2);
        }
        else {
            this.position.x = event.point.x;
            NerdBoard.penStroke = Math.round(NerdBoard.penStrokeRange * disRatio);
            PencilToolOptionsRail.strokeWidth = NerdBoard.penStroke;
            var scaleMarker = (NerdBoard.penStrokeRange + PencilToolOptionsRailMarker.data.radiusOffset) * disRatio;
            NerdBoardUI.data.scaleIconTo(PencilToolOptionsRailMarker, {x: scaleMarker, y: scaleMarker});
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


    //var LineStyleView = makeSlider("PenStrokeHandle", "PenStrokeTrack", "PenStrokeSlider", {point1: PencilToolOptionsColors.bounds.topLeft, point2: PencilToolOptionsColors.bounds.topRight}, {min:0, max: NerdBoard.penStrokeRange}, NerdBoard.penStrokeRange/2, NerdBoard.penColor, NerdBoard.colors.defaultBg);
    //console.log(PencilToolOptionsColors.bounds.topRight);
    //console.log({point1: PencilToolOptionsColors.bounds.topLeft, point2: PencilToolOptionsColors.bounds.topRight});
    //LineStyleView.position.y -= 25;
    ////LineStyleView.data = {
    ////    name: "LineStyleView"
    ////};

    PencilToolOptionsColors.onMouseDown = function (event) {
        event.preventDefault();
        PencilToolOptionsColors.data.dragging = false;
    };
    PencilToolOptionsColors.onMouseDrag = function (event) {
        event.preventDefault();
        PencilToolOptionsColors.data.dragging = true;
        if (PencilToolOptions.data.out) {
            var avgColor = this.getAverageColor(event.point);
            PencilToolOptionsRedBox.fillColor = new Color(avgColor.red * 256, 0, 0);
            PencilToolOptionsRedText.content = Math.round(avgColor.red * 256);
            PencilToolOptionsGreenBox.fillColor = new Color(0, avgColor.green * 256, 0);
            PencilToolOptionsGreenText.content = Math.round(avgColor.green * 256);
            PencilToolOptionsBlueBox.fillColor = new Color(0, 0, avgColor.blue * 256);
            PencilToolOptionsBlueText.content = Math.round(avgColor.blue * 256);
            if (PencilToolOptions.data.choosingPenColor) {
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
    PencilToolOptionsColors.onMouseUp = function (event) {
        event.preventDefault();
        //if (!PencilToolOptionsColors.data.dragging) {
        //    window.setTimeout(function () {
        //        if (PencilToolIcon.data.optionsOut)
        //            PencilToolIcon.data.closeOptions();
        //    }, 10);
        //}
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
    NerdBoardUI.position = new Point(NerdBoard.width * .25, NerdBoard.height * .25);
    NerdBoardUI.bringToFront();
    //NerdBoardUI.selected = true;
    NerdBoardUI.data = {
        name: "NerdBoardUI",
        wasDragged: false,
        animate: false,
        destination: {},
        delta: 2,
        reset: function () {
            this.animate = false;
        },
        setDest: function (range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        toolsOut: false,
        animatingTools: false,
        toolsStack: [7, 6, 5],
        toolsToAnimate: {tool2: 50, tool3: 100, tool4: 150},
        toolsAngle: {angle1: 175, angle2: 145, angle3: 115, angle4: 85},
        activeTool: "draw",
        animateToolsIn: function () {
            this.animatingTools = true;
            this.out = false;
            //console.log(NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]]);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.animate = true;
            this.updateUI();
        },
        animateToolsOut: function () {
            this.animatingTools = false;
            this.out = true;
            if (!NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle1);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.animate = true;

            if (!NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle2);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.animate = true;

            if (!NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.out)
                NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.setDest(100, NerdBoardUI.data.toolsAngle.angle3);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.animate = true;
        },
        toggleTools: function () {
            if (!this.toolsOut) {
                this.animateToolsOut();
            }
            else {
                this.animateToolsIn();
            }
        },
        updateUI: function () {
            var childLength = NerdBoardUI.children.length;
            var lastChild = NerdBoardUI.children[childLength - 1];

            if (!lastChild.data.active) {
                this.scaleIconTo(lastChild, smallIcon);
                NerdBoardUICenter.bringToFront();
                for (var i = childLength - NerdBoardUI.data.toolsStack.length - 2; i < childLength; i++) {
                    if (NerdBoardUI.children[i].data.active) {
                        NerdBoardUI.children[i].bringToFront();
                        break;
                    }
                }
            }

            if (lastChild.data.optionsOut)
                lastChild.data.closeOptions();
        },
        updateTool: function () {
            var childLength = NerdBoardUI.children.length;
            for (var i = childLength - NerdBoardUI.data.toolsStack.length - 2; i < childLength; i++) {
                if (NerdBoardUI.children[i].data.active) {
                    NerdBoardUI.children[i].data.activateTool();
                    break;
                }
            }
        },
        vectorThres: 1,
        destinationPoint: function (dist, angle) {
            var dir = new Point(dist * Math.cos(angle * (Math.PI / 180)), dist * Math.sin(angle * (Math.PI / 180)));
            var dest = new Point(NerdBoardUICenter.position.x + dir.x, NerdBoardUICenter.position.y - dir.y);
            return dest;
        },
        destinationVector: function (destination, icon) {
            var vector = new Point(destination.x - icon.position.x, destination.y - icon.position.y);
            return vector;
        },
        centerVector: function (icon) {
            return new Point(NerdBoardUICenter.position.x - icon.position.x, NerdBoardUICenter.position.y - icon.position.y);
        },
        animateIconOut: function (delta, vector, icon) {
            if (-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = true;
                icon.data.reset();
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;
        },
        animateIconIn: function (delta, vector, icon) {
            if (-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = false;
                icon.data.reset();
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;

            if (icon.data.active) {
                this.scaleIconTo(icon, mediumIcon);
            }
        },
        toggleIcon: function (icon) {
            if (icon.data.animate) {
                if (!icon.data.out) {
                    var vector = NerdBoardUI.data.destinationVector(icon.data.destination, icon);
                    NerdBoardUI.data.animateIconOut(icon.data.delta, vector, icon);
                }
                else {
                    var vector = NerdBoardUI.data.centerVector(icon);
                    NerdBoardUI.data.animateIconIn(icon.data.delta, vector, icon);
                }
            }
        },
        scaleIconTo: function (icon, dimensions) {
            var xScale = dimensions.x / icon.bounds.width;
            var yScale = dimensions.y / icon.bounds.height;
            icon.scale(xScale, yScale);
        }
    };
    /*
     *   This handles deactivating the current tool when using the NerdBoardUI
     * */
    NerdBoardUI.onMouseDown = function (event) {
        event.preventDefault();
        this.data.wasDragged = false;
        NerdBoard.Tools.tools.none.activate();
    };
    NerdBoardUI.onMouseDrag = function (event) {
        event.preventDefault();
        this.data.wasDragged = true;
    };
    NerdBoardUI.onMouseUp = function (event) {
        event.preventDefault();
        window.setTimeout(NerdBoardUI.data.updateTool, 10);
    };
    /*
     *   NerdBoardUI
     * */



    /*
     *   NerdBoardUI private functions
     * */
    function makeCircle(center, radius, fillColor, strokeColor, data) {
        return new Path.Circle({
            center: new Point(center.x, center.y),
            radius: radius,
            fillColor: fillColor,
            strokeColor: strokeColor,
            strokeWidth: 2,
            data: data
        });
    }


    function makeRect(center, size, fillColor, strokeColor, data) {
        return new paper.Path.Rectangle({
            center: new Point(center.x, center.y),
            size: [size.x, size.y],
            fillColor: fillColor,
            strokeColor: strokeColor,
            strokeWidth: 2,
            data: data
        });
    }


    function makeText(content, size, justification, fillColor, data) {
        return new PointText({
            content: content,
            fontFamily: 'sans-serif',
            fontSize: size,
            justification: justification,
            fillColor: fillColor,
            data: data
        });
    }


    function makeIcon(name, active, tool) {
        return {
            name: name,
            active: active,
            animate: false,
            out: false,
            destination: {},
            delta: 2,
            reset: function () {
                this.animate = false;
            },
            setDest: function (range, angle) {
                this.destination = NerdBoardUI.data.destinationPoint(range, angle);
            },
            activateTool: tool
        };
    }


    function makeIconWithOptions(name, active, options, tool) {
        return {
            name: name,
            optionsOut: false,
            active: active,
            animate: false,
            out: false,
            destination: {},
            delta: 2,
            reset: function () {
                this.animate = false;
            },
            setDest: function (range, angle) {
                this.destination = NerdBoardUI.data.destinationPoint(range, angle);
            },
            activateTool: tool,
            closeOptions: function () {
                this.optionsOut = false;
                options.data.animate = true;
                NerdBoardUI.data.scaleIconTo(options, smallToolOptions);
                window.setTimeout(function () {
                    options.opacity = 0;
                }, 50);//Prevent displaying under other icons
            },
            openOptions: function () {
                this.optionsOut = true;
                if (!this.out) {
                    if (!options.data.out)
                        options.data.setDest(270, -50);
                    options.data.animate = true;
                    window.setTimeout(function () {
                        NerdBoardUI.data.scaleIconTo(options, largeToolOptions);
                        options.opacity = 1;
                    }, 20);//For animation
                }
            },
            toggleOptions: function () {
                if (!this.optionsOut) {
                    this.openOptions();
                }
                else {
                    this.closeOptions();
                }
            }
        };
    }


    function makeSlider(handleName, trackName, sliderName, sliderSize, sliderRange, trackStrokeWidth, fillColor, strokeColor) {
        var handle = makeCircle({x: 0, y: sliderSize.point1.y}, (sliderRange.max + 15) / 4, fillColor, strokeColor, {name: handleName, value: sliderRange.max/2, radiusOffset: 30});
        handle.onMouseDrag = function (event) {
            var totDis = sliderSize.point2.x - sliderSize.point1.x;
            console.log(sliderSize.point2);
            console.log(sliderSize.point1);
            console.log(totDis);
            var currDis = event.point.x - sliderSize.point1.x;
            console.log(currDis);
            var disRatio = currDis / totDis;
            console.log(disRatio);

            if (disRatio <= .06) {
                this.position.x = sliderSize.point1.x + (handle.bounds.width / 2);
                this.data.value = sliderRange.min;
            }
            else if (disRatio >= .9) {
                this.position.x = sliderSize.point2.x - (handle.bounds.width / 2);
                this.data.value = sliderRange.max;
            }
            else {
                this.position.x = event.point.x;
                this.data.value = Math.round(sliderRange.max * disRatio);
                console.log(this.data.value);
            }
        };
        var track = new Path({
            strokeColor: fillColor,
            strokeWidth: trackStrokeWidth,
            strokeCap: 'round',
            data: {
                name: trackName
            }
        });
        console.log(sliderSize.point2);
        console.log(sliderSize.point1);
        track.add(sliderSize.point1, sliderSize.point2);
        var slider = new Group(track, handle);
        slider.data = {
            name: sliderName
        };

        return slider;
    }
    /*
     *   NerdBoardUI private functions
     * */




    /*
     *   Positioning and scaling icons
     * */
    var smallIcon = {x: 32, y: 32};
    var smallMediumIcon = {x: 48, y: 48};
    var mediumIcon = {x: 64, y: 64};
    var largeIcon = {x: 256, y: 288};

    var smallToolOptions = {x: 16, y: 16};
    var largeToolOptions = {x: 288, y: 288};

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
    PencilToolIcon.data = makeIconWithOptions("PencilToolIcon", true, PencilToolOptions, NerdBoard.activateDrawMode);
    PencilToolIcon.onMouseDrag = function (event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
    };
    PencilToolIcon.onMouseUp = function (event) {
        event.preventDefault();
        if (!NerdBoardUI.data.wasDragged) {//Prevents tools animation after being dragged
            if (NerdBoardUI.children[NerdBoardUI.children.length - 1].data.name != "PencilToolIcon") {
                NerdBoardUI.children[NerdBoardUI.children.length - 1].data.active = false;
                this.data.active = true;
                NerdBoardUI.data.animateToolsIn();
                NerdBoardUI.data.updateTool();
            }
            else {
                PencilToolIcon.data.toggleOptions();
            }
        }
    };
    /*
     *   PencilToolIcon
     * */




    /*
     *   PencilToolOptionsColors
     * */
    PencilToolOptions.data = makeIcon("PencilToolOptions", false, NerdBoard.Tools.tools.none);
    PencilToolOptions.data.choosingPenColor = true;
    PencilToolOptions.onMouseDown = function () {
        event.preventDefault();
        /*
         * NerdBoardUI deactivates the current tool onMouseDown
         * This will reset the active tool to draw after a color is choosen
         * */
        window.setTimeout(function () {
            PencilToolIcon.data.activateTool();
        }, 10);
    };
    /*
     *   PencilToolOptionsColors
     * */




    /*
     *   EraserToolIcon
     * */
    EraserToolIcon.data = makeIcon("EraserToolIcon", false, NerdBoard.activateEraseMode);
    EraserToolIcon.onMouseUp = function (event) {
        event.preventDefault();
        if (!NerdBoardUI.data.wasDragged) {//Prevents tools animation after being dragged
            if (NerdBoardUI.children[NerdBoardUI.children.length - 1].data.name != "EraserToolIcon") {
                NerdBoardUI.children[NerdBoardUI.children.length - 1].data.active = false;
                this.data.active = true;
                NerdBoardUI.data.animateToolsIn();
                NerdBoardUI.data.updateTool();
            }
        }
    };
    EraserToolIcon.onMouseDrag = function (event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
    };
    /*
     *   EraserToolIcon
     * */




    /*
     *   MoveToolIcon
     * */
    MoveToolIcon.data = makeIcon("MoveToolIcon", false, NerdBoard.activateMoveMode);
    MoveToolIcon.onMouseUp = function (event) {
        event.preventDefault();
        if (NerdBoardUI.children[NerdBoardUI.children.length - 1].data.name != "MoveToolIcon") {
            NerdBoardUI.children[NerdBoardUI.children.length - 1].data.active = false;
            this.data.active = true;
            NerdBoardUI.data.animateToolsIn();
            NerdBoardUI.data.updateTool();
        }
    };
    MoveToolIcon.onMouseDrag = function (event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
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
        reset: function () {
            this.animate = false;
        },
        setDest: function (range, angle) {
            this.destination = NerdBoardUI.data.destinationPoint(range, angle);
        },
        activateTool: function () {
        },
        closeOptions: function () {
            this.optionsOut = false;
            SaveIcon.data.animate = true;
            NerdBoardUI.data.scaleIconTo(SaveIcon, smallToolOptions);
            UploadIcon.data.animate = true;
            NerdBoardUI.data.scaleIconTo(UploadIcon, smallToolOptions);
        },
        openOptions: function () {
            this.optionsOut = true;
            if (!this.out) {
                SaveIcon.data.setDest(100, 22.5);
                SaveIcon.data.animate = true;
                UploadIcon.data.setDest(100, -22.5);
                UploadIcon.data.animate = true;
                window.setTimeout(function () {
                    NerdBoardUI.data.scaleIconTo(SaveIcon, mediumIcon);
                    NerdBoardUI.data.scaleIconTo(UploadIcon, mediumIcon);
                }, 20);//For animation
            }
        },
        toggleOptions: function () {
            if (!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        }
    };
    MenuIcon.onMouseUp = function (event) {
        event.preventDefault();
        if (!NerdBoardUI.data.wasDragged) {//Prevents tools animation after being dragged
            if (NerdBoardUI.children[NerdBoardUI.children.length - 1].data.name != "MenuIcon") {
                NerdBoardUI.children[NerdBoardUI.children.length - 1].data.active = false;
                this.data.active = true;
                NerdBoardUI.data.animateToolsIn();
                NerdBoardUI.data.updateTool();
            }
            else {
                MenuIcon.data.toggleOptions();
            }
        }
    };
    MenuIcon.onMouseDrag = function (event) {
        event.preventDefault();
        NerdBoardUI.position.x += event.delta.x;
        NerdBoardUI.position.y += event.delta.y;
    };
    /*
     *   MenuIcon
     * */




    /*
     *   SaveIcon
     * */
    SaveIcon.data = makeIcon("SaveIcon", false, NerdBoard.Tools.tools.none);
    SaveIcon.onMouseDown = function () {
        event.preventDefault();
        var link = document.createElement("a");
        var name = window.prompt("Please name your Image: ");
        if (name != null) {
            NerdBoardUI.opacity = 0;
            paper.view.draw();

            link.href = NerdBoard.canvas[0].toDataURL('image/png');
            link.download = name;
            link.click();

            NerdBoardUI.opacity = 1;
            paper.view.draw();

            window.alert("Image was saved!");
        }
        else {
            window.alert("Image was NOT saved!!");
        }
    };
    /*
     *   SaveIcon
     * */




    /*
     *   UploadIcon
     * */
    UploadIcon.data = makeIcon("UploadIcon", false,  NerdBoard.Tools.tools.none);
    UploadIcon.onMouseDown = function () {
        event.preventDefault();
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
     *   UploadIcon
     * */




    /*
     *   UndoIcon
     * */
    UndoIcon.onMouseDown = function () {
        event.preventDefault();
        NerdBoard.Tools.undo();
    };
    /*
     *   UndoIcon
     * */




    /*
     *   TrashIcon
     * */
    TrashIcon.onMouseUp = function (event) {
        event.preventDefault();
        var c = confirm('Are you sure you want to clear the canvas?');
        if (c) {
            NerdBoardUI.data.beingUsed = false;
            NerdBoard.Tools.clear();
        }
    };
    /*
     *   TrashIcon
     * */




    paper.view.onFrame = function (event) {
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
    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);


    drawingLayer.onMouseDown = function() {
        event.preventDefault();
        window.setTimeout(NerdBoardUI.data.updateUI, 10);
    };
    //console.log(paper);
}