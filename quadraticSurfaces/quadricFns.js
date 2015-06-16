var A11 = personalParser('cos(theta14)*cos(theta13)*cos(theta12)'),
    A12 = personalParser('-cos(theta14)*cos(theta13)*sin(theta12)'),
    A13 = personalParser('-cos(theta14)*sin(theta13)'),
    A14 = personalParser('-sin(theta14)'),
    A21 = personalParser('(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*cos(theta12)+cos(theta24)*cos(theta23)*sin(theta12)'),
    A22 = personalParser('-(-sin(theta24)*sin(theta14)*cos(theta13)-cos(theta24)*sin(theta23)*sin(theta13))*sin(theta12)+cos(theta24)*cos(theta23)*cos(theta12)'),
    A23 = personalParser('sin(theta24)*sin(theta14)*sin(theta13)-cos(theta24)*sin(theta23)*cos(theta13)'),
    A24 = personalParser('-sin(theta24)*cos(theta14)'),
    A31 = personalParser('(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*sin(theta12)'),
    A32 = personalParser('-(-sin(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(-sin(theta34)*sin(theta24)*cos(theta23)+cos(theta34)*sin(theta23))*cos(theta12)'),
    A33 = personalParser('sin(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(sin(theta34)*sin(theta24)*sin(theta23)+cos(theta34)*cos(theta23))*cos(theta13)'),
    A34 = personalParser('-sin(theta34)*cos(theta24)*cos(theta14)'),
    A41 = personalParser('(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*cos(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*sin(theta12)'),
    A42 = personalParser('-(cos(theta34)*cos(theta24)*sin(theta14)*cos(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*sin(theta13))*sin(theta12)+(cos(theta34)*sin(theta24)*cos(theta23)+sin(theta34)*sin(theta23))*cos(theta12)'),
    A43 = personalParser('-cos(theta34)*cos(theta24)*sin(theta14)*sin(theta13)+(-cos(theta34)*sin(theta24)*sin(theta23)+sin(theta34)*cos(theta23))*cos(theta13)'),
    A44 = personalParser('cos(theta34)*cos(theta24)*cos(theta14)');

var builtU = [
    buildUniqueFn('theta12, theta13, theta14', A11),
    buildUniqueFn('theta12, theta13, theta14', A12),
    buildUniqueFn('theta13, theta14', A13),
    buildUniqueFn('theta14', A14),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24', A21),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24', A22),
    buildUniqueFn('theta13, theta14, theta23, theta24', A23),
    buildUniqueFn('theta14, theta24', A24),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24, theta34', A31),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24, theta34', A32),
    buildUniqueFn('theta13, theta14, theta23, theta24, theta34', A33),
    buildUniqueFn('theta14, theta24, theta34', A34),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24, theta34', A41),
    buildUniqueFn('theta12, theta13, theta14, theta23, theta24, theta34', A42),
    buildUniqueFn('theta13, theta14, theta23, theta24, theta34', A43),
    buildUniqueFn('theta14, theta24, theta34', A44)
];




function passAngleToU(angle12, angle13, angle14, angle23, angle24, angle34){
    var results = [
        [
            builtU[0](angle12, angle13, angle14),
            builtU[1](angle12, angle13, angle14),
            builtU[2](angle13, angle14),
            builtU[3](angle14)
        ],
        [
            builtU[4](angle12, angle13, angle14, angle23, angle24),
            builtU[5](angle12, angle13, angle14, angle23, angle24),
            builtU[6](angle13, angle14, angle23, angle24),
            builtU[7](angle14, angle24)
        ],
        [
            builtU[8](angle12, angle13, angle14, angle23, angle24, angle34),
            builtU[9](angle12, angle13, angle14, angle23, angle24, angle34),
            builtU[10](angle13, angle14, angle23, angle24, angle34),
            builtU[11](angle14, angle24, angle34)
        ],
        [
            builtU[12](angle12, angle13, angle14, angle23, angle24, angle34),
            builtU[13](angle12, angle13, angle14, angle23, angle24, angle34),
            builtU[14](angle13, angle14, angle23, angle24, angle34),
            builtU[15](angle14, angle24, angle34)
        ]
    ];

    return results
}




function buildUniqueFn(params, functionString){
        var method = new Function(params, 'return ' + functionString + ';');

        return method;
}