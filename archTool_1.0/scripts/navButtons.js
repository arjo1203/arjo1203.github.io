var pixHeightDis, pixWidthDis, imgList, Grid, numOfRuns = 0;
var heightData = [];


function openJSON(onSuccess) {
    var body = document.getElementById('body'),
        file = document.createElement('input');
    
    file.type = 'file';
    file.click();

    file.addEventListener('change', function () {
        var reader = new FileReader();
        reader.onloadstart = function () {
//            body.style.cursor = 'progress';   
        };
        reader.onprogress = function () {
//            window.style.cursor = 'progress';   
        };
        reader.onloadend = function () {
//            body.style.cursor = 'default';   
        };
        reader.onload = function (e) {
            //Create paperjs project from saved paperjs project
            var inputFile = JSON.parse(e.target.result);
//            console.log(inputFile);
            imgList = inputFile[0];
            paper.project.importJSON(inputFile[1]);
            pixWidthDis = inputFile[2];
            pixHeightDis = inputFile[3];
            heightData = inputFile[4];
            Grid = createGrid(pixWidthDis, pixHeightDis, 'White', 'Yellow');
            onSuccess();
        };
        reader.readAsText(file.files[0]);
    }, 
    false);
}




function saveAsJSON(){
    var file = new Array();
    
    file.push(imgList);

    file.push(JSON.stringify(paper.project));
    
    file.push(pixWidthDis);
    file.push(pixHeightDis);
    
    file.push(heightData);

    var outputFile = JSON.stringify(file);

    var blob = new Blob([outputFile], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var link = document.createElement("a");
    var name = window.prompt("Please name your Project: ");
    if(name != null){
        link.href = url;
        link.download = name;
        link.click();

        window.alert("Project was saved!");
    }
    else{
        window.alert("Project was NOT saved!!");   
    }
}





function saveJSON(){
    
}
      
            
            
            
            
function displayToCanvases(){
    if(numOfRuns != 0){
        console.log('remove everythin');
        scene.remove(_3dTerrain);

        paper.project.clear();
        
//        var mapList = document.getElementById("mapOptions");
//        if(mapList){
//            while(mapList.firstChild){
//                mapList.removeChild(mapList.firstChild);
//            }
//        }
//
//        var mapOp = document.getElementById("mapOpacity");
//        while(mapOp.children.length > 2){
//            mapOp.removeChild(mapOp.lastChild);
//        }
        
//        setupPaper();
//        setupThree();
        render();
//        paper.view.draw();
    }
    else{
        setupPaper();
        setupThree();
    }
    
    numOfRuns++;
    console.log(numOfRuns);
}