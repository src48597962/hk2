//修正按钮元素
function toerji(item) {
    let info = storage0.getMyVar('一级源接口信息');
    let extra = item.extra || {};
    extra.name = extra.name || extra.pageTitle ||item.title;
    extra.img = extra.img || item.pic_url || item.img;
    extra.stype = info.type;
    extra.pageTitle = extra.pageTitle || extra.name;
    if(item.url && !/js:|select:|\(|\)|=>|@/.test(item.url)){
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
    try{
        let parse;
        let source;
        if(datatype=="1"){
            source = jkdata.parse;
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
        }else if(datatype=="2"){
            source = jkdata.erparse;
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
        }else if(datatype=="0"){
            parse = jkdata.public;
        }
        return parse;
    }catch(e){
        log("读取接口本地缓存文件失败>"+e.message);
        return {};
    }
}