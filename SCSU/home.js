//For centering logo
var logoDiv = $('.logoContainer'), glowDiv = $('.glow');

//For animation
var videos = $('.videoBorder'), ISELF = $('.ISELF_Border'), Campus = $('.campusBorder'), Projects = $('.projectBorder'), logo = $('#homeLogo'),
    videoLine = $('.videoLine'), ISELFLine = $('.ISELF_Line'), CampusLine = $('.CampusLine'), ProjectLine = $('.projectLine');
var glowing, counter = 0, speedInOut = 400, glowingSpeed = 1000, riverSpeed = [150, 300, 450], fadeInSpeed = 200, fadeOutSpeed = 200;//all speeds in milliseconds
var startTime, lastTime = 0, deltaTime;



init();
function init(){
    logo.click(function(){
        startTime = (new Date()).getTime();

        if(!deltaTime){
            deltaTime = 800;
        }
        else{
            deltaTime = startTime - lastTime;
        }


        if(deltaTime > 799){

            if(counter % 2 == 0){
                stopGlowing();
                logo.removeClass('rotateBackward');
                logo.addClass('rotateForward');
                slideOut();
            }
            else{
                animateGlow();
                logo.removeClass('rotateForward');
                logo.addClass('rotateBackward');
                slideIn();
            }

            counter++;
        }

        lastTime = startTime;
    });


    centerLogo();
    animateGlow();
    window.addEventListener('resize', onWindowResize, false);

}




function slideOut(){
    videos.animate({
        left: '445px',
        top: '0'
    }, speedInOut);
    setTimeout(function(){
        videoLine.fadeTo(fadeOutSpeed, 1);
    }, speedInOut / 2);

    setTimeout(function(){
        ISELF.animate({
            left: '445px',
            bottom: '0'
        }, speedInOut);
    }, riverSpeed[0]);

    setTimeout(function(){
        ISELFLine.fadeTo(fadeOutSpeed, 1);
    }, (speedInOut / 2) + riverSpeed[0]);

    setTimeout(function(){
        Projects.animate({
            right: '445px',
            bottom: '0'
        }, speedInOut);
    }, riverSpeed[1]);

    setTimeout(function(){
        ProjectLine.fadeTo(fadeOutSpeed, 1);
    }, (speedInOut / 2) + riverSpeed[1]);

    setTimeout(function(){
        Campus.animate({
            right: '445px',
            top: '0'
        }, speedInOut);
    }, riverSpeed[2]);

    setTimeout(function(){
        CampusLine.fadeTo(fadeOutSpeed, 1);
    }, (speedInOut / 2) + riverSpeed[2]);
}



function slideIn(){
    CampusLine.fadeTo(fadeInSpeed, 0);
    Campus.animate({
        right: '0',
        top: '150px'
    }, speedInOut);

    setTimeout(function(){
        ProjectLine.fadeTo(fadeInSpeed, 0);
        Projects.animate({
            right: '0',
            bottom: '150px'
        }, speedInOut);
    }, riverSpeed[0]);

    setTimeout(function(){
        ISELFLine.fadeTo(fadeInSpeed, 0);
        ISELF.animate({
            left: '0',
            bottom: '150px'
        }, speedInOut);
    }, riverSpeed[1]);

    setTimeout(function(){
        videoLine.fadeTo(fadeInSpeed, 0);
        videos.animate({
            left: '0',
            top: '150px'
        }, speedInOut);
    }, riverSpeed[2]);
}




function animateGlow(){
    glow();
    glowing = setInterval(glow, glowingSpeed * 2);
}


function stopGlowing(){
    clearInterval(glowing);
    glowDiv.fadeTo(glowingSpeed / 2, 1);
}



function glow(){
    glowDiv.fadeTo(glowingSpeed, 0);

    setTimeout(function(){
        glowDiv.fadeTo(glowingSpeed, 1);
    }, glowingSpeed);
}



function onWindowResize(){
    centerLogo();
}




function centerLogo(){
    var top = .5, left = .5;
    var width = window.innerWidth, height = window.innerHeight;

    logoDiv[0].style.left = ((width * left) - (logoDiv[0].clientWidth * left)).toString() + 'px';
    logoDiv[0].style.top = ((height * top) - (logoDiv[0].clientHeight * top)).toString() + 'px';

    glowDiv[0].style.left = ((width * left) - (glowDiv[0].clientWidth * left)).toString() + 'px';
    glowDiv[0].style.top = ((height * top) - (glowDiv[0].clientHeight * top)).toString() + 'px';
}