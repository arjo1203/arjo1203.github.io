var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, videos = $('#videos'), mainView = $('#mainView');
var inputPlayList = document.getElementById('playList'), go = $('#Go'), logoDiv = $('#logoDiv'), logo = $('#logoImg'), afterClick = false;
var startTime, errorTimer;

var carousel = {
    reset: false,
    playlist: [],
    videos: videos[0],
    CarouselWidth: 0,
    VideosWidth: Math.round(window.innerWidth * .15),
    VideosHeight: Math.round(window.innerHeight * .15),
    findVideo: function (div) {
        for(var i = 0; i < div.children.length; i ++){
            var video = div.children[i];

            if(video.className == 'border'){
                var index = i;
            }
        }

        return index;
    },
    changeVideo: function () {
        var videoIndex = carousel.findVideo(carousel.videos);

        if(videoIndex == carousel.videos.children.length - 1){
            var nextVideo = $('#0');
        }
        else{
            var nextVideo = $('#' + carousel.videos.children[videoIndex + 1].id)[0];
        }

        nextVideo.click();
    },
    addVideos: function () {
        carousel.numOfVideos = carousel.playlist.length;
        carousel.CarouselWidth = Math.round(carousel.numOfVideos * carousel.VideosWidth);

        carousel.videos.style.width = (carousel.CarouselWidth).toString() + 'px';


        for (var j = 0; j < carousel.playlist.length; j++) {
            var input = document.createElement('input');

            input.type = 'image';
            input.id = j.toString();
            input.src = 'http://img.youtube.com/vi/' + carousel.playlist[j] + '/0.jpg';
            input.style.width = (carousel.VideosWidth).toString() + 'px';
            input.style.height = (carousel.VideosHeight).toString() + 'px';
            input.onclick = function(){

                for(var i = 0; i < carousel.videos.children.length; i++){
                    if(carousel.videos.children[i].id != this.id){
                        $('#' + carousel.videos.children[i].id).removeClass('border');
                    }
                    else{
                        $('#' + carousel.videos.children[i].id).addClass('border');
                    }
                }

                player.loadVideoById(carousel.playlist[parseInt(this.id)]);
            };

            if(j == 0){
                input.className = 'border';
            }

            carousel.videos.appendChild(input);
        }
    },
    removeVideos: function () {
        while(carousel.videos.children.length > 0){
            carousel.videos.removeChild(carousel.videos.lastChild);
        }
    },
    onResize: function () {
        carousel.VideosWidth = Math.round(window.innerWidth * .15);

        for (var j = 0; j < carousel.videos.children.length; j++) {
            carousel.videos.children[j].style.width = (carousel.VideosWidth).toString() + 'px';
        }

        carousel.videos.style.width = (Math.round(carousel.numOfVideos * carousel.VideosWidth)).toString() + 'px';

        view.width = window.innerWidth;
        view.height = window.innerHeight;
        view.positionChild(logoDiv[0]);
    }
};

var view = {
    width: mainView[0].clientWidth,
    height: mainView[0].clientHeight,
    logoPosition: {
        x: 1,
        y: .85
    },
    positionChild: function (div) {
        var divWidth = div.clientWidth, divHeight = div.clientHeight;

        var deltaY = view.positionChildInY(divHeight, view.logoPosition.y);
        div.style.top = deltaY.toString() + 'px';

        var deltaX = view.positionChildInX(divWidth, view.logoPosition.x);
        div.style.left = deltaX.toString() + 'px';
    },
    positionChildInX: function (width, percent) {
        var percentWidth = width * percent,
            percentInWidth = this.width * percent,
            delta = Math.round(percentInWidth - percentWidth);

        return delta;
    },
    positionChildInY: function (height, percent){
        var percentInHeight = this.height * percent,
            delta = Math.round(percentInHeight - height);

        return delta;
    }
};




init();



function init() {
    window.addEventListener('resize', carousel.onResize, false);
    view.positionChild(logoDiv[0]);
}



go.click( function() {
    afterClick = true;
    carousel.reset = false;
    carousel.removeVideos();

    inputPlayList.placeholder = inputPlayList.value;

    var container = document.getElementById("container");
    container.removeChild(container.children[0]);

    var div = document.createElement('div');
    div.id = 'player';
    container.appendChild(div);

    player = new YT.Player('player', {
        height: '82%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: inputPlayList.value, //other playlist PLScC8g4bqD47c-qHlsfhGH3j6Bg7jzFy-
            'controls': 0,
            'autohide': 1,
            'rel': 0
        },
        events:{
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
});



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
    if(event.data == -1){//First
        startTime = (new Date()).getTime();
        errorTimer = setTimeout(checkTimer, 500);
    }
    if(event.data == 3){//Second
        startTime = 0;
        clearTimeout(errorTimer);
    }
    if(event.data == 1 && !carousel.reset){//Third
        carousel.playlist = player.getPlaylist();
        carousel.addVideos();
        carousel.reset = true;
    }
    if(event.data == 0){
        carousel.changeVideo();
    }
}



function checkTimer(){
    if(startTime > 0){
        promptError();
    }
}




function promptError(){
    window.alert('Could not find Youtube Playlist. Please enter another Youtube Playlist.');
    inputPlayList.value = 'Enter a VALID Youtube Playlist, then click \'Watch!\'';
}