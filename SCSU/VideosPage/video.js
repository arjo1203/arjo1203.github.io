var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, 
    videos = $('#videos'),
    logoDiv = $('#logoDiv'),
    left = $('#left'),
    right = $('#right'),
    btns = $('#btns');

var carousel = {
    widthOfCarousel: 0,
    widthOfVideos: Math.round(window.innerWidth * .15),
    heightOfVideos: Math.round(window.innerHeight * .15),
    numOfVideos: 0,
    RightVideos: 0,
    MiddleVideos: 0,
    LeftVideos: 0,
    currentIndex: 0,
    lastOffSet: 0
};



init();



function init() {
    window.addEventListener('resize', onWindowResize, false);

    setlogoDiv(logoDiv, 'right');
    setlogoDiv(btns, 'center');
}



function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: 'PLc9N-_6px7KFVrwxkVbgaAvvnjVGFF053',
            'controls': 0,
            'autohide': 1,
            'rel': 0
        },
        events:{
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}




function onPlayerReady(event) {
    event.target.playVideo();
}




function onPlayerStateChange(event) {
    if(event.data == 0){
        changeVideo();
    }
    if(event.data == 1){
        addElement();
    }
}



//creates the sidebar elements
function addElement() {
    var playerList = player.getPlaylist();

    carousel.MiddleVideos = Math.round(window.innerWidth / carousel.widthOfVideos);
    carousel.lastOffSet = (carousel.widthOfVideos * carousel.MiddleVideos) - window.innerWidth;
    carousel.numOfVideos = player.getPlaylist().length;
    carousel.widthOfCarousel = Math.round(carousel.numOfVideos * carousel.widthOfVideos);
    carousel.RightVideos = carousel.numOfVideos - carousel.MiddleVideos;//Giving more time for carousel.MiddleVideos to be initialized

    videos[0].style.width = (carousel.widthOfCarousel).toString() + 'px';


    for (var j = 0; j < playerList.length; j++) {
        var input = document.createElement('input');

        input.type = 'image';
        input.id = j.toString();
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';
        input.style.width = (carousel.widthOfVideos).toString() + 'px';
        input.style.height = (carousel.heightOfVideos).toString() + 'px';
        input.onclick = function(){

            for(var i = 0; i < videos[0].children.length; i++){
                if(videos[0].children[i].id != this.id){
                    $('#' + videos[0].children[i].id).removeClass('border');
                }
                else{
                    $('#' + videos[0].children[i].id).addClass('border');
                }
            }

            player.loadVideoById(playerList[parseInt(this.id)]);
        };

        if(j == 0){
            input.className = 'border';
        }

        videos[0].appendChild(input);
    }
}



function changeVideo() {
    var videoIndex = findVideo(videos[0]);

    if(videoIndex == videos[0].children.length - 1){
        var nextVideo = $('#0');
    }
    else{
        var nextVideo = $('#' + videos[0].children[videoIndex + 1].id)[0];
    }

    nextVideo.click();
}



function findVideo(div) {
    for(var i = 0; i < div.children.length; i ++){
        var video = div.children[i];

        if(video.className == 'border'){
            var index = i;
        }
    }

    return index;
}



function onWindowResize() {
    carousel.widthOfVideos = Math.round(window.innerWidth * .15);

    for (var j = 0; j < videos[0].children.length; j++) {
        videos[0].children[j].style.width = (carousel.widthOfVideos).toString() + 'px';
    }

    videos[0].style.width = (Math.round(carousel.numOfVideos * carousel.widthOfVideos)).toString() + 'px';

    setlogoDiv(logoDiv);
    setlogoDiv(btns, 'center');
}



function setlogoDiv(div, position) {
    var width = div[0].clientWidth / 2, height = div[0].clientHeight;
    var inHeight = window.innerHeight * .85, inWidth = window.innerWidth / 2;

    div[0].style.top = Math.round(inHeight - height).toString() + 'px';

    switch(position){
        case 'left':
            div[0].style.left = '0';
            break;
        case 'center':
            div[0].style.left = Math.round(inWidth - width).toString() + 'px';
            break;
        case 'right':
            div[0].style.right = '0';
            break;
    }
}




left.click(function() {
    if(carousel.LeftVideos > 0){
        carousel.currentIndex--;

        videos.animate({
            left: '-' + (carousel.widthOfVideos * carousel.currentIndex).toString() + 'px'
        }, 100);

        carousel.RightVideos++;
        carousel.LeftVideos--;
    }
    else{
        videos.animate({
            left: '0'
        }, 50);
    }
});




right.click(function() {
    if(carousel.RightVideos > 0){
        carousel.currentIndex++;

        videos.animate({
            left: '-' + (carousel.widthOfVideos * carousel.currentIndex).toString() + 'px'
        }, 100);

        carousel.RightVideos--;
        carousel.LeftVideos++;
    }
    else{
        videos.animate({
            left: '-' + (carousel.widthOfVideos * carousel.currentIndex + carousel.lastOffSet).toString() + 'px'
        }, 50);
    }
});