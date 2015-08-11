NerdBoard.UIHandler = (function() {
    var NerdUIS = {};
    NerdUIS.menu = {
        btn: $('#menuUIBtn'),
        options: $('#menuUIOptions'),
        isOut: false,
        toggle: function() {
            if(NerdUIS.menu.isOut) {
                NerdUIS.menu.close();
            }
            else {
                NerdUIS.menu.open();
            }
        },
        open: function() {
            NerdUIS.menu.options.animate({
                left: '0'
            }, 300);
            NerdUIS.menu.isOut = true;
        },
        close: function() {
            NerdUIS.menu.options.animate({
                left: '-50'
            }, 250);
            NerdUIS.menu.isOut = false;
        },
        click: function() {
            NerdBoard.UIHandler.menu.toggleStart = (new Date()).getTime();

            NerdBoard.UIHandler.menu.toggleDelta = NerdBoard.UIHandler.menu.toggleStart - NerdBoard.UIHandler.menu.toggleLast;

            if(NerdBoard.UIHandler.menu.toggleDelta > 300) {
                NerdBoard.UIHandler.menu.toggle();
                NerdBoard.UIHandler.menu.closeInternalUIS();
            }

            NerdBoard.UIHandler.menu.toggleLast = NerdBoard.UIHandler.menu.toggleStart;
        },
        toggleStart: 0,
            toggleDelta: 0,
            toggleLast: 0,
            closeInternalUIS: function() {
            for(var UI in NerdUIS.menu.internalUIS) {
                if(NerdUIS.menu.internalUIS[UI].isOut) {
                    NerdUIS.menu.internalUIS[UI].close();
                }
            }
        },
        activeInternalUI: '',
        internalUIS: {
            saveUI: {
                btn: $('#saveUIBtn'),
                options: $('#saveUIOptions'),
                isOut: false,
                toggle: function() {
                    if(NerdUIS.menu.internalUIS.saveUI.isOut) {
                        NerdUIS.menu.internalUIS.saveUI.close();
                    }
                    else {
                        NerdUIS.menu.internalUIS.saveUI.open();
                    }
                },
                open: function() {
                    NerdUIS.menu.activeInternalUI = 'saveUI';
                    NerdUIS.menu.internalUIS.saveUI.options.animate({
                        left: '50px'
                    }, 300);
                    NerdUIS.menu.internalUIS.saveUI.isOut = true;
                },
                close: function() {
                    NerdUIS.menu.internalUIS.saveUI.options.animate({
                        left: '-110px'
                    }, 250);
                    NerdUIS.menu.internalUIS.saveUI.isOut = false;
                },
                click: function() {
                    NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleStart = (new Date()).getTime();

                    NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleDelta = NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleStart - NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleLast;

                    if(NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleDelta > 300) {
                        NerdBoard.UIHandler.menu.internalUIS.saveUI.toggle();
                        NerdBoard.UIHandler.menu.internalUIS.closeOtherInternalUIS();
                    }

                    NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleLast = NerdBoard.UIHandler.menu.internalUIS.saveUI.toggleStart;
                },
                toggleStart: 0,
                    toggleDelta: 0,
                    toggleLast: 0
            },
            loadUI: {
                btn: $('#loadUIBtn'),
                options: $('#loadUIOptions'),
                isOut: false,
                toggle: function() {
                if(NerdUIS.menu.internalUIS.loadUI.isOut) {
                        NerdUIS.menu.internalUIS.loadUI.close();
                    }
                    else {
                        NerdUIS.menu.internalUIS.loadUI.open();
                    }
                },
                open: function() {
                    NerdUIS.menu.activeInternalUI = 'loadUI';
                    NerdUIS.menu.internalUIS.loadUI.options.animate({
                        left: '50px'
                    }, 300);
                    NerdUIS.menu.internalUIS.loadUI.isOut = true;
                },
                close: function() {
                    NerdUIS.menu.internalUIS.loadUI.options.animate({
                        left: '-110px'
                    }, 250);
                    NerdUIS.menu.internalUIS.loadUI.isOut = false;
                },
                click: function() {
                    NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleStart = (new Date()).getTime();

                    NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleDelta = NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleStart - NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleLast;

                    if(NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleDelta > 300) {
                        NerdBoard.UIHandler.menu.internalUIS.loadUI.toggle();
                        NerdBoard.UIHandler.menu.internalUIS.closeOtherInternalUIS();
                    }

                    NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleLast = NerdBoard.UIHandler.menu.internalUIS.loadUI.toggleStart;
                },
                toggleStart: 0,
                    toggleDelta: 0,
                    toggleLast: 0
            },
            bgUI: {
                btn: $('#bgUIBtn'),
                options: $('#bgUIOptions'),
                isOut: false,
                toggle: function() {
                if(NerdUIS.menu.internalUIS.bgUI.isOut) {
                        NerdUIS.menu.internalUIS.bgUI.close();
                    }
                    else {
                        NerdUIS.menu.internalUIS.bgUI.open();
                    }
                },
                open: function() {
                    NerdUIS.menu.activeInternalUI = 'bgUI';
                    NerdUIS.menu.internalUIS.bgUI.options.animate({
                        left: '50px'
                    }, 300);
                    NerdUIS.menu.internalUIS.bgUI.isOut = true;
                },
                close: function() {
                    NerdUIS.menu.internalUIS.bgUI.options.animate({
                        left: '-270px'
                    }, 250);
                    NerdUIS.menu.internalUIS.bgUI.isOut = false;
                },
                click: function() {
                    NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleStart = (new Date()).getTime();

                    NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleDelta = NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleStart - NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleLast;

                    if(NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleDelta > 300) {
                        NerdBoard.UIHandler.menu.internalUIS.bgUI.toggle();
                        NerdBoard.UIHandler.menu.internalUIS.closeOtherInternalUIS();
                    }

                    NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleLast = NerdBoard.UIHandler.menu.internalUIS.bgUI.toggleStart;
                },
                toggleStart: 0,
                    toggleDelta: 0,
                    toggleLast: 0
            },
            closeOtherInternalUIS: function() {
                for(var UI in NerdUIS.menu.internalUIS) {
                    if(UI !== NerdUIS.menu.activeInternalUI) {
                        if(NerdUIS.menu.internalUIS[UI].isOut) {
                            NerdUIS.menu.internalUIS[UI].close();
                        }
                    }
                }
            }
        }
    };
    
    NerdUIS.leftBar = {
        leftSideBar: $('#leftSideBar'),
        activeUI: 'drawUI',
        internalUIS: {
            toolsUI: {
                btn: $('#leftToolsUIBtn'),
                options: $('#leftToolsUIOptions'),
                isOut: false,
                toggle: function() {
                    if(NerdUIS.leftBar.internalUIS.toolsUI.isOut) {
                        NerdUIS.leftBar.internalUIS.toolsUI.close();
                    }
                    else {
                        NerdUIS.leftBar.internalUIS.toolsUI.open();
                    }
                    NerdUIS.leftBar.internalUIS.drawUI.closeUIS();
                    NerdUIS.leftBar.internalUIS.addUI.closeUIS();
                },
                open: function() {
                    NerdUIS.leftBar.internalUIS.toolsUI.options.animate({
                            left: '80px'
                        }, 300);
                    NerdUIS.leftBar.internalUIS.toolsUI.isOut = true;
                },
                close: function() {
                    NerdUIS.leftBar.internalUIS.toolsUI.options.animate({
                        left: '-200px'
                    }, 250);
                    NerdUIS.leftBar.internalUIS.toolsUI.isOut = false;
                },
                click: function() {
                    NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleStart = (new Date()).getTime();

                    NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleDelta = NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleStart - NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleLast;

                    if(NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleDelta > 300) {
                        NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggle();
                    }

                    NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleLast = NerdBoard.UIHandler.leftBar.internalUIS.toolsUI.toggleStart;
                },
                toggleStart: 0,
                toggleDelta: 0,
                toggleLast: 0
            },
            drawUI: {
                layer: $('#leftDrawUI'),
                activeInternalUI: '',
                internalUIS: {
                    colorUI: {
                        btn: $('#leftColorUIBtn'),
                        options: $('#leftColorUIOptions'),
                        btnIcon: $('#leftColorUIBtnIcon'),
                        isOut: false,
                        toggle: function() {
                            if(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.isOut) {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.close();
                            }
                            else {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.open();
                            }
                        },
                        open: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.activeInternalUI = 'colorUI';
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.options.animate({
                                    left: '80px'
                                }, 300);
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.isOut = true;
                        },
                        close: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.options.animate({
                                left: '-265px'
                            }, 250);
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.isOut = false;
                        },
                        click: function() {
                            NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleStart = (new Date()).getTime();

                            NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleDelta = NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleStart - NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleLast;

                            if(NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleDelta > 300) {
                                NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggle();
                                NerdBoard.UIHandler.leftBar.internalUIS.drawUI.closeOtherUIS();
                            }

                            NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleLast = NerdBoard.UIHandler.leftBar.internalUIS.drawUI.internalUIS.colorUI.toggleStart;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    widthUI: {
                        btn: $('#leftWidthUIBtn'),
                        options: $('#leftWidthUIOptions'),
                        input: $('#leftWidthUISlider'),
                        slider: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.input.slider({
                                min  : 1,
                                max  : 20,
                                value: 5,
                                step: 1,
                                tooltip: 'hide'
                            });
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.input.on('slideStart', function(event) {
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

                            });
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.input.on('slide', function(event) {
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

                                $('#penWidthSlider .slider-track').css('height', event.value.toString() + 'px');
                                $('#penWidthSlider .slider-handle').css('margin-top', -(event.value / 2).toString() + 'px');

                                if(event.value > 3) {
                                    $('#penWidthSlider .slider-handle').css('width', (event.value * 2).toString() + 'px');
                                    $('#penWidthSlider .slider-handle').css('height', (event.value * 2).toString() + 'px');
                                }
                            });
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.input.on('slideStop', function(event) {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.isOut) {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.close();
                            }
                            else {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.open();
                            }
                        },
                        open: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.activeInternalUI = 'widthUI';
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.options.animate({
                                    left: '80px'
                                }, 300);
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.isOut = true;
                        },
                        close: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.options.animate({
                                left: '-130px'
                            }, 250);
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.isOut = false;
                        },
                        click: function() {
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleStart = (new Date()).getTime();

                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleDelta = NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleStart - NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleLast;

                            if(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleDelta > 300) {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggle();
                                NerdBoard.UIHandler.leftBar.internalUIS.drawUI.closeOtherUIS();
                            }

                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleLast = NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.toggleStart;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function(){
                    NerdUIS.leftBar.switchUI('drawUI');
                    NerdUIS.leftBar.leftSideBar.animate({
                        height: '209px'
                    }, 100);
                },
                styleUI: function() {
                    var penColor = NerdBoard.getColorComponents(NerdBoard.penColor);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.toolsUI.btn, penColor);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.btn, navBg);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.colorUI.btnIcon, penColor);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.drawUI.internalUIS.widthUI.btn, navBg);

                    NerdBoard.styleEle($('#penWidthSlider .slider-selection'), penColor);
                    $('#penWidthSlider .slider-handle').css("background", "rgb(" + penColor.r + ',' + penColor.g + ',' + penColor.b + ")");
                },
                closeOtherUIS: function() {
                    for(var UI in NerdUIS.leftBar.internalUIS.drawUI.internalUIS) {
                        if(UI !== NerdUIS.leftBar.internalUIS.drawUI.activeInternalUI) {
                            if(NerdUIS.leftBar.internalUIS.drawUI.internalUIS[UI].isOut) {
                                NerdUIS.leftBar.internalUIS.drawUI.internalUIS[UI].close();
                            }
                            if(NerdUIS.leftBar.internalUIS.toolsUI.isOut) {
                                NerdUIS.leftBar.internalUIS.toolsUI.close();
                            }
                        }
                    }
                },
                closeUIS: function() {
                    for(var UI in NerdUIS.leftBar.internalUIS.drawUI.internalUIS) {
                        if(NerdUIS.leftBar.internalUIS.drawUI.internalUIS[UI].isOut) {
                            NerdUIS.leftBar.internalUIS.drawUI.internalUIS[UI].close();
                        }
                    }
                }
            },
            eraseUI: {
                layer: $('#leftEraseUI'),
                displayOptions: function() {
                    NerdUIS.leftBar.switchUI('eraseUI');
                    NerdUIS.leftBar.leftSideBar.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                }
            },
            moveUI: {
                layer: $('#moveToolUI'),
                displayOptions: function() {
                    NerdUIS.leftBar.switchUI('moveUI');
                    NerdUIS.leftBar.leftSideBar.animate({
                        height: '70px'
                    }, 200);
                },
                styleUI: function() {
                }
            },
            addUI: {
                layer: $('#leftAddUI'),
                activeInternalUI: '',
                drawAfter: {
                    checkBox: $('#drawAfterCheckbox')
                },
                internalUIS: {
                    shapeUI: {
                        btn: $('#leftShapeUIBtn'),
                        options: $('#leftShapeUIOptions'),
                        isOut: false,
                        toggle: function() {
                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.isOut) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.close();
                            }
                            else {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.open();
                            }
                        },
                        open: function() {
                            NerdUIS.leftBar.internalUIS.addUI.activeInternalUI = 'shapeUI';
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.options.animate({
                                    left: '80px'
                                }, 300);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.isOut = true;
                        },
                        close: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.options.animate({
                                left: '-300px'
                            }, 250);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.isOut = false;
                        },
                        click: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleStart = (new Date()).getTime();

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleDelta = NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleStart - NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleLast;

                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleDelta > 300) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggle();
                                NerdBoard.UIHandler.leftBar.internalUIS.addUI.closeOtherUIS();
                            }

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleLast = NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.toggleStart;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textSizeUI: {
                        btn: $('#leftTextSizeUIBtn'),
                        options: $('#leftTextSizeUIOptions'),
                        input: $('#leftTextSizeUISlider'),
                        slider: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.input.slider({
                                min  : 5,
                                max  : 60,
                                value: 40,
                                step: 1,
                                tooltip: 'hide'
                            });
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.input.on('slideStart', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.input.on('slide', function(event) {
                                $('#textSizeSliderVal').text(event.value);
                                NerdBoard.textSize = event.value;

                            });
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.input.on('slideStop', function() {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.close();
                            });
                        },
                        isOut: false,
                        toggle: function() {
                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.isOut) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.close();
                            }
                            else {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.open();
                            }
                        },
                        open: function() {
                            NerdUIS.leftBar.internalUIS.addUI.activeInternalUI = 'textSizeUI';
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.options.animate({
                                    left: '80px'
                                }, 300);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.isOut = true;
                        },
                        close: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.options.animate({
                                left: '-170px'
                            }, 250);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.isOut = false;
                        },
                        click: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleStart = (new Date()).getTime();

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleDelta = NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleStart - NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleLast;

                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleDelta > 300) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggle();
                                NerdBoard.UIHandler.leftBar.internalUIS.addUI.closeOtherUIS();
                            }

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleLast = NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.toggleStart;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    },
                    textInputUI: {
                        btn: $('#leftTextInputUIBtn'),
                        options: $('#leftTextInputUIOptions'),
                        isOut: false,
                        toggle: function() {
                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.isOut) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.close();
                            }
                            else {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.open();
                            }
                        },
                        open: function() {
                            NerdUIS.leftBar.internalUIS.addUI.activeInternalUI = 'textInputUI';
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.options.animate({
                                    left: '80px'
                                }, 300);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.isOut = true;
                        },
                        close: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.options.animate({
                                left: '-170px'
                            }, 250);
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.isOut = false;
                        },
                        click: function() {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleStart = (new Date()).getTime();

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleDelta = NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleStart - NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleLast;

                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleDelta > 300) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggle();
                                NerdBoard.UIHandler.leftBar.internalUIS.addUI.closeOtherUIS();
                            }

                            NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleLast = NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.toggleStart;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                displayOptions: function() {
                    NerdUIS.leftBar.switchUI('addUI');
                    NerdUIS.leftBar.leftSideBar.animate({
                        height: '320px'
                    }, 200);
                },
                styleUI: function() {
                    //var eraseColor = NerdBoardOriginal.getColorComponents(NerdBoardOriginal.theme.bg);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.colors.neonBlack);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.addUI.internalUIS.shapeUI.btn, navBg);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textSizeUI.btn, navBg);
                    NerdBoard.styleEle(NerdUIS.leftBar.internalUIS.addUI.internalUIS.textInputUI.btn, navBg);
                },
                closeOtherUIS: function() {
                    for(var UI in NerdUIS.leftBar.internalUIS.addUI.internalUIS) {
                        if(UI !== NerdUIS.leftBar.internalUIS.addUI.activeInternalUI) {
                            if(NerdUIS.leftBar.internalUIS.addUI.internalUIS[UI].isOut) {
                                NerdUIS.leftBar.internalUIS.addUI.internalUIS[UI].close();
                            }
                            if(NerdUIS.leftBar.internalUIS.toolsUI.isOut) {
                                NerdUIS.leftBar.internalUIS.toolsUI.close();
                            }
                        }
                    }
                },
                closeUIS: function() {
                    for(var UI in NerdUIS.leftBar.internalUIS.addUI.internalUIS) {
                        if(NerdUIS.leftBar.internalUIS.addUI.internalUIS[UI].isOut) {
                            NerdUIS.leftBar.internalUIS.addUI.internalUIS[UI].close();
                        }
                    }
                }
            }
        },
        toolSelected: function() {
            NerdUIS.leftBar.updateUIOptions();

            if(NerdUIS.leftBar.internalUIS.toolsUI.isOut) {
                NerdUIS.leftBar.internalUIS.toolsUI.close();
            }
        },
        updateUIOptions: function() {
            switch (NerdBoard.activeMode) {
                case 'draw':
                    NerdUIS.leftBar.internalUIS.drawUI.displayOptions();
                    break;
                case 'erase':
                    NerdUIS.leftBar.internalUIS.eraseUI.displayOptions();
                    break;
                case 'move':
                    NerdUIS.leftBar.internalUIS.moveUI.displayOptions();
                    break;
                case 'add':
                    NerdUIS.leftBar.internalUIS.addUI.displayOptions();
                    break;
            }
        },
        switchUI: function(selectedUI) {
            for(var UI in NerdUIS.leftBar.internalUIS) {
                if(UI !== 'toolsUI' && UI !== 'menuUI') {
                    if(UI !== selectedUI) {
                        NerdUIS.leftBar.internalUIS[UI].layer.css('opacity', '0');
                        NerdUIS.leftBar.internalUIS[UI].layer.css('z-index', '-1');
                    }
                    else {
                        NerdUIS.leftBar.internalUIS[UI].layer.css('opacity', '1');
                        NerdUIS.leftBar.internalUIS[UI].layer.css('z-index', '1');
                        NerdUIS.leftBar.activeUI = UI;
                        NerdUIS.leftBar.styleUI();
                    }
                }
            }
        },
        styleUI: function() {
            for(var UI in NerdUIS.leftBar.internalUIS) {
                var id = UI.slice(UI.length - 2, UI.length);
                if(id == 'UI') {
                    if(UI == NerdUIS.leftBar.activeUI) {
                        NerdUIS.leftBar.internalUIS[UI].styleUI();
                    }
                }
            }
        },
        closeUIS: function() {
            for(var UI in NerdUIS.leftBar.internalUIS) {

                if(NerdUIS.leftBar.internalUIS[UI].isOut) {
                    NerdUIS.leftBar.internalUIS[UI].close();
                }


                for(var internalUI in NerdUIS.leftBar.internalUIS[UI].internalUIS) {

                    if(NerdUIS.leftBar.internalUIS[UI].internalUIS[internalUI].isOut) {
                        NerdUIS.leftBar.internalUIS[UI].internalUIS[internalUI].close();
                    }
                }
            }
        }
    };

    return NerdUIS;
}());