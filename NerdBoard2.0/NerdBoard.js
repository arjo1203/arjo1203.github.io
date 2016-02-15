/**
 * Created by Jose Araujo on 07/22/15.
 */

paper.install(window);



// Main Javascript functions and code.
var NerdBoard = (function(wb) {
    wb.logo = $('#NerdLogo');

    wb.width = window.innerWidth;
    wb.height = window.innerHeight;

    wb.canvas = $("#my-canvas");
    wb.canvas[0].width = wb.width;
    wb.canvas[0].height = wb.height;

    wb.penStrokeRange = 50;
    wb.penStroke = 15;
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
        slateYellow: createColor(241, 196, 15)
    };
    wb.penColor = wb.colors.defaultBlack;
    wb.bgColor = wb.colors.nightBlack;
    wb.pathName = 'defaultBg';


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
    };




    wb.setBg = function(color){
        wb.bgColor = wb.colors[color];
        NerdBoard.Tools.changeBgColor();
    };

    wb.setColor = function (color) {
        wb.pathName = color;
        wb.penColor = wb.colors[color];

        var penColor = wb.getColorComponents(NerdBoard.penColor);
        NerdBoard.styleEle(NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.btn, penColor);
        NerdBoard.styleEle(NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.btnIcon, penColor);

        $('#penWidthSlider .slider-selection').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");
        $('#penWidthSlider .slider-handle').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");

        NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.close();
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

        NerdBoard.UIHandler.leftBar.internalUIS.addUI.internalUIS.shapeUI.close();
        NerdBoard.UIHandler.leftBar.internalUIS.addUI.internalUIS.textInputUI.open();
    };



    //Activators
    wb.activateThemeMode = function() {
        wb.activeMode = 'theme';

        NerdBoard.UIHandler.leftBar.toolSelected();
    };

    wb.activateDrawMode = function() {
        wb.activeMode = 'draw';
        NerdBoard.Tools.tools.draw.activate();
    };

    wb.activateShapeMode = function() {
        wb.activeMode = 'add';
        NerdBoard.Tools.tools.shape.activate();
    };

    wb.activateEraseMode = function() {
        wb.activeMode = 'erase';
        NerdBoard.Tools.tools.erase.activate();
    };

    wb.activateMoveMode = function() {
        wb.activeMode = 'move';
        NerdBoard.Tools.tools.move.activate();
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


    function onWindowResize() {
        NerdBoard.width = window.innerWidth;
        NerdBoard.height = window.innerHeight;

        NerdBoard.Tools.resizeBg();
        paper.view.draw();
    }

    window.addEventListener('resize', onWindowResize, false);

    $(window).bind('beforeunload', function() {
        return "Save your drawing before leaving!!";
    });


    function createColor(r, g, b) {
        return new Color(r / 255, g / 255, b / 255);
    }


    return wb;
}(NerdBoard || {}));