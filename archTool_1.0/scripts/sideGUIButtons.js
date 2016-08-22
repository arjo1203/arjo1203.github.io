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




//$("#on_off").on('switchChange.bootstrapSwitch', function(event, state){
//    gridVisible(Grid, state);
//});




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
    for(var i = numOfChildren; i < paper.project.activeLayer.children.length; i++){
        paper.project.activeLayer.children[i].opacity = opacity;
    }
}




function clearPaper(onSuccess){
    for(var i = imgList.length; i < paper.project.activeLayer.children.length; i++){
        console.log(paper.project.activeLayer.children[i]);
        
        if(paper.project.activeLayer.children[i].name !== 'grid'){
            console.log('hello');
            paper.project.activeLayer.children[i].remove();    
            paper.view.draw();
        }
    }

    paper.project.activeLayer.children.splice(imgList.length, paper.project.activeLayer.children.length);


    onSuccess();
}




function undo(onSuccess){
    if(paper.project.activeLayer.children.length > numOfChildren){
        paper.project.activeLayer.children[paper.project.activeLayer.children.length-1].remove();
    }
    
    onSuccess();
}




function gridOnOff(grid){
    if(grid.children[0].visible == true){
        for(var i = 0; i < lines.length; i++){
            grid.children[i].visible = false;
            window.paper.view.draw();
        }
    }
    else{
        for(var i = 0; i < lines.length; i++){
            grid.children[i].visible = true;
            window.paper.view.draw();
        }
    }
}