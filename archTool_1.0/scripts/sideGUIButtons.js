$("#terrainMap").slider();
$("#terrainMap").on('slide', function(slideEvt) {
    $("#terrainMapVal").text(slideEvt.value);
    paper.project.activeLayer.children[0].opacity = slideEvt.value/100;

    _3dTerrainMapofWorkSpace();
});




$("#heightMap").slider();
$("#heightMap").on('slide', function(slideEvt) {
    $("#heightMapVal").text(slideEvt.value);
    paper.project.activeLayer.children[1].opacity = slideEvt.value/100;

    _3dTerrainMapofWorkSpace();
});




$("#lineWidth").slider();
$("#lineWidth").on('slide', function(slideEvt) {
    $("#lineWidthVal").text(slideEvt.value);
    changePathWidth(slideEvt.value);

    _3dTerrainMapofWorkSpace();
});




$("#lineOpacity").slider();
$("#lineOpacity").on('slide', function(slideEvt) {
    $("#lineOpacityVal").text(slideEvt.value);
    changePathOpacity(slideEvt.value/100);
//    console.log(paper.project.activeLayer.children);
    
    _3dTerrainMapofWorkSpace();
});




$("#activateLine").on('click', function() {
    console.log("hello");
    tools.drawing.activate();
});




$("#terrainRelief").slider();
$("#terrainRelief").on('slide', function(slideEvt) {
    $("#terrainReliefVal").text(slideEvt.value);
    _3dTerrain.scale.z = slideEvt.value/100;
    render();
});




$("#on_off").bootstrapSwitch('size', 'mini').on('switchChange.bootstrapSwitch', function(event, state){
    gridVisible(Grid, state);
});




function changePathColor(hue){
    colors.options = hue; 
    switch(hue){
        case "Black":
            fillColor = 'gray';
            break;
        case "Red":
            fillColor = '#ffcccb';
            break;
        case "Blue":
            fillColor = '#add8e6';
            break;
        case "Yellow":
            fillColor = '#ffffe0';
            break;
        case "Green":
            fillColor = '#98fb98';
            break;
    }
}



function changePathWidth(width){
    thickness.pixel = width /  pixWidthDis;
}




function changePathOpacity(opacity){
    for(var i = 2; i < paper.project.activeLayer.children.length; i++){//j starts at 2 because the first 2 children are rasters
        paper.project.activeLayer.children[i].opacity = opacity;
    }
}




function clearPaper(onSuccess){
    for(var i = 2; i < paper.project.activeLayer.children.length; i++){//j starts at 2 because the first 2 children are rasters
        paper.project.activeLayer.children[i].remove();
    }

    paper.project.activeLayer.children.splice(2, paper.project.activeLayer.children.length);
    paper.view.draw();

    onSuccess();
}