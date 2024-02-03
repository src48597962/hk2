let cfgfile = "hiker://files/rules/Src/Ju/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
    Juconfig["依赖"] = config.依赖 || "https://gitcode.net/src48597962/hk/-/raw/Ju/SrcJuPublic.js";
    writeFile(cfgfile, JSON.stringify(Juconfig));
}

let runTypes = ["漫画","小说","听书","图集","影视","音频","聚合","其它"];
let runMode = Juconfig["runMode"] || "漫画";
let sourcename = Juconfig[runMode+'sourcename'] || "";//主页源名称
let stopTypes = storage0.getItem('stopTypes',[]);

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
//获取类型名称数组
function getTypeNames(is) {
    let snames = [];
    if(is=="主页"){
        runTypes.forEach(it=>{
            if(stopTypes.indexOf(it)==-1){
                snames.push(it);
            }
        })
    }else if(is=="搜索页"){
        snames = ["漫画","小说","听书","影视","聚合"];
    }else{
        snames = runTypes;
    }
    return snames;
}
//获取类型名称数组
function getGroupNames() {
    let gnames = [];
    erdatalist.forEach(it=>{
        if(it.group && gnames.indexOf(it.group)==-1){
            gnames.push(it.group);
        }
    })
    return gnames;
}

//获取接口列表数据
function getListData(lx, selectType) {
    let jkdatalist = [];
    if(lx=="all"){
        jkdatalist = datalist;
    }else if(lx=="yx"){
        jkdatalist = yxdatalist;
    }else if(lx=="yi"){
        jkdatalist = yidatalist;
    }else if(lx=="er"){
        jkdatalist = erdatalist;
    }
    return jkdatalist.filter(it=>{
        return selectType=="全部" || selectType==it.type;
    })
}

