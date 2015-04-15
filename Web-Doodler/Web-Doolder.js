//Install paper on window to use like regular javascript
paper.install(window);

//Install paper on 2d canvas and set the size
paper.setup('myCanvas');
paper.view.viewSize = [window.innerWidth, window.innerHeight];


window.addEventListener('resize', onWindowResize, false);


var tools, path, counter = 0, color = 'black', onOffCounter = 0;
var menu_toggle = $("#menu-toggle"),
    canvas = document.getElementById('myCanvas'),
    drawButton = document.getElementById('drawButton');


createPaperTools();




function createPaperTools() {
    //Create Drawing Tool
    tools.drawing = new Tool();
    tools.drawing.onMouseDown = onMouseDown;
    tools.drawing.onMouseDrag = onMouseDrag;
    tools.drawing.onMouseUp = onMouseUp;
    tools.drawing.minDistance = 5;
    tools.drawing.maxDistance = 10;
}




function onMouseDown(event){
    path = new Path();
    path.strokeColor = color;
    path.strokeWidth = 4;

    path.add(event.point);
}




function onMouseDrag(event){
    path.add(event.point);
}




function onMouseUp(event){
    path.simplify();
}




function onOff() {
    if(counter % 2 == 0){
        tools.drawing.off('mousedown', onMouseDown);
        tools.drawing.off('mousedrag', onMouseDrag);
        canvas.style.pointerEvents = 'none';
        drawButton.innerHTML = 'Draw Off';
    }
    else{
        tools.drawing.on('mousedown', onMouseDown);
        tools.drawing.on('mousedrag', onMouseDrag);
        canvas.style.pointerEvents = 'auto';
        drawButton.innerHTML = 'Draw On';
    }
    counter++;
}




function changePathColor(hue){
    color = hue;
}




function goToWebsite(){
    var div = $('#iframeContainer')[0];
    console.log(div);
    if(div.children.length > 0){
        div.removeChild(div.lastChild);
    }

    var website = document.getElementById('website').value;
    var iframe = document.createElement('iframe');
    iframe.src = website;
    iframe.width = '100%';
    iframe.height = '100%';
    div.appendChild(iframe);
}




//Toggle for sidebar
menu_toggle.click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    //console.log($("#wrapper"));

    if(onOffCounter % 2 == 0){
        menu_toggle[0].innerHTML = 'Open';//change label of button when clicked
    }
    else{
        menu_toggle[0].innerHTML = 'Close';
    }

    onOffCounter++;
});




function onWindowResize(){
    innerWidth = window.innerWidth;
    console.log(window.innerWidth);
    console.log(innerWidth);
}




function undo(){
    if(paper.project.activeLayer.children.length > 0){
        paper.project.activeLayer.children[paper.project.activeLayer.children.length-1].remove();
    }
    window.paper.view.draw();
}