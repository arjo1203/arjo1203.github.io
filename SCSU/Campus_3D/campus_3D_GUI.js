var buttons = [$('#question'), $('#min'), $('#go'), $('#plus'), $('#show')], toggleShow = 0, threejs = $('#threejs');

buttons[0].click( function() {
});

buttons[1].click( function(evt) {
    //window.removeEventListener( 'mousedown', onMouseDown, true);

    distancePercent = 30;
    ZOOMOUT = true;
});

buttons[2].click( function() {
    flyCamera = true;
    distancePercent = Math.round(((intersect.distance - 5000) / intersect.distance) * 100);
});

buttons[3].click( function(evt) {
    evt.stopPropagation();
    distancePercent = 30;
    ZOOMIN = true;
});

buttons[4].click( function(evt) {
    evt.stopPropagation();

    if(toggleShow % 2 == 0){
        activeLabel = findActiveLabel();
        showLabels();
    }
    else{
        hideLabels(activeLabel);
    }

    toggleShow++;
});