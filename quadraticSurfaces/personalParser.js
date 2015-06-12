function personalParser(string){
    //console.log(string);
    var indicies = [], variables = [];

    //Finds the index where all '^' signs and stores them in indicies
    //When '^' is found the variable is infront
    //Store the string of the variable in variables
    for(var i = 0; i < string.length; i++){
        if(string[i] == '^'){
            //Stores the index 2 before the '^' in order
            //to start at the beginning of the variable
            indicies.push(i-2);

            //The variable are the 2 characters before the '^'
            var variable = string[i-2] + string[i-1];
            variables.push(variable);
        }
    }


    var spliced = '', powersParsed = '', finalFn = '', restOfString = '', charIndex = 0;

    if(indicies.length > 0){
        for(var i = 0; i < indicies.length; i++){
            spliced = '';

            //spliced is the string before the variables
            for(var j = charIndex; j < indicies[i]; j++){
                spliced += string[j];
            }

            //Convert x1^2 to javascript syntax Math.pow(x1, 2)
            var parsed = spliced + 'Math.pow(' + variables[i] + ', 2)';

            //when completed powersParsed will be the converted string
            powersParsed += parsed;

            //In order not to include x1^2 in powersParsed
            //charIndex increments by the index of the '^' plus 4 more to the index
            //because x1^2 is of length 4
            charIndex = indicies[i] + 4;
        }

    }
    else{
        powersParsed = string;
    }
    //console.log(powersParsed);

    var lastIndex = indicies.length - 1;
    for(var i = indicies[lastIndex] + 4; i < string.length; i++){
        restOfString += string[i];
    }

    finalFn = powersParsed + restOfString;

    finalFn = parseLetter(finalFn, 'si');
    finalFn = parseLetter(finalFn, 'sq');
    finalFn = parseLetter(finalFn, 'co');

    return finalFn;
}
//var fun = personalParser('(1/2)*x2*cos(theta24)');
//console.log(fun);



function parseLetter(string, letters){
    var indicies = [], charIndex = 0, letterParsed = '';


    //Finds the index where all 's' signs and stores them in indicies
    //this detect where the string 'sqrt' is
    for(var i = 0; i < string.length; i++){
        spliced = '';
        if(string[i] + string[i + 1] == letters){
            indicies.push(i);
        }
    }

    indicies.push(string.length);

    if(indicies.length > 0){
        //Add 'Math.' infront of all 'sqrt'
        for(var i = 0; i < indicies.length; i++){
            spliced = '';

            //spliced is the string before 'sqrt'
            for(var j = charIndex; j < indicies[i]; j++){
                spliced += string[j];
            }

            //Convert 'sqrt' to javascript syntax 'Math.sqrt'
            var parsed = spliced + 'Math.';

            letterParsed += parsed;

            //In order to continue adding characters to the sqrtParsed in the correct order
            //For the next loop start the index where 'Math.' was included
            charIndex = indicies[i];
        }

        //Remove the last 'Math.'
        letterParsed = letterParsed.slice(0, letterParsed.length - 5);
        //console.log(letterParsed);

    }
    else{
        letterParsed = string;
    }

    return letterParsed;
}




function buildFunction(functionString){
    var method = new Function('x1, x2, x3, x4, theta12, theta13, theta14, theta23, theta24, theta34', 'return ' + functionString + ';');

    return method;
}