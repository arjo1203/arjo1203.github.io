var A = [];
var numOfElement = 6;

for(var i = 0; i < numOfElement; i++){
    A.push(i);   
}

while(A.length == numOfElement){
    console.log(A);
    var index = binarySearch(A, 3, 0, A.length - 1);   
    console.log(index);
}

function binarySearch(array, item, start, end){
    var i = Math.floor(end + start) / 2; 
    
    if(array[i] == item) {
        console.log('Item found!');
    
        return i;
    }
//    else{
//        if(array[i] > item) {  
//            start = i;
//            return binarySearch(array, item, start, end);
//            console.log('Item is less');
//        }
//        else {
//            end = i;
//            return binarySearch(array, item, start, end);
//            console.log('Item is greater');
//        }
//    }
}