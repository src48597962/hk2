let cfilename = jiekoudata.name+'-'+jiekoudata.type;
let cachefile = `hiker://files/cache/_fileSelect_${cfilename}.json`;
writeFile(cachefile,jiekoudata);