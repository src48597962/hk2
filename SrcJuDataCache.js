function cacheData(data){
    let cfilename = data.name+'-'+data.type;
    let cachefile = `hiker://files/cache/_fileSelect_${cfilename}.json`;
    writeFile(cachefile,data);
}
