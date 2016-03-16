/**
 * Created by Jose Araujo on 07/22/15.
 */
NerdBoard.UI = (function() {
    var UI = {
        smartMove: false,
        smartDest: {},
        smartOffset: 300,
        setSmartDest: function(event) {
            if(event.point.x > 400)
                UI.smartDest = event.point.subtract({x:300, y:0});
            else
                UI.smartDest = event.point.add({x:300, y:0});
            var smartVec = UI.smartDest.subtract(UI.group.position);
            if(300 < smartVec.length)
                UI.smartMove = true;
        },
        smartMoving: function() {
            if(UI.smartMove) {
                var smartVec = UI.smartDest.subtract(UI.group.position);
                UI.group.position = UI.group.position.add(smartVec.divide(5));
                if (smartVec.length < 10)
                    UI.smartMove = false;
            }
        },
        wasDragged: false,
        icons: {
            BG: {},
            pencil: {},
            eraser: {},
            move: {},
            insert: {},
            menu: {},
            colorGradient: {},
            save: {},
            upload: {},
            undo: {},
            clear: {},
            grid: {},
            tools: {},
            uploadImg: {}
        },
        iconsSizes: {
            s: {width: 32, height: 32},
            sm: {width: 48, height: 48},
            m: {width: 52, height: 52},
            sTool: {width: 16, height: 16},
            lTool: {width: 460, height: 360}
        },
        group: {},
        toolOptions: {
            pencil: {},
            insert: {},
            menu: {}
        },
        toolsStack: [9, 8, 7, 6],
        toolsAngle: [175, 145, 115, 85],
        toolsPeak: function() {
            return UI.group.children[UI.group.children.length - 2];
        },
        keyBoard: {}
    };




    UI.animationHandler = {
        toolsOut: false,
        animatingTools: false,
        animateToolsIn: function () {
            this.animatingTools = true;
            this.toolsOut = false;
            for(var i = 0; i < UI.toolsStack.length; i++) {
                UI.group.children[UI.toolsStack[i]].data.animate = true;
            }
            UI.updateUI();
        },
        animateToolsOut: function () {
            this.animatingTools = false;
            this.toolsOut = true;
            for(var i = 0; i < UI.toolsStack.length; i++) {
                if (!UI.group.children[UI.toolsStack[i]].data.out)
                    UI.group.children[UI.toolsStack[i]].data.setDestination(100, UI.toolsAngle[i]);
                UI.group.children[UI.toolsStack[i]].data.animate = true;
            }
        },
        toggleTools: function () {
            if (!this.toolsOut) {
                this.animateToolsOut();
            }
            else {
                this.animateToolsIn();
            }
        },
        vectorThres: 1,
        destinationPoint: function (mag, angle) {
            var dir = new Point(mag * Math.cos(angle * (Math.PI / 180)), mag * Math.sin(angle * (Math.PI / 180)));
            return new Point(UI.icons.BG.position.x + dir.x, UI.icons.BG.position.y - dir.y);
        },
        destinationVector: function (destination, icon) {
            return new Point(destination.x - icon.position.x, destination.y - icon.position.y);
        },
        centerVector: function (icon) {
            return new Point(UI.icons.BG.position.x - icon.position.x, UI.icons.BG.position.y - icon.position.y);
        },
        iconOut: function (delta, vector, icon) {
            if (-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = true;
                icon.data.animate = false;
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;
        },
        iconIn: function (delta, vector, icon) {
            if (-this.vectorThres < vector.x && vector.x < this.vectorThres && -this.vectorThres < vector.y && vector.y < this.vectorThres) {
                icon.data.out = false;
                icon.data.animate = false;
            }
            icon.position.x += vector.x / delta;
            icon.position.y += vector.y / delta;

            if (icon.data.active) {
                NerdBoard.scaleImg(icon, UI.iconsSizes.m);
            }
        },
        toggleIcon: function (icon) {
            if (icon.data.animate) {
                var vector;
                if (!icon.data.out) {
                    vector = UI.animationHandler.destinationVector(icon.data.destination, icon);
                    UI.animationHandler.iconOut(icon.data.delta, vector, icon);
                }
                else {
                    vector = UI.animationHandler.centerVector(icon);
                    UI.animationHandler.iconIn(icon.data.delta, vector, icon);
                }
            }
        }
    };




    UI.makeUI = function() {
        var PenBGPicker = makePenBGPicker();
        var RGBValues = makeRBGValues(UI.icons.colorGradient.bounds.topRight, 30, {a: 75, b: 115, c: 155});
        var PencilWidthSlider = makeSlider(UI.icons.colorGradient.bounds.topLeft, UI.icons.colorGradient.bounds.topRight, {min: 1, max: NerdBoard.penStrokeRange},
            4, NerdBoard.penStrokeRange / 3, NerdBoard.penColor, NerdBoard.colors.defaultBg, NerdBoard.colors.defaultBg, NerdBoard.penColor, NerdBoard.penStroke);
        UI.toolOptions.pencil = new Group(UI.icons.colorGradient, PenBGPicker, RGBValues, PencilWidthSlider);

        UI.toolOptions.insert = new Group(UI.icons.uploadImg);
        UI.toolOptions.menu = new Group(UI.icons.save, UI.icons.upload);

        var colorSwatches = makeColorSwatches();

        UI.group = new Group(colorSwatches, UI.toolOptions.pencil, UI.toolOptions.insert, UI.toolOptions.menu, UI.icons.clear, UI.icons.undo, UI.icons.menu, UI.icons.insert, UI.icons.move, UI.icons.eraser, UI.icons.BG, UI.icons.pencil, UI.icons.tools);
        UI.group.position = new Point(NerdBoard.size.width * .25, NerdBoard.size.height * .25);
        UI.group.bringToFront();
        //UI.group.opacity = .7;

        UI.setUp();
        UI.positionIcons();
        UI.scaleIcons();
        //makeGroupA();
    };




    UI.updateUI = function () {
        var childLength = UI.group.children.length;
        var peak = UI.group.children[childLength - 2];
        if (!peak.data.active) {
            NerdBoard.scaleImg(peak, UI.iconsSizes.s);
            UI.icons.BG.bringToFront();
            for (var i = childLength - UI.toolsStack.length - 3; i < childLength; i++) {
                if (UI.group.children[i].data.active) {
                    UI.group.children[i].bringToFront();
                    UI.icons.tools.bringToFront();
                    break;
                }
            }
            if(peak.data.swatchesOut)
                peak.data.closeSwatches();
        }
        if (peak.data.optionsOut)
            peak.data.closeOptions();
    };




    UI.updateUIBG = function() {
        UI.icons.BG.fillColor = NerdBoard.penColor;
    };




    UI.updateTool = function () {
        var childLength = UI.group.children.length;
        for (var i = childLength - UI.toolsStack.length - 3; i < childLength; i++) {
            if (UI.group.children[i].data.active) {
                UI.group.children[i].data.activateTool();
                break;
            }
        }
    };




    UI.positionIcons = function() {
        UI.icons.undo.position = UI.icons.undo.position.add({x: -60, y:60});
        UI.icons.clear.position = UI.icons.clear.position.add({x: -20, y:75});
        UI.icons.tools.position = UI.icons.tools.position.subtract(28);
        UI.icons.save.position = UI.icons.save.position.add({x: -5, y:-30});
        UI.icons.upload.position = UI.icons.upload.position.add({x: -5, y:30});
        UI.toolOptions.pencil.children[3].position = UI.toolOptions.pencil.children[3].position.add({x: 0, y:-25});
        UI.group.children[0].position = UI.icons.BG.position;
        UI.icons.pencil.data.toggleSwatches();
    };




    UI.scaleIcons = function() {
        NerdBoard.scaleImg(UI.icons.pencil, UI.iconsSizes.m);
        NerdBoard.scaleImg(UI.icons.eraser, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.icons.move, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.icons.menu, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.icons.insert, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.icons.tools, {width: 25, height: 25});
        NerdBoard.scaleImg(UI.icons.save, UI.iconsSizes.m);
        NerdBoard.scaleImg(UI.icons.upload, UI.iconsSizes.m);
        NerdBoard.scaleImg(UI.icons.undo, UI.iconsSizes.sm);
        NerdBoard.scaleImg(UI.icons.clear, UI.iconsSizes.sm);
        NerdBoard.scaleImg(UI.icons.grid, {width: 3, height: 3});
        NerdBoard.scaleImg(UI.toolOptions.pencil, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.toolOptions.insert, UI.iconsSizes.s);
        NerdBoard.scaleImg(UI.toolOptions.menu, UI.iconsSizes.s);
    };




    UI.makeIcons = function() {
        UI.icons.eraser.data = makeIcon("Eraser", false, NerdBoard.activateEraseMode);
        UI.icons.move.data = makeIcon("Move", false, NerdBoard.activateMoveMode);




        UI.toolOptions.pencil.data = makeIcon("PencilToolOptions", false, NerdBoard.activateNone);
        UI.toolOptions.pencil.data.choosingPenColor = true;

        UI.icons.pencil.data = makeIcon("Pencil", true, NerdBoard.activateDrawMode);
        UI.icons.pencil.data.closeOptions = function () {
            this.optionsOut = false;
            UI.toolOptions.pencil.data.animate = true;
            NerdBoard.scaleImg(UI.toolOptions.pencil, UI.iconsSizes.s);
        };
        UI.icons.pencil.data.openOptions = function () {
            this.optionsOut = true;
            if (!this.out) {
                if (!UI.toolOptions.pencil.data.out)
                    UI.toolOptions.pencil.data.setDestination(300, -15);
                UI.toolOptions.pencil.data.animate = true;
                window.setTimeout(function () {
                    NerdBoard.scaleImg(UI.toolOptions.pencil, {width: 256, height: 242});
                }, 20);//For animation
            }
        };
        UI.icons.pencil.data.toggleOptions = function () {
            if (!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        };
        UI.icons.pencil.data.swatchesOut = false;
        UI.icons.pencil.data.closeSwatches = function() {
            UI.group.children[0].position = UI.icons.BG.position;
            this.swatchesOut = false;
        };
        UI.icons.pencil.data.openSwatches = function() {
            UI.group.children[0].position = UI.group.children[0].position.add({x: 100, y:0});
            this.swatchesOut = true;
        };
        UI.icons.pencil.data.toggleSwatches = function() {
            if(this.swatchesOut)
                this.closeSwatches();
            else
                this.openSwatches();
        };




        UI.toolOptions.insert.data = makeIcon("InsertOptions", false, NerdBoard.activateNone);

        UI.icons.insert.data = makeIcon("Insert", false, NerdBoard.activateNone);
        UI.icons.insert.data.closeOptions = function () {
            this.optionsOut = false;
            UI.toolOptions.insert.data.animate = true;
            NerdBoard.scaleImg(UI.toolOptions.insert, UI.iconsSizes.s);
        };
        UI.icons.insert.data.openOptions = function () {
            this.optionsOut = true;
            if (!this.out) {
                if (!UI.toolOptions.insert.data.out)
                    UI.toolOptions.insert.data.setDestination(100, 0);
                UI.toolOptions.insert.data.animate = true;
                window.setTimeout(function () {
                    NerdBoard.scaleImg(UI.toolOptions.insert, UI.iconsSizes.m);
                }, 20);//For animation
            }
        };
        UI.icons.insert.data.toggleOptions = function () {
            if (!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        };




        UI.toolOptions.menu.data = makeIcon("MenuOptions", false, NerdBoard.activateNone);

        UI.icons.menu.data = makeIcon("Menu", false, NerdBoard.activateNone);
        UI.icons.menu.data.closeOptions = function () {
            this.optionsOut = false;
            UI.toolOptions.menu.data.animate = true;
            NerdBoard.scaleImg(UI.toolOptions.menu, UI.iconsSizes.s);
        };
        UI.icons.menu.data.openOptions = function () {
            this.optionsOut = true;
            if (!this.out) {
                if (!UI.toolOptions.menu.data.out)
                    UI.toolOptions.menu.data.setDestination(100, 0);
                UI.toolOptions.menu.data.animate = true;
                window.setTimeout(function () {
                    NerdBoard.scaleImg(UI.toolOptions.menu, {width: 52, height: 112});
                }, 20);//For animation
            }
        };
        UI.icons.menu.data.toggleOptions = function () {
            if (!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        };



        UI.icons.colorGradient.data = {
            name: "colorGradient",
            updateRGB: function(color) {
                UI.toolOptions.pencil.children[2].children[0].children[0].fillColor = new Color(color.red * 255, 0, 0);
                UI.toolOptions.pencil.children[2].children[0].children[1].content = Math.round(color.red * 255);
                UI.toolOptions.pencil.children[2].children[1].children[0].fillColor = new Color(0, color.green * 255, 0);
                UI.toolOptions.pencil.children[2].children[1].children[1].content = Math.round(color.green * 255);
                UI.toolOptions.pencil.children[2].children[2].children[0].fillColor = new Color(0, 0, color.blue * 255);
                UI.toolOptions.pencil.children[2].children[2].children[1].content = Math.round(color.blue * 255);
            },
            getRGB: function() {
                return {
                    red: UI.toolOptions.pencil.children[2].children[0].children[1].content,
                    green: UI.toolOptions.pencil.children[2].children[1].children[1].content,
                    blue: UI.toolOptions.pencil.children[2].children[2].children[1].content
                };
            },
            updateBGColor: function() {
                UI.toolOptions.pencil.children[1].children[1].fillColor = NerdBoard.BGColor;
            },
            updatePenColor: function() {
                UI.toolOptions.pencil.children[1].children[1].fillColor = NerdBoard.penColor;
                this.updateStrokeWidthSlider();
                UI.updateUIBG();
            },
            updateColorPickingUI: function(color) {
                this.updateRGB(color);
                if (UI.toolOptions.pencil.data.choosingPenColor) {
                    NerdBoard.setPenColor(color);
                    this.updatePenColor();
                }
                else {
                    NerdBoard.setBGColor(color);
                    this.updateBGColor();
                }
            },
            updateStrokeWidthSlider: function() {
                UI.toolOptions.pencil.children[3].children[1].fillColor = NerdBoard.penColor;
                UI.toolOptions.pencil.children[3].children[0].strokeColor = NerdBoard.penColor;
            }
        };
    };




    UI.addListeners = function() {
        UI.icons.BG.onMouseDrag = UI.icons.tools.onMouseDrag = function(event) {
            UI.group.position = UI.group.position.add(event.delta);
        };
        UI.icons.BG.onClick = UI.icons.tools.onClick = function (event) {
            event.preventDefault();
            if (!UI.wasDragged) {//Prevents tools animation after being dragged
                UI.animationHandler.toggleTools();
            }
        };
        UI.icons.BG.onDoubleClick = UI.icons.tools.onDoubleClick = preventDefault;


        UI.icons.pencil.onMouseDown = function() {
            if(!this.data.swatchesOut)
                this.data.openSwatches();
        };
        UI.icons.pencil.onMouseDrag = moveUI;
        UI.icons.pencil.onClick = toolsOnClick;
        UI.icons.pencil.onDoubleClick = preventDefault;

        UI.icons.eraser.onMouseDrag = moveUI;
        UI.icons.eraser.onClick = toolsOnClick;

        UI.icons.move.onMouseDrag = moveUI;
        UI.icons.move.onClick = toolsOnClick;

        UI.icons.insert.onMouseDrag = moveUI;
        UI.icons.insert.onClick = toolsOnClick;

        UI.icons.menu.onMouseDrag = moveUI;
        UI.icons.menu.onClick = toolsOnClick;


        UI.group.onMouseDown = function (event) {
            event.preventDefault();
            NerdBoard.activateNone();
            UI.wasDragged = false;
        };
        UI.group.onMouseDrag = function (event) {
            event.preventDefault();
            UI.wasDragged = true;
        };
        UI.group.onMouseUp = function (event) {
            event.preventDefault();
            window.setTimeout(function() {
                if(!UI.toolsPeak().data.optionsOut) {//Reactivates tool when options are closed by user
                    UI.updateTool();
                }
            }, 10);
        };


        UI.icons.colorGradient.onMouseDrag = function (event) {
            event.preventDefault();
            var avgColor = this.getAverageColor(event.point);
            if(avgColor) {
                this.data.updateColorPickingUI(avgColor);
            }
        };
        UI.icons.colorGradient.onMouseUp = function (event) {
            event.preventDefault();
            var avgColor = this.getAverageColor(event.point);
            this.data.updateColorPickingUI(avgColor);
            shiftSwatches(avgColor);
        };


        UI.icons.save.onClick = function () {
            event.preventDefault();
            if(!UI.wasDragged) {
                NerdBoard.saveAsImg();
            }
        };


        UI.icons.uploadImg.onClick = function() {
            NerdBoard.loadImg();
        };


        UI.icons.undo.onClick = function () {
            event.preventDefault();
            if(!UI.wasDragged) {
                NerdBoard.undo();
            }
        };


        UI.icons.clear.onClick = function (event) {
            event.preventDefault();
            if(!UI.wasDragged) {
                var c = confirm('Are you sure you want to clear the canvas?');
                if (c) {
                    NerdBoard.clear();
                }
            }
        };


        setSwatchesOnMouseUp();


        NerdBoard.layers.drawing.onMouseDown = function(event) {
            event.preventDefault();
            UI.updateUI();//Too close any open options
            UI.updateTool();//Ensure the active tool is activated
        };


        NerdBoard.layers.drawing.onMouseUp = function(event) {
            event.preventDefault();
            UI.setSmartDest(event);
        };

        UI.toolOptions.pencil.children[3].onMouseDrag = function() {
            if(UI.toolOptions.pencil.children[3].children[2].content != NerdBoard.penStroke) {
                NerdBoard.setPenWidth(UI.toolOptions.pencil.children[3].children[2].content);//Set penStroke
                UI.toolOptions.pencil.children[3].children[0].strokeWidth = NerdBoard.penStroke;//Change pencilWidthSlider thickness
            }
        };
    };




    UI.setUp = function() {
        UI.makeIcons();
        UI.addListeners();
        UI.onFrame();
    };




    UI.onFrame = function() {
        view.onFrame = function (event) {
            UI.animationHandler.toggleIcon(UI.icons.pencil);
            UI.animationHandler.toggleIcon(UI.icons.eraser);
            UI.animationHandler.toggleIcon(UI.icons.move);
            UI.animationHandler.toggleIcon(UI.icons.insert);
            UI.animationHandler.toggleIcon(UI.icons.menu);
            UI.animationHandler.toggleIcon(UI.toolOptions.pencil);
            UI.animationHandler.toggleIcon(UI.toolOptions.insert);
            UI.animationHandler.toggleIcon(UI.toolOptions.menu);

            UI.smartMoving();
        };
    };




    UI.loadIcons = function() {
        UI.icons.BG = makeCircle({x: 0, y: 0}, 55, NerdBoard.penColor, NerdBoard.colors.defaultRed, "NerdBoardUIBG");
        var iconsToLoad = ['PencilIcon', 'EraserIcon', 'MoveIcon', 'InsertIcon', 'MenuIcon', 'ColorIcon', 'SaveIcon', 'UploadIcon', 'UndoIcon', 'TrashIcon', 'GridIcon', 'ToolsIcon', 'UploadImgIcon'];
        NerdBoard.layers.UI.activate();
        UI.icons.pencil = new Raster('PencilIcon');
        UI.icons.pencil.onLoad = function() {
            NerdBoard.layers.UI.activate();
            UI.icons.colorGradient = new Raster('ColorIcon');
            NerdBoard.layers.UI.activate();
            UI.icons.colorGradient.onLoad = function() {
                NerdBoard.layers.UI.activate();
                UI.icons.eraser = new Raster('EraserIcon');
                UI.icons.eraser.onLoad = function() {
                    NerdBoard.layers.UI.activate();
                    UI.icons.move = new Raster('MoveIcon');
                    UI.icons.move.onLoad = function() {
                        NerdBoard.layers.UI.activate();
                        UI.icons.menu = new Raster('MenuIcon');
                        UI.icons.menu.onLoad = function() {
                            NerdBoard.layers.UI.activate();
                            UI.icons.save = new Raster('SaveIcon');
                            UI.icons.save.onLoad = function() {
                                NerdBoard.layers.UI.activate();
                                UI.icons.upload = new Raster('UploadIcon');
                                UI.icons.upload.onLoad = function() {
                                    NerdBoard.layers.UI.activate();
                                    UI.icons.undo = new Raster('UndoIcon');
                                    UI.icons.undo.onLoad = function() {
                                        NerdBoard.layers.UI.activate();
                                        UI.icons.clear = new Raster('TrashIcon');
                                        UI.icons.clear.onLoad = function() {
                                            NerdBoard.layers.UI.activate();
                                            UI.icons.grid = new Raster('GridIcon');
                                            UI.icons.grid.onLoad = function() {
                                                NerdBoard.layers.UI.activate();
                                                UI.icons.tools = new Raster('ToolsIcon');
                                                UI.icons.tools.onLoad = function() {
                                                    NerdBoard.layers.UI.activate();
                                                    UI.icons.uploadImg = new Raster('UploadImgIcon');
                                                    UI.icons.uploadImg.onLoad = function() {
                                                        NerdBoard.layers.UI.activate();
                                                        UI.icons.insert = new Raster('InsertIcon');
                                                        UI.icons.insert.onLoad = UI.makeUI;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                }
                            };
                        };
                    }
                }
            };
        };
    };



    function makeGroupA() {
        var a = makeText("a", 60, "center", "black", {name: "a"});
        a.onMouseUp = function() {
            console.log("a");
        };

        var b = makeText("b", 30, "center", "black", {name: "b"});
        b.position = b.position.add({x: 0, y: -50});
        b.onMouseUp = function() {
            console.log("b");
        };

        var c = makeText("c", 30, "center", "black", {name: "c"});
        c.position = c.position.add({x: 50, y: 0});
        c.onMouseUp = function() {
            console.log("c");
        };

        var d = makeText("d", 30, "center", "black", {name: "d"});
        d.position = d.position.add({x: 0, y: 50});
        d.onMouseUp = function() {
            console.log("d");
        };

        var e = makeText("e", 30, "center", "black", {name: "e"});
        e.position = e.position.add({x: -50, y: 0});
        e.onMouseUp = function() {
            console.log("e");
        };

        var groupA = new Group(a, b, c, d, e);
        groupA.position = view.center;
    }




    function toolsOnClick(event) {
        event.preventDefault();
        if(!UI.wasDragged) {
            var peak = UI.toolsPeak();
            if (peak.data.name != this.data.name) {
                peak.data.active = false;
                this.data.active = true;
                UI.animationHandler.animateToolsIn();
                UI.updateTool();
            }
            else {
                if(this.data.toggleOptions) {
                    this.data.toggleOptions();
                }
            }
        }
    }





    function preventDefault(event) {
        event.preventDefault();
    }




    function moveUI(event) {
        event.preventDefault();
        UI.group.position = UI.group.position.add(event.delta);
    }




    function makeIcon(name, active, tool) {
        return {
            name: name,
            active: active,
            animate: false,
            out: false,
            optionsOut: false,
            delta: 2,
            destination: {},
            setDestination: function(mag, angle) {
                this.destination = UI.animationHandler.destinationPoint(mag, angle);
            },
            activateTool: tool
        };
    }




    function addOptions() {
        UI.icons.insert.data.closeOptions = function () {
            this.optionsOut = false;
            UI.toolOptions.insert.data.animate = true;
            NerdBoard.scaleImg(UI.toolOptions.insert, UI.iconsSizes.s);
        };
        UI.icons.insert.data.openOptions = function () {
            this.optionsOut = true;
            if (!this.out) {
                if (!UI.toolOptions.insert.data.out)
                    UI.toolOptions.insert.data.setDestination(100, 0);
                UI.toolOptions.insert.data.animate = true;
                window.setTimeout(function () {
                    NerdBoard.scaleImg(UI.toolOptions.insert, {width: 52, height: 112});
                }, 20);//For animation
            }
        };
        UI.icons.insert.data.toggleOptions = function () {
            if (!this.optionsOut) {
                this.openOptions();
            }
            else {
                this.closeOptions();
            }
        };
    }




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



    function makePenBGPicker() {
        var PenColor = makeRect({x: UI.icons.colorGradient.bounds.topRight.x + 25, y: UI.icons.colorGradient.bounds.topRight.y + 15
        }, {x: 30, y: 30}, NerdBoard.penColor, NerdBoard.colors.defaultBg, {name: "PenColor"});
        PenColor.onMouseUp = function () {
            UI.toolOptions.pencil.data.choosingPenColor = true;
            BGColor.sendToBack();
            //PencilToolOptionsBGOptions.opacity = 0;
        };

        var BGColor = makeRect({
            x: UI.icons.colorGradient.bounds.topRight.x + 40,
            y: UI.icons.colorGradient.bounds.topRight.y + 30
        }, {x: 30, y: 30}, NerdBoard.BGColor, NerdBoard.colors.defaultBg, {name: "PencilToolOptionsBGColor"});
        BGColor.onMouseUp = function () {
            UI.toolOptions.pencil.data.choosingPenColor = false;
            PenColor.sendToBack();
            //PencilToolOptionsBGOptions.opacity = 1;
        };
        return new Group(BGColor, PenColor);
    }




    function makeRBGValues(referencePoint, leftShift, verticalShifts) {
        var RedBox = makeRect({
            x: referencePoint.x + leftShift,
            y: referencePoint.y + verticalShifts.a
        }, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "RedBox"});
        var RedText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "RedText"});
        RedText.fitBounds(RedBox.bounds);
        var Red = new Group(RedBox, RedText);

        var GreenBox = makeRect({
            x: referencePoint.x + leftShift,
            y: referencePoint.y + verticalShifts.b
        }, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "GreenBox"});
        var GreenText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "GreenText"});
        GreenText.fitBounds(GreenBox.bounds);
        var Green = new Group(GreenBox, GreenText);

        var BlueBox = makeRect({
            x: referencePoint.x + leftShift,
            y: referencePoint.y + verticalShifts.c
        }, {x: 45, y: 30}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBg, {name: "BlueBox"});
        var BlueText = makeText("0", NerdBoard.textSize, "center", NerdBoard.colors.defaultBg, {name: "BlueText"});
        BlueText.fitBounds(BlueBox.bounds);
        var Blue = new Group(BlueBox, BlueText);
        return new Group(Red, Green, Blue);
    }
    
    
    

    function makeSlider(referencePoint1, referencePoint2, range, start, handleRadius, handleFillColor, handleStrokeColor, handleTextColor, trackColor, trackWidth) {
        var totDis = referencePoint2.x - referencePoint1.x;
        var handle = makeCircle({x: referencePoint1.x + (totDis * (start/range.max)), y: referencePoint1.y}, handleRadius, handleFillColor, handleStrokeColor, {name: "handle"});
        var handleText = makeText(start.toString(), 20, "center", handleTextColor, {name: "handleText", value: 0});
        handleText.fitBounds(handle.bounds);
        handleText.onMouseDrag = function (event) {
            var currDis = event.point.x - track.segments[0].point.x;
            var disRatio = currDis / totDis;

            if (disRatio <= .01) {
                this.position.x = track.segments[0].point.x + (handle.bounds.width / 2);
                handle.position.x = track.segments[0].point.x + (handle.bounds.width / 2);
                handleText.data.value = range.min;
            }
            else if (disRatio >= 1) {
                this.position.x = track.segments[1].point.x - (handle.bounds.width / 2);
                handle.position.x = track.segments[1].point.x - (handle.bounds.width / 2);
                handleText.data.value = range.max;
            }
            else {
                this.position.x = event.point.x;
                handle.position.x = event.point.x;
                handleText.data.value = Math.round(NerdBoard.penStrokeRange * disRatio);
            }
            handleText.content = handleText.data.value;
        };
        var track = new Path({
            strokeColor: trackColor,
            strokeWidth: trackWidth,
            strokeCap: 'round',
            data: {
                name: "track"
            }
        });
        track.add(referencePoint1, referencePoint2);
        return new Group(track, handle, handleText);
    }




    function makeColorSwatches() {
        var black = makeRect({x:-10, y:0}, {x:20, y:20}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBlack, {name: "BlackSw"});
        var white = makeRect({x:15, y:0}, {x:20, y:20}, NerdBoard.colors.defaultBg, NerdBoard.colors.defaultBg, {name: "WhiteSw"});
        var red = makeRect({x:0, y:25}, {x:20, y:20}, NerdBoard.colors.defaultRed, NerdBoard.colors.defaultRed, {name: "RedSw"});
        var green = makeRect({x:25, y:25}, {x:20, y:20}, NerdBoard.colors.defaultGreen, NerdBoard.colors.defaultGreen, {name: "GreenSw"});
        var blue = makeRect({x:50, y:25}, {x:20, y:20}, NerdBoard.colors.defaultBlue, NerdBoard.colors.defaultBlue, {name: "BlueSw"});
        var color1 = makeRect({x:-10, y:50}, {x:20, y:20}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBlack, {name: "Color1Sw"});
        var color2 = makeRect({x:15, y:50}, {x:20, y:20}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBlack, {name: "Color1Sw"});
        var color3 = makeRect({x:40, y:50}, {x:20, y:20}, NerdBoard.colors.defaultBlack, NerdBoard.colors.defaultBlack, {name: "Color2Sw"});
        var customColors = new Group(color1, color2, color3);
        return new Group(customColors, black, white, red, green, blue);
    }




    function setSwatchesOnMouseUp() {
        for(var j = 0; j < UI.group.children[0].children[0].children.length; j++) {
            UI.group.children[0].children[0].children[j].onMouseUp = function() {
                UI.icons.colorGradient.data.updateColorPickingUI(this.fillColor);
            };
        }
        for(var i = 1; i < UI.group.children[0].children.length; i++) {
            UI.group.children[0].children[i].onMouseUp = function() {
                UI.icons.colorGradient.data.updateColorPickingUI(this.fillColor);
            };
        }
    }





    function shiftSwatches(color) {
        for(var i = UI.group.children[0].children[0].children.length - 1; i > 0; i--) {
            UI.group.children[0].children[0].children[i].fillColor = UI.group.children[0].children[0].children[i-1].fillColor;
            UI.group.children[0].children[0].children[i].strokeColor = UI.group.children[0].children[0].children[i-1].fillColor;
        }
        UI.group.children[0].children[0].children[0].fillColor = color;
        UI.group.children[0].children[0].children[0].strokeColor = color;
    }

    return UI;
}((NerdBoard.UI || {})));
NerdBoard.setUp();