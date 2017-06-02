function range(max, min, colorRange){;
    var temp = 0;
    var diff = Math.round(max / colorRange);
    var dataRange = [min];
    for(i=1; i<colorRange; i++){
        dataRange[i]= dataRange[i-1] + diff;
      }
    console.log(dataRange)
    return dataRange;
}
