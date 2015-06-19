xBtn.click(function(){
    xAnimation = onThreeClick(xBtn, xAnimation);
});




yBtn.click(function(){
    yAnimation = onThreeClick(yBtn, yAnimation);
});





zBtn.click(function(){
    zAnimation = onThreeClick(zBtn, zAnimation);
});





zCrossBtn.click(function(){
    zCrossAnimation = onThreeClick(zCrossBtn, zCrossAnimation);
});



function onThreeClick(idBtn, idAnimation){
    var playing;

    if(!idAnimation){

        idBtn[0].innerHTML = '&#9616;&nbsp;&#9612;';

        playing = true;
    }
    else{

        idBtn[0].innerHTML = '&#9658;';

        playing = false;
    }

    return playing;
}


function animateThreeSliderById(slider, sliderId, min, max, step){
    var nextValue;

    if(sliderValues[sliderId] >= max){
        nextValue = min;
    }
    else{
        nextValue = sliderValues[sliderId] + step;
    }

    slider.setValue(nextValue, true);

    sliderValues[sliderId] = nextValue;
}