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
    RM: function(){
        quadTools.animate({
            width: '100%',
            left: '5px',
            top: '20px'
        }, 500);

        coneTools.animate({
            top: '670px'
        }, 500);

    },
    LM: function(){
        quadTools.animate({
            width: '100%',
            left: '5px',
            top: '20px'
        }, 500);

        coneTools.animate({
            width: '100%',
            height: '400px',
            left: '5px',
            top: '670px'
        }, 500);

    },
    ML: function(){
        coneTools.animate({
            height: '0',
            left: '-400px'
        }, 500);
    },
    RL: function(){
        coneTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        quadTools.animate({
            width: '100%',
            left: '5px'
        }, 300);
    },
    MR: function(){
        quadTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        coneTools.animate({
            top: '20px'
        }, 500);
    },
    LR: function(){
        quadTools.animate({
            width: '0',
            left: '-400px'
        }, 500);

        coneTools.animate({
            width: '100%',
            height: '400px',
            left: '5px',
            top: '20px'
        }, 500);
    }
};