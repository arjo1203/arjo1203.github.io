var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, videosDiv = document.getElementById('videos'), videos = $('#videos')[0];




function onYouTubeIframeAPIReady(){

    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: 'PL1DD10E84B9B08A35', //'PLwyv96l14uwm0HoKlOgfJ7vX7oJAEQssf' //'PL1DD10E84B9B08A35'
            'controls': 1,
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
}




first = 0;
//API calls when player state changes
function onPlayerStateChange(event){
    if (event.data == YT.PlayerState.PLAYING){
        //loads the videoplaylist after the playlist has started playing
        if(first == 0){
            addElement();
        }
        first++;
    }
    if(event.data == 0){
        var ended = event.data;
        changeVideo();
        //console.log("vid ended " + ended);
        //console.log(videosDiv);
    }

}



//creates the sidebar elements
function addElement() {
    var playerList = player.getPlaylist();
    //console.log(playerList);
    videosDiv.style.width = (playerList.length * 150).toString() + 'px';


    for (var j = 0; j < playerList.length; j++) {
        var input = document.createElement('input');

        input.type = 'image';
        input.id = j.toString();
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';
        input.style.width = '150px';
        input.style.height = '150px';
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