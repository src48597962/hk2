//修正按钮元素
function toerji(item) {
    let info = storage0.getMyVar('一级源接口信息');
    let extra = item.extra || {};
    extra.name = extra.name || extra.pageTitle ||item.title;
    extra.img = extra.img || item.pic_url || item.img;
    extra.stype = info.type;
    extra.pageTitle = extra.pageTitle || extra.name;
    if(item.url && !/js:|select:|\(|\)|=>|@|toast:/.test(item.url)){
        extra.surl = item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
        extra.sname = info.name;
    }
    if((item.col_type!="scroll_button") || item.extra){
        item.extra = extra;
    }
    item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
        require(config.依赖);
        erji();
    }):item.url
    return item;
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcSimple.js');
    return PYStr(str,x);
}
//写接口数据临时缓存
function cacheData(jkdata){
    let fileid = jkdata.type + '_'+ jkdata.name;
    let cachefile = `hiker://files/_cache/${fileid}.json`;
    if (!fileExist(cachefile)) {
        writeFile(cachefile,JSON.stringify(jkdata));
    }
}
//读接口数据临时缓存
function readData(fileid,datatype){
    let cachefile = `hiker://files/_cache/${fileid}.json`;
    let jkdata = {};
    try{
        eval("jkdata=" + fetch(cachefile));
    }catch(e){
        log("jkdata加载失败>"+fileid+">"+e.message);
    }

    try{
        let parse;
        let source;
        if(datatype==1){
            eval("source = " + jkdata.parse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
        }else if(datatype==2){
            eval("source = " + jkdata.erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
        }else if(datatype==3){
            eval("source = " + jkdata.public);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = ggdata;
            } else {
                parse = source;
            }
        }
        return parse;
    }catch(e){
        log("读取接口本地缓存文件失败>"+e.message);
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
