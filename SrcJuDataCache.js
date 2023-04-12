function cacheData(data){
    let jkdata = data;
    let cfilename = jkdata.name+'-'+jkdata.type;
    let cachefile = `hiker://files/cache/_fileSelect_${cfilename}.json`;
    writeFile(cachefile,jkdata);
}
