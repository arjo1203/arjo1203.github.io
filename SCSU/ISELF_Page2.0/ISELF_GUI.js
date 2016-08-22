var first = $('#first'),
    second = $('#second'),
    third = $('#third'),
    ext = $('#Ext');

var buttons = [first, second, third, ext];

buttons[0].click(function(){
    $Buildings.turnOn('ISELF_1stfloor');
});

buttons[1].click(function(){
    $Buildings.turnOn('ISELF_2ndfloor');
});

buttons[2].click(function(){
    $Buildings.turnOn('ISELF_3rdfloor');
});

buttons[3].click(function(){
    $Buildings.turnOn('ISELF_exterior');
});