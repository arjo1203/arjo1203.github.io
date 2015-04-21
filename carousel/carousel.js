
var currentVideoIndex = 1, innerHeight = window.innerHeight *.7, innerWidth = window.innerWidth *.7;
var button1 = $('#button1'), button2 = $('#button2'), button3 = $('#button3'), button4 = $('#button4');

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: innerHeight,
        width: innerWidth,
        videoId: '6-mH38nPEyg',
        playerVars: {'controls': 0, 'autohide': 1},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
    console.log(player);

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    console.log(event);
    if (event.data == 0) {
        switch (currentVideoIndex){
            case 1:
                $('#button2').click();
                break;
            case 2:
                $('#button3').click();
                break;
            case 3:
                $('#button4').click();
                break;
            case 4:
                $('#button1').click();
                break;
        }
    }
}


function changeSrc(string){
    var container = document.getElementById("container");
    container.removeChild(container.children[0]);

    var div = document.createElement('div');
    div.id = 'player';
    container.appendChild(div);

    makeNewPlayer(string);
}



function makeNewPlayer(src){
    player = new YT.Player('player', {
        height: innerHeight,
        width: innerWidth,
        controls: 0,
        videoId: src,
        playerVars: {'controls': 0, 'autohide': 1},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}




button1.click(function(){
    currentVideoIndex = 1;

    button2.removeClass('border');
    button3.removeClass('border');
    button4.removeClass('border');

    changeSrc('6-mH38nPEyg');
    button1.addClass('border');
});




button2.click(function(){
    currentVideoIndex = 2;

    button1.removeClass('border');
    button3.removeClass('border');
    button4.removeClass('border');

    changeSrc('E_5o7FdxvOs');
    button2.addClass('border');
});




button3.click(function(){
    currentVideoIndex = 3;

    button1.removeClass('border');
    button2.removeClass('border');
    button4.removeClass('border');

    changeSrc('nnVlM9XIijI');
    button3.addClass('border');
});




button4.click(function(){
    currentVideoIndex = 4;

    button1.removeClass('border');
    button2.removeClass('border');
    button3.removeClass('border');

    changeSrc('E_5o7FdxvOs');
    button4.addClass('border');
});