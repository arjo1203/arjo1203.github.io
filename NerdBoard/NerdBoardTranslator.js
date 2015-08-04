$('#undo').on('click', function() {
    NerdBoard.undo();
});

$('#clear').on('click', function() {
    NerdBoard.clear();
});

$('#black').on('click', function() {
    NerdBoard.setColor('black');
});

$('#red').on('click', function() {
    NerdBoard.setColor('red');
});

$('#green').on('click', function() {
    NerdBoard.setColor('green');
});

$('#blue').on('click', function() {
    NerdBoard.setColor('blue');
});

$('#yellow').on('click', function() {
    NerdBoard.setColor('yellow');
});

$('#Text').on('click', function() {
    NerdBoard.setShape('Text');
});

$('#Terminal').on('click', function() {
    NerdBoard.setShape('Terminal');
});

$('#Process').on('click', function() {
    NerdBoard.setShape('Process');
});

$('#Input').on('click', function() {
    NerdBoard.setShape('Input');
});

$('#Decision').on('click', function() {
    NerdBoard.setShape('Decision');
});

$('#saveWorkSpace').on('click', function() {
    NerdBoard.saveAsWorkSpace();
});

$('#loadWorkSpace').on('click', function() {
    NerdBoard.loadWorkSpace();
});



var toolIcon = $('#toolIcon');

$('#drawTool').click(function() {
    NerdBoard.activateDrawMode();
    toolIcon.attr('src', 'icons/pencil.png');
});

$('#eraseTool').click(function() {
    NerdBoard.activateEraseMode();
    toolIcon.attr('src', 'icons/eraser.png');
});

$('#moveTool').click(function() {
    NerdBoard.activateMoveMode();
    toolIcon.attr('src', 'icons/move.png');
});

$('#addTool').click(function() {
    NerdBoard.activateShapeMode();
    toolIcon.attr('src', 'icons/add.png');
});

$('#themeTool').click(function() {
    NerdBoard.activateThemeMode();
    toolIcon.attr('src', 'icons/settings.png');
});




$('#toolsView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggle();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart;
});


$('#themeBtn').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggle();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart;
});


$('#colorView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart;
});

$('#widthView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart;
});

$('#shapeView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart;
});

$('#textSizeView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart;
});

$('#textInputView').click(function() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart;
});




$('#saveImg').on('click', function() {
    this.download = NerdBoard.getDate();
    this.href = NerdBoard.canvas.toDataURL('image/png');
});

$('#uploadImg').on('change', function(e) {
    var file = e.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function(e2) {
        NerdBoard.clear();
        NerdBoard.Tools.loadRaster(e2.target.result);
    };

    fileReader.readAsDataURL(file);
});




NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.slider();
NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.slider();



NerdBoard.UIHandler.LeftSideBarUI.styleUI();

var canvas = $('#my-canvas'), sideBar = $('#leftSideBar');

centerDiv(canvas, sideBar, 0, .5);
centerDiv(canvas, $('#NerdLogo'), 1, 0);

function centerDiv(outerDiv, innerDiv, left, top) {
    var inWidth = innerDiv[0].clientWidth * left, inHeight = innerDiv[0].clientHeight * top;
    var outWidth = outerDiv[0].clientWidth * left, outHeight = outerDiv[0].clientHeight * top;

    innerDiv[0].style.top = Math.round(outHeight - inHeight).toString() + 'px';
    innerDiv[0].style.left = Math.round(outWidth - inWidth).toString() + 'px';
}