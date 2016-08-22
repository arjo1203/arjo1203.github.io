var toolBar;

var view = {
    animateView: false,
    widths: {
        min: .4,
        max: .8,
        sideBar: .2,
        sliders: .18
    },
    views: {
        left: false,
        middle: true,
        right: false
    },
    setView: function(prop){
        for(var child in view.views){
            if(child == prop){
                view.views[child] = true;
            }
            else{
                view.views[child] = false;
            }
        }
    },
    currentView: function(){
        for(var child in view.views){
            if(view.views[child] == true){
                return child;
                break;
            }
        }
    },
    animateLeft: function(){
        view.setView('right');

        view.animateView = true;

        leftView.animate({
            width: '0'
        }, 500,
        function(){
            setTimeout(function(){
                view.animateView = false;
            }, 100);
        });

        sideBar.animate({
            left: '0'
        }, 500);

        rightView.animate({
            width: '80%'
        }, 500);
    },
    animateMiddle: function(){
        view.setView('middle');

        view.animateView = true;

        leftView.animate({
            width: '40%'
        }, 500);

        sideBar.animate({
            left: '40%'
        }, 500,
        function(){
            setTimeout(function(){
                view.animateView = false;
            }, 100);
        });

        rightView.animate({
            width: '40%'
        }, 500);
    },
    animateRight: function(){
        view.setView('left');

        view.animateView = true;

        leftView.animate({
            width: '80%'
        }, 500);

        sideBar.animate({
            left: '80%'
        }, 500);

        rightView.animate({
            width: '0'
        }, 500,
        function(){
            setTimeout(function(){
                view.animateView = false;
            }, 100);
        });
    },
    resizeView: function(){
        if(view.currentView() == 'left'){
            view.resizeLeftView();
        }
        if(view.currentView() == 'middle'){
            view.resizeBothView();
        }
        if(view.currentView() == 'right'){
            view.resizeRightView();
        }

        view.resizeSidebar();
        view.resizeSliders();
        view.centerViewButtons();
        view.centerHeaders();
    },
    resizeBothView: function(){
        leftView[0].style.width = window.innerWidth * view.widths.min;
        rightView[0].style.width = window.innerWidth * view.widths.min;

    },
    resizeRightView: function(){
        leftView[0].style.width = 0;
        rightView[0].style.width = window.innerWidth * view.widths.max;
    },
    resizeLeftView: function(){
        rightView[0].style.width = 0;
        leftView[0].style.width = window.innerWidth * view.widths.max;
    },
    resizeSidebar: function(){
        sideBar[0].style.width = window.innerWidth * view.widths.sideBar;
    },
    resizeSliders: function(){
        var sliderWidth = window.innerWidth * view.widths.sliders;

        if(sliderArray.length > 0){
            for(var i = 0; i < sliderArray.length; i ++){
                sliderArray[i].$sliderElem[0].style.width = sliderWidth;
            }
        }
        else{
            console.log('Slider Array error!');
        }
    },
    centerViewButtons: function(){
        var sideBarWidth = sideBar[0].clientWidth / 2,
            viewOptionsWidth = viewOptions[0].clientWidth / 2,
            delta = sideBarWidth - viewOptionsWidth;

        viewOptions[0].style.left = delta.toString() + 'px';
    },
    centerHeaders: function(){
        var sideBarWidth = sideBar[0].clientWidth / 2,
            quadWidth = quadHeader[0].clientWidth / 2,
            quadDelta = sideBarWidth - quadWidth,
            coneWidth = coneHeader[0].clientWidth / 2,
            coneDelta = sideBarWidth - coneWidth;

        quadHeader[0].style.left = quadDelta.toString() + 'px';
        coneHeader[0].style.left = coneDelta.toString() + 'px';
    }
};