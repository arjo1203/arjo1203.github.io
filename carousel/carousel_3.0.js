/**
 * Created by ICe on 4/22/15.
 */

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
        height: '1000',
        width: '1580',
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


//jquery button clicks
$('.play').click(function(){
    player.playVideo();
});

$('.pause').click(function(){
    player.pauseVideo();
});

$(".stop").click(function(){
    player.stopVideo();
});

//ff click plays next video
$(".ff").click(function(){
    player.nextVideo();
});

$(".rw").click(function(){
    player.previousVideo();
    //  This function loads and plays the specified video in the playlist.
});


var buttonsDiv = document.getElementById('buttons');

//creates the sidebar elements
function addElement( ) {


    var playerList = player.getPlaylist();


    for (var j = 0; j < playerList.length; j++) {


        var div = document.createElement('div');
        var button = document.createElement('button');
        var input = document.createElement('input');

        div.setAttribute("id", "jDivs"/*+j*/);
        input.setAttribute("id", "jDivs"/*+j*/);

        div.setAttribute("class", "Vid" + j);
        input.setAttribute("class", "Vid" + j);

        var videoArray = [playerList];

        console.log("vide array " + videoArray[j]);


        input.type = 'image';
        input.src = 'http://img.youtube.com/vi/' + playerList[j] + '/0.jpg';


        button.appendChild(input);
        div.appendChild(button);
        buttonsDiv.appendChild(div);

        console.log(player.getPlaylistIndex());


//sidebar img click
        $('.Vid' + j).click(makeFunction(j));

        function makeFunction(x) {

            return function () {
                otherFunction(x);
            }
        }

    }


    //video div index encapsulation
    function otherFunction(x) {

        var playList = player.getPlaylist();
        var videoArray = [playerList];

        console.log(x);
        player.loadVideoById(videoArray[0][x]);
        console.log(videoArray[0][x]);


        $(".ff").click(ffFunction(x));
        $(".rw").click(rwFunction(x));

        //fast forward function
        function ffFunction(k) {

            return function () {
                k++;
                fFunction(k);
            }
        }

//rewind function
        function rwFunction(k) {

            return function () {
                k--;
                fFunction(k);
            }
        }

    }

    //used for fastforward and rewind buttons while in player sidebar
    function fFunction(k) {
        var playList = player.getPlaylist();
        var videoArray = [playerList];

        // var newPlayed = player.getPlaylistIndex()+5;

        console.log("k before " + k);

        if (k <= 0) {

            player.loadVideoById(videoArray[0][playerList.length - 1]);

        }
        else if (k >= playerList.length) {
            console.log("INTEL");
            player.loadVideoById(videoArray[0][0]);

        }
        else {
            player.loadVideoById(videoArray[0][k]);

        }

    }
}

