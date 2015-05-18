//use youtube api to create video
//video should have a playlist...
//youtube should be disabled so that user cant go to youtube
//use pause and play buttons to allow user to still take control of a video

//loads youtube api script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//create iframe and youtube player
//playlist http://stackoverflow.com/questions/9313216/example-youtube-playlist-code
var player;
function onYouTubeIframeAPIReady(){

    player = new YT.Player('player', {
        height: '85%',
        width: '100%',
        //playlistId: 'PL1DD10E84B9B08A35'
        //videoId: '_nQDU7HOStc', //player.loadVideoById(videoId:String, startSeconds:Number, suggestedQuality:String):Void
        playerVars: {
            listType:'playlist',
            list: 'PL1DD10E84B9B08A35', //'PLwyv96l14uwm0HoKlOgfJ7vX7oJAEQssf' //'PL1DD10E84B9B08A35'
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
}

//API calls when player state changes
//playing video = state=1
var done= false;
function onPlayerStateChange(event){

    if (event.data == YT.PlayerState.PLAYING && !done){
        //setTimeout(stopVideo, 6000);
        done=true;

        //loads the videoplaylist sidebar elements
        addElement();
    }
    //checkign that the data is passed
    if(event.data == 1){
        var playing = event.data;
        console.log("is playing " + playing);

    }
    if(event.data == 2){
        //trying to set data to an object to pass into a button
        var paused = event.data;
        console.log("is paused " + paused);

    }
    if(event.data == 0){
        var ended = event.data;
        console.log("vid ended " + ended);
    }

}

var buttonsDiv = document.getElementById('buttons');

//creates the sidebar elements
function addElement( ) {


    var playerList = player.getPlaylist();
    buttonsDiv.style.width = (playerList.length * 150).toString() + 'px';


    for (var j = 0; j < playerList.length; j++) {
        var input = document.createElement('input');

        input.type = 'image';
        input.id = j.toString();
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';
        input.style.width = '150px';
        input.style.height = '150px';
        input.onclick = function(){
            player.loadVideoById(playerList[parseInt(this.id)]);
        };

        buttonsDiv.appendChild(input);
    }
}