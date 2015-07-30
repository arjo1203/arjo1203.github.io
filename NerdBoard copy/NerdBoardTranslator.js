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
    toolIcon.attr('src', 'icons/hand.png');
});

$('#addTool').click(function() {
    NerdBoard.activateShapeMode();
    toolIcon.attr('src', 'icons/add.png');
});

$('#themeTool').click(function() {
    NerdBoard.activateThemeMode();
    toolIcon.attr('src', 'icons/theme.png');
});




$('#toolsView').click(function() {
    NerdBoard.UIHandler.UIS.toolsUI.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.toolsUI.toggleDelta = NerdBoard.UIHandler.UIS.toolsUI.toggleStart - NerdBoard.UIHandler.UIS.toolsUI.toggleLast;

    if(NerdBoard.UIHandler.UIS.toolsUI.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.toolsUI.toggle();
    }

    NerdBoard.UIHandler.UIS.toolsUI.toggleLast = NerdBoard.UIHandler.UIS.toolsUI.toggleStart;
});


$('#themeBtn').click(function() {
    NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleDelta = NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleStart - NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleLast;

    if(NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.themeUI.options.themes.toggle();
    }

    NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleLast = NerdBoard.UIHandler.UIS.themeUI.options.themes.toggleStart;
});


$('#colorView').click(function() {
    NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleDelta = NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleStart - NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleLast;

    if(NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.drawUI.options.colors.toggle();
        NerdBoard.UIHandler.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleStart;
});

$('#widthView').click(function() {
    NerdBoard.UIHandler.UIS.drawUI.options.width.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.drawUI.options.width.toggleDelta = NerdBoard.UIHandler.UIS.drawUI.options.width.toggleStart - NerdBoard.UIHandler.UIS.drawUI.options.width.toggleLast;

    if(NerdBoard.UIHandler.UIS.drawUI.options.width.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.drawUI.options.width.toggle();
        NerdBoard.UIHandler.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.UIS.drawUI.options.width.toggleLast = NerdBoard.UIHandler.UIS.drawUI.options.width.toggleStart;
});

$('#shapeView').click(function() {
    NerdBoard.UIHandler.UIS.addUI.options.shapes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.addUI.options.shapes.toggleDelta = NerdBoard.UIHandler.UIS.addUI.options.shapes.toggleStart - NerdBoard.UIHandler.UIS.addUI.options.shapes.toggleLast;

    if(NerdBoard.UIHandler.UIS.addUI.options.shapes.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.addUI.options.shapes.toggle();
        NerdBoard.UIHandler.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.UIS.drawUI.options.colors.toggleStart;
});

$('#textSizeView').click(function() {
    NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleDelta = NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleStart - NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleLast;

    if(NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.addUI.options.textSize.toggle();
        NerdBoard.UIHandler.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleLast = NerdBoard.UIHandler.UIS.addUI.options.textSize.toggleStart;
});

$('#textInputView').click(function() {
    NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleDelta = NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleStart - NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleLast;

    if(NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleDelta > 300) {
        NerdBoard.UIHandler.UIS.addUI.options.textInput.toggle();
        NerdBoard.UIHandler.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleLast = NerdBoard.UIHandler.UIS.addUI.options.textInput.toggleStart;
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




NerdBoard.UIHandler.UIS.drawUI.options.width.slider();
NerdBoard.UIHandler.UIS.addUI.options.textSize.slider();