//封装选择主页源方法
function selectSource(selectType) {
    let sourcenames = [];
    /*
    getListData("yi",selectType).forEach(it=>{
        if(sourcenames.indexOf(it.name)==-1){
            if(Juconfig[runMode+'sourcename'] == it.name){
                it.name = '‘‘’’<span style="color:red" title="'+it.name+'">'+it.name+'</span>';
            }
            sourcenames.push(it.name);
        }
    })
    */
    const hikerPop = $.require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'hikerPop.js');
    getListData("yi",selectType).forEach(it=>{
        if(sourcenames.indexOf(it.name)==-1){
            if(Juconfig[runMode+'sourcename'] == it.name){
                it.name = it.name + '√';
            }
            sourcenames.push({title: it.name, icon: it.img, url: it.name});
        }
    })
    if(sourcenames.length==0){
        return "toast://当前分类无接口"
    }
    if(getItem('sourceListSort','update') == 'name'){
        sourcenames.sort(SortList);
    }
    //return $(sourcenames,3,"选择 "+selectType+" 主页源").select((runMode,sourcename,cfgfile,Juconfig) => {
    hikerPop.selectCenterIcon({iconList: sourcenames, title: selectType + ">主页源>" + sourcename, columns: 2, click(input) {
        input = input.replace(/‘|’|“|”|<[^>]+>/g,"").replace(/(.*)√/,'$1');
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
        try{
            refreshX5WebView('about:blank');
        }catch(e){}

        Juconfig["runMode"] = runMode;
        Juconfig[runMode+'sourcename'] = input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        refreshPage(false);
        return 'toast://'+runMode+' 主页源已设置为：' + input;
    //}, selectType, sourcename, cfgfile, Juconfig)
    }});
    return "hiker://empty";
}
//打开指定类型的新页面
function rulePage(datatype,ispage) {
    return $("hiker://empty#noRecordHistory##noHistory#" + (ispage ? "?page=fypage" : "")).rule((datatype) => {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
        getYiData(datatype);
    },datatype)
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
        xlog("√一级源代码加载异常>"+e.message);
    }
    if(parse){
        try{
            eval("let gonggong = " + sourcedata[0].public);
            if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
                requireCache(gonggong.ext, 48);
                gonggong = ggdata;
            }
            公共 = gonggong || parse['公共'] || {};
            let info = {type: sourcedata[0].type, name: sourcedata[0].name};
            let 标识 = info.type + "_" + info.name;
            let itemid = 标识 + "_" + datatype;
            let page = MY_PAGE || 1;
            let loading;
            if (page==1 && typeof(setPreResult)!="undefined" && getMyVar('动态加载loading')!=itemid) {           
                loading = 1;
                d.push({
                    title: "",
                    url: "hiker://empty",
                    col_type: "text_1",
                    extra: {
                        lineVisible: false,
                        cls: "loading_gif"
                    }
                })
                d.push({
                    title: "",
                    url: "hiker://empty",
                    col_type: "text_1",
                    extra: {
                        lineVisible: false,
                        cls: "loading_gif"
                    }
                })
                d.push({
                    pic_url: "https://hikerfans.com/weisyr/img/Loading1.gif",
                    col_type: "pic_1_center",
                    url: "hiker://empty",
                    extra: {
                        cls: "loading_gif"
                    }
                })
                setPreResult(d);
                d = [];
                putMyVar('动态加载loading', itemid);
            }
            let 执行str = parse[datatype].toString();
            if(!执行str.includes('rule')){
                执行str = 执行str.replace('setResult','return ');
            }
            let obj = parse.四大金刚 || {};
            if(obj.url && obj.type == datatype){//四大金刚获取分类数据
                let class_name = (obj.class_name||"").split('&').filter(item => item != '');
                let class_url = (obj.class_url||"").split('&').filter(item => item != '');
                let area_name = (obj.area_name||"").split('&').filter(item => item != '');
                let area_url = (obj.area_url||"").split('&').filter(item => item != '');
                let year_name = (obj.year_name||"").split('&').filter(item => item != '');
                let year_url = (obj.year_url||"").split('&').filter(item => item != '');
                let sort_name = (obj.sort_name||"").split('&').filter(item => item != '');
                let sort_url = (obj.sort_url||"").split('&').filter(item => item != '');
                let isAll = (obj.url||"").includes('fyAll')?1:0;
                fyAll = getMyVar("fyAll_id", class_url.length>0?class_url[0]:"");
                fyclass = isAll?fyAll:getMyVar("fyclass_id", class_url.length>0?class_url[0]:"");
                fyarea = isAll?fyAll:getMyVar("fyarea_id", area_url.length>0?area_url[0]:"");
                fyyear = isAll?fyAll:getMyVar("fyyear_id", year_url.length>0?year_url[0]:"");
                fysort = isAll?fyAll:getMyVar("fysort_id", sort_url.length>0?sort_url[0]:"");
                if(page==1){
                    class_url.forEach((it,i)=>{
                        try{
                            d.push({
                                title: fyclass==it?`““””<b><span style="color: #09c11b">`+class_name[i]+`</span></b>`:class_name[i],
                                url: $("#noLoading#").lazyRule((id_name,nowid,newid) => {
                                    if(nowid != newid){
                                        putMyVar(id_name, newid);
                                        refreshPage(false);
                                    }
                                    return 'hiker://empty'
                                }, isAll?"fyAll_id":"fyclass_id", fyclass, it),
                                col_type: 'scroll_button'
                            })
                        }catch(e){}
                    })
                    area_url.forEach((it,i)=>{
                        if(i==0){
                            d.push({
                                col_type: "blank_block"
                            })
                        }
                        try{
                            d.push({
                                title: fyarea==it?`““””<b><span style="color: #09c11b">`+area_name[i]+`</span></b>`:area_name[i],
                                url: $("#noLoading#").lazyRule((id_name,nowid,newid) => {
                                    if(nowid != newid){
                                        putMyVar(id_name, newid);
                                        refreshPage(false);
                                    }
                                    return 'hiker://empty'
                                }, isAll?"fyAll_id":"fyarea_id", fyarea, it),
                                col_type: 'scroll_button'
                            })
                        }catch(e){}
                    })
                    year_url.forEach((it,i)=>{
                        if(i==0){
                            d.push({
                                col_type: "blank_block"
                            })
                        }
                        try{
                            d.push({
                                title: fyyear==it?`““””<b><span style="color: #09c11b">`+year_name[i]+`</span></b>`:year_name[i],
                                url: $("#noLoading#").lazyRule((id_name,nowid,newid) => {
                                    if(nowid != newid){
                                        putMyVar(id_name, newid);
                                        refreshPage(false);
                                    }
                                    return 'hiker://empty'
                                }, isAll?"fyAll_id":"fyyear_id", fyyear, it),
                                col_type: 'scroll_button'
                            })
                        }catch(e){}
                    })
                    sort_url.forEach((it,i)=>{
                        if(i==0){
                            d.push({
                                col_type: "blank_block"
                            })
                        }
                        try{
                            d.push({
                                title: fysort==it?`““””<b><span style="color: #09c11b">`+sort_name[i]+`</span></b>`:sort_name[i],
                                url: $("#noLoading#").lazyRule((id_name,nowid,newid) => {
                                    if(nowid != newid){
                                        putMyVar(id_name, newid);
                                        refreshPage(false);
                                    }
                                    return 'hiker://empty'
                                }, isAll?"fyAll_id":"fysort_id", fysort, it),
                                col_type: 'scroll_button'
                            })
                        }catch(e){}
                    })
                }
                d.push({
                    col_type: "blank_block"
                })
                let fypage = page;
                MY_URL = obj.url.replace('fyAll',fyAll).replace('fyclass',fyclass).replace('fyarea',fyarea).replace('fyyear',fyyear).replace('fysort',fysort).replace('fypage',fypage);
                执行str = 执行str.replace('getResCode()','request(MY_URL)');
            }
            let getData = [];
            try{
                eval("let 数据 = " + 执行str);
                getData = 数据();
            }catch(e){
                getData = [];
                xlog(e.message);
            }
            if(loading){
                deleteItemByCls("loading_gif");
            }
            if(getData.length==0 && page==1){
                d.push({
                    title: "未获取到数据",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                })
            }else if(getData.length>0){
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                getData.forEach(item => {
                    try{
                        item = toerji(item,info);
                    }catch(e){
                        //log(item);
                    }
                })
            }
            d = d.concat(getData);
        }catch(e){
            toast(datatype+"代码报错，更换主页源或联系接口作者");
            xlog("√报错信息>"+e.message + " 错误行#" + e.lineNumber);
        }
        setResult(d);
    }else{
        if(datatype=="主页"){
            d.push({
                title: runMode+" 主页源不存在\n需先选择配置主页源",//\n设置-选择漫画/小说/听书/
                desc: "点此或上面类型按钮皆可选择",//设置长按菜单可以开启界面切换开关
                url: $('#noLoading#').lazyRule((input) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                    return selectSource(input);
                }, runMode),
                col_type: "text_center_1",
                extra: {
                    lineVisible: false
                }
            })
        }
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
//聚影搜索调用
function JySearch(sskeyword,sstype) {
    if(sstype=="聚搜接口"){
        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
            xunmi(name);
        }, sskeyword);
    }else if(sstype=="云盘接口"){
        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
            let d = [];
            d.push({
                title: name+"-云盘聚合搜索",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                    id: "listloading",
                    lineVisible: false
                }
            })
            setResult(d);
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
            aliDiskSearch(name);
        }, sskeyword);
    }else if(sstype=="Alist接口"){
        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
            let d = [];
            d.push({
                title: name+"-Alist聚合搜索",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                    id: "listloading",
                    lineVisible: false
                }
            })
            setResult(d);
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAlist.js');
            alistSearch2(name,1);
        }, sskeyword);
    }else{
        return "hiker://search?rule=聚影√&s=" + sskeyword;
    }
}

