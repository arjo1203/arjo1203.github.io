var gw;
var startTime;
function touchHandler(ev) {
    if (gw == null || !gw.IsConnected()) { return; }
    ev.preventDefault(); //prevent the browser from doing its default actions with touch-gestures and prevent mouse events from firing.
    var eType = null;
    if (ev.type === 'touchmove') {
        eType = GestureWorks.TouchStatus.TOUCH_UPDATE;
    } else if (ev.type === 'touchstart') {
        eType = GestureWorks.TouchStatus.TOUCH_ADDED;
    } else if (ev.type === 'touchend') {
        eType = GestureWorks.TouchStatus.TOUCH_REMOVED;
    }

    if (eType != null) {
        var currentTime = new Date().getTime() - startTime;
        var touches = ev.changedTouches;
        var touch;
        var i;
        //iterate through each touch and inform gestureworks.
        for (i = 0; i < touches.length; i++) {
            touch = touches[i];
            gw.addEvent(touch.identifier, touch.clientX / window.innerWidth, touch.clientY / window.innerHeight, eType, currentTime, touch.radiusX, touch.radiusY);
        }
    }
}

window.onload = function () {
    gw = new GestureWorks("ws://199.17.28.238:3000/");
    startime = new Date().getTime();
    gw.onSocketOpen = function(e) {
        console.log("Gestureworks socket opened.");
        gw.registerTouchObject(touchObjId);
        document.addEventListener('touchstart', touchHandler, false);
        document.addEventListener('touchmove', touchHandler, false);
        document.addEventListener('touchend', touchHandler, false);
    };
    gw.onSocketError = function(e) {
        console.log("Gestureworks error: "+e);
    };
    gw.onSocketClose = function(e) {
        console.log("Gestureworks socket closed.");
    };
    gw.connect();
};