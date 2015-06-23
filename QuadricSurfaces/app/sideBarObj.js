var coneTools = $('#coneTools'),
    quadTools = $('#quadTools');



toolBar = {
    tools: {
        both: true,
        cone: false,
        quad: false
    },
    currentTools: function(){
        for(var child in toolBar.tools){
            if(toolBar.tools[child] == true){
                return child;
                break;
            }
        }
    },
    QuadricAndConic: function(){
        quadTools.animate({
            width: '100%',
            left: '5px',
            top: '60px'
        }, 500);

        coneTools.animate({
            width: '100%',
            height: '400px',
            left: '5px',
            top: '740px'
        }, 500);
    },
    Quadric: function(){
        coneTools.animate({
            height: '0',
            left: '-400px'
        }, 500);
    },
    ConicToQuaric: function(){
        coneTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        quadTools.animate({
            width: '100%',
            left: '5px'
        }, 300);
    },
    Conic: function(){
        quadTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        coneTools.animate({
            width: '100%',
            height: '400px',
            left: '5px',
            top: '60px'
        }, 500);
    },
    QuadricToConic: function(){
        quadTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        coneTools.animate({
            width: '100%',
            height: '400px',
            left: '5px',
            top: '60px'
        }, 500);
    }
};