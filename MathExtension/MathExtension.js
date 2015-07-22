Math.degToRad = function(degrees) {
    return degrees * Math.PI / 180;
};


Math.radToDeg = function(radians) {
    return radians * 180 / Math.PI;
};


Math.cos2 = function(angle) {
    return Math.pow( Math.cos(angle), 2);
};


Math.sin2 = function(angle) {
    return Math.pow( Math.sin(angle), 2);
};