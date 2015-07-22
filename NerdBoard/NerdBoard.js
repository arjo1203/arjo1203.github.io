/**
 * Created by Jose Araujo on 07/22/15.
 */

paper.install(window);



// Main Javascript functions and code.
var NerdBoard = (function(wb) {

    wb.width = window.innerWidth;
    wb.height = window.innerHeight;

    wb.canvas = $("#my-canvas")[0];
    wb.canvas.width = wb.width;
    wb.canvas.height = wb.height;

    wb.penStroke = 3;
    wb.eraseStroke = 30;
    wb.textSize = 40;

    wb.activeMode = 'draw';

    wb.shape = 'Text';
    wb.numOfShapes = 0;
    wb.shapeStrokeColor = '#95B1BD';
    wb.erasing = false;





    wb.themes = {
        default: {
            name: 'defalut',
            bg: createColor(255, 255, 255),
            black: createColor(0, 0, 0),
            red: createColor(255, 0, 0),
            green: createColor(0, 128, 0),
            blue: createColor(0, 0, 255),
            yellow: createColor(225, 225, 0),
            penColor: createColor(0, 0, 0),
            navBg: createColor(88, 110, 117),
            pathName: 'black'
        },
        night: {
            name: 'night',
            bg: createColor(0, 43, 54),
            black: createColor(101, 123, 131),
            red: createColor(220, 50, 47),
            green: createColor(72, 139, 60),
            blue: createColor(38, 139, 210),
            yellow: createColor(241, 196, 15),
            penColor: createColor(101, 123, 131),
            navBg: createColor(88, 110, 117),
            pathName: 'black'
        },
        neon: {
            name: 'neon',
            bg: createColor(0, 0, 0),
            black: createColor(176, 176, 176),
            red: createColor(251, 1, 32),
            green: createColor(161, 198, 89),
            blue: createColor(111, 179, 216),
            yellow: createColor(253, 163, 49),
            penColor: createColor(48, 48, 48),
            navBg: createColor(0, 0, 0),
            pathName: 'black'
        },
        slate: {
            name: 'slate',
            bg: createColor(125, 133, 138),
            black: createColor(62, 68, 76),
            red: createColor(237, 88, 84),
            green: createColor(112, 201, 112),
            blue: createColor(108, 199, 225),
            yellow: createColor(241, 196, 15),
            penColor: createColor(62, 68, 76),
            navBg: createColor(39, 43, 48),
            pathName: 'black'
        }
    };
    wb.theme = wb.themes.default;

    wb.convertBtnTheme = function() {
        var black = getColorComponents(wb.theme.black);
        styleEle($('.penBlack'), black);

        var red = getColorComponents(wb.theme.red);
        styleEle($('.penRed'), red);

        var green = getColorComponents(wb.theme.green);
        styleEle($('.penGreen'), green);

        var blue = getColorComponents(wb.theme.blue);
        styleEle($('.penBlue'), blue);

        var yellow = getColorComponents(wb.theme.yellow);
        styleEle($('.penYellow'), yellow);

        var nav = getColorComponents(wb.theme.navBg);
        styleEle($('#navBar'), nav);
    };
    wb.convertBtnTheme();

    wb.toggleToolBtns = function() {
        var shapeIndicator = $('#shapeIndicator'), moveIndicator = $('#moveIndicator'), eraseIndicator = $('#eraseIndicator');
        var indicators = [shapeIndicator, moveIndicator, eraseIndicator];

        if(wb.activeMode == 'draw') {
            indicators[0][0].className = "glyphicon glyphicon-unchecked";
            indicators[1][0].className = "glyphicon glyphicon-unchecked";
            indicators[2][0].className = "glyphicon glyphicon-unchecked";
        }
        if(wb.activeMode == 'erase') {
            indicators[0][0].className = "glyphicon glyphicon-unchecked";
            indicators[1][0].className = "glyphicon glyphicon-unchecked";
            indicators[2][0].className = "glyphicon glyphicon-check";
        }
        if(wb.activeMode == 'shape') {
            indicators[0][0].className = "glyphicon glyphicon-check";
            indicators[1][0].className = "glyphicon glyphicon-unchecked";
            indicators[2][0].className = "glyphicon glyphicon-unchecked";
        }
        if(wb.activeMode == 'move') {
            indicators[0][0].className = "glyphicon glyphicon-unchecked";
            indicators[1][0].className = "glyphicon glyphicon-check";
            indicators[2][0].className = "glyphicon glyphicon-unchecked";
        }

    };





    wb.setTheme = function(theme) {
        $('#theme')[0].innerHTML =  " <span class=\"caret\"></span>" + "Themes: "+ theme.capitalizeFirstLetter();

        var priorColor = wb.theme.pathName;
        wb.themes[theme].penColor = wb.themes[theme][priorColor];
        wb.theme = wb.themes[theme];

        NerdBoard.Tools.convertTheme();
        wb.convertBtnTheme();
    };

    wb.setColor = function (color) {
        wb.theme.penColor = wb.theme[color];
        wb.theme.pathName = color;
        wb.activateDrawMode();
        wb.toggleToolBtns();
    };

    wb.setPenWidth = function(width) {
        $('#penDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Pen Width: " + width;
        wb.penStroke = width;
        wb.activateDrawMode();
        wb.toggleToolBtns();
    };

    wb.setEraserWidth = function(width) {
        $('#eraseDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Eraser Width: " + width.toString();
        wb.eraseStroke = width;
        wb.activateEraseMode();
        wb.toggleToolBtns();
    };

    wb.setTextSize = function(size) {
        $('#textDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Text Size: " + size.toString();
        wb.textSize = size;
        wb.activateShapeMode();
        wb.toggleToolBtns();
    };

    wb.setShape = function(shape) {
        wb.shape = shape;

        if(shape == 'Input') {
            $('#shapeChoice')[0].innerHTML = "<span class=\"caret\"></span> " + shape + " / Output";
        }
        else {
            $('#shapeChoice')[0].innerHTML = "<span class=\"caret\"></span> " + shape;
        }

        if(wb.activeMode !== 'shape') {
            wb.toggleShapeMode();
        }
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

    wb.activateDrawMode = function() {
        wb.activeMode = 'draw';
        NerdBoard.Tools.tools.draw.activate();
        wb.toggleToolBtns();
    };

    wb.activateShapeMode = function() {
        wb.activeMode = 'shape';
        NerdBoard.Tools.tools.shape.activate();
        wb.toggleToolBtns();
    };

    wb.activateEraseMode = function() {
        wb.activeMode = 'erase';
        NerdBoard.Tools.tools.erase.activate();
        wb.toggleToolBtns();
    };

    wb.activateMoveMode = function() {
        wb.activeMode = 'move';
        NerdBoard.Tools.tools.move.activate();
        wb.toggleToolBtns();
    };

    wb.activatePanMode = function() {
        wb.activeMode = 'pan';
        NerdBoard.Tools.tools.pan.activate();
        wb.toggleToolBtns();
    };

    wb.toggleShapeMode = function() {
        if (wb.activeMode !== 'shape') {
            wb.activateShapeMode();
        } else {
            wb.activateDrawMode();
        }
    };

    wb.toggleMoveMode = function() {
        if (wb.activeMode !== 'move') {
            wb.activateMoveMode();
        } else {
            wb.activateDrawMode();
        }
    };

    wb.togglePanMode = function() {
        if (wb.activeMode !== 'pan') {
            wb.activatePanMode();
        } else {
            wb.activateDrawMode();
        }
    };

    wb.toggleEraseMode = function () {
        if (wb.activeMode !== 'erase') {
            wb.activateEraseMode();
        } else {
            wb.activateDrawMode();
        }
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

    $('#saveImg').on('click', function() {
        this.download = wb.getDate();
        this.href = wb.canvas.toDataURL('image/svg');
    });

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
                    wb.resizeBg();
                    NerdBoard.Tools.convertTheme();
                    paper.view.draw();
                };
                reader.readAsText(file.files[0]);
            },
            false);
    };

    $('#uploadImg').on('change', function(e) {
        var file = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function(e2) {
            wb.clear();
            NerdBoard.Tools.loadRaster(e2.target.result);
        };

        fileReader.readAsDataURL(file);
    });





    wb.resizeBg = function() {
        var SW = paper.project.activeLayer.children['bg']._segments[0],
            NW = paper.project.activeLayer.children['bg']._segments[1],
            NE = paper.project.activeLayer.children['bg']._segments[2],
            SE = paper.project.activeLayer.children['bg']._segments[3];

        NW._point._x = 0;
        NW._point._y = 0;

        SW._point._x = 0;
        SW._point._y = NerdBoard.height;

        NE._point._x = NerdBoard.width;
        NE._point._y = 0;

        SE._point._x = NerdBoard.width;
        SE._point._y = NerdBoard.height;
    };


    function onWindowResize() {
        NerdBoard.width = window.innerWidth;
        NerdBoard.height = window.innerHeight;

        NerdBoard.resizeBg();
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


    function getColorComponents(color) {
        var components = {
            r: (Math.round(color._components[0] * 255)).toString(),
            g: (Math.round(color._components[1] * 255)).toString(),
            b: (Math.round(color._components[2] * 255)).toString()
        };

        return components;
    }


    function styleEle(ele, components) {
        ele.css("background-color", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
        ele.css("border", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
    }


    return wb;
}(NerdBoard || {}));
