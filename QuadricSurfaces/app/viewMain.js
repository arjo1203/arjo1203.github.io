var L = $('#L'),
    M = $('#M'),
    R = $('#R'),
    threeView = $('#threeD'),
    fourView = $('#fourD'),
    sideBar = $('#sideBar'),
    viewOptions = $('#viewOptions'),
    quadHeader = $('#quadHeader'),
    coneHeader = $('#coneHeader');



onStart();



function onStart(){
    view.resizeView();

    window.addEventListener('resize', onWindowResize, false);
}



L.click(function(evt){
    evt.preventDefault();

    if(view.currentView() == 'right'){
        toolBar.RL();
    }
    else{
        toolBar.ML();
    }

    view.animateLeft();

});


M.click(function(evt){
    evt.preventDefault();

    if(view.currentView() == 'right'){
        toolBar.RM();
    }
    else{
        toolBar.LM();
    }

    view.animateMiddle();
});


R.click(function(evt){
    evt.preventDefault();

    if(view.currentView() == 'middle'){
        toolBar.MR();
    }
    else{
        toolBar.LR();
    }

    view.animateRight();

});



function onWindowResize(){
    view.resizeView();

    onThreeResize();
    onFourResize();
}


function onThreeResize(){
    threeCamera.aspect = threeView[0].clientWidth / threeView[0].clientHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(threeView[0].clientWidth, threeView[0].clientHeight);

    threeRender();
}


function onFourResize(){
    fourCamera.aspect = fourView[0].clientWidth / fourView[0].clientHeight;
    fourCamera.updateProjectionMatrix();
    fourRenderer.setSize(fourView[0].clientWidth, fourView[0].clientHeight);

    fourRender();
}