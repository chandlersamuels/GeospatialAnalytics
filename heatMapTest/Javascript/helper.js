
function range(max, min, colorRange){
    var temp = 0;
    var diff = Math.round(max / colorRange);
    var dataRange = [min];
    for(var i=1; i<colorRange; i++){
        dataRange[i]= dataRange[i-1] + diff;
      }
    return dataRange;
};

function rangeNEG(max, min, colorRange){
    var temp = 0;
    var newMin = Math.abs(min)
    var diff = Math.round(newMin / colorRange);
    var dataRange = new Array(colorRange);
    dataRange[0] = 0;
    for(var i=1; i<colorRange; i++){
        dataRange[i] = dataRange[i-1] - diff;
      }
    return dataRange;
};
