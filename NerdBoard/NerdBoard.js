/**
 * Created by alexpersian on 11/16/14.
 */

paper.install(window);
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
window.addEventListener('resize', onWindowResize, false);


function onWindowResize() {
    NerdBoard.width = window.innerWidth;
    NerdBoard.height = window.innerHeight;

    paper.project.activeLayer.children['bg']._segments[2]._point._x = NerdBoard.width;
    paper.project.activeLayer.children['bg']._segments[3]._point._x = NerdBoard.width;
    paper.view.draw();
}

// Main Javascript functions and code.
var NerdBoard = (function() {

    var wb = {};

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
            green: createColor(72, 139, 210),
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


    /**
     * Modifies all colors to match the selected theme
     */
    wb.changeTheme = function(theme) {
        $('#theme')[0].innerHTML =  " <span class=\"caret\"></span>" + "Theme: "+ theme.capitalizeFirstLetter();

        var priorColor = wb.theme.pathName;
        wb.themes[theme].penColor = wb.themes[theme][priorColor];
        wb.theme = wb.themes[theme];

        NerdBoardTools.convertTheme();
        wb.convertBtnTheme();
    };



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


    /**
     * Change color will grab the value from the color buttons and change the draw color to that.
     * If in night mode, it will change to the more pleasing colors.
     */
    wb.changeColor = function (color) {
        wb.theme.penColor = wb.theme[color];
        wb.theme.pathName = color;
        wb.activateDrawMode();
        wb.toggleToolBtns();
    };



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

    /**
     * These two functions simple change the stroke width based on passed integer parameter.
     */
    wb.changePenWidth = function(width) {
        $('#penDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Pen Width: " + width;
        wb.penStroke = width;
        wb.activateDrawMode();
        wb.toggleToolBtns();
    };
    wb.changeEraserWidth = function(width) {
        $('#eraseDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Eraser Width: " + width.toString();
        wb.eraseStroke = width;
        wb.activateEraseMode();
        wb.toggleToolBtns();
    };
    wb.changeTextSize = function(size) {
        $('#textDisplay')[0].innerHTML = " <span class=\"caret\"></span>" + " Text Size: " + size.toString();
        wb.textSize = size;
        wb.activateShapeMode();
        wb.toggleToolBtns();
    };

    /**
     * Undo simply removes the most recently created path.
     */
    wb.undo = function() {
        NerdBoardTools.undo();
    };

    /**
     * Clears the canvas by drawing the background over the current canvas.
     * Considers the current theme when redrawing.
     */
    wb.clear = function() {
        c = confirm('Are you sure you want to clear the canvas?');
        if (c) {
            NerdBoardTools.clear();
        }
    };



    /**
     * Change shape monitors the value of the shape dropdown.
     * Draws shapes on the canvas by using Rectangle paths.
     * Shapes are created at mouse click point.
     */
    wb.changeShape = function(shape) {
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
    wb.activateDrawMode = function() {
        wb.activeMode = 'draw';
        NerdBoardTools.tools.draw.activate();
        wb.toggleToolBtns();
    };
    wb.activateShapeMode = function() {
        wb.activeMode = 'shape';
        NerdBoardTools.tools.shape.activate();
        wb.toggleToolBtns();
    };
    wb.activateEraseMode = function() {
        wb.activeMode = 'erase';
        NerdBoardTools.tools.erase.activate();
        wb.toggleToolBtns();
    };
    wb.activateMoveMode = function() {
        wb.activeMode = 'move';
        NerdBoardTools.tools.move.activate();
        wb.toggleToolBtns();
    };
    wb.activatePanMode = function() {
        wb.activeMode = 'pan';
        NerdBoardTools.tools.pan.activate();
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
    /**
     * Hacky way to handle the eraser functionality.
     * Draws over the canvas with a white pen stroke.
     * Changes the text in the eraser button to reflect the mode.
     * Saves the current pen color+width so it can be used after erasing is finished.
     */
    wb.toggleEraseMode = function () {
        if (wb.activeMode !== 'erase') {
            wb.activateEraseMode();
        } else {
            wb.activateDrawMode();
        }
    };



    /**
     * Returns a date string used to timestamp save files.
     */
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

    /**
     * Prevents default page scrolling action; fixes iOS 8 drawing bug.
     */
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);


    /**
     * Ensures that drawings aren't unintentionally lost when navigating away from page.
     */
    $(window).bind('beforeunload', function() {
        return "Save your drawing before leaving!!";
    });


    /**
     * Save button grabs canvas and saves it as .png with timestamp as file name.
     */
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
                    paper.view.draw();
                };
                reader.readAsText(file.files[0]);
            },
            false);
    };

    /**
     * Loads a saved board from an image file. Overwrites current canvas.
     */
    $('#uploadImg').on('change', function(e) {
        var file = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function(e2) {
            wb.clear();
            NerdBoardTools.loadRaster(e2.target.result);
        };

        fileReader.readAsDataURL(file);
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
}(NerdBoard = NerdBoard || {}));
