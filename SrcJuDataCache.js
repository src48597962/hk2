function cacheData(data){
    let jkdata = data;
    let cfilename = jkdata.name+'-'+jkdata.type;
    let cachefile = `hiker://files/cache/_fileSelect_${cfilename}.json`;
    writeFile(cachefile,JSON.stringify(jkdata));
}

function readData(fileid){
    let cfilename = fileid;
    let cachefile = `hiker://files/cache/_fileSelect_${cfilename}.json`;
    let cachedata = fetch(cachefile);
    if(cachedata != ""){
        try{
            eval("var jkdata=" + cachedata+ ";");
        }catch(e){
            var jkdata = {};
        }
    }else{
        var jkdata = {};
    }
    let public = jkdata.public;
    let parse = jkdata.parse;
    let erparse = jkdata.erparse;
    return {parse:parse,erparse:erparse,public:public}
}