function SortList(v1, v2) {
    var aFirstChar = v1.title.charAt(0);
    var bFirstChar = v2.title.charAt(0);

    // 判断是否为数字
    function isNumber(char) {
        return !isNaN(Number(char));
    }

    // 数字排序
    if (isNumber(aFirstChar) && isNumber(bFirstChar)) {
        return parseInt(aFirstChar, 10) - parseInt(bFirstChar, 10);
    }

    // 如果仅有一个是数字，则数字排在前面
    if (isNumber(aFirstChar)) {
        return -1;
    } else if (isNumber(bFirstChar)) {
        return 1;
    }

    // 对于非数字字符，先按ASCII码排序英文部分
    var asciiResult = aFirstChar.localeCompare(bFirstChar, 'en', { sensitivity: 'base' });

    // 再按Unicode编码排序中文部分
    if (asciiResult === 0) {
        var aChinese = /[^\x00-\xff]/.test(aFirstChar);
        var bChinese = /[^\x00-\xff]/.test(bFirstChar);

        // 如果都是中文或者都是非中文，则根据ASCII结果返回
        if ((aChinese && bChinese) || (!aChinese && !bChinese)) {
        return asciiResult;
        }

        // 否则，中文排在非中文后面
        return aChinese ? 1 : -1;
    }

    return asciiResult;
}
