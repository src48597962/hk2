let runModes = ["漫画","小说"];
let cfgfile = "hiker://files/rules/Src/Ju/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
}
let runMode = Juconfig["runMode"] || "漫画";
let sourcename = Juconfig[runMode+'sourcename'] || "";

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
datalist.reverse();

let yxdatalist = datalist.filter(it=>{
    return !it.stop;
});
let yidatalist = yxdatalist.filter(it=>{
    return it.parse && it.type==runMode;
});
let erdatalist = yxdatalist.filter(it=>{
    return it.erparse;
});

function rulePage(type,page) {
    return $("hiker://empty#noRecordHistory##noHistory#" + (page ? "?page=fypage" : "")).rule((type) => {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
        getYiData(type);
    },type)
}

//获取一级数据
function getYiData(type,od) {
    let d = od || [];
    let sourcedata = yidatalist.filter(it=>{
        return it.name==sourcename;
    });
    let parse;
    let 公共;
    try{
        if(sourcedata.length>0){
            eval("let source = " + sourcedata[0].parse);
            if(source.ext && /^http/.test(source.ext)){
                requireCache(source.ext, 48);
                parse = yidata;
            }else{
                parse = source;
            }
            if(parse){
                eval("let gonggong = " + sourcedata[0].public);
                公共 = gonggong || parse['公共'] || {};
            }
        }
    }catch(e){
        log("一级源接口加载异常>"+e.message);
    }
    if(parse){
        let data = [];
        try{
            eval("let 数据 = " + parse[type])
            data = 数据();
        }catch(e){
            log(e.message);
        }
        if(data.length==0){
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            let extra = item.extra || {};
            extra.name = extra.name || extra.pageTitle ||item.title;
            extra.img = extra.img || item.pic_url || item.img;
            extra.stype = sourcedata[0].type;
            extra.pageTitle = extra.pageTitle || extra.name;
            if(item.url && /^http/.test(item.url) && !/@/.test(item.url)){
                extra.surl = item.url.replace(/#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#/,"");
                extra.sname = sourcename;
            }
            if((item.col_type!="scroll_button") || item.extra){
                item.extra = extra;
            }
            item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖);
                erji();
            }):item.url
        })
        d = d.concat(data);
    }else{
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }
    setResult(d);
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcSimple.js');
    return PYStr(str,x);
}