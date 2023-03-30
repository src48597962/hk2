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

//一级
function yiji() {
    Version();
    let sourcename = JMconfig['source'] || "神漫画";
    let sourcedata = datalist.length>0?datalist.filter(it=>{
        return it.name==sourcename&&it.parse;
    }):[];
    let d = [];
    d.push({
        title: "管理",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmSet.js');
            SRCSet();
        }),
        pic_url: "",
        col_type: 'icon_5'
    })
    d.push({
        title: "更新",
        url: "",
        pic_url: "",
        col_type: 'icon_5'
    })
    d.push({
        title: "分类",
        url: "",
        pic_url: "",
        col_type: 'icon_5'
    })
    d.push({
        title: "排行",
        url: "",
        pic_url: "",
        col_type: 'icon_5'
    })
    d.push({
        title: "书架",
        url: "",
        pic_url: "",
        col_type: 'icon_5'
    })
    if(sourcedata.length==0){
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }else{
        log(sourcedata[0]);
    }

    setResult(d);
    /*
    if(getMyVar('jydingyue','0')=="0"&&JYconfig['codedyid']&&JYconfig['codeid']!=JYconfig['codedyid']){
        putMyVar('jydingyue','1');
        try{
            var nowtime = Date.now();
            var oldtime = parseInt(getItem('dingyuetime','0').replace('time',''));
            if(nowtime > (oldtime+6*60*60*1000)){
                let pasteurl = JYconfig['codedyid'];
                let text = parsePaste('https://netcut.cn/p/'+aesDecode('Juying', pasteurl));
                if(pasteurl&&!/^error/.test(text)){
                    let pastedata = JSON.parse(base64Decode(text));
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
                    let jknum = 0;
                    let jxnum = 0;
                    var jkdatalist = pastedata.jiekou||[];
                    if(jkdatalist.length>0){
                        jknum = jiekousave(jkdatalist, 0, JYconfig['codedytype']||1);
                    }
                    var jxdatalist = pastedata.jiexi||[];
                    if(jxdatalist.length>0){
                        jxnum = jiexisave(jxdatalist, 0, JYconfig['codedytype']||1);
                    }
                    if(pastedata.live){
                        let livefilepath = "hiker://files/rules/Src/Juying/liveconfig.json";
                        let liveconfig = pastedata.live;
                        writeFile(livefilepath, JSON.stringify(liveconfig));
                    }
                    log("订阅资源码自动同步完成，接口："+jknum+"，解析："+jxnum);
                }else{
                    log("订阅资源码自动同步口令错误或已失效");
                }
                setItem('dingyuetime',nowtime+"time");
            }
        } catch (e) {
            log('自动订阅更新失败：'+e.message); 
        }
    }
    */
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
