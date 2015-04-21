var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, innerHeight = window.innerHeight *.7, innerWidth = window.innerWidth *.7;
var buttons = [$('#button0'), $('#button1'), $('#button2'), $('#button3')];


function onYouTubeIframeAPIReady() {
    makeNewPlayer('6-mH38nPEyg');
}


function onPlayerReady(event) {
    event.target.playVideo();
}


function onPlayerStateChange(event) {
    if (event.data == 0) {
        var index = currentIndex();
        switchVideo(index);
    }
}


function currentIndex() {
    var currentIndex;

    for(var i = 0; i < buttons.length; i++){
        if(buttons[i][0].className == 'border'){
            currentIndex = i;
        }
    }

    return currentIndex;
}


function switchVideo(index) {
    if(index < buttons.length - 1){
        buttons[index + 1].click();
    }
    else{
        buttons[0].click();
    }
}


function changeSrc(string) {
    var container = document.getElementById("container");
    container.removeChild(container.children[0]);

    var div = document.createElement('div');
    div.id = 'player';
    container.appendChild(div);

    makeNewPlayer(string);
}


function makeNewPlayer(src) {
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


buttons[0].click(function() {
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != buttons[0]){
            buttons[i].removeClass('border');
        }
        else{
            buttons[0].addClass('border');
        }
    }

    changeSrc('6-mH38nPEyg');
});


buttons[1].click(function() {
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != buttons[1]){
            buttons[i].removeClass('border');
        }
        else{
            buttons[1].addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});


buttons[2].click(function() {
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != buttons[2]){
            buttons[i].removeClass('border');
        }
        else{
            buttons[2].addClass('border');
        }
    }

    changeSrc('nnVlM9XIijI');
});


buttons[3].click(function() {
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != buttons[3]){
            buttons[i].removeClass('border');
        }
        else{
            buttons[3].addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});