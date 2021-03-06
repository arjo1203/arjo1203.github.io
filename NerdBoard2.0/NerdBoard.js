/**
 * Created by Jose Araujo on 07/22/15.
 */
paper.install(window);



// Main Javascript functions and code.
var NerdBoard = (function(wb) {
    wb.activeMode = "Pencil";
    wb.size = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    wb.center = {
        x: Math.ceil(wb.size.width * .5),
        y: Math.ceil(wb.size.height * .5)
    };
    
    wb.canvas = $("#my-canvas")[0];
    wb.canvas.width = wb.size.width;
    wb.canvas.height = wb.size.height;

    wb.layers = {
        drawing: {},
        UI: {}
    };

    wb.symbols = {};


    wb.pathCount = 0;


    wb.colors = {
        defaultBg: createColor(255, 255, 255),
        defaultBlack: createColor(0, 0, 0),
        defaultRed: createColor(227, 24, 54),
        defaultGreen: createColor(0, 128, 0),
        defaultBlue: createColor(0, 0, 255),
        defaultYellow: createColor(225, 225, 0),
        neonBg: createColor(30, 30, 30),
        neonBlack: createColor(176, 176, 176),
        neonRed: createColor(251, 1, 32),
        neonGreen: createColor(161, 198, 89),
        neonBlue: createColor(111, 179, 216),
        neonYellow: createColor(253, 163, 49),
        nightBg: createColor(0, 43, 54),
        nightBlack: createColor(101, 123, 131),
        nightRed: createColor(220, 50, 47),
        nightGreen: createColor(72, 139, 60),
        nightBlue: createColor(38, 139, 210),
        nightYellow: createColor(241, 196, 15),
        slateBg: createColor(125, 133, 138),
        slateBlack: createColor(62, 68, 76),
        slateRed: createColor(237, 88, 84),
        slateGreen: createColor(112, 201, 112),
        slateBlue: createColor(108, 199, 225),
        slateYellow: createColor(241, 196, 15),
        greenGridBg: createColor(233, 254, 198),
        selecting: '#e9e9ff',
        selected: '#009dec'
    };
    
    wb.penColor = wb.colors.defaultBlack;
    wb.penStrokeRange = 50;
    wb.penStroke = 4;
    
    wb.BGColor = wb.colors.greenGridBg;
    wb.pathName = "Path";


    function createColor(r, g, b) {
        return new Color(r / 255, g / 255, b / 255);
    }


    wb.getRGB = function(color) {
        return {
            r: (Math.round(color.red * 255)).toString(),
            g: (Math.round(color.green * 255)).toString(),
            b: (Math.round(color.blue * 255)).toString()
        };
    };




    wb.setBGColor = function(color){
        wb.BGColor = color;
        this.layers.drawing.children[0].fillColor = color;
    };

    wb.setPenColor = function (color) {
        wb.penColor = color;
    };

    wb.setPenWidth = function(width) {
        wb.penStroke = width;
    };



    //Activators
    wb.activateNone = function() {
        NerdBoard.Tools.tools.none.activate();
    };

    wb.activateDrawMode = function() {
        NerdBoard.Tools.tools.draw.activate();
    };

    wb.activateEraseMode = function() {
        NerdBoard.Tools.tools.erase.activate();
    };

    wb.activateMoveMode = function() {
        NerdBoard.Tools.tools.move.activate();
    };




    wb.saveAsImg = function() {
        var link = document.createElement("a");
        var name = window.prompt("Please name your Image: ");
        if (name != null) {
            NerdBoard.UI.group.opacity = 0;
            view.draw();

            link.href = NerdBoard.canvas.toDataURL('image/png');
            link.download = name;
            link.click();

            NerdBoard.UI.group.opacity = 1;
            view.draw();

            window.alert("Image was saved!");
        }
        else {
            window.alert("Image was NOT saved!!");
        }
    };




    wb.saveAsWorkSpace = function() {
        var file = JSON.stringify(paper.project);

        var blob = new Blob([file], {type: "application/json"});
        var url  = URL.createObjectURL(blob);

        var link = document.createElement("a");
        var name = window.prompt("Please name your Project: ");
        if(name != null){
            link.href = url;
            link.download = name;
            link.click();

            window.alert("Project was saved!");
        }
        else{
            window.alert("Project was NOT saved!!");
        }
    };




    wb.loadRaster = function(image) {
        wb.layers.drawing.activate();
        //var closeIcon = NerdBoard.Tools.makeCloseIcon();
        //closeIcon.data.name = "CloseIcon";
        var raster = new Raster(image);
        raster.data.name = "Raster";
        //raster.onLoad = function() {
        //    closeIcon.position = raster.bounds.topRight.add({x: -25, y:25});
        //};
        //var imgGroup = new Group(closeIcon, raster);
        var imgGroup = new Group(raster);
        imgGroup.position = paper.view.center;
        imgGroup.scale(.25);
        imgGroup.data = {
            name: "Group",
            closeIconIsBack: true
        };
        //imgGroup.onClick = function(event) {
        //    event.preventDefault();
        //    if(wb.activeMode == "Eraser" && imgGroup.data.closeIconIsBack) {
        //        console.log("Eraser && " + imgGroup.data.closeIconIsBack);
        //        //imgGroup.children[0].bringToFront();
        //        imgGroup.data.closeIconIsBack = false;
        //    }
        //    else {
        //        //imgGroup.children[imgGroup.children.length-1].sendToBack();
        //        imgGroup.data.closeIconIsBack = true;
        //    }
        //};
        //closeIcon.onClick = function(event) {
        //    event.preventDefault();
        //    imgGroup.remove();
        //};
    };





    wb.loadWorkSpace = function() {
        var file = document.createElement('input');

        file.type = 'file';
        file.click();

        file.addEventListener('change', function () {
            var reader = new FileReader();
            reader.onload = function (e) {
                var inputFile = JSON.parse(e.target.result);

                if(paper.project.activeLayer) {
                    paper.project.activeLayer.remove();
                }

                paper.project.importJSON(inputFile[0]);

                paper.project.activeLayer.position = paper.view.center;
                NerdBoard.Tools.resizeBg();
                paper.view.draw();
            };
            reader.readAsText(file.files[0]);
        },
        false);
    };




    wb.loadImg = function() {
        var file = document.createElement('input');
        file.type = 'file';
        file.click();

        file.addEventListener('change', function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    wb.loadRaster(e.target.result);
                };
                reader.readAsDataURL(file.files[0]);
            },
            false);
    };





    wb.undo = function() {
        var children = NerdBoard.layers.drawing.children;
        //console.log(children);
        var lastIndex = children.length - 1;

        if(children.length > 1){//Prevents removing BG and BGImg
            lastItem = children[lastIndex];
            lastItemClass = children[lastIndex].__proto__._class;

            if(lastItemClass == "Group") {
                var groupLength = lastItem.children.length;

                if(groupLength == 1) {
                    lastItem.remove();
                }

                if(groupLength > 1) {
                    lastItem.children[groupLength - 1].remove();
                }
            }

            if(lastItemClass == "Path") {
                lastItem.remove();
            }

            if(lastItemClass == "Raster") {
                lastItem.remove();
            }
        }
        paper.view.draw();
    };




    wb.clear = function() {
        while(NerdBoard.layers.drawing.children.length > 1){
            NerdBoard.layers.drawing.children[NerdBoard.layers.drawing.children.length - 1].remove();
        }
    };




    wb.makeBG = function() {
        this.layers.drawing.activate();
        var BGColor = new Path.Rectangle({
            center: this.center,
            size: [NerdBoard.size.width, NerdBoard.size.height],
            fillColor: this.BGColor,
            data: {
                name: "BG"
            }
        });
        var grid = this.makeGrid({width: 24, height: 24}, "green");
        grid.data = {
            name: "BG"
        };
        wb.BG = new Group(BGColor, grid);
        wb.BG.data = {
            name: "BG"
        };
    };




    wb.makeGrid = function(gridSize, gridColor) {
        var numOfHozLines = Math.round(NerdBoard.size.width / gridSize.width);//How many grid line there will be vertically
        var numOfVertLines = Math.round(NerdBoard.size.height / gridSize.height);//How many grid line there will be vertically
        //build the frame of the grid
        var topLeft = new Point(0,0);
        var bottomLeft = new Point(0, NerdBoard.size.height);
        var topRight = new Point(NerdBoard.size.width, 0);
        //Create grid
        var grid = new Group();
        var path = new Path.Line(topLeft,topRight);
        path.data.name = "BG";
        grid.addChild(path);
        var path4 = new Path.Line(topLeft,bottomLeft);
        path4.data.name = "BG";
        grid.addChild(path4);
        //Creates the vertical grid lines
        for(var i = 0; i < numOfHozLines; i++) {
            var top = new Point(gridSize.width + gridSize.width * i, 0);
            var bottom = new Point(gridSize.width + gridSize.width * i, NerdBoard.size.height);
            var line = new Path.Line(top,bottom);
            line.data.name = "BG";
            grid.addChild(line);
        }
        //Creates the horizontal grid lines
        for(var j = 0; j < numOfVertLines; j++) {
            var top2 = new Point(0, gridSize.height + gridSize.height * j);
            var bottom2 = new Point(NerdBoard.size.width, gridSize.height + gridSize.height * j);
            var line2 = new Path.Line(top2,bottom2);
            line2.data.name = "BG";
            grid.addChild(line2);
        }
        grid.strokeColor = gridColor;
        grid.opacity = .8;
        grid.strokeWidth = .3;
        return grid;
    };



    wb.makeResistor = function() {
        var incre = 10;
        var path1 = wb.makePath(NerdBoard.colors.defaultRed, 4, "Resistor");
        path1.add({x: 0, y: 0}, {x: 2 * incre, y: 0}, {x: 2.5 * incre, y: -incre},
            {x: 3.5 * incre, y: incre}, {x: 4.5 * incre, y: -incre},
            {x: 5.5 * incre, y: incre}, {x: 6 * incre, y: 0}, {x: 8 * incre, y: 0});
        //path1.scale(1);
        return path1;
    };



    wb.makeVoltageSrc = function() {
        var path1 = wb.makePath(NerdBoard.colors.defaultRed, 4, "VoltageSrcPosSignPaths");
        path1.add({x: -5, y: 0}, {x: 5, y: 0});
        var path2 = path1.clone();
        path2.rotate(90);
        var posSign = new Group(path1, path2);
        posSign.position = posSign.position.add({x: 0, y: -10});
        var negSign = path1.clone();
        negSign.position = negSign.position.add({x: 0, y: 20});
        var signs = new Group(posSign, negSign);
        var circle = wb.makePath(NerdBoard.colors.defaultRed, 4, "VoltageSrcCircle");
        var radius = 20;
        circle.add({x: -radius, y: radius}, {x: radius, y: radius}, {x: radius, y: -radius}, {x: -radius, y: -radius});
        circle.closed = true;
        circle.smooth();
        var path3 = path2.clone();
        path3.position = path3.position.add({x: 0, y: 2*radius + 5});
        var path4 = path2.clone();
        path4.position = path4.position.add({x: 0, y: -(radius + 5)});
        return new Group(signs, circle, path3, path4);
    };




    wb.makePath = function(strokeColor, strokeWidth, name) {
        NerdBoard.pathCount++;
        return new Path({
            strokeColor: strokeColor || NerdBoard.penColor,
            strokeWidth: strokeWidth || NerdBoard.penStroke,
            strokeCap: 'round',
            data: {
                name: name || NerdBoard.pathName
            }
        });
    };




    wb.makeCircle = function(center, radius, fillColor, strokeColor, data) {
        return new Path.Circle({
            center: new Point(center.x, center.y),
            radius: radius,
            fillColor: fillColor,
            strokeColor: strokeColor,
            strokeWidth: 2,
            data: data
        });
    };




    wb.setChildrenColor = function(parent, color) {
        parent.strokeColor = color;
    };




    wb.scaleImg = function (icon, dimensions) {
        var xScale = dimensions.width / icon.bounds.width;
        var yScale = dimensions.height / icon.bounds.height;
        icon.scale(xScale, yScale);
    };




    wb.resizeBG = function() {
        var bg = NerdBoard.layers.drawing.children[0].children[0];
        this.resizeRect(bg, 0, 0, this.size.width, this.size.height);
    };




    wb.resizeRect = function(rect, x0, y0, width, height) {
        var SW = rect._segments[0],
            NW = rect._segments[1],
            NE = rect._segments[2],
            SE = rect._segments[3];

        NW._point._x = x0;
        NW._point._y = y0;

        SW._point._x = x0;
        SW._point._y = y0 + height;

        NE._point._x = x0 + width;
        NE._point._y = y0;

        SE._point._x = x0 + width;
        SE._point._y = y0 + height;
    };




    wb.onWindowResize = function() {
        wb.size = {width: Math.round(window.innerWidth), height: Math.round(window.innerHeight)};
        wb.resizeBG();
        //NerdBoard.layers.drawing.children[0].children[1] = makeGrid({width: 24, height: 24}, "green");
        view.draw();
    };




    wb.setUp = function() {
        paper.setup(NerdBoard.canvas);
        window.setTimeout(function() {
            wb.layers.drawing = new Layer();
            wb.layers.drawing.name = wb.layers.drawing.data.name = "drawingLayer";
            wb.layers.UI = new Layer();
            wb.layers.UI.name = wb.layers.UI.data.name = "UILayer";
            wb.makeBG();
            NerdBoard.UI.loadIcons();
            NerdBoard.Tools.createPaperTools();
        }, 100);
    };





    $(window).bind('beforeunload', function() {
        return "Save your drawing before leaving!!";
    });
    //window.addEventListener('resize', NerdBoard.onWindowResize, false);
    /**
     * Prevents default page scrolling action; fixes iOS 8 drawing bug.
     */
    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);


    return wb;
}(NerdBoard || {}));