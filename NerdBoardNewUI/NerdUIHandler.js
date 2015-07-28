NerdBoard.UIHandler = (function() {
    var sideBar = {
        sideBarEle: $('#sideBar'),
        activeToolView: $('#toolsView'),
        activeTool: $('#activeTool'),
        toolBtns: {
            drawTool: $('#drawTool'),
            eraseTool: $('#eraseTool'),
            moveTool: $('#moveTool'),
            addTool: $('#addTool')
        },
        selectedTool: 'drawTool',
        activeUI: 'drawUI',
        toolsUI: {
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
                        left: '215px'
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
                                step: 1
                            });
                            sideBar.UIS.drawUI.options.width.input.on('slide', function(event) {
                                $('#penWidth').text(event.value);
                                NerdBoard.penStroke = event.value;

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
                                left: '-120px'
                            }, 250);
                            sideBar.UIS.drawUI.options.width.isOut = false;
                        },
                        toggleStart: 0,
                        toggleDelta: 0,
                        toggleLast: 0
                    }
                },
                closeOtherOptions: function() {
                    for(var option in sideBar.UIS.drawUI.options) {
                        if(option !== sideBar.UIS.drawUI.activeOption) {
                            if(sideBar.UIS.drawUI.options[option].isOut) {
                                sideBar.UIS.drawUI.options[option].close();
                            }
                        }
                    }
                },
                displayOptions: function(){
                    sideBar.switchUI('drawUI');
                    sideBar.sideBarEle.animate({
                        height: '210px'
                    }, 100);
                },
                styleUI: function() {
                    var penColor = NerdBoard.getColorComponents(NerdBoard.theme.penColor);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.theme.navBg);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.colors.tigger, navBg);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.width.tigger, navBg);
                    NerdBoard.styleEle(sideBar.activeToolView, penColor);
                    NerdBoard.styleEle(sideBar.UIS.drawUI.options.colors.activeColor, penColor);
                }
            },
            eraseUI: {
                ele: $('#eraseToolOptions'),
                options: {
                    width: {
                        input: $('#eraseSlider'),
                        slider: function() {
                            sideBar.UIS.eraseUI.options.width.input.slider({
                                min  : 1,
                                max  : 50,
                                value: 30,
                                step: 5,
                                orientation: 'vertical'
                            });
                            sideBar.UIS.eraseUI.options.width.input.on('slide', function(event) {
                                $('#eraseSliderVal').text(event.value);
                                NerdBoard.eraseStroke = event.value;
                            });
                        }
                    }
                },
                displayOptions: function() {
                    sideBar.switchUI('eraseUI');
                    sideBar.sideBarEle.animate({
                        height: '285px'
                    }, 200);
                },
                styleUI: function() {
                    var eraseColor = NerdBoard.getColorComponents(NerdBoard.theme.bg);
                    var navBg = NerdBoard.getColorComponents(NerdBoard.theme.navBg);
                    NerdBoard.styleEle($('#eraseWidth'), navBg);
                    NerdBoard.styleEle(sideBar.activeToolView, eraseColor);
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
        }
    };
    
    
    


    sideBar.toolsUI.tigger.click(function() {
        sideBar.toolsUI.toggleStart = (new Date()).getTime();

        sideBar.toolsUI.toggleDelta = sideBar.toolsUI.toggleStart - sideBar.toolsUI.toggleLast;

        if(sideBar.toolsUI.toggleDelta > 300) {
            sideBar.toolsUI.toggle();
        }

        sideBar.toolsUI.toggleLast = sideBar.toolsUI.toggleStart;
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

    sideBar.toolBtns.drawTool.click(function() {
        sideBar.selectedTool = 'drawTool';
        sideBar.setToolMode();
        NerdBoard.activateDrawMode();
        $('#toolIcon').attr('src', 'icons/pencil.png');
    });

    sideBar.toolBtns.eraseTool.click(function() {
        sideBar.selectedTool = 'eraseTool';
        sideBar.setToolMode();
        NerdBoard.activateEraseMode();
        $('#toolIcon').attr('src', 'icons/eraser.png');
    });

    sideBar.toolBtns.moveTool.click(function() {
        sideBar.selectedTool = 'moveTool';
        sideBar.setToolMode();
        $('#toolIcon').attr('src', 'icons/hand.png');
    });

    sideBar.toolBtns.addTool.click(function() {
        sideBar.selectedTool = 'addTool';
        sideBar.setToolMode();
        $('#toolIcon').attr('src', 'icons/add.png');
    });



    sideBar.UIS.drawUI.options.width.slider();
    sideBar.UIS.eraseUI.options.width.slider();



    function centerDiv(outerDiv, innerDiv, left, top) {
        var inWidth = innerDiv[0].clientWidth * left, inHeight = innerDiv[0].clientHeight * top;
        var outWidth = outerDiv[0].clientWidth * left, outHeight = outerDiv[0].clientHeight * top;

        innerDiv[0].style.top = Math.round(outHeight - inHeight).toString() + 'px';
        innerDiv[0].style.left = Math.round(outWidth - inWidth).toString() + 'px';
    }

    return sideBar;
}());