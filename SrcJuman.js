//聚漫，接口型空壳小程序，接口分为主页源和搜索源
let cfgfile = "hiker://files/rules/Src/Juman/config.json";
let Jumancfg=fetch(cfgfile);
if(Jumancfg != ""){
    eval("var JMconfig=" + Jumancfg+ ";");
}else{
    var JMconfig= {};
}

let sourcefile = "hiker://files/rules/Src/Juman/jiekou.json";
let sourcedata = fetch(sourcefile);
if(sourcedata != ""){
    eval("var datalist=" + sourcedata+ ";");
}else{
    var datalist = [];
}
let sourcename = JMconfig['source'] || "神漫画";


//一级
function yiji() {
    Version();
    downloadicon();
    let d = [];
    d.push({
        title: "管理",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmSet.js');
            SRCSet();
        }),
        pic_url: "hiker://files/cache/src/管理.png",
        col_type: 'icon_5'
    })
    d.push({
        title: "更新",
        url: "",
        pic_url: "hiker://files/cache/src/更新.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "分类",
        url: "",
        pic_url: "hiker://files/cache/src/分类.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "排行",
        url: "",
        pic_url: "hiker://files/cache/src/排行.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "书架",
        url: "",
        pic_url: "hiker://files/cache/src/书架.png",
        col_type: 'icon_5'
    })
    d.push({
        col_type: 'line'
    })
    let sourcedata = datalist.length>0?datalist.filter(it=>{
        return it.name==sourcename&&it.parse;
    }):[];
    if(sourcedata.length==0){
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }else{
        let parse;
        eval("let source = " + sourcedata[0].parse);
        if(source.ext && /^http/.test(source.ext)){
            require(source.ext, 48);
            parse = yi;
        }else{
            parse = source;
        }
        MY_HOME = parse['链接'];
        let data = [];
        try{
            eval("let 主页 = " + parse['主页'])
            data = 主页();
        }catch(e){
            log(e.message);
        }
        if(data.length==0){
            data.push({
                title: "主页接口的主页数据获取失败",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        d = d.concat(data);
    }

    setResult(d);
}
//搜索
function sousuo() {
    let d = [];
    let wd = MY_URL.split('##')[1];
    let page = MY_URL.split('##')[2];
    let sourcedata = datalist.length>0?datalist.filter(it=>{
        return it.name==sourcename&&it.parse;
    }):[];
    if(sourcedata.length==0){
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }else{
        let source = sourcedata[0].erparse;
        if(source.ext && /^http/.test(source.ext)){
            requireCache(source.ext, 48);
            MY_HOME = erparse['链接'];
            let data = [];
            try{
                eval("let 搜索 = " + erparse['搜索'])
                data = 搜索();
            }catch(e){
                log(e.message);
            }
            if(data.length==0){
                data.push({
                    title: "搜索接口的搜索数据获取失败",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                })
            }
            d = d.concat(data);
        }
    }
    setResult(d);
}
//二级+源搜索
function erji(name) {
    name = name || MY_PARAMS.name;
    let d = [];
    let task = function(obj) {
        try{
            let source = obj.erparse;
            if(source.ext && /^http/.test(source.ext)){
                requireCache(source.ext, 48);
                MY_HOME = erparse['链接'];
                let data = [];
                eval("let 搜索 = " + erparse['搜索'])
                data = 搜索();
            }
        }catch(e){
          log(obj.name+'>搜源失败>'+e.message);
        }
        return 1;
    }
    let list = datalist.map((item)=>{
        return {
          func: task,
          param: item,
          id: item.name
        }
    });
    if(list.length>0){
        //deleteItemByCls('loadlist');
        //putMyVar('diskSearch', '1');
        be(list, {
            func: function(obj, id, error, taskResult) {
            },
            param: {
            }
        });
        //storage0.putMyVar('alistMark',alistMark);
        //clearMyVar('diskSearch');
        toast('搜源完成');
    }else{
      toast('无接口，未找到源');
    }
    hideLoading();

    setResult(d);
}
//图标下载
function downloadicon() {
    try{
        if(!fileExist('hiker://files/cache/src/管理.png')){
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/管理.png", 'hiker://files/cache/src/管理.png');
        }
        if(!fileExist('hiker://files/cache/src/更新.webp')){
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/更新.webp", 'hiker://files/cache/src/更新.webp');
        }
        if(!fileExist('hiker://files/cache/src/分类.webp')){
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/分类.webp", 'hiker://files/cache/src/分类.webp');
        }
        if(!fileExist('hiker://files/cache/src/排行.webp')){
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/排行.webp", 'hiker://files/cache/src/排行.webp');
        }
        if(!fileExist('hiker://files/cache/src/书架.jpg')){
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/书架.png", 'hiker://files/cache/src/书架.png');
        }
    }catch(e){}
}
//版本检测
function Version() {
    var nowVersion = "0.1";//现在版本 
    var nowtime = Date.now();
    var oldtime = parseInt(getItem('VersionChecktime','0').replace('time',''));
    if (getMyVar('SrcJuman-VersionCheck', '0') == '0' && nowtime > (oldtime+12*60*60*1000)) {
        try {
            eval(request(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('Comics','master') + 'SrcTmplVersion.js'))
            if (parseFloat(newVersion.SrcJuman) > parseFloat(nowVersion)) {
                confirm({
                    title:'发现新版本，是否更新？', 
                    content:nowVersion+'=>'+newVersion.SrcJuman+'\n'+newVersion.SrcJumandesc[newVersion.SrcJuman], 
                    confirm: $.toString((nowtime) => {
                        setItem('VersionChecktime', nowtime+'time');
                        deleteCache();
                        delete config.依赖;
                        refreshPage();
                    },nowtime),
                    cancel:''
                })
                log('检测到新版本！\nV'+newVersion.SrcJuman+'版本》'+newVersion.SrcJumandesc[newVersion.SrcJuman]);
            }
            putMyVar('SrcJuman-Version', '-V'+newVersion.SrcJuying);
        } catch (e) { }
        putMyVar('SrcJuman-VersionCheck', '1');
    }else{
        putMyVar('SrcJuman-Version', '-V'+nowVersion);
    }
}
