var toolBar;

var view = {
    animateView: false,
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
                label.off();
            }, 100);
        });

        sideBar.animate({
            left: '0'
        }, 500);

        fourView.animate({
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
                label.on();
            }, 100);
        });

        fourView.animate({
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

        fourView.animate({
            width: '0'
        }, 500,
        function(){
            setTimeout(function(){
                view.animateView = false;
                label.off();
            }, 100);
        });
    },
    resizeView: function(){
        if(view.currentView() == 'left'){
            console.log('debug');
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
        leftView[0].style.width = window.innerWidth * .4;
        fourView[0].style.width = window.innerWidth * .4;

    },
    resizeRightView: function(){
        leftView[0].style.width = 0;
        fourView[0].style.width = window.innerWidth * .8;
    },
    resizeLeftView: function(){
        fourView[0].style.width = 0;
        leftView[0].style.width = window.innerWidth * .8;
    },
    resizeSidebar: function(){
        sideBar[0].style.width = window.innerWidth * .2;
    },
    resizeSliders: function(){
        var sliderWidth = window.innerWidth * .18;

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