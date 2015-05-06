var buttons = [$('#firstFloor'), $('#secondFloor'), $('#thirdFloor'), $('#allFloors')];

buttons[0].click( function() {
    toggleClass(buttons[0], buttons[0][0].className);

    if(buttons[0][0].className == 'btn btn-success'){
        $Buildings.ISELF_1stfloor.visible = true;
    }
    else{
        $Buildings.ISELF_1stfloor.visible = false;
    }

    updateAllFloorsButton();

    render();
});

buttons[1].click( function() {
    toggleClass(buttons[1], buttons[1][0].className);

    if(buttons[1][0].className == 'btn btn-success'){
        $Buildings.ISELF_2ndfloor.visible = true;
    }
    else{
        $Buildings.ISELF_2ndfloor.visible = false;
    }

    updateAllFloorsButton();

    render();
});

buttons[2].click( function() {
    toggleClass(buttons[2], buttons[2][0].className);

    if(buttons[2][0].className == 'btn btn-success'){
        $Buildings.ISELF_3rdfloor.visible = true;
    }
    else{
        $Buildings.ISELF_3rdfloor.visible = false;
    }

    updateAllFloorsButton();

    render();
});

buttons[3].click( function() {
    for(var i = 0; i < buttons.length - 1; i++){
        if(buttons[i][0].className == 'btn btn-danger'){
            buttons[i].click();
        }
    }
});


function updateAllFloorsButton(){
    if(buttons[0][0].className == 'btn btn-success' && buttons[1][0].className == 'btn btn-success' && buttons[2][0].className == 'btn btn-success'){
        toggleClass(buttons[3], 'btn btn-danger');
    }
    else{
        toggleClass(buttons[3], 'btn btn-success');
    }
}


function toggleClass(button, classString){
    if(classString == 'btn btn-success'){
        button.removeClass('btn btn-success');
        button.addClass('btn btn-danger');
    }
    else{
        button.removeClass('btn btn-danger');
        button.addClass('btn btn-success');
    }
}