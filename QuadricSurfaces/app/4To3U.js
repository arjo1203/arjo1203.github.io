var min = -20,
    max = 20,
    animationResolution = 26;

var A = [ [1, 0, 0, 0] , [0, 1, 0, 0] , [0, 0, -1, 0] , [0, 0, 0, 1] ];

var sliderValues = {};

sliderValues.R12 = 0;
sliderValues.R13 = 0;
sliderValues.R14 = 0;
sliderValues.R23 = 0;
sliderValues.R24 = 0;
sliderValues.R34 = 0;
sliderValues.w = 0;


var U11 = toJavascriptSyntax('cos(theta14)*cos(theta13)*cos(theta12)'),
    U12 = toJavascriptSyntax('-cos(theta14)*cos(theta13)*sin(theta12)'),
    U13 = toJavascriptSyntax('-cos(theta14)*sin(theta13)'),
    U14 = toJavascriptSyntax('-sin(theta14)'),
    U21 = toJavascriptSyntax('(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*cos(theta12)+cos(theta24)*cos(theta23)*sin(theta12)'),
    U22 = toJavascriptSyntax('-(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*sin(theta12)+cos(theta24)*cos(theta23)*cos(theta12)'),
    U23 = toJavascriptSyntax('sin(theta24)*sin(theta14)*sin(theta13)-cos(theta24)*sin(theta23)*cos(theta13)'),
    U24 = toJavascriptSyntax('-sin(theta24)*cos(theta14)'),
    U31 = toJavascriptSyntax('(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*sin(theta12)'),
    U32 = toJavascriptSyntax('-(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*cos(theta12)'),
    U33 = toJavascriptSyntax('sin(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*cos(theta13)'),
    U34 = toJavascriptSyntax('-sin(theta34)*cos(theta24)*cos(theta14)'),
    U41 = toJavascriptSyntax('(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*sin(theta12)'),
    U42 = toJavascriptSyntax('-(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*cos(theta12)'),
    U43 = toJavascriptSyntax('-cos(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*cos(theta13)'),
    U44 = toJavascriptSyntax('cos(theta34)*cos(theta24)*cos(theta14)');


var U = [
    buildFunction('theta12, theta13, theta14', U11),
    buildFunction('theta12, theta13, theta14', U12),
    buildFunction('theta13, theta14', U13),
    buildFunction('theta14', U14),
    buildFunction('theta12, theta13, theta14, theta23, theta24', U21),
    buildFunction('theta12, theta13, theta14, theta23, theta24', U22),
    buildFunction('theta13, theta14, theta23, theta24', U23),
    buildFunction('theta14, theta24', U24),
    buildFunction('theta12, theta13, theta14, theta23, theta24, theta34', U31),
    buildFunction('theta12, theta13, theta14, theta23, theta24, theta34', U32),
    buildFunction('theta13, theta14, theta23, theta24, theta34', U33),
    buildFunction('theta14, theta24, theta34', U34),
    buildFunction('theta12, theta13, theta14, theta23, theta24, theta34', U41),
    buildFunction('theta12, theta13, theta14, theta23, theta24, theta34', U42),
    buildFunction('theta13, theta14, theta23, theta24, theta34', U43),
    buildFunction('theta14, theta24, theta34', U44)
];




function passAngleToU(angle12, angle13, angle14, angle23, angle24, angle34){
    var results = [
        [
            U[0](angle12, angle13, angle14),
            U[1](angle12, angle13, angle14),
            U[2](angle13, angle14),
            U[3](angle14)
        ],
        [
            U[4](angle12, angle13, angle14, angle23, angle24),
            U[5](angle12, angle13, angle14, angle23, angle24),
            U[6](angle13, angle14, angle23, angle24),
            U[7](angle14, angle24)
        ],
        [
            U[8](angle12, angle13, angle14, angle23, angle24, angle34),
            U[9](angle12, angle13, angle14, angle23, angle24, angle34),
            U[10](angle13, angle14, angle23, angle24, angle34),
            U[11](angle14, angle24, angle34)
        ],
        [
            U[12](angle12, angle13, angle14, angle23, angle24, angle34),
            U[13](angle12, angle13, angle14, angle23, angle24, angle34),
            U[14](angle13, angle14, angle23, angle24, angle34),
            U[15](angle14, angle24, angle34)
        ]
    ];

    return results
}