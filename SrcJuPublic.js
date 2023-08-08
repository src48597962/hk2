let cfgfile = "hiker://files/rules/Src/Ju/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
    Juconfig["依赖"] = config.依赖 || "https://gitcode.net/src48597962/hk/-/raw/Ju/SrcJuPublic.js";
    writeFile(cfgfile, JSON.stringify(Juconfig));
}
let runModes = ["漫画","小说","听书","图集","影视"];
let runMode = Juconfig["runMode"] || "漫画";
let sourcename = Juconfig[runMode+'sourcename'] || "";//主页源名称

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
    return it.parse;
});
let erdatalist = yxdatalist.filter(it=>{
    return it.erparse;
});
function selectsource(input) {
    let sourcenames = [];
    yidatalist.forEach(it=>{
        if(it.type==input && sourcenames.indexOf(it.name)==-1){
            if(Juconfig[runMode+'sourcename'] == it.name){
                it.name = '‘‘’’<span style="color:red" title="'+it.name+'">'+it.name+'</span>';
            }
            sourcenames.push(it.name);
        }
    })
    return $(sourcenames,3,"选择"+input+"主页源").select((runMode,sourcename,cfgfile,Juconfig) => {
        input = input.replace(/‘|’|“|”|<[^>]+>/g,"");
        if(Juconfig["runMode"] == runMode && input==Juconfig[runMode+'sourcename']){
            return 'toast://'+runMode+' 主页源：' + input;
        }
        if (typeof (unRegisterTask) != "undefined") {
            unRegisterTask("juyue");
        }else{
            toast("软件版本过低，可能存在异常");
        }
        try{
            let listMyVar = listMyVarKeys();
            listMyVar.forEach(it=>{
                if(!/^SrcJu_|initConfig/.test(it)){
                    clearMyVar(it);
                }
            })
        }catch(e){
            log('清MyVar失败>'+e.message);
            clearMyVar(MY_RULE.title + "分类");
            clearMyVar(MY_RULE.title + "更新");
            clearMyVar(MY_RULE.title + "类别");
            clearMyVar(MY_RULE.title + "地区");
            clearMyVar(MY_RULE.title + "进度");
            clearMyVar(MY_RULE.title + "排序");
            clearMyVar("排名");
            clearMyVar("分类");
            clearMyVar("更新");
            clearMyVar(runMode+"_"+sourcename);
            clearMyVar("一级源接口信息");
        }
        Juconfig["runMode"] = runMode;
        Juconfig[runMode+'sourcename'] = input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        refreshPage(false);
        return 'toast://'+runMode+' 主页源已设置为：' + input;
    }, input, sourcename, cfgfile, Juconfig)
}
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
        return it.name==sourcename && it.type==runMode;
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
        }
    }catch(e){
        log("√一级源接口加载异常>"+e.message);
    }
    if(parse){
        eval("let gonggong = " + sourcedata[0].public);
        if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
            requireCache(gonggong.ext, 48);
            gonggong = ggdata;
        }
        公共 = gonggong || parse['公共'] || {};
        let info = storage0.getMyVar('一级源接口信息');
        let 标识 = info.type + "_" + info.name;
        let page = MY_PAGE || 1;
        let data = [];
        try{
            eval("let 数据 = " + parse[type])
            data = 数据();
        }catch(e){
            log(e.message);
        }
        if(data.length==0 && page==1){
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            let extra = item.extra || {};
            extra.name = extra.name || extra.pageTitle || (item.title?item.title.replace(/‘|’|“|”|<[^>]+>/g,""):"");
            extra.img = extra.img || item.pic_url || item.img;
            extra.stype = sourcedata[0].type;
            extra.pageTitle = extra.pageTitle || extra.name;
            if(item.url && !/js:|select:|\(|\)|=>|@|toast:|hiker:\/\/page/.test(item.url)){
                extra.surl = item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
                extra.sname = sourcename;
            }
            if((item.col_type!="scroll_button") || item.extra){
                item.extra = extra;
            }
            item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖);
                erji();
            }):item.url
            /*
            if(extra.stype=="图集" && /js:|select:|\(|\)|=>|toast:/.test(item.url)){
                extra.longClick = [{
                    title: "下载本地📥",
                    js: $.toString(() => {
                        return "hiker://page/download.view#noRecordHistory##noRefresh##noHistory#?rule=本地资源管理"
                    })
                }];
                extra.chapterList = [{title:"正文", url:item.url.split("@")[0]}],
                extra.defaultView = "1";
                extra.info = {
                    "bookName": extra.name,
                    "bookTopPic": extra.img,
                    "parseCode": item.url.split("js:")[1],
                    "ruleName": MY_RULE.title,
                    "type": "comic"
                }
            }
            */
        })
        d = d.concat(data);
    }else{
        d.push({
            title: "请先配置一个主页源\n设置-选择漫画/小说/听书/...",
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