var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, videosDiv = $('#videos'), videos = $('#videos')[0], mainDiv = document.getElementById('container');
var inputPlayList = document.getElementById('playList'), logoDiv = $('#logoDiv'), logo = $('#logo'), left = $('#left'), right = $('#right');
var rightOffSet = 0, leftOffSet = 0, videoWidth = Math.round(window.innerWidth * .15), animateIndex = 0, maxLength;
var numMiddle = Math.round(window.innerWidth / videoWidth),
    numRight, numLeft = 0, lastOffSet = (videoWidth * numMiddle) - window.innerWidth;
var btns = $('#btns');
console.log(numMiddle);

window.addEventListener('resize', onWindowResize, false);

left.click(function(){
    if(numLeft > 0){
        animateIndex--;

        videosDiv.animate({
            left: '-' + (videoWidth * animateIndex).toString() + 'px'
        }, 100);

        numRight++;
        numLeft--;
    }
});

right.click(function(){
    if(numRight > 0){
        animateIndex++;

        videosDiv.animate({
            left: '-' + (videoWidth * animateIndex).toString() + 'px'
        }, 100);

        numLeft++;
        numRight--;
    }
    else{
        videosDiv.animate({
            left: '-' + (videoWidth * animateIndex + lastOffSet).toString() + 'px'
        }, 100);
    }
});



function onYouTubeIframeAPIReady(){

    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: 'PLc9N-_6px7KFVrwxkVbgaAvvnjVGFF053', //other playlist PLScC8g4bqD47c-qHlsfhGH3j6Bg7jzFy-, PL1DD10E84B9B08A35
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




//API will call this function when player is ready
function onPlayerReady(event){
    console.log(event);
    event.target.playVideo();
}




//API calls when player state changes
function onPlayerStateChange(event){
    console.log(event);
    if(event.data == 0){
        //Video has ended
        changeVideo();
    }
    if(event.data == 1){
        addElement();
    }
}



//creates the sidebar elements
function addElement() {
    maxLength = player.getPlaylist().length;
    numRight = maxLength - numMiddle - numLeft;

    var playerList = player.getPlaylist();
    //console.log(playerList);
    videosDiv[0].style.width = (playerList.length * (window.innerWidth * .15)).toString() + 'px';

    var inWidth = Math.round(window.innerWidth * .15), inHeight = Math.round(window.innerHeight * .15);


    for (var j = 0; j < playerList.length; j++) {
        var input = document.createElement('input');

        input.type = 'image';
        input.id = j.toString();
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';
        input.style.width = (inWidth).toString() + 'px';
        input.style.height = (inHeight).toString() + 'px';
        input.onclick = function(){

            for(var i = 0; i < videos.children.length; i++){
                if(videos.children[i].id != this.id){
                    $('#' + videos.children[i].id).removeClass('border');
                }
                else{
                    $('#' + videos.children[i].id).addClass('border');
                }
            }

            player.loadVideoById(playerList[parseInt(this.id)]);
        };

        if(j == 0){
            //console.log(input);
            input.className = 'border';
        }

        videosDiv[0].appendChild(input);
    }
}



function changeVideo(){
    var videoIndex = findVideo(videos);

    if(videoIndex == videos.children.length - 1){
        var nextVideo = $('#0');
    }
    else{
        var nextVideo = $('#' + videos.children[videoIndex + 1].id)[0];
    }

    nextVideo.click();
}



function findVideo(div){
    for(var i = 0; i < div.children.length; i ++){
        var video = div.children[i];

        if(video.className == 'border'){
            //console.log('found');
            var index = i;
        }
    }

    return index;
}



function onWindowResize(){
    var inWidth = window.innerWidth * .15;
    videoWidth = Math.round(window.innerWidth * .15)

    for (var j = 0; j < videosDiv[0].children.length; j++) {
        videosDiv[0].children[j].style.width = (inWidth).toString() + 'px';
    }

    videosDiv[0].style.width = (videosDiv[0].children.length * inWidth).toString() + 'px';

    setlogoDiv(logoDiv);
}



function setlogoDiv(div, position){
    var width = div[0].clientWidth / 2, height = div[0].clientHeight, deltaHeight, deltaWidth;
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



setlogoDiv(logoDiv, 'right');
setlogoDiv(btns, 'center');
logo[0].style.opacity = .8;