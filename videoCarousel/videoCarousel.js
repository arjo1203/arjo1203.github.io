var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, videosDiv = document.getElementById('videos'), videos = $('#videos')[0], mainDiv = document.getElementById('container');
var inputPlayList = document.getElementById('playList'), go = $('#Go'), logoDiv = $('#logoDiv'), logo = $('#logoImg');


window.addEventListener('resize', onWindowResize, false);



go.click( function(){
    first = true;

    inputPlayList.placeholder = inputPlayList.value;
    //console.log(inputPlayList);
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
    //console.log(player.getPlaylist());
});



function onYouTubeIframeAPIReady(){

    player = new YT.Player('player', {
        height: '82%',
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
    event.target.playVideo();
    //console.log(event);
}




var first = true;
//API calls when player state changes
function onPlayerStateChange(event){
    //console.log(event);
    //loads the videoplaylist after the playlist has started playing
    if(first == true){
        while(videosDiv.children.length > 0){
            videosDiv.removeChild(videosDiv.lastChild);
        }
        //console.log(player.getPlaylist());
        setTimeout(addElement, 1000);
        first = false;
    }
    if(event.data == 0){
        //Video has ended
        changeVideo();
    }
}



//creates the sidebar elements
function addElement() {
    var playerList = player.getPlaylist();
    //console.log(playerList);
    if(!playerList){
        console.log('error');
        promptError();
    }
    else{
        videosDiv.style.width = (playerList.length * (window.innerWidth * .15)).toString() + 'px';

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

            videosDiv.appendChild(input);
        }
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
    videosDiv.style.width = (videosDiv.children.length * inWidth).toString() + 'px';
    for (var j = 0; j < videosDiv.children.length; j++) {
        videosDiv.children[j].style.width = (inWidth).toString() + 'px';
    }

    setlogoDiv(logoDiv);
}



function setlogoDiv(div){
    //console.log(div);
    var width = div[0].clientWidth, height = div[0].clientHeight, deltaHeight, deltaWidth;
    var inHeight = window.innerHeight * .85, inWidth = window.innerWidth;
    //console.log(width, height);

    //img.style.position.x = Math.round(inWidth - deltaWidth);
    div[0].style.top = Math.round(inHeight - height).toString() + 'px';
    div[0].style.right = '0';
}



setlogoDiv(logoDiv);
logo[0].style.opacity = '.8';




function promptError(){
    window.alert('Could not find Youtube Playlist. Please enter another Youtube Playlist.');
    inputPlayList.value = 'Enter a VALID Youtube Playlist, then click \'Watch!\'';
}