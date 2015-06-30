var L = $('#L'),
    M = $('#M'),
    R = $('#R'),
    threeView = $('#threeD'),
    fourView = $('#fourD'),
    twoView = $('#twoD'),
    sideBar = $('#sideBar'),
    viewOptions = $('#viewOptions'),
    quadHeader = $('#quadHeader'),
    coneHeader = $('#coneHeader'),
    leftView = $('#leftView');



onStart();



function onStart(){
    view.resizeView();

    window.addEventListener('resize', onWindowResize, false);
}



quadHeader.click(function(){
    label.toggle(label.labels[0]);
});



coneHeader.click(function(){
    label.toggle(label.labels[1]);
});



L.click(function(evt){
    evt.preventDefault();

    var currentView = view.currentView();

    //If you are already at the view that the button will display
    //then do nothing
    //if not change view and sideBar
    if(currentView !== 'left'){

        if(currentView == 'right'){
            toolBar.Conic();
        }
        else{
            toolBar.QuadricToConic();
        }


        view.animateRight();
    }
});

M.click(function(evt){
    evt.preventDefault();

    //If you are already at the view that the button will display
    //then do nothing
    //if not change view and sideBar
    var currentView = view.currentView();

    if(currentView !== 'middle') {
        toolBar.QuadricAndConic();

        view.animateMiddle();
    }
});


R.click(function(evt){
    evt.preventDefault();

    //If you are already at the view that the button will display
    //then do nothing
    //if not change view and sideBar
    var currentView = view.currentView();

    if(currentView !== 'right') {

        if (currentView == 'middle') {
            toolBar.Quadric();
        }
        else {
            toolBar.ConicToQuaric();
        }

        view.animateLeft();
    }
});



function onWindowResize(){
    view.resizeView();

    onThreeResize();
    onFourResize();
}


function onTwoResize(){
    twoCamera.aspect = leftView[0].clientWidth / (leftView[0].clientHeight *.5);
    twoCamera.updateProjectionMatrix();
    twoRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight *.5);

    twoRender();
}


function onThreeResize(){
    threeCamera.aspect = leftView[0].clientWidth / (leftView[0].clientHeight *.5);
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight * .5);

    threeRender();
}


function onFourResize(){
    fourCamera.aspect = fourView[0].clientWidth / fourView[0].clientHeight;
    fourCamera.updateProjectionMatrix();
    fourRenderer.setSize(fourView[0].clientWidth, fourView[0].clientHeight);

    fourRender();
}