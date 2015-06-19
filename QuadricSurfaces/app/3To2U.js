var plane, _3to2shape;

var threeA = [ [1, 0, 0] , [0, 1, 0] , [0, 0, -1] ];

sliderValues.x = 0;
sliderValues.y = 0;
sliderValues.z = 0;
sliderValues.zCross = 0;


var threeU11 = toJavascriptSyntax('cos(theta23)*cos(theta13)'),
    threeU12 = toJavascriptSyntax('-sin(theta23)*cos(theta12)+cos(theta23)*sin(theta13)*sin(theta12)'),
    threeU13 = toJavascriptSyntax('sin(theta23)*sin(theta12)+cos(theta23)*sin(theta13)*cos(theta12)'),
    threeU21 = toJavascriptSyntax('sin(theta23)*cos(theta13)'),
    threeU22 = toJavascriptSyntax('cos(theta23)*cos(theta12)+sin(theta23)*sin(theta13)*sin(theta12)'),
    threeU23 = toJavascriptSyntax('-cos(theta23)*sin(theta12)+sin(theta23)*sin(theta13)*cos(theta12)'),
    threeU31 = toJavascriptSyntax('-sin(theta13)'),
    threeU32 = toJavascriptSyntax('cos(theta13)*sin(theta12)'),
    threeU33 = toJavascriptSyntax('cos(theta13)*cos(theta12)');


var threeU = [
    buildFunction('theta13, theta23', threeU11),
    buildFunction('theta12, theta13, theta23', threeU12),
    buildFunction('theta12, theta13, theta23', threeU13),
    buildFunction('theta13, theta23', threeU21),
    buildFunction('theta12, theta13, theta23', threeU22),
    buildFunction('theta12, theta13, theta23', threeU23),
    buildFunction('theta13', threeU31),
    buildFunction('theta12, theta13', threeU32),
    buildFunction('theta12, theta13', threeU33)
];




function passAngleToThreeU(angle12, angle13, angle23){
    var results = [
        [
            threeU[0](angle13, angle23),
            threeU[1](angle12, angle13, angle23),
            threeU[2](angle13, angle13, angle23)
        ],
        [
            threeU[3](angle13, angle23),
            threeU[4](angle13, angle13, angle23),
            threeU[5](angle13, angle13, angle23)
        ],
        [
            threeU[6](angle13),
            threeU[7](angle12, angle13),
            threeU[8](angle12, angle13)
        ]
    ];

    return results
}