//PAPER.JS Globals
var path, colors, opacities, thickness, fillColor;//Global object that paperGUI uses
var paths = new Array();//Global object that paperGUI uses
var pathPositions = new Array();
var tools = {};//Global object that paperGUI uses
var paperMaps = new Array();
var target = document.getElementById('paperjs');
var SCALE = 1;
var numOfChildren, activeTool = 'drawing';


target.addEventListener('mousewheel', zoom);



function setupPaper(){
    //fillColor will be a light version on the storkeColor
    //Initialize fillColor to gray since pathColor is initialized to black
    
    fillColor = 'Gray';

    //Adding members to Gui
    colors = {
        options: ''
    };

    thickness = {
        pixel: 1,
        meters: 10
    };

    opacities = {
        paths: .5   
    };
    
    var div = document.getElementById("mapOpacity");
    var sliders = new Array();
//    console.log(imgList);
    
    if(imgList.length > 2){//By default first 2 raster are Terrain and Height
        
        if(imgList.length > 3){//By default first 2 raster are Terrain and Height
            var span1 = document.createElement("span");
            span1.innerHTML = imgList[3] + " Opacity (%): ";
    //                        span1.setAttribute("style","float: left;");

            var span2 = document.createElement("span");
            span2.id = "topoVal";
            span2.innerHTML = "0";
            span1.appendChild(span2);

            var input = document.createElement("input");
            input.id = "topo";
            input.setAttribute("type", "text");
            input.setAttribute("data-slider-min", "0");
            input.setAttribute("data-slider-step", "2");
            input.setAttribute("data-slider-max", "100");
            input.setAttribute("data-slider-value", "0");
            input.setAttribute("data", "value: '0'");
            input.setAttribute("value", "0");
            input.setAttribute("style", "display: none;");
            span1.appendChild(input);
            div.appendChild(span1);

            sliders.push(input.id);
        }
        
        var span1 = document.createElement("span");
        span1.innerHTML = imgList[2] + " Opacity (%): ";
//                        span1.setAttribute("style","float: left;");
        
        var span2 = document.createElement("span");
        span2.id = "soilsVal";
        span2.innerHTML = "0";
        span1.appendChild(span2);
        
        var input = document.createElement("input");
        input.id = "soils";
        input.setAttribute("type", "text");
        input.setAttribute("data-slider-min", "0");
        input.setAttribute("data-slider-step", "2");
        input.setAttribute("data-slider-max", "100");
        input.setAttribute("data-slider-value", "0");
        input.setAttribute("data", "value: '0'");
        input.setAttribute("value", "0");
        input.setAttribute("style", "display: none;");
        span1.appendChild(input);
        div.appendChild(span1);
        console.log("#" + input.id);
        
        sliders.push(input.id);
    }
    
    for(var i = 0; i < imgList.length; i++){
        paper.project.activeLayer.children[i].image.src = imgList[i];
    }
    
    console.log(paper.project);
    
    if(sliders.length > 0){
        if(sliders.length > 1){
            $("#" + sliders[1]).slider();
            $("#" + sliders[1]).on('slide', function(slideEvt){
                $("#" + sliders[1] + "Val").text(slideEvt.value);
                paper.project.activeLayer.children[2].opacity = slideEvt.value/100;

                _3dTerrainMapofWorkSpace();
            });   
        }
        
        $("#" + sliders[0]).slider();
        $("#" + sliders[0]).on('slide', function(slideEvt){
            $("#" + sliders[0
                           ] + "Val").text(slideEvt.value);
            paper.project.activeLayer.children[3].opacity = slideEvt.value/100;

            _3dTerrainMapofWorkSpace();
        });   
    }
    
    
    
    createPaperTools();
}




interact(target).gesturable({
  onstart: function(ev){
      deactivateAllTool();
  },
  onmove: function(ev){
            if(SCALE * (1 + ev.ds) >= 1 && SCALE * (1 + ev.ds) <= 5){
                SCALE = SCALE * (1 + ev.ds);
                paper.view.zoom = SCALE;
                var x = (paper.project.activeLayer.position.x || 0) + ev.dx;
                var y = (paper.project.activeLayer.position.y || 0) + ev.dy;
//                console.log(paper.project);
                
                for(var i = 0; i < paper.project.layers.length; i++){
                    paper.project.layers[i].position.x = x;
                    paper.project.layers[i].position.y = y;
                    paper.view.draw();
                }
            }
  },
  onend: function(ev){
      switch(activeTool){
        case "drawing":
            activateDrawingTool();
            break;
        case "fill":
            activateFillTool();
            break;
        case "eraser":
            activateEraserTool();
            break;
        case "grid":
            activateGridTool();
            break;
        case "pan":
            activateProjectTool();
            break;
    }
  }
});




