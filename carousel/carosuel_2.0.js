
var innerHeight = window.innerHeight *.7, innerWidth = window.innerWidth *.7;
var button0 = $('#button0'), button1 = $('#button1'), button2 = $('#button2'), button3 = $('#button3'),
    button4 = $('#button4'), button5 = $('#button5');
var buttons = [button0, button1, button2, button3, button4, button5];

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
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    console.log($('#carosuel'));
    if (event.data == 0) {
        var index = currentIndex();
        switchVideo(index);
    }
}



function currentIndex(){
    var currentIndex;

    for(var i = 0; i < buttons.length; i++){
        if(buttons[i][0].className == 'border'){
            currentIndex = i;
        }
    }

    return currentIndex;
}


function switchVideo(index){
    if(index < buttons.length - 1){
        buttons[index + 1].click();
    }
    else{
        buttons[0].click();
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
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}




button0.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button0){
            buttons[i].removeClass('border');
            //console.log(buttons[i]);
        }
        else{
            button0.addClass('border');
        }
    }

    changeSrc('6-mH38nPEyg');
});




button1.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button1){
            buttons[i].removeClass('border');
            //console.log(buttons[i]);
        }
        else{
            button1.addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});




button2.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button2){
            buttons[i].removeClass('border');
            //console.log(buttons[i]);
        }
        else{
            button2.addClass('border');
        }
    }

    changeSrc('nnVlM9XIijI');
});




button3.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button3){
            buttons[i].removeClass('border');
        }
        else{
            button3.addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});




button4.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button4){
            buttons[i].removeClass('border');
        }
        else{
            button4.addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});




button5.click(function(){
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i] != button5){
            buttons[i].removeClass('border');
        }
        else{
            button5.addClass('border');
        }
    }

    changeSrc('E_5o7FdxvOs');
});