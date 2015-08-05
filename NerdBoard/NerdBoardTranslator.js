$('#undo').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.undo();
});

$('#clear').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.clear();
});

$('#menu').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
});

$('#black').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('black');
});

$('#red').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('red');
});

$('#green').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('green');
});

$('#blue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('blue');
});

$('#yellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('yellow');
});

$('#Text').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setShape('Text');
});

$('#Terminal').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setShape('Terminal');
});

$('#Process').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setShape('Process');
});

$('#Input').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setShape('Input');
});

$('#Decision').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setShape('Decision');
});

$('#saveWorkSpace').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.saveAsWorkSpace();
});

$('#loadWorkSpace').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.loadWorkSpace();
});





//row1
$('#colorDefaultBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultBg');
});

$('#colorSlateBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('slateBlack');
});

$('#colorSlateRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('slateRed');
});

$('#colorNeonGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonGreen');
});

$('#colorSlateBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('slateBlue');
});

$('#colorDefaultYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultYellow');
});

//row2
$('#colorNeonBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonBlack');
});

$('#colorNightBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightBg');
});

$('#colorNightRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightRed');
});

$('#colorNeonGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonGreen');
});

$('#colorNeonBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonBlue');
});

$('#colorNightYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightYellow');
});

//row3
$('#colorSlateBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('slateBg');
});

$('#colorNeonBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonBg');
});

$('#colorNeonRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonRed');
});

$('#colorNightGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightGreen');
});

$('#colorNightBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightBlue');
});

$('#colorSlateYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('slateYellow');
});

//row4
$('#colorNightBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('nightBlack');
});

$('#colorDefaultBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultBlack');
});

$('#colorDefaultRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultRed');
});

$('#colorDefaultGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultGreen');
});

$('#colorDefaultBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('defaultBlue');
});

$('#colorNeonYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setColor('neonYellow');
});







//row1
$('#themeDefaultBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultBg');
});

$('#themeSlateBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('slateBlack');
});

$('#themeSlateRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('slateRed');
});

$('#themeNeonGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonGreen');
});

$('#themeSlateBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('slateBlue');
});

$('#themeDefaultYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultYellow');
});

//row2
$('#themeNeonBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonBlack');
});

$('#themeNightBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightBg');
});

$('#themeNightRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightRed');
});

$('#themeNeonGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonGreen');
});

$('#themeNeonBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonBlue');
});

$('#themeNightYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightYellow');
});

//row3
$('#themeSlateBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('slateBg');
});

$('#themeNeonBg').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonBg');
});

$('#themeNeonRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonRed');
});

$('#themeNightGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightGreen');
});

$('#themeNightBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightBlue');
});

$('#themeSlateYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('slateYellow');
});

//row4
$('#themeNightBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('nightBlack');
});

$('#themeDefaultBlack').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultBlack');
});

$('#themeDefaultRed').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultRed');
});

$('#themeDefaultGreen').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultGreen');
});

$('#themeDefaultBlue').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('defaultBlue');
});

$('#themeNeonYellow').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    NerdBoard.setBg('neonYellow');
});



var toolIcon = $('#toolIcon');

$('#drawTool').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    updateToDrawMode();
});

function updateToDrawMode() {
    NerdBoard.activateDrawMode();
    toolIcon.attr('src', 'icons/pencil.png');
}

$('#eraseTool').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    updateToEraseMode();
});

function updateToEraseMode() {
    NerdBoard.activateEraseMode();
    toolIcon.attr('src', 'icons/eraser.png');
}

$('#moveTool').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    updateToMoveMode();
});

function updateToMoveMode() {
    NerdBoard.activateMoveMode();
    toolIcon.attr('src', 'icons/move.png');
}

$('#addTool').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    updateToAddMode();
});

function updateToAddMode() {
    NerdBoard.activateShapeMode();
    toolIcon.attr('src', 'icons/add.png');
}

$('#themeTool').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    updateToThemeMode();
});

function updateToThemeMode() {
    NerdBoard.activateThemeMode();
    toolIcon.attr('src', 'icons/settings.png');
}





$('#toolsView').bind('mousedown touchstart', function() {
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


$('#themeBtn').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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



$('#colorView').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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

$('#widthView').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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

$('#shapeView').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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

$('#textSizeView').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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

$('#textInputView').bind('mousedown touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
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




$('#saveImg').bind('mousedown touchstart', function() {
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

NerdBoard.setColor('defaultBlack');

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