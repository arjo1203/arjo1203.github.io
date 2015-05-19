var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, videosDiv = document.getElementById('videos'), videos = $('#videos')[0];
var inputPlayList = document.getElementById('playList'), go = $('#Go');


//Install paper on window to use like regular javascript
paper.install(window);

//Install paper on 2d canvas and set the size
paper.setup('myCanvas');
paper.view.viewSize = [window.innerWidth, window.innerHeight];



go.click( function(){
    inputPlayList.placeholder = inputPlayList.value;
    console.log(inputPlayList);
    var container = document.getElementById("container");
    container.removeChild(container.children[0]);

    var div = document.createElement('div');
    div.id = 'player';
    container.appendChild(div);
    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: inputPlayList.value, //other playlist PLScC8g4bqD47c-qHlsfhGH3j6Bg7jzFy-
            'controls': 1,
            'autohide': 1,
            'rel': 0
        },
        events:{
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });

    first = 0;
});



function onYouTubeIframeAPIReady(){

    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        playerVars: {
            listType:'playlist',
            list: 'PL1DD10E84B9B08A35', //other playlist PLScC8g4bqD47c-qHlsfhGH3j6Bg7jzFy-
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
            if(videosDiv.children.length > 0){
                while(videosDiv.children.length > 0){
                    videosDiv.removeChild(videosDiv.lastChild);
                }
            }


            addElement();
        }
        first++;
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
    videosDiv.style.width = (playerList.length * (window.innerWidth * .10)).toString() + 'px';


    for (var j = 0; j < playerList.length; j++) {
        var input = document.createElement('input');

        input.type = 'image';
        input.id = j.toString();
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';
        input.style.width = (window.innerWidth * .15).toString() + 'px';
        input.style.height = (window.innerHeight * .15).toString() + 'px';
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


window.addEventListener('resize', onWindowResize, false);



function onWindowResize(){
    paper.view.viewSize = [window.innerWidth, window.innerHeight];
    innerWidth = window.innerWidth;
    console.log(window.innerWidth);
    console.log(innerWidth);
}


// Create a raster item using the image tag with id='mona'
var backGround = new Raster('../SCSU/scsuCode.jpg');

// Move the raster to the center of the view
backGround.position = view.center;
backGround.opacity = .2;



function onFrame(event){
    console.log(event.time);
}