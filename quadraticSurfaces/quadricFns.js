var A11 = toJavascriptSyntax('cos(theta14)*cos(theta13)*cos(theta12)'),
    A12 = toJavascriptSyntax('-cos(theta14)*cos(theta13)*sin(theta12)'),
    A13 = toJavascriptSyntax('-cos(theta14)*sin(theta13)'),
    A14 = toJavascriptSyntax('-sin(theta14)'),
    A21 = toJavascriptSyntax('(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*cos(theta12)+cos(theta24)*cos(theta23)*sin(theta12)'),
    A22 = toJavascriptSyntax('-(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*sin(theta12)+cos(theta24)*cos(theta23)*cos(theta12)'),
    A23 = toJavascriptSyntax('sin(theta24)*sin(theta14)*sin(theta13)-cos(theta24)*sin(theta23)*cos(theta13)'),
    A24 = toJavascriptSyntax('-sin(theta24)*cos(theta14)'),
    A31 = toJavascriptSyntax('(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*sin(theta12)'),
    A32 = toJavascriptSyntax('-(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*cos(theta12)'),
    A33 = toJavascriptSyntax('sin(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*cos(theta13)'),
    A34 = toJavascriptSyntax('-sin(theta34)*cos(theta24)*cos(theta14)'),
    A41 = toJavascriptSyntax('(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*sin(theta12)'),
    A42 = toJavascriptSyntax('-(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*cos(theta12)'),
    A43 = toJavascriptSyntax('-cos(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*cos(theta13)'),
    A44 = toJavascriptSyntax('cos(theta34)*cos(theta24)*cos(theta14)');


var U = [
    buildFn('theta12, theta13, theta14', A11),
    buildFn('theta12, theta13, theta14', A12),
    buildFn('theta13, theta14', A13),
    buildFn('theta14', A14),
    buildFn('theta12, theta13, theta14, theta23, theta24', A21),
    buildFn('theta12, theta13, theta14, theta23, theta24', A22),
    buildFn('theta13, theta14, theta23, theta24', A23),
    buildFn('theta14, theta24', A24),
    buildFn('theta12, theta13, theta14, theta23, theta24, theta34', A31),
    buildFn('theta12, theta13, theta14, theta23, theta24, theta34', A32),
    buildFn('theta13, theta14, theta23, theta24, theta34', A33),
    buildFn('theta14, theta24, theta34', A34),
    buildFn('theta12, theta13, theta14, theta23, theta24, theta34', A41),
    buildFn('theta12, theta13, theta14, theta23, theta24, theta34', A42),
    buildFn('theta13, theta14, theta23, theta24, theta34', A43),
    buildFn('theta14, theta24, theta34', A44)
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




function buildFn(params, functionString){
        var method = new Function(params, 'return ' + functionString + ';');

        return method;
}