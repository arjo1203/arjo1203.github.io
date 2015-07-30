NerdBoard.UIHandler = (function() {
    var sideBar = {
        sideBar: $('#sideBar'),
        logo: $('#NerdLogo'),
        activeUI: 'drawUI',
        UIS: {
            toolsUI: {
                backGround: $('#toolsView'),
                options: $('#toolOptions'),
                isOut: false,
                toggle: function() {
                    if(sideBar.UIS.toolsUI.isOut) {
                        sideBar.UIS.toolsUI.close();
                    }
                    else {
                        sideBar.UIS.toolsUI.open();
                    }
                },
                open: function() {
                    sideBar.UIS.toolsUI.options.animate({
                            left: '265px'
                        }, 300,
                        function() {
                            sideBar.UIS.toolsUI.options.css('z-index', '1');
                        });
                    sideBar.UIS.toolsUI.isOut = true;
                },
                close: function() {
                    sideBar.UIS.toolsUI.options.css('z-index', '-1');
                    sideBar.UIS.toolsUI.options.animate({
                        left: '0'
                    }, 250);
                    sideBar.UIS.toolsUI.isOut = false;
                },
                toggleStart: 0,
                toggleDelta: 0,
                toggleLast: 0
            },
            drawUI: {
                layer: $('#drawToolOptions'),
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
                                    left: '465px'
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
                    sideBar.sideBar.animate({
                        height: '209px'
                    }, 100);
                    sideBar.switchUI('drawUI');
                },
                styleUI: function() {
                    var penColor = NerdBoard.getColorComponents(NerdBoard.penColor);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.colors.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.width.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.toolsUI.backGround, penColor);
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
                layer: $('#eraseToolOptions'),
                displayOptions: function() {
                    sideBar.sideBar.animate({
                        height: '70px'
                    }, 200);
                    sideBar.switchUI('eraseUI');
                },
                styleUI: function() {
                }
            },
            moveUI: {
                layer: $('#moveToolOptions'),
                displayOptions: function() {
                    sideBar.switchUI('moveUI');
                    sideBar.sideBar.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                }
            },
            addUI: {
                layer: $('#shapeToolOptions'),
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
                    sideBar.sideBar.animate({
                        height: '279px'
                    }, 200);
                },
                styleUI: function() {
                    //var eraseColor = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.bg);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
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
                layer: $('#themeToolOptions'),
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
                                left: '365px'
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
                    sideBar.sideBar.animate({
                        height: '140px'
                    }, 200);
                },
                styleUI: function() {
                    //var bg = NerdBoard.getColorComponents(NerdBoard.theme.bg);
                    //NerdBoard.styleEle(sideBar.UIS.themeUI.options.themes.tigger, bg);
                }
            }
        },
        toolSelected: function() {
            if(sideBar.UIS.toolsUI.isOut) {
                sideBar.UIS.toolsUI.toggle();
                sideBar.updateUIOptions();
            }
        },
        updateUIOptions: function() {
            switch (NerdBoard.activeMode) {
                case 'draw':
                    sideBar.UIS.drawUI.displayOptions();
                    break;
                case 'erase':
                    sideBar.UIS.eraseUI.displayOptions();
                    break;
                case 'move':
                    sideBar.UIS.moveUI.displayOptions();
                    break;
                case 'add':
                    sideBar.UIS.addUI.displayOptions();
                    break;
                case 'theme':
                    sideBar.UIS.themeUI.displayOptions();
                    break;
            }
        },
        switchUI: function(selectedUI) {
            for(var UI in sideBar.UIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI !== 'toolsUI') {
                        if(UI !== selectedUI) {
                            sideBar.UIS[UI].layer.css('opacity', '0');
                            sideBar.UIS[UI].layer.css('z-index', '-1');
                        }
                        else {
                            sideBar.UIS[UI].layer.css('opacity', '1');
                            sideBar.UIS[UI].layer.css('z-index', '1');
                            sideBar.activeUI = UI;
                            sideBar.styleUI();
                        }
                    }
                }
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
        }
    };

    sideBar.styleLogo = function(ele, components) {
        ele.css("color", "rgb(" + components.r + ',' + components.g + ',' + components.b + ")");
    };

    return sideBar;
}());