var first = $('#first'),
    second = $('#second'),
    third = $('#third'),
    ext = $('#Ext');

var buttons = [first, second, third, ext];

buttons[0].click(function(){
    $Buildings.ISELF_exterior.visible = false;

    var state = switchClass(buttons[0]);
    
    if(state == 'ffo'){
        $Buildings.ISELF_1stfloor.visible = true;
    }
    else{
        $Buildings.ISELF_1stfloor.visible = false;
    }
});

buttons[1].click(function(){
    $Buildings.ISELF_exterior.visible = false;

    var state = switchClass(buttons[1]);
    
    if(state == 'ffo'){
        $Buildings.ISELF_2ndfloor.visible = true;
    }
    else{
        $Buildings.ISELF_2ndfloor.visible = false;
    }
});

buttons[2].click(function(){
    $Buildings.ISELF_exterior.visible = false;

    var state = switchClass(buttons[2]);
    
    if(state == 'ffo'){
        $Buildings.ISELF_3rdfloor.visible = true;
    }
    else{
        $Buildings.ISELF_3rdfloor.visible = false;
    }
});

buttons[3].click(function(){
    $Buildings.ISELF_exterior.visible = false;

    var state = switchClass(buttons[3]);
    //console.log(state);
    
    if(state == 'ffo'){
        $Buildings.ISELF_exterior.visible = true;
    }
    else{
        $Buildings.ISELF_exterior.visible = false;
    }
});


function switchClass(obj){
    var currentClass = obj[0].className;
    var interestedClass = currentClass[currentClass.length - 1] + currentClass[currentClass.length - 2] + currentClass[currentClass.length - 3];
    
    if(interestedClass == 'ffo'){
        obj.removeClass('off');
        obj.addClass('on');
    }
    else{
        obj.removeClass('on');
        obj.addClass('off');
    }
    
    return interestedClass;
}