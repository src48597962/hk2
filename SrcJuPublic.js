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
            xlog('清MyVar失败>'+e.message);
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
let sousuoextra = {
    id: "sousuopageid",
    newWindow: true,
    windowId: MY_RULE.title + "搜索页",
    longClick: [{
        title: "🔍搜索",
        js: $.toString(() => {
            return $("hiker://empty#noRecordHistory##noHistory##fullTheme###fypage").rule(() => {
                require(config.依赖);
                newsousuopage();
            })
        })
    }]
}
function rulePage(datatype,ispage) {
    let url = "hiker://empty#noRecordHistory##noHistory#" + (ispage ? "?page=fypage" : "");
    if(datatype=="分类"){
        return $('#noLoading#').lazyRule((url,sousuoextra) => {
            delete sousuoextra.newWindow;
            updateItem("sousuopageid",{extra:sousuoextra});
            return $(url).rule((sousuoextra) => {
                addListener("onClose", $.toString((sousuoextra) => {
                    sousuoextra.newWindow = true;
                    updateItem("sousuopageid",{extra:sousuoextra});
                },sousuoextra));
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                getYiData('分类');
            },sousuoextra)
        },url,sousuoextra)
    }else{
        return $(url).rule((datatype) => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
            getYiData(datatype);
        },datatype)
    }
}

//获取一级数据
function getYiData(datatype,od) {
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
        xlog("√一级源接口加载异常>"+e.message);
    }
    if(parse){
        eval("let gonggong = " + sourcedata[0].public);
        if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
            requireCache(gonggong.ext, 48);
            gonggong = ggdata;
        }
        公共 = gonggong || parse['公共'] || {};
        let info = storage0.getMyVar('一级源接口信息');
        //let info = {type: sourcedata[0].type, name: sourcedata[0].name};
        let 标识 = info.type + "_" + info.name;
        /*
        let itemid = 标识 + "_" + datatype;
        d.push({
            title: "加载中",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
                id: itemid
            }
        })
        setResult(d);
        */
        let page = MY_PAGE || 1;
        let loading;
        if (page==1 && typeof(setPreResult)!="undefined") {           
            loading = 1;
            d.push({
                title: "",
                col_type: "text_1",
                extra: {
                    lineVisible: false,
                    cls: "loading_gif"
                }
            })
            d.push({
                title: "",
                col_type: "text_1",
                extra: {
                    lineVisible: false,
                    cls: "loading_gif"
                }
            })
            d.push({
                pic_url: "https://hikerfans.com/weisyr/img/Loading1.gif",
                col_type: "pic_1_center",
                extra: {
                    cls: "loading_gif"
                }
            })
            setPreResult(d);
            d = [];
        }
        let data = [];
        try{
            eval("let 数据 = " + parse[datatype])
            data = 数据();
        }catch(e){
            xlog(e.message);
        }
        if(loading){
            deleteItemByCls("loading_gif");
        }
        if(data.length==0 && page==1){
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }else if(data.length>0){
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
            data.forEach(item => {
                item = toerji(item,info);
            })
        }
        d = d.concat(data);
        /*
        addItemBefore(itemid, data);
        */
        
        setResult(d);
    }else{
        d.push({
            title: "请先配置一个主页源\n设置-选择漫画/小说/听书/...",
            desc: "设置长按菜单可以开启界面切换开关",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
        setResult(d);
    }
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcSimple.js');
    return PYStr(str,x);
}
//重定义打印日志，只允许调试模式下打印
var xlog = log;
log = function(msg){
    if(getMyVar("SrcJu_调试模式") || getItem("SrcJu_接口日志")){
        xlog(msg);
    }
}
