//子页面读接口临时缓存
function readData(fileid,datatype){
    let cachefile = `hiker://files/_cache/${fileid}.json`;
    let jkdata = {};
    try{
        let cachefiledata = fetch(cachefile);
        if(cachefiledata){
            eval("jkdata=" + cachefiledata);
        }else{
            let sourcefile = "hiker://files/rules/Src/Ju/jiekou.json";
            let sourcedata = fetch(sourcefile);
            if(sourcedata != ""){
                try{
                    eval("var datalist=" + sourcedata+ ";");
                }catch(e){
                    var datalist = [];
                }
            }else{
                var datalist = [];
            }
            let jklist = datalist.filter(it=>{
                return (it.type+'_'+it.name) == fileid;
            });
            if(jklist.length==1){
                jkdata = jklist[0];
                writeFile(cachefile,JSON.stringify(jkdata));
            }
        }
        
    }catch(e){
        xlog("接口数据加载失败>"+fileid+">"+e.message);
    }

    try{
        let parse;
        let source;
        if(datatype==1){
            eval("source = " + jkdata.parse);
            if (source && source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
        }else if(datatype==2){
            eval("source = " + jkdata.erparse);
            if (source && source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
        }else if(datatype==3){
            eval("source = " + jkdata.public);
            if (source && source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = ggdata;
            } else {
                parse = source;
            }
        }
        return parse;
    }catch(e){
        xlog("读取接口本地缓存文件失败>"+e.message);
        return "";
    }
}
let 一级 = function(fileid) {
    let info = storage0.getMyVar('一级源接口信息') || {};
    let 标识 = info.type + "_" + info.name;
    fileid = fileid || 标识;
    return readData(fileid, 1)
}
let 二级 = function(fileid) {
    let info = storage0.getMyVar('二级源接口信息') || {};
    let 标识 = info.type + "_" + info.name;
    fileid = fileid || 标识;
    return readData(fileid, 2)
}
let 公共 = function(fileid) {
    return readData(fileid, 3)
}
let 属性 = function(fileid, parse, attribut) {
    let 接口;
    eval("接口 = " + parse);
    return 接口(fileid)[attribut];
};

$.exports = {
    一级: 一级,
    二级: 二级,
    公共: 公共,
    属性: 属性
}