function createPaperTools(){
    numOfChildren = paper.project.activeLayer.children.length;
    //Create Drawing Tool
    tools.drawing = new Tool();
    tools.drawing.onMouseDown = onMouseDown;
    tools.drawing.onMouseDrag = onMouseDrag;
    tools.drawing.onMouseUp = onMouseUp;
    tools.drawing.minDistance = 5;
    tools.drawing.maxDistance = 10;

    //Create Fill Tool
    tools.fill = new Tool();
    tools.fill.onMouseDown = onMouseDown;
    tools.fill.onMouseDrag = onMouseDrag;
    tools.fill.onMouseUp = fillArea;
    tools.fill.minDistance = 5;
    tools.fill.maxDistance = 10;

    //Create Eraser Tool
    tools.eraser = new Tool();
    tools.eraser.onMouseDrag = eraser;

    //Create Grid Tool
    tools.grid = new Tool();
    tools.grid.onMouseDrag = moveGrid;
    
    //Create Project Tool
    tools.moveProject = new Tool();
    tools.moveProject.onMouseDrag = moveProject;
}



//Creats a path on Mouse Down and stores them in an array
function onMouseDown(event) {
//    console.log('start');
//    console.log(event);
    
    if(event.event.type == 'mousedown'){
//        console.log('MouseEvent');

        path = new Path();
        path.strokeColor = colors.options;
        path.strokeWidth = thickness.pixel;
        path.opacity = opacities.paths;

    }
    else if(event.event.type == 'touchstart'){
//        console.log('TouchEvent');
        event.event.preventDefault();

        //adds segments to path
        var touches = event.event.touches;
        var touch = touches[0];
        var pX, pY, s, cX, cY, dX, dY, transX, transY;

        s = paper.view.zoom;

        cX = paper.view.center.x;
        cY = paper.view.center.y;

        if(touches.length == 1){
            pX = touch.pageX;
            pY = touch.pageY;

            dX = pX - cX;
            dY = pY - cY;

            transX = dX/s;
            transY = (dY-92)/s;


            path = new Path();
            path.strokeColor = colors.options;
            path.strokeWidth = thickness.pixel;
            path.opacity = opacities.paths;
        }
    }
}




//Makes the path created on Mouse Down with a thickness and fills the thickness with color
 function onMouseDrag(event){
//     console.log('moving');
//     console.log(event);
     
    path.add(event.point);
}




function onMouseUp(event){
//    console.log('up');
    path.simplify();
    paths.push(path);
}



function fillArea(event){
    path.fillColor = fillColor;
    paths.push(path);
}




function eraser(event){
    var hitOptions = {
        segments: true,
        tolerance: 20
    };

    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            for(var i = 0; i < paths.length; i++){
                if(hitResult.item == paths[i]){   
                    hitResult.item.remove();
                    removePath(hitResult.item);
                }//if
            }//for
        }//if
    }//if
}//fn




function removePath(item){
    var index = 0;
    var remove = new Array();
    remove.push(item);

    for(var i = 0; i < remove.length; i++){
        for(var j = 2; j < paper.project.activeLayer.children.length; j++){//j starts at 2 because the first 2 children are rasters
            if(remove[i].segments[0].point.x == paper.project.activeLayer.children[j].segments[0].point.x){
                if(remove[i].segments[0].point.y == paper.project.activeLayer.children[j].segments[0].point.y){
                    index = j;
                }
            }  
        }
    }

    paper.project.activeLayer.children.splice(index, 1);
}




function moveGrid(event){
    console.log('moveGrid');
    Grid.position = event.point;   
}




function deactivateDrawingTool(){
    tools.drawing.off('mousedown', onMouseDown);
    tools.drawing.off('mouseup', onMouseUp);
    tools.drawing.off('mousedrag', onMouseDrag);
}



function activateDrawingTool(){
    tools.drawing.on('mousedown', onMouseDown);
    tools.drawing.on('mouseup', onMouseUp);
    tools.drawing.on('mousedrag', onMouseDrag);
    
    tools.drawing.activate();
    activeTool = 'drawing';
}




function deactivateFillTool(){
    tools.fill.off('mousedown', onMouseDown);
    tools.fill.off('mouseup', fillArea);
    tools.fill.off('mousedrag', onMouseDrag);
}



function activateFillTool(){
    tools.fill.on('mousedown', onMouseDown);
    tools.fill.on('mouseup', fillArea);
    tools.fill.on('mousedrag', onMouseDrag);
    
    tools.fill.activate();
    activeTool = 'fill';
}




function deactivateEraserTool(){
    tools.eraser.off('mousedrag', eraser);
}



function activateEraserTool(){
    tools.eraser.on('mousedrag', eraser);
    
    tools.eraser.activate();
    activeTool = 'eraser';
}




function deactivateGridTool(){
    tools.grid.off('mousedrag', moveGrid);
}



function activateGridTool(){
    gridVisible(Grid, true);
    
    tools.grid.on('mousedrag', moveGrid);
    
    tools.grid.activate();
    activeTool = 'grid';
}




function deactivateProjectTool(){
    tools.moveProject.off('mousedrag', moveProject);
}



function activateProjectTool(){
    tools.moveProject.on('mousedrag', moveProject);
    
    tools.moveProject.activate();
    activeTool = 'pan';
}




function deactivateAllTool(){
    deactivateDrawingTool();
    deactivateEraserTool();
    deactivateFillTool();
    deactivateGridTool();
}




