/**
 * Created by Jose Araujo on 07/22/15.
 */

paper.install(window);



// Main Javascript functions and code.
var NerdBoard = (function(wb) {
    wb.logo = $('#NerdLogo');

    wb.width = window.innerWidth;
    wb.height = window.innerHeight;

    wb.canvas = $("#my-canvas")[0];
    wb.canvas.width = wb.width;
    wb.canvas.height = wb.height;

    wb.penStroke = 3;
    wb.eraseStroke = 30;
    wb.textSize = 40;

    wb.activeMode = 'draw';

    wb.shape = 'Terminal';
    wb.numOfShapes = 0;
    wb.shapeStrokeColor = '#95B1BD';
    wb.erasing = false;


    wb.colors = {
        defaultBg: createColor(255, 255, 255),
        defaultBlack: createColor(0, 0, 0),
        defaultRed: createColor(255, 0, 0),
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
        slateYellow: createColor(241, 196, 15)
    };
    wb.penColor = wb.colors.defaultBlack;
    wb.bgColor = wb.colors.defaultBg;
    wb.pathName = 'defaultBlack';


    wb.getColorComponents = function(color) {
        var components = {
            r: (Math.round(color._components[0] * 255)).toString(),
            g: (Math.round(color._components[1] * 255)).toString(),
            b: (Math.round(color._components[2] * 255)).toString()
        };

        return components;
    };


    wb.styleEle = function(ele, components) {
        ele.css("background-color", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
        //ele.css("border", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
    };




    wb.setBg = function(color){
        wb.bgColor = wb.colors[color];

        var bgColor = wb.getColorComponents(NerdBoard.bgColor);
        NerdBoard.styleEle($('#menuBtn'), bgColor);
        NerdBoard.styleEle($('#themeBtn'), bgColor);

        NerdBoard.Tools.changeBgColor();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.close();
    };

    wb.setColor = function (color) {
        wb.pathName = color;
        wb.penColor = wb.colors[color];

        var penColor = wb.getColorComponents(NerdBoard.penColor);
        NerdBoard.styleEle(NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.backGround, penColor);
        NerdBoard.styleEle(NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.activeColor, penColor);

        $('#penWidthSlider .slider-selection').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");
        $('#penWidthSlider .slider-handle').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");

        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.close();
    };

    wb.setPenWidth = function(width) {
        $('#penDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Pen Width: " + width;
        wb.penStroke = width;
        wb.activateDrawMode();
    };

    wb.setEraserWidth = function(width) {
        $('#eraseDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Eraser Width: " + width.toString();
        wb.eraseStroke = width;
        wb.activateEraseMode();
    };

    wb.setTextSize = function(size) {
        $('#textDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Text Size: " + size.toString();
        wb.textSize = size;
        wb.activateShapeMode();
    };

    wb.setShape = function(shape) {
        wb.shape = shape;

        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.close();
    };





    wb.undo = function() {
        NerdBoard.Tools.undo();
    };

    wb.clear = function() {
        c = confirm('Are you sure you want to clear the canvas?');
        if (c) {
            NerdBoard.Tools.clear();
        }
    };




    wb.activateThemeMode = function() {
        wb.activeMode = 'theme';

        NerdBoard.UIHandler.LeftSideBarUI.toolSelected();
    };

    wb.activateDrawMode = function() {
        wb.activeMode = 'draw';
        NerdBoard.Tools.tools.draw.activate();

        NerdBoard.UIHandler.LeftSideBarUI.toolSelected();
    };

    wb.activateShapeMode = function() {
        wb.activeMode = 'add';
        NerdBoard.Tools.tools.shape.activate();

        NerdBoard.UIHandler.LeftSideBarUI.toolSelected();
    };

    wb.activateEraseMode = function() {
        wb.activeMode = 'erase';
        NerdBoard.Tools.tools.erase.activate();

        NerdBoard.UIHandler.LeftSideBarUI.toolSelected();
    };

    wb.activateMoveMode = function() {
        wb.activeMode = 'move';
        NerdBoard.Tools.tools.move.activate();

        NerdBoard.UIHandler.LeftSideBarUI.toolSelected();
    };

    wb.activatePanMode = function() {
        wb.activeMode = 'pan';
        NerdBoard.Tools.tools.pan.activate();
    };





    wb.getDate = function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        return (year + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec);
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

    wb.loadWorkSpace = function() {
        var body = document.getElementById('body'),
            file = document.createElement('input');

        file.type = 'file';
        file.click();

        file.addEventListener('change', function () {
                var reader = new FileReader();

                reader.onloadstart = function () {
                };
                reader.onprogress = function () {
                };
                reader.onloadend = function () {
                };
                reader.onload = function (e) {
                    var inputFile = JSON.parse(e.target.result);

                    if(paper.project.activeLayer) {
                        paper.project.activeLayer.remove();
                    }

                    paper.project.importJSON(inputFile[0]);

                    paper.project.activeLayer.position = paper.view.center;
                    NerdBoard.resizeBg();
                    NerdBoard.Tools.convertTheme();
                    paper.view.draw();
                };
                reader.readAsText(file.files[0]);
            },
            false);
    };


    function onWindowResize() {
        NerdBoard.width = window.innerWidth;
        NerdBoard.height = window.innerHeight;

        centerDiv(canvas, $('#NerdLogo'), 1, 0);
        centerDiv(canvas, sideBar, 0, .5);
        NerdBoard.Tools.resizeBg();
        paper.view.draw();
    }

    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);

    $(window).bind('beforeunload', function() {
        return "Save your drawing before leaving!!";
    });


    function createColor(r, g, b) {
        return new Color(r / 255, g / 255, b / 255);
    }


    return wb;
}(NerdBoard || {}));
