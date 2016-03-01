var NerdBoardUI;
var PencilToolIcon, PencilToolOptionsColors, EraserToolIcon, MoveToolIcon, MenuIcon, SaveIcon, UploadIcon, UndoIcon, TrashIcon, BGImg, GridIcon;
var smallIcon = {width: 32, height: 32};
var smallMediumIcon = {width: 48, height: 48};
var mediumIcon = {width: 56, height: 56};
var largeIcon = {width: 256, height: 288};

var smallToolOptions = {width: 16, height: 16};
var largeToolOptions = {width: 460, height: 360};



NerdBoard.layers.UI.activate();
PencilToolIcon = new Raster('PencilIcon');
PencilToolIcon.onLoad = function() {
    NerdBoard.layers.UI.activate();
    PencilToolOptionsColors = new Raster('ColorIcon');
    NerdBoard.layers.UI.activate();
    PencilToolOptionsColors.onLoad = function() {
        NerdBoard.layers.UI.activate();
        EraserToolIcon = new Raster('EraserIcon');
        EraserToolIcon.onLoad = function() {
            NerdBoard.layers.UI.activate();
            MoveToolIcon = new Raster('MoveIcon');
            MoveToolIcon.onLoad = function() {
                NerdBoard.layers.UI.activate();
                MenuIcon = new Raster('MenuIcon');
                MenuIcon.onLoad = function() {
                    NerdBoard.layers.UI.activate();
                    SaveIcon = new Raster('SaveIcon');
                    SaveIcon.onLoad = function() {
                        NerdBoard.layers.UI.activate();
                        UploadIcon = new Raster('UploadIcon');
                        UploadIcon.onLoad = function() {
                            NerdBoard.layers.UI.activate();
                            UndoIcon = new Raster('UndoIcon');
                            UndoIcon.onLoad = function() {
                                NerdBoard.layers.UI.activate();
                                TrashIcon = new Raster('TrashIcon');
                                TrashIcon.onLoad = function() {
                                    NerdBoard.layers.UI.activate();
                                    GridIcon = new Raster('GridIcon');
                                    GridIcon.onLoad = createUI;
                                };
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
    var PencilToolOptionsPenColor = makeRect({x: PencilToolOptionsColors.bounds.topLeft.x - 40, y: PencilToolOptionsColors.bounds.topLeft.y + 15
    }, {x: 30, y: 30}, NerdBoard.penColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsPenColor"});
    PencilToolOptionsPenColor.onMouseUp = function () {
        PencilToolOptions.data.choosingPenColor = true;
        PencilToolOptionsBGColor.sendToBack();
        //PencilToolOptionsBGOptions.opacity = 0;
    };

    var PencilToolOptionsBGColor = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 25,
        y: PencilToolOptionsColors.bounds.topLeft.y + 30
    }, {x: 30, y: 30}, NerdBoard.bgColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBGColor"});
    PencilToolOptionsBGColor.onMouseUp = function () {
        PencilToolOptions.data.choosingPenColor = false;
        PencilToolOptionsPenColor.sendToBack();
        //PencilToolOptionsBGOptions.opacity = 1;
    };
    var PencilToolOptionsPenBGPicker = new Group(PencilToolOptionsBGColor, PencilToolOptionsPenColor);


    //RGB values
    var PencilToolOptionsRedBox = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 30,
        y: PencilToolOptionsColors.bounds.topLeft.y + 75
    }, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsRedBox"});
    var PencilToolOptionsRedText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsRedText"});
    PencilToolOptionsRedText.fitBounds(PencilToolOptionsRedBox.bounds);
    var PencilToolOptionsRed = new Group(PencilToolOptionsRedBox, PencilToolOptionsRedText);

    var PencilToolOptionsGreenBox = makeRect({
        x: PencilToolOptionsColors.bounds.topLeft.x - 30,
        y: PencilToolOptionsColors.bounds.topLeft.y + 115
    }, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsGreenBox"});
    var PencilToolOptionsGreenText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsGreenText"});
    PencilToolOptionsGreenText.fitBounds(PencilToolOptionsGreenBox.bounds);
    var PencilToolOptionsGreen = new Group(PencilToolOptionsGreenBox, PencilToolOptionsGreenText);

    var PencilToolOptionsBlueBox = makeRect({x: PencilToolOptionsColors.bounds.topLeft.x - 30, y: PencilToolOptionsColors.bounds.topLeft.y + 155}, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBlueBox"});
    var PencilToolOptionsBlueText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBlueText"});
    PencilToolOptionsBlueText.fitBounds(PencilToolOptionsBlueBox.bounds);
    var PencilToolOptionsBlue = new Group(PencilToolOptionsBlueBox, PencilToolOptionsBlueText);
    var PencilToolOptionsRGB = new Group(PencilToolOptionsRed, PencilToolOptionsGreen, PencilToolOptionsBlue);



    //Predefined Colors
    var PencilToolOptionsWhite = makeRect({x: PencilToolOptionsColors.bounds.topRight.x + 25, y: PencilToolOptionsColors.bounds.topRight.y + 30}, {x: 30, y: 30}, NerdBoard.colors.defaultBg, NerdBoard.colors.defaultBlack, {name: "PencilToolOptionsWhite"});
    PencilToolOptionsWhite.onMouseUp = function (event) {
        event.preventDefault();
        PencilToolOptionsColors.data.updateColorPickingUI(NerdBoard.colors.defaultBg);

    };
    var PencilToolOptionsBlack = makeRect({x: PencilToolOptionsColors.bounds.topRight.x + 65, y: PencilToolOptionsColors.bounds.topRight.y + 30}, {x: 30, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBlack"});
    PencilToolOptionsBlack.onMouseUp = function (event) {
        event.preventDefault();
        PencilToolOptionsColors.data.updateColorPickingUI(NerdBoard.colors.defaultBlack);
    };


    //usedColorsStack
    var usedColor1 = makeRect({x: 0, y: 0}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor1"});
    var usedColor2 = makeRect({x: 40, y: 0}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor2"});
    var usedColor3 = makeRect({x: 80, y: 0}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor3"});
    var usedColor4 = makeRect({x: 0, y: 40}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor4"});
    var usedColor5 = makeRect({x: 40, y: 40}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor5"});
    var usedColor6 = makeRect({x: 80, y: 40}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor6"});
    var usedColor7 = makeRect({x: 0, y: 80}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor7"});
    var usedColor8 = makeRect({x: 40, y: 80}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor8"});
    var usedColor9 = makeRect({x: 80, y: 80}, {x: 30, y: 30},NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "usedColor9"});
    var PencilToolOptionsUsedColorsStack = new Group(usedColor1, usedColor2, usedColor3, usedColor4, usedColor5, usedColor6, usedColor7, usedColor8, usedColor9);
    PencilToolOptionsUsedColorsStack.position.x = PencilToolOptionsColors.bounds.topRight.x + 65;
    PencilToolOptionsUsedColorsStack.position.y = PencilToolOptionsColors.bounds.topRight.y + 110;
    PencilToolOptionsUsedColorsStack.data = {
        name: "PencilToolOptionsUsedColorsStack",
        shiftColors: function(color) {
            for(var i = PencilToolOptionsUsedColorsStack.children.length - 1; i > 0; i-- ) {
                PencilToolOptionsUsedColorsStack.children[i].fillColor = PencilToolOptionsUsedColorsStack.children[i-1].fillColor;
            }
            PencilToolOptionsUsedColorsStack.children[0].fillColor = color;
        },
        setChildrenOnMouseUp: function() {
            for(var i = 0; i < PencilToolOptionsUsedColorsStack.children.length; i++) {
                PencilToolOptionsUsedColorsStack.children[i].onMouseUp = function() {
                    PencilToolOptionsColors.data.updateColorPickingUI(this.fillColor);
                };
            }
        }
    };
    PencilToolOptionsUsedColorsStack.data.setChildrenOnMouseUp();




    //StrokeWidth slider
    var PencilToolOptionsPenWidthMarker = makeCircle({x: 0, y: PencilToolOptionsColors.bounds.topLeft.y}, (NerdBoard.penStrokeRange + 15) / 4, NerdBoard.penColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsPenWidthMarker", radiusOffset: 30});
    var PencilToolOptionsPenWidthMarkerText = makeText("25", 20, "center", NerdBoard.colors.defaultBg, {name: "PencilToolOptionsPenWidthMarkerText"});
    PencilToolOptionsPenWidthMarkerText.fitBounds(PencilToolOptionsPenWidthMarker.bounds);
    var PencilToolOptionsPenWidthRail = new Path({
        strokeColor: NerdBoard.penColor,
        strokeWidth: NerdBoard.penStroke,
        strokeCap: 'round',
        data: {
            name: "PencilToolOptionsPenWidthRail"
        }
    });
    PencilToolOptionsPenWidthMarkerText.onMouseDrag = function (event) {
        var totDis = PencilToolOptionsColors.bounds.topRight.x - PencilToolOptionsColors.bounds.topLeft.x;
        var currDis = event.point.x - PencilToolOptionsColors.bounds.topLeft.x;
        var disRatio = currDis / totDis;

        if (disRatio <= .01) {
            this.position.x = PencilToolOptionsColors.bounds.topLeft.x + (PencilToolOptionsPenWidthMarker.bounds.width / 2);
            PencilToolOptionsPenWidthMarker.position.x = PencilToolOptionsColors.bounds.topLeft.x + (PencilToolOptionsPenWidthMarker.bounds.width / 2);
            NerdBoard.penStroke = 1;
        }
        else if (disRatio >= 1) {
            this.position.x = PencilToolOptionsColors.bounds.topRight.x - (PencilToolOptionsPenWidthMarker.bounds.width / 2);
            PencilToolOptionsPenWidthMarker.position.x = PencilToolOptionsColors.bounds.topRight.x - (PencilToolOptionsPenWidthMarker.bounds.width / 2);
            NerdBoard.penStroke = NerdBoard.penStrokeRange;
        }
        else {
            this.position.x = event.point.x;
            PencilToolOptionsPenWidthMarker.position.x = event.point.x;
            NerdBoard.penStroke = Math.round(NerdBoard.penStrokeRange * disRatio);
            PencilToolOptionsPenWidthRail.strokeWidth = NerdBoard.penStroke;
        }
        PencilToolOptionsPenWidthMarkerText.content = NerdBoard.penStroke;
    };
    PencilToolOptionsPenWidthRail.add(PencilToolOptionsColors.bounds.topLeft, PencilToolOptionsColors.bounds.topRight);
    var PencilToolOptionsPenWidthSlider = new Group(PencilToolOptionsPenWidthRail, PencilToolOptionsPenWidthMarker, PencilToolOptionsPenWidthMarkerText);
    PencilToolOptionsPenWidthSlider.position.y -= 25;
    PencilToolOptionsPenWidthSlider.data = {
        name: "PencilToolOptionsPenWidthSlider"
    };

    //var
    var PencilToolOptionsBGOptions = new Group(GridIcon);


    //var PencilToolOptionsPenWidthSlider = makeSlider("PenStrokeHandle", "PenStrokeTrack", "PenStrokeSlider", {point1: PencilToolOptionsColors.bounds.topLeft, point2: PencilToolOptionsColors.bounds.topRight}, {min:0, max: NerdBoard.penStrokeRange}, NerdBoard.penStrokeRange/2, NerdBoard.penColor, NerdBoard.colors.defaultBg);
    //console.log(PencilToolOptionsColors.bounds.topRight);
    //console.log({point1: PencilToolOptionsColors.bounds.topLeft, point2: PencilToolOptionsColors.bounds.topRight});
    //PencilToolOptionsPenWidthSlider.position.y -= 25;
    //PencilToolOptionsPenWidthSlider.data = {
    //    name: "PencilToolOptionsPenWidthSlider"
    //};
    var PencilToolOptions = new Group(PencilToolOptionsBGOptions, PencilToolOptionsUsedColorsStack, PencilToolOptionsBlack, PencilToolOptionsWhite, PencilToolOptionsPenBGPicker, PencilToolOptionsRGB, PencilToolOptionsColors, PencilToolOptionsPenWidthSlider);
    PencilToolOptions.opacity = 0;
    /*
     * PencilToolOptions UI
     * */




    /*
     *   NerdBoardUI manages all of the event for the UI
     *   NerdBoardUI will interface with NerdBoard
     * */
    NerdBoardUI = new Group(TrashIcon, UndoIcon, UploadIcon, SaveIcon, PencilToolOptions, MenuIcon, MoveToolIcon, EraserToolIcon, NerdBoardUICenter, PencilToolIcon);
    NerdBoardUI.position = new Point(NerdBoard.size.width * .25, NerdBoard.size.height * .25);
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
            this.toolsOut = false;
            //console.log(NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]]);
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[0]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[1]].data.animate = true;
            NerdBoardUI.children[NerdBoardUI.data.toolsStack[2]].data.animate = true;
            this.updateUI();
        },
        animateToolsOut: function () {
            this.animatingTools = false;
            this.toolsOut = true;
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
                NerdBoard.scaleImg(lastChild, smallIcon);
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
        updateCenter: function() {
            NerdBoardUICenter.fillColor = NerdBoard.penColor;
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
                NerdBoard.scaleImg(icon, mediumIcon);
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
        }
    };
    /*
     *   This handles deactivating the current tool when using the NerdBoardUI
     * */
    NerdBoardUI.onMouseDown = function (event) {
        event.preventDefault();
        this.data.wasDragged = false;
        NerdBoard.activateNone();
    };
    NerdBoardUI.onMouseDrag = function (event) {
        event.preventDefault();
        this.data.wasDragged = true;
    };
    NerdBoardUI.onMouseUp = function (event) {
        event.preventDefault();
        window.setTimeout(function() {
            if(!NerdBoardUI.children[NerdBoardUI.children.length-1].data.optionsOut) {//Reactivates tool when options are closed by user
                NerdBoardUI.data.updateTool();
            }
        }, 10);
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


    function makeIconWithOptions(name, active, options, tool, dis, angle, smallScale, largeScale) {
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
                NerdBoard.scaleImg(options, smallScale);
                window.setTimeout(function () {
                    options.opacity = 0;
                }, 50);//Prevent displaying under other icons
            },
            openOptions: function () {
                this.optionsOut = true;
                if (!this.out) {
                    if (!options.data.out)
                        options.data.setDest(dis, angle);
                    options.data.animate = true;
                    window.setTimeout(function () {
                        NerdBoard.scaleImg(options, largeScale);
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

    //PencilToolOptionsBGOptions.opacity = 0;

    UndoIcon.position.x -= 60;
    UndoIcon.position.y += 60;
    TrashIcon.position.x -= 20;
    TrashIcon.position.y += 75;
    PencilToolOptionsBGOptions.position.x = PencilToolOptionsColors.bounds.bottomLeft.x + 25;
    PencilToolOptionsBGOptions.position.y = PencilToolOptionsColors.bounds.bottomLeft.y + 30;

    NerdBoard.scaleImg(PencilToolIcon, mediumIcon);
    NerdBoard.scaleImg(PencilToolOptions, smallIcon);
    NerdBoard.scaleImg(EraserToolIcon, smallIcon);
    NerdBoard.scaleImg(MoveToolIcon, smallIcon);
    NerdBoard.scaleImg(MenuIcon, smallIcon);

    NerdBoard.scaleImg(SaveIcon, mediumIcon);
    NerdBoard.scaleImg(UploadIcon, mediumIcon);
    NerdBoard.scaleImg(UndoIcon, smallMediumIcon);
    NerdBoard.scaleImg(TrashIcon, smallMediumIcon);
    NerdBoard.scaleImg(GridIcon, {width: 3, height: 3});
    /*
     *   Positioning and scaling icons
     * */




    /*
     *   PencilToolIcon
     * */
    PencilToolIcon.data = makeIconWithOptions("PencilToolIcon", true, PencilToolOptions, NerdBoard.activateDrawMode, 350, -25, smallIcon, largeToolOptions);
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
                //NerdBoardUI.data.updateTool();
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
     *   PencilToolOptions
     * */
    PencilToolOptions.data = makeIcon("PencilToolOptions", false, NerdBoard.activateNone);
    PencilToolOptions.data.choosingPenColor = true;
    /*
     *   PencilToolOptions
     * */


    PencilToolOptionsColors.data = {
        name: "PencilToolOptionsColors",
        updateRGB: function(color) {
            PencilToolOptionsRedBox.fillColor = new Color(color.red * 255, 0, 0);
            PencilToolOptionsRedText.content = Math.round(color.red * 255);
            PencilToolOptionsGreenBox.fillColor = new Color(0, color.green * 255, 0);
            PencilToolOptionsGreenText.content = Math.round(color.green * 255);
            PencilToolOptionsBlueBox.fillColor = new Color(0, 0, color.blue * 255);
            PencilToolOptionsBlueText.content = Math.round(color.blue * 255);
        },
        getRGB: function() {
            return {
                red: PencilToolOptionsRedText.content,
                green: PencilToolOptionsGreenText.content,
                blue: PencilToolOptionsBlueText.content
            };
        },
        updateBGColor: function() {
            PencilToolOptionsBGColor.fillColor = NerdBoard.bgColor;
        },
        updatePenColor: function() {
            PencilToolOptionsPenColor.fillColor = NerdBoard.penColor;
            this.updateStrokeWidthSlider();
            NerdBoardUI.data.updateCenter();
        },
        updateColorPickingUI: function(color) {
            this.updateRGB(color);
            if (PencilToolOptions.data.choosingPenColor) {
                NerdBoard.setColor(color);
                this.updatePenColor();
            }
            else {
                NerdBoard.setBg(color);
                this.updateBGColor();
            }
        },
        updateStrokeWidthSlider: function() {
            PencilToolOptionsPenWidthMarker.fillColor = NerdBoard.penColor;
            PencilToolOptionsPenWidthRail.strokeColor = NerdBoard.penColor;
        }
    };
    PencilToolOptionsColors.onMouseDown = function (event) {
        event.preventDefault();
    };
    PencilToolOptionsColors.onMouseDrag = function (event) {
        event.preventDefault();
        if (PencilToolOptions.data.out) {
            var avgColor = this.getAverageColor(event.point);
            if(avgColor) {
                this.data.updateColorPickingUI(avgColor);
            }
        }
    };
    PencilToolOptionsColors.onMouseUp = function (event) {
        event.preventDefault();
        if (PencilToolOptions.data.out) {
            var avgColor = this.getAverageColor(event.point);
            this.data.updateColorPickingUI(avgColor);
            PencilToolOptionsUsedColorsStack.data.shiftColors(avgColor);
        }
    };




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
            NerdBoard.scaleImg(SaveIcon, smallToolOptions);
            UploadIcon.data.animate = true;
            NerdBoard.scaleImg(UploadIcon, smallToolOptions);
        },
        openOptions: function () {
            this.optionsOut = true;
            if (!this.out) {
                SaveIcon.data.setDest(100, 22.5);
                SaveIcon.data.animate = true;
                UploadIcon.data.setDest(100, -22.5);
                UploadIcon.data.animate = true;
                window.setTimeout(function () {
                    NerdBoard.scaleImg(SaveIcon, mediumIcon);
                    NerdBoard.scaleImg(UploadIcon, mediumIcon);
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
    SaveIcon.data = makeIcon("SaveIcon", false, NerdBoard.activateNone);
    SaveIcon.onMouseDown = function () {
        event.preventDefault();
        NerdBoard.saveAsImg();
    };
    /*
     *   SaveIcon
     * */




    /*
     *   UploadIcon
     * */
    UploadIcon.data = makeIcon("UploadIcon", false,  NerdBoard.activateNone);
    UploadIcon.onMouseDown = function () {
        event.preventDefault();
        NerdBoard.setBGImg();
    };
    /*
     *   UploadIcon
     * */




    /*
     *   BGImg
     * */
    //BGImg.onMouseDown = function () {
    //    event.preventDefault();
    //    NerdBoard.setBGImg();
    //};
    /*
     *   BGImg
     * */




    /*
     *   UndoIcon
     * */
    UndoIcon.onMouseDown = function () {
        event.preventDefault();
        NerdBoard.undo();
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
            NerdBoard.clear();
        }
    };
    /*
     *   TrashIcon
     * */



    /*
    *   GridIcon
    * */
    GridIcon.onMouseDown = function() {
        if(NerdBoard.layers.drawing.children[0].children[1].opacity == .8) {
            NerdBoard.layers.drawing.children[0].children[1].opacity = 0;
        }
        else {
            NerdBoard.layers.drawing.children[0].children[1].opacity = .8;
        }
    };
    /*
    *   GridIcon
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


    NerdBoard.layers.drawing.onMouseUp = function() {
        event.preventDefault();
        window.setTimeout(function() {
            NerdBoardUI.data.updateUI();//Too close any open options
            NerdBoardUI.data.updateTool();//Ensure the active tool is activated
        }, 30);
    };
    //console.log(paper);
}