function moveGrid(event){
    Grid.position = event.point;   

    _3dTerrainMapofWorkSpace();
}



function moveProject(event){
    paper.project.activeLayer.position = event.point;
}



function zoom(ev){
    ev.preventDefault();
    
    if(SCALE * (1 + (10/ev.wheelDelta)) >= 1.05 && SCALE * (1 + (10/ev.wheelDelta)) <= 5){
        SCALE = SCALE * (1 + (10/ev.wheelDelta));
        paper.view.zoom = SCALE;

        window.paper.view.draw();
    }
}



function setRasterPosition(raster, width, height, scale){
    var x, y;
    x = (width/2) * scale;
    y = (height/2) * scale;
    raster.position.x = x;
    raster.position.y = y;   
}




function makePaths(file){
    var parse = JSON.parse(file);
    var newPaths = new Array();
    console.log(parse);

    for(var i = 1; i < parse.length; i++){  
        var newPath = new Path({
            segments: parse[i][1].segments,
            strokeColor: parse[i][1].strokeColor,
            opacity: parse[i][1].opacity,
            strokeWidth: parse[i][1].strokeWidth 
        });

        for(var prop in parse[i][1]){
            if(prop == 'fillColor'){
                newPath.fillColor = parse[i][1].fillColor;   
            }
        }
        newPaths.push(newPath);

        window.paper.view.draw();
    }

    return newPaths;
}




function createGrid(pixelsHozitonalDistance,pixelsVerticalDistance,frameColor,gridLinesColor){
    //The sqaure grid will represent one square mile, where each box within the gird will represent an acre of land
    var roundPixHozDis = Math.round(pixelsHozitonalDistance);
    var roundPixVertDis = Math.round(pixelsVerticalDistance);
    var lengthOfSides = 1609; //approx. how many meters in a mile
    var numOfHozPix = Math.round(lengthOfSides / roundPixHozDis);//how pixels will equal the horizontal length of a mile
    var numOfVertPix = Math.round(lengthOfSides / roundPixVertDis);//how pixels will equal the vertical length of a mile

    //1 square mile = 680 acres, the square root of 680 approx. = 25.3
    var hozIincrement = Math.round(numOfHozPix / 25.3); //Where a grid line will start
    var vertIncrement = Math.round(numOfVertPix / 25.3); //Where 25.3 are how many acres are within the lengthOfGrid
    var numOfHozLines = Math.round(numOfHozPix/hozIincrement);//How many grid line there will be horizontally
    var numOfVertLines = Math.round(numOfVertPix/vertIncrement);//How many grid line there will be vertically

    //After everything has been converted to the pixels, we find the length of the sides according the pixels
    var hozPixLength = Math.round(numOfHozLines*hozIincrement);
    var vertPixLength = Math.round(numOfVertLines*vertIncrement);
    //build the frame of the grid
    var topLeft = new Point(0,0);
    var bottomLeft = new Point(0,vertPixLength);
    var topRight = new Point(hozPixLength,0);
    var bottomRight = new Point(hozPixLength,vertPixLength);

    //Array to hold all lines
    lines = new Array();

    //Create the frame of the grid and push them into an array, they will be the first four elements
    //This allow to change the color of the frame very easy
    var path = new Path.Line(topRight,topLeft);
    lines.push(path);
    var path2 = new Path.Line(bottomRight,bottomLeft);
    lines.push(path2);
    var path3 = new Path.Line(topRight,bottomRight);
    lines.push(path3);
    var path4 = new Path.Line(topLeft,bottomLeft);
    lines.push(path4);

    //Creates the vertical grid lines
    for(var i = 0; i < numOfHozLines - 1; i++){
        var top = new Point(hozIincrement + hozIincrement * i, 0);
        var bottom = new Point(hozIincrement + hozIincrement * i, vertPixLength);
        var line = new Path.Line(top,bottom);
        lines.push(line);
    }

    //Creates the horizontal grid lines
    for(var i = 0; i < numOfVertLines - 1; i++){
        var top2 = new Point(0, vertIncrement + vertIncrement * i);
        var bottom2 = new Point(hozPixLength, vertIncrement + vertIncrement * i);
        var line2 = new Path.Line(top2,bottom2);
        lines.push(line2); 
    }

    //Set the color and strokewidth of the frame and the grid lines
    for(var i = 0; i < lines.length; i++){
        lines[i].name = 'grid'; 
        
        if(i < 4){
            lines[i].strokeColor = frameColor; 
            lines[i].strokeWidth = .8; 
        }
        else{
            lines[i].strokeColor = gridLinesColor;  
            lines[i].strokeWidth = .5; 
        }
    }

    //Create an object that will hold all of the paths
    var grid = new CompoundPath();
    for(var i = 0; i < lines.length; i++){
        grid.children[i] = lines[i];
        grid.children[i].visible = false;
    }

    //Return the object
    return grid;
}


function gridVisible(grid, true_false){
    for(var i = 0; i < lines.length; i++){
        grid.children[i].visible = true_false;
        window.paper.view.draw();
    }
}