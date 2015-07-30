NerdBoard.UIHandler = (function() {
    var sideBar = {
        sideBarEle: $('#sideBar'),
        activeToolView: $('#toolsView'),
        activeTool: $('#activeTool'),
        logo: $('#NerdLogo'),
        selectedTool: 'drawTool',
        activeUI: 'drawUI',
        toolsUI: {
            btns: {
                drawTool: $('#drawTool'),
                eraseTool: $('#eraseTool'),
                moveTool: $('#moveTool'),
                addTool: $('#addTool'),
                themeTool: $('#themeTool')
            },
            tigger: $('#toolsView'),
            options: $('#toolOptions'),
            isOut: false,
            toggle: function() {
                if(sideBar.toolsUI.isOut) {
                    sideBar.toolsUI.close();
                }
                else {
                    sideBar.toolsUI.open();
                }
            },
            open: function() {
                sideBar.toolsUI.options.animate({
                        left: '265px'
                    }, 300,
                    function() {
                        sideBar.toolsUI.options.css('z-index', '1');
                    });
                sideBar.toolsUI.isOut = true;
            },
            close: function() {
                sideBar.toolsUI.options.css('z-index', '-1');
                sideBar.toolsUI.options.animate({
                    left: '0'
                }, 250);
                sideBar.toolsUI.isOut = false;
            },
            toggleStart: 0,
            toggleDelta: 0,
            toggleLast: 0
        },
        UIS: {
            drawUI: {
                ele: $('#drawToolOptions'),
                activeOption: '',
                options: {
                    colors: {
                        tigger: $('#colorView'),
                        options: $('#colorOptions'),
                        activeColor: $('#activeColor'),
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.drawUI.options.colors.isOut) {
                                sideBar.UIS.drawUI.options.colors.close();
                            }
                            else {
                                sideBar.UIS.drawUI.options.colors.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.drawUI.activeOption = 'colors';
                            sideBar.UIS.drawUI.options.colors.options.animate({
                                    left: '181px'
                                }, 300,
                                function() {
                                    sideBar.UIS.drawUI.options.colors.options.css('z-index', '1');
                                });
                            sideBar.UIS.drawUI.options.colors.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.drawUI.options.colors.options.css('z-index', '-1');
                            sideBar.UIS.drawUI.options.colors.options.animate({
                                left: '0'
                            }, 250);
                            sideBar.UIS.drawUI.options.colors.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    width: {
                        tigger: $('#widthView'),
                        options: $('#widthOptions'),
                        input: $('#widths'),
                        slider: function() {
                            sideBar.UIS.drawUI.options.width.input.slider({
                                min  : 1,
                                max  : 20,
                                value: 5,
                                step: 1,
                                tooltip: 'hide'
                            });
                            sideBar.UIS.drawUI.options.width.input.on('slideStart', function(event) {
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

                            });
                            sideBar.UIS.drawUI.options.width.input.on('slide', function(event) {
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;
                                $('.slider.slider-horizontal .slider-track').css('height', event.value.toString() + 'px');
                                $('.slider-handle').css('margin-top', -(event.value / 2).toString() + 'px');

                                if(event.value > 3) {
                                    $('.slider-handle').css('width', (event.value * 2).toString() + 'px');
                                    $('.slider-handle').css('height', (event.value * 2).toString() + 'px');
                                }
                            });
                            sideBar.UIS.drawUI.options.width.input.on('slideStop', function(event) {
                                sideBar.UIS.drawUI.options.width.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.drawUI.options.width.isOut) {
                                sideBar.UIS.drawUI.options.width.close();
                            }
                            else {
                                sideBar.UIS.drawUI.options.width.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.drawUI.activeOption = 'width';
                            sideBar.UIS.drawUI.options.width.options.animate({
                                    left: '85px'
                                }, 300,
                                function() {
                                    sideBar.UIS.drawUI.options.width.options.css('z-index', '1');
                                });
                            sideBar.UIS.drawUI.options.width.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.drawUI.options.width.options.css('z-index', '-1');
                            sideBar.UIS.drawUI.options.width.options.animate({
                                left: '-130px'
                            }, 250);
                            sideBar.UIS.drawUI.options.width.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function(){
                    sideBar.switchUI('drawUI');
                    sideBar.sideBarEle.animate({
                        height: '209px'
                    }, 100);
                },
                styleUI: function() {
                    var penColor = NerdBoard.getColorComponents(NerdBoard.theme.penColor);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.theme.navBg);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.colors.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.width.tigger, navBg);
                    NerdBoard.styleEle(sideBar.activeToolView, penColor);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.colors.activeColor, penColor);
                    NerdBoard.styleEle($('#penWidth .slider-selection'), penColor);

                    $('#penWidth .slider-handle').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");
                },
                closeOtherOptions: function() {
                    for(var option in sideBar.UIS.drawUI.options) {
                        if(option !== sideBar.UIS.drawUI.activeOption) {
                            if(sideBar.UIS.drawUI.options[option].isOut) {
                                sideBar.UIS.drawUI.options[option].close();
                            }
                        }
                    }
                }
            },
            eraseUI: {
                ele: $('#eraseToolOptions'),
                displayOptions: function() {
                    sideBar.switchUI('eraseUI');
                    sideBar.sideBarEle.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                    var eraseColor = NerdBoard.getColorComponents(NerdBoard.theme.bg);
                    NerdBoard.styleEle(sideBar.activeToolView, eraseColor);
                }
            },
            moveUI: {
                ele: $('#moveToolOptions'),
                displayOptions: function() {
                    sideBar.switchUI('moveUI');
                    sideBar.sideBarEle.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                    //var eraseColor = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.bg);
                    //var navBg = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.navBg);
                    //NerdBoardOriginal.styleEle($('#eraseWidth'), navBg);
                    //NerdBoardOriginal.styleEle(sideBar.activeToolView, eraseColor);
                }
            },
            addUI: {
                ele: $('#shapeToolOptions'),
                options: {
                    shapes: {
                        tigger: $('#shapeView'),
                        options: $('#shapeOptions'),
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.addUI.options.shapes.isOut) {
                                sideBar.UIS.addUI.options.shapes.close();
                            }
                            else {
                                sideBar.UIS.addUI.options.shapes.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.addUI.activeOption = 'shapes';
                            sideBar.UIS.addUI.options.shapes.options.animate({
                                    left: '365px'
                                }, 300,
                                function() {
                                    sideBar.UIS.addUI.options.shapes.options.css('z-index', '1');
                                });
                            sideBar.UIS.addUI.options.shapes.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.addUI.options.shapes.options.css('z-index', '-1');
                            sideBar.UIS.addUI.options.shapes.options.animate({
                                left: '0'
                            }, 250);
                            sideBar.UIS.addUI.options.shapes.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textSize: {
                        tigger: $('#textSizeView'),
                        options: $('#textSizeOptions'),
                        input: $('#textSizeSlider'),
                        slider: function() {
                            sideBar.UIS.addUI.options.textSize.input.slider({
                                min  : 5,
                                max  : 60,
                                value: 40,
                                step: 1,
                                tooltip: 'hide'
                            });
                            sideBar.UIS.addUI.options.textSize.input.on('slideStart', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            sideBar.UIS.addUI.options.textSize.input.on('slide', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            sideBar.UIS.addUI.options.textSize.input.on('slideStop', function() {
                                sideBar.UIS.addUI.options.textSize.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.addUI.options.textSize.isOut) {
                                sideBar.UIS.addUI.options.textSize.close();
                            }
                            else {
                                sideBar.UIS.addUI.options.textSize.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.addUI.activeOption = 'textSize';
                            sideBar.UIS.addUI.options.textSize.options.animate({
                                    left: '100px'
                                }, 300,
                                function() {
                                    sideBar.UIS.addUI.options.textSize.options.css('z-index', '1');
                                });
                            sideBar.UIS.addUI.options.textSize.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.addUI.options.textSize.options.css('z-index', '-1');
                            sideBar.UIS.addUI.options.textSize.options.animate({
                                left: '-106px'
                            }, 250);
                            sideBar.UIS.addUI.options.textSize.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textInput: {
                        tigger: $('#textInputView'),
                        options: $('#textInputOptions'),
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.addUI.options.textInput.isOut) {
                                sideBar.UIS.addUI.options.textInput.close();
                            }
                            else {
                                sideBar.UIS.addUI.options.textInput.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.addUI.activeOption = 'textInput';
                            sideBar.UIS.addUI.options.textInput.options.animate({
                                    left: '100px'
                                }, 300,
                                function() {
                                    sideBar.UIS.addUI.options.textInput.options.css('z-index', '1');
                                });
                            sideBar.UIS.addUI.options.textInput.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.addUI.options.textInput.options.css('z-index', '-1');
                            sideBar.UIS.addUI.options.textInput.options.animate({
                                left: '-106px'
                            }, 250);
                            sideBar.UIS.addUI.options.textInput.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function() {
                    sideBar.switchUI('addUI');
                    sideBar.sideBarEle.animate({
                        height: '279px'
                    }, 200);
                },
                styleUI: function() {
                    //var eraseColor = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.bg);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.theme.navBg);
                    NerdBoard.styleEle(sideBar.UIS.addUI.options.shapes.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.addUI.options.textSize.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.addUI.options.textInput.tigger, navBg);
                },
                closeOtherOptions: function() {
                    for(var option in sideBar.UIS.addUI.options) {
                        if(option !== sideBar.UIS.addUI.activeOption) {
                            if(sideBar.UIS.addUI.options[option].isOut) {
                                sideBar.UIS.addUI.options[option].close();
                            }
                        }
                    }
                }
            },
            themeUI: {
                ele: $('#themeToolOptions'),
                activeOption: '',
                options: {
                    themes: {
                        tigger: $('#themeBtn'),
                        options: $('#themeOptions'),
                        isOut: false,
                        toggle: function() {
                            if(sideBar.UIS.themeUI.options.themes.isOut) {
                                sideBar.UIS.themeUI.options.themes.close();
                            }
                            else {
                                sideBar.UIS.themeUI.options.themes.open();
                            }
                        },
                        open: function() {
                            sideBar.UIS.themeUI.options.themes.options.animate({
                                left: '263px'
                            }, 300);
                            sideBar.UIS.themeUI.options.themes.isOut = true;
                        },
                        close: function() {
                            sideBar.UIS.themeUI.options.themes.options.animate({
                                left: '0'
                            }, 250);
                            sideBar.UIS.themeUI.options.themes.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function() {
                    sideBar.switchUI('themeUI');
                    sideBar.sideBarEle.animate({
                        height: '140px'
                    }, 200);
                },
                styleUI: function() {
                    var navBg = NerdBoard.getColorComponents(NerdBoard.theme.navBg);
                    NerdBoard.styleEle(sideBar.UIS.themeUI.ele, navBg);
                }
            }
        },
        switchUI: function(selectedUI) {
            for(var UI in sideBar.UIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI !== selectedUI) {
                        sideBar.UIS[UI].ele.css('opacity', '0');
                        sideBar.UIS[UI].ele.css('z-index', '-1');
                    }
                    else {
                        sideBar.UIS[UI].ele.css('opacity', '1');
                        sideBar.UIS[UI].ele.css('z-index', '1');
                        sideBar.activeUI = UI;
                        sideBar.styleUI();
                    }
                }
            }
        },
        updateToolOptions: function() {
            switch (sideBar.selectedTool) {
                case 'drawTool':
                    sideBar.UIS.drawUI.displayOptions();
                    break;
                case 'eraseTool':
                    sideBar.UIS.eraseUI.displayOptions();
                    break;
                case 'moveTool':
                    sideBar.UIS.moveUI.displayOptions();
                    break;
                case 'addTool':
                    sideBar.UIS.addUI.displayOptions();
                    break;
                case 'themeTool':
                    sideBar.UIS.themeUI.displayOptions();
                    break;
            }
        },
        setToolMode: function() {
            var selectedMode = sideBar.selectedTool.replace('Tool', 'Mode');
            NerdBoard.activeMode = selectedMode;

            if(sideBar.toolsUI.isOut) {
                sideBar.toolsUI.toggle();
                sideBar.updateToolOptions();
            }
        },
        styleUI: function() {
            for(var UI in sideBar.UIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI == sideBar.activeUI) {
                        sideBar.UIS[UI].styleUI();
                    }
                }
            }

            var black = NerdBoard.getColorComponents(NerdBoard.theme.black);
            sideBar.styleLogo(sideBar.logo, black);
        }
    };

    sideBar.styleLogo = function(ele, components) {
        ele.css("color", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
    };
    
    
    


    sideBar.toolsUI.tigger.click(function() {
        sideBar.toolsUI.toggleStart = (new Date()).getTime();

        sideBar.toolsUI.toggleDelta = sideBar.toolsUI.toggleStart - sideBar.toolsUI.toggleLast;

        if(sideBar.toolsUI.toggleDelta > 300) {
            sideBar.toolsUI.toggle();
        }

        sideBar.toolsUI.toggleLast = sideBar.toolsUI.toggleStart;
    });


    sideBar.UIS.themeUI.options.themes.tigger.click(function() {
        sideBar.UIS.themeUI.options.themes.toggleStart = (new Date()).getTime();

        sideBar.UIS.themeUI.options.themes.toggleDelta = sideBar.UIS.themeUI.options.themes.toggleStart - sideBar.UIS.themeUI.options.themes.toggleLast;

        if(sideBar.UIS.themeUI.options.themes.toggleDelta > 300) {
            sideBar.UIS.themeUI.options.themes.toggle();
        }

        sideBar.UIS.themeUI.options.themes.toggleLast = sideBar.UIS.themeUI.options.themes.toggleStart;
    });


    sideBar.UIS.drawUI.options.colors.tigger.click(function() {
        sideBar.UIS.drawUI.options.colors.toggleStart = (new Date()).getTime();

        sideBar.UIS.drawUI.options.colors.toggleDelta = sideBar.UIS.drawUI.options.colors.toggleStart - sideBar.UIS.drawUI.options.colors.toggleLast;

        if(sideBar.UIS.drawUI.options.colors.toggleDelta > 300) {
            sideBar.UIS.drawUI.options.colors.toggle();
            sideBar.UIS.drawUI.closeOtherOptions();
        }

        sideBar.UIS.drawUI.options.colors.toggleLast = sideBar.UIS.drawUI.options.colors.toggleStart;
    });

    sideBar.UIS.drawUI.options.width.tigger.click(function() {
        sideBar.UIS.drawUI.options.width.toggleStart = (new Date()).getTime();

        sideBar.UIS.drawUI.options.width.toggleDelta = sideBar.UIS.drawUI.options.width.toggleStart - sideBar.UIS.drawUI.options.width.toggleLast;

        if(sideBar.UIS.drawUI.options.width.toggleDelta > 300) {
            sideBar.UIS.drawUI.options.width.toggle();
            sideBar.UIS.drawUI.closeOtherOptions();
        }

        sideBar.UIS.drawUI.options.width.toggleLast = sideBar.UIS.drawUI.options.width.toggleStart;
    });

    sideBar.UIS.addUI.options.shapes.tigger.click(function() {
        sideBar.UIS.addUI.options.shapes.toggleStart = (new Date()).getTime();

        sideBar.UIS.addUI.options.shapes.toggleDelta = sideBar.UIS.addUI.options.shapes.toggleStart - sideBar.UIS.addUI.options.shapes.toggleLast;

        if(sideBar.UIS.addUI.options.shapes.toggleDelta > 300) {
            sideBar.UIS.addUI.options.shapes.toggle();
            sideBar.UIS.addUI.closeOtherOptions();
        }

        sideBar.UIS.drawUI.options.colors.toggleLast = sideBar.UIS.drawUI.options.colors.toggleStart;
    });

    sideBar.UIS.addUI.options.textSize.tigger.click(function() {
        sideBar.UIS.addUI.options.textSize.toggleStart = (new Date()).getTime();

        sideBar.UIS.addUI.options.textSize.toggleDelta = sideBar.UIS.addUI.options.textSize.toggleStart - sideBar.UIS.addUI.options.textSize.toggleLast;

        if(sideBar.UIS.addUI.options.textSize.toggleDelta > 300) {
            sideBar.UIS.addUI.options.textSize.toggle();
            sideBar.UIS.addUI.closeOtherOptions();
        }

        sideBar.UIS.addUI.options.textSize.toggleLast = sideBar.UIS.addUI.options.textSize.toggleStart;
    });

    sideBar.UIS.addUI.options.textInput.tigger.click(function() {
        sideBar.UIS.addUI.options.textInput.toggleStart = (new Date()).getTime();

        sideBar.UIS.addUI.options.textInput.toggleDelta = sideBar.UIS.addUI.options.textInput.toggleStart - sideBar.UIS.addUI.options.textInput.toggleLast;

        if(sideBar.UIS.addUI.options.textInput.toggleDelta > 300) {
            sideBar.UIS.addUI.options.textInput.toggle();
            sideBar.UIS.addUI.closeOtherOptions();
        }

        sideBar.UIS.addUI.options.textInput.toggleLast = sideBar.UIS.addUI.options.textInput.toggleStart;
    });

    sideBar.toolsUI.btns.drawTool.click(function() {
        sideBar.selectedTool = 'drawTool';
        sideBar.setToolMode();
        NerdBoard.activateDrawMode();
        $('#toolIcon').attr('src', 'icons/pencil.png');
    });

    sideBar.toolsUI.btns.eraseTool.click(function() {
        sideBar.selectedTool = 'eraseTool';
        sideBar.setToolMode();
        NerdBoard.activateEraseMode();
        $('#toolIcon').attr('src', 'icons/eraser.png');
    });

    sideBar.toolsUI.btns.moveTool.click(function() {
        sideBar.selectedTool = 'moveTool';
        sideBar.setToolMode();
        NerdBoard.activateMoveMode();
        $('#toolIcon').attr('src', 'icons/hand.png');
    });

    sideBar.toolsUI.btns.addTool.click(function() {
        sideBar.selectedTool = 'addTool';
        sideBar.setToolMode();
        NerdBoard.activateShapeMode();
        $('#toolIcon').attr('src', 'icons/add.png');
    });

    sideBar.toolsUI.btns.themeTool.click(function() {
        sideBar.selectedTool = 'themeTool';
        sideBar.setToolMode();
        NerdBoard.activateShapeMode();
        $('#toolIcon').attr('src', 'icons/theme.png');
    });



    sideBar.UIS.drawUI.options.width.slider();
    sideBar.UIS.addUI.options.textSize.slider();



    function centerDiv(outerDiv, innerDiv, left, top) {
        var inWidth = innerDiv[0].clientWidth * left, inHeight = innerDiv[0].clientHeight * top;
        var outWidth = outerDiv[0].clientWidth * left, outHeight = outerDiv[0].clientHeight * top;

        innerDiv[0].style.top = Math.round(outHeight - inHeight).toString() + 'px';
        innerDiv[0].style.left = Math.round(outWidth - inWidth).toString() + 'px';
    }

    return sideBar;
}());