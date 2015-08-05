NerdBoard.UIHandler = (function() {
    var SideBarUIS = {};
    SideBarUIS.LeftSideBarUI = {
        leftSideBar: $('#leftSideBar'),
        activeUI: 'drawUI',
        UIS: {
            toolsUI: {
                backGround: $('#toolsView'),
                options: $('#toolOptions'),
                isOut: false,
                toggle: function() {
                    if(SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut) {
                        SideBarUIS.LeftSideBarUI.UIS.toolsUI.close();
                    }
                    else {
                        SideBarUIS.LeftSideBarUI.UIS.toolsUI.open();
                    }
                    SideBarUIS.LeftSideBarUI.UIS.drawUI.closeOptions();
                    SideBarUIS.LeftSideBarUI.UIS.addUI.closeOptions();
                    SideBarUIS.LeftSideBarUI.UIS.themeUI.closeOption();
                },
                open: function() {
                    SideBarUIS.LeftSideBarUI.UIS.toolsUI.options.animate({
                            left: '265px'
                        }, 300,
                        function() {
                            SideBarUIS.LeftSideBarUI.UIS.toolsUI.options.css('z-index', '1');
                        });
                    SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut = true;
                },
                close: function() {
                    SideBarUIS.LeftSideBarUI.UIS.toolsUI.options.css('z-index', '-1');
                    SideBarUIS.LeftSideBarUI.UIS.toolsUI.options.animate({
                        left: '0'
                    }, 250);
                    SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut = false;
                },
                toggleStart: 0,
                toggleDelta: 0,
                toggleLast: 0
            },
            drawUI: {
                layer: $('#leftDrawToolOptions'),
                activeOption: '',
                options: {
                    colors: {
                        tiger: $('#colorView'),
                        options: $('#colorOptions'),
                        activeColor: $('#activeColor'),
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.open();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.activeOption = 'colors';
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.options.animate({
                                    left: '350px'
                                }, 300,
                                function() {
                                    SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.options.css('z-index', '1');
                                });
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.options.css('z-index', '-1');
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.options.animate({
                                left: '0'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    width: {
                        tiger: $('#widthView'),
                        options: $('#widthOptions'),
                        input: $('#widths'),
                        slider: function() {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.input.slider({
                                min  : 1,
                                max  : 20,
                                value: 5,
                                step: 1,
                                tooltip: 'hide'
                            });
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.input.on('slideStart', function(event) {
                                console.log(event);
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

                            });
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.input.on('slide', function(event) {
                                console.log(event);
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

                                $('.slider-track').css('height', event.value.toString() + 'px');
                                $('.slider-handle').css('margin-top', -(event.value / 2).toString() + 'px');

                                if(event.value > 3) {
                                    $('.slider-handle').css('width', (event.value * 2).toString() + 'px');
                                    $('.slider-handle').css('height', (event.value * 2).toString() + 'px');
                                }
                            });
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.input.on('slideStop', function(event) {
                                console.log(event);
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.open();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.activeOption = 'width';
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.options.animate({
                                    left: '85px'
                                }, 300,
                                function() {
                                    SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.options.css('z-index', '1');
                                });
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.options.css('z-index', '-1');
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.options.animate({
                                left: '-130px'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function(){
                    SideBarUIS.LeftSideBarUI.switchUI('drawUI');
                    SideBarUIS.LeftSideBarUI.leftSideBar.animate({
                        height: '209px'
                    }, 100);
                },
                styleUI: function() {
                    var penColor = NerdBoard.getColorComponents(NerdBoard.penColor);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.tiger, navBg);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.drawUI.options.width.tiger, navBg);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.toolsUI.backGround, penColor);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.drawUI.options.colors.activeColor, penColor);
                    NerdBoard.styleEle($('#penWidth .slider-selection'), penColor);

                    $('#penWidth .slider-handle').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");
                },
                closeOtherOptions: function() {
                    for(var option in SideBarUIS.LeftSideBarUI.UIS.drawUI.options) {
                        if(option !== SideBarUIS.LeftSideBarUI.UIS.drawUI.activeOption) {
                            if(SideBarUIS.LeftSideBarUI.UIS.drawUI.options[option].isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.drawUI.options[option].close();
                            }
                            if(SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.toolsUI.close();
                            }
                        }
                    }
                },
                closeOptions: function() {
                    for(var option in SideBarUIS.LeftSideBarUI.UIS.drawUI.options) {
                        if(SideBarUIS.LeftSideBarUI.UIS.drawUI.options[option].isOut) {
                            SideBarUIS.LeftSideBarUI.UIS.drawUI.options[option].close();
                        }
                    }
                }
            },
            eraseUI: {
                layer: $('#leftEraseToolOptions'),
                displayOptions: function() {
                    SideBarUIS.LeftSideBarUI.switchUI('eraseUI');
                    SideBarUIS.LeftSideBarUI.leftSideBar.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                }
            },
            moveUI: {
                layer: $('#moveToolOptions'),
                displayOptions: function() {
                    SideBarUIS.LeftSideBarUI.switchUI('moveUI');
                    SideBarUIS.LeftSideBarUI.leftSideBar.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                }
            },
            addUI: {
                layer: $('#leftShapeToolOptions'),
                options: {
                    drawAfter: {
                        tiger: $('#drawAfterCheckbox'),
                        checkBox: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.drawAfter.tiger.checkbox();
                        }
                    },
                    shapes: {
                        tiger: $('#shapeView'),
                        options: $('#shapeOptions'),
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.open();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.activeOption = 'shapes';
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.options.animate({
                                    left: '365px'
                                }, 300,
                                function() {
                                    SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.options.css('z-index', '1');
                                });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.options.css('z-index', '-1');
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.options.animate({
                                left: '0'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textSize: {
                        tiger: $('#textSizeView'),
                        options: $('#textSizeOptions'),
                        input: $('#textSizeSlider'),
                        slider: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.input.slider({
                                min  : 5,
                                max  : 60,
                                value: 40,
                                step: 1,
                                tooltip: 'hide'
                            });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.input.on('slideStart', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.input.on('slide', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.input.on('slideStop', function() {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.open();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.activeOption = 'textSize';
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.options.animate({
                                    left: '185px'
                                }, 300,
                                function() {
                                    SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.options.css('z-index', '1');
                                });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.options.css('z-index', '-1');
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.options.animate({
                                left: '0'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textInput: {
                        tiger: $('#textInputView'),
                        options: $('#textInputOptions'),
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.open();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.activeOption = 'textInput';
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.options.animate({
                                    left: '185px'
                                }, 300,
                                function() {
                                    SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.options.css('z-index', '1');
                                });
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.options.css('z-index', '-1');
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.options.animate({
                                left: '0'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function() {
                    SideBarUIS.LeftSideBarUI.switchUI('addUI');
                    SideBarUIS.LeftSideBarUI.leftSideBar.animate({
                        height: '320px'
                    }, 200);
                },
                styleUI: function() {
                    //var eraseColor = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.bg);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.addUI.options.shapes.tiger, navBg);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.addUI.options.textSize.tiger, navBg);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.addUI.options.textInput.tiger, navBg);
                },
                closeOtherOptions: function() {
                    for(var option in SideBarUIS.LeftSideBarUI.UIS.addUI.options) {
                        if(option !== SideBarUIS.LeftSideBarUI.UIS.addUI.activeOption) {
                            if(SideBarUIS.LeftSideBarUI.UIS.addUI.options[option].isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.addUI.options[option].close();
                            }
                            if(SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.toolsUI.close();
                            }
                        }
                    }
                },
                closeOptions: function() {
                    for(var option in SideBarUIS.LeftSideBarUI.UIS.addUI.options) {
                        if(SideBarUIS.LeftSideBarUI.UIS.addUI.options[option].isOut) {
                            SideBarUIS.LeftSideBarUI.UIS.addUI.options[option].close();
                        }
                    }
                }
            },
            themeUI: {
                layer: $('#leftThemeToolOptions'),
                activeOption: '',
                options: {
                    themes: {
                        tiger: $('#themeBtn'),
                        options: $('#themes'),
                        isOut: false,
                        toggle: function() {
                            if(SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.close();
                            }
                            else {
                                SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.open();
                            }
                            if(SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut) {
                                SideBarUIS.LeftSideBarUI.UIS.toolsUI.close();
                            }
                        },
                        open: function() {
                            SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.options.animate({
                                left: '85px'
                            }, 300);
                            SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.isOut = true;
                        },
                        close: function() {
                            SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.options.animate({
                                left: '-265px'
                            }, 250);
                            SideBarUIS.LeftSideBarUI.UIS.themeUI.options.themes.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function() {
                    SideBarUIS.LeftSideBarUI.switchUI('themeUI');
                    SideBarUIS.LeftSideBarUI.leftSideBar.animate({
                        height: '140px'
                    }, 200);
                },
                styleUI: function() {
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    NerdBoard.styleEle(SideBarUIS.LeftSideBarUI.UIS.themeUI.layer, navBg);
                },
                closeOption: function() {
                    for(var option in SideBarUIS.LeftSideBarUI.UIS.themeUI.options) {
                        if(SideBarUIS.LeftSideBarUI.UIS.themeUI.options[option].isOut) {
                            SideBarUIS.LeftSideBarUI.UIS.themeUI.options[option].close();
                        }
                    }
                }
            }
        },
        toolSelected: function() {
            SideBarUIS.LeftSideBarUI.updateUIOptions();
            if(SideBarUIS.LeftSideBarUI.UIS.toolsUI.isOut) {
                SideBarUIS.LeftSideBarUI.UIS.toolsUI.close();
            }
        },
        updateUIOptions: function() {
            switch (NerdBoard.activeMode) {
                case 'draw':
                    SideBarUIS.LeftSideBarUI.UIS.drawUI.displayOptions();
                    break;
                case 'erase':
                    SideBarUIS.LeftSideBarUI.UIS.eraseUI.displayOptions();
                    break;
                case 'move':
                    SideBarUIS.LeftSideBarUI.UIS.moveUI.displayOptions();
                    break;
                case 'add':
                    SideBarUIS.LeftSideBarUI.UIS.addUI.displayOptions();
                    break;
                case 'theme':
                    SideBarUIS.LeftSideBarUI.UIS.themeUI.displayOptions();
                    break;
            }
        },
        switchUI: function(selectedUI) {
            for(var UI in SideBarUIS.LeftSideBarUI.UIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI !== 'toolsUI') {
                        if(UI !== selectedUI) {
                            SideBarUIS.LeftSideBarUI.UIS[UI].layer.css('opacity', '0');
                            SideBarUIS.LeftSideBarUI.UIS[UI].layer.css('z-index', '-1');
                        }
                        else {
                            SideBarUIS.LeftSideBarUI.UIS[UI].layer.css('opacity', '1');
                            SideBarUIS.LeftSideBarUI.UIS[UI].layer.css('z-index', '1');
                            SideBarUIS.LeftSideBarUI.activeUI = UI;
                            SideBarUIS.LeftSideBarUI.styleUI();
                        }
                    }
                }
            }
        },
        styleUI: function() {
            for(var UI in SideBarUIS.LeftSideBarUI.UIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI == SideBarUIS.LeftSideBarUI.activeUI) {
                        SideBarUIS.LeftSideBarUI.UIS[UI].styleUI();
                    }
                }
            }
        }
    };

    return SideBarUIS;
}());