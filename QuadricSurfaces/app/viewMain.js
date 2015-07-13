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
    leftView = $('#leftView'),
    rightView = $('#rightView');



onStart();



function onStart(){
    view.resizeView();

    window.addEventListener('resize', onWindowResize, false);
}



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

    onFourResize();
    onThreeResize();
    onTwoResize();
}


function onTwoResize(){
    twoCamera.aspect = leftView[0].clientWidth / (leftView[0].clientHeight * .475);
    twoCamera.updateProjectionMatrix();
    twoRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight * .475);

    twoRender();
}


function onThreeResize(){
    threeCamera.aspect = leftView[0].clientWidth / (leftView[0].clientHeight *.475);
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(leftView[0].clientWidth, leftView[0].clientHeight * .475);

    threeRender();
}


function onFourResize(){
    fourCamera.aspect = rightView[0].clientWidth / (rightView[0].clientHeight * .95);
    fourCamera.updateProjectionMatrix();
    fourRenderer.setSize(rightView[0].clientWidth, rightView[0].clientHeight *.95);

    fourRender();
}