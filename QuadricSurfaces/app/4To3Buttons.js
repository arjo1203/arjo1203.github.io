R12Btn.click(function(){
    R12Animation = onClick(R12, R12Btn, R12Animation);
});




R13Btn.click(function(){
    R13Animation = onClick(R13, R13Btn, R13Animation);
});





R14Btn.click(function(){
    R14Animation = onClick(R14, R14Btn, R14Animation);
});





R23Btn.click(function(){
    R23Animation = onClick(R23, R23Btn, R23Animation);
});




R24Btn.click(function(){
    R24Animation = onClick(R24, R24Btn, R24Animation);
});





R34Btn.click(function(){
    R34Animation = onClick(R34, R34Btn, R34Animation);
});




wBtn.click(function(){
    wAnimation = onClick(w, wBtn, wAnimation);
});



function onClick(slider, idBtn, idAnimation){
    var playing;

    if(!idAnimation){
        slider.off('slide', _4to3onSlide);
        slider.on('slide', onAnimate);

        idBtn[0].innerHTML = '&#9616;&nbsp;&#9612;';

        playing = true;
    }
    else{
        slider.off('slide', onAnimate);
        slider.on('slide', _4to3onSlide);

        idBtn[0].innerHTML = '&#9658;';

        playing = false;
    }

    return playing;
}