$('#undo').on('mousedown', function() {
    NerdBoard.undo();
});

$('#undo').on('touchstart', function() {
    NerdBoard.undo();
});

$('#clear').on('mousedown', function() {
    NerdBoard.clear();
});

$('#clear').on('touchstart', function() {
    NerdBoard.clear();
});

$('#black').on('mousedown', function() {
    NerdBoard.setColor('black');
});

$('#black').on('touchstart', function() {
    NerdBoard.setColor('black');
});

$('#red').on('mousedown', function() {
    NerdBoard.setColor('red');
});

$('#red').on('touchstart', function() {
    NerdBoard.setColor('red');
});

$('#green').on('mousedown', function() {
    NerdBoard.setColor('green');
});

$('#green').on('touchstart', function() {
    NerdBoard.setColor('green');
});

$('#blue').on('mousedown', function() {
    NerdBoard.setColor('blue');
});

$('#blue').on('touchstart', function() {
    NerdBoard.setColor('blue');
});

$('#yellow').on('mousedown', function() {
    NerdBoard.setColor('yellow');
});

$('#yellow').on('touchstart', function() {
    NerdBoard.setColor('yellow');
});

$('#Text').on('mousedown', function() {
    NerdBoard.setShape('Text');
});

$('#Text').on('touchstart', function() {
    NerdBoard.setShape('Text');
});

$('#Terminal').on('mousedown', function() {
    NerdBoard.setShape('Terminal');
});

$('#Terminal').on('touchstart', function() {
    NerdBoard.setShape('Terminal');
});

$('#Process').on('mousedown', function() {
    NerdBoard.setShape('Process');
});

$('#Process').on('touchstart', function() {
    NerdBoard.setShape('Process');
});

$('#Input').on('mousedown', function() {
    NerdBoard.setShape('Input');
});

$('#Input').on('touchstart', function() {
    NerdBoard.setShape('Input');
});

$('#Decision').on('mousedown', function() {
    NerdBoard.setShape('Decision');
});

$('#Decision').on('touchstart', function() {
    NerdBoard.setShape('Decision');
});

$('#saveWorkSpace').on('mousedown', function() {
    NerdBoard.saveAsWorkSpace();
});

$('#saveWorkSpace').on('touchstart', function() {
    NerdBoard.saveAsWorkSpace();
});

$('#loadWorkSpace').on('mousedown', function() {
    NerdBoard.loadWorkSpace();
});

$('#loadWorkSpace').on('touchstart', function() {
    NerdBoard.loadWorkSpace();
});



var toolIcon = $('#toolIcon');

$('#drawTool').on('mousedown', function() {
    updateToDrawMode();
});

$('#drawTool').on('touchstart', function() {
    updateToDrawMode();
});

function updateToDrawMode() {
    NerdBoard.activateDrawMode();
    toolIcon.attr('src', 'icons/pencil.png');
}

$('#eraseTool').on('mousedown', function() {
    updateToEraseMode();
});

$('#eraseTool').on('touchstart', function() {
    updateToEraseMode();
});

function updateToEraseMode() {
    NerdBoard.activateEraseMode();
    toolIcon.attr('src', 'icons/eraser.png');
}

$('#moveTool').on('mousedown', function() {
    updateToMoveMode();
});

$('#moveTool').on('touchstart', function() {
    updateToMoveMode();
});

function updateToMoveMode() {
    NerdBoard.activateMoveMode();
    toolIcon.attr('src', 'icons/move.png');
}

$('#addTool').on('mousedown', function() {
    updateToAddMode();
});

$('#addTool').on('touchstart', function() {
    updateToAddMode();
});

function updateToAddMode() {
    NerdBoard.activateShapeMode();
    toolIcon.attr('src', 'icons/add.png');
}

$('#themeTool').on('mousedown', function() {
    updateToThemeMode()
});

$('#themeTool').on('touchstart', function() {
    updateToThemeMode();
});

function updateToThemeMode() {
    NerdBoard.activateThemeMode();
    toolIcon.attr('src', 'icons/settings.png');
}




$('#toolsView').on('mousedown', function() {
    toolsViewClick();
});

$('#toolsView').on('touchstart', function() {
    toolsViewClick();
});


function toolsViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggle();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.toolsUI.toggleStart;
}


$('#themeBtn').on('mousedown', function() {
    themeBtnClick();
});

$('#themeBtn').on('touchstart', function() {
    themeBtnClick();
});


function themeBtnClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggle();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.themeUI.options.themes.toggleStart;
}


$('#colorView').on('mousedown', function() {
    colorViewClick();
});

$('#colorView').on('touchstart', function() {
    colorViewClick();
});


function colorViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart;
}

$('#widthView').on('mousedown', function() {
    widthViewClick();
});

$('#widthView').on('touchstart', function() {
    widthViewClick();
});


function widthViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.width.toggleStart;
}

$('#shapeView').on('mousedown', function() {
    shapeViewClick();
});

$('#shapeView').on('touchstart', function() {
    shapeViewClick();
});

function shapeViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.shapes.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.drawUI.options.colors.toggleStart;
}

$('#textSizeView').on('mousedown', function() {
    textSizeViewClick()
});

$('#textSizeView').on('touchstart', function() {
    textSizeViewClick();
});

function textSizeViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textSize.toggleStart;
}

$('#textInputView').on('mousedown', function() {
    textInputViewClick();
});

$('#textInputView').on('touchstart', function() {
    textInputViewClick();
});

function textInputViewClick() {
    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart = (new Date()).getTime();

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleDelta = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart - NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleLast;

    if(NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleDelta > 300) {
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggle();
        NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.closeOtherOptions();
    }

    NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleLast = NerdBoard.UIHandler.LeftSideBarUI.UIS.addUI.options.textInput.toggleStart;
}




$('#saveImg').on('mousedown', function() {
    saveImgClick();
});

$('#saveImg').on('touchstart', function() {
    saveImgClick();
});

function saveImgClick() {
    this.download = NerdBoard.getDate();
    this.href = NerdBoard.canvas.toDataURL('image/png');
}

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