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
        title: "排行",
        url: "",
        pic_url: "hiker://files/cache/src/排行.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "分类",
        url: "",
        pic_url: "hiker://files/cache/src/分类.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "更新",
        url: "",
        pic_url: "hiker://files/cache/src/更新.webp",
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
            requireCache(source.ext, 48);
            parse = yidata;
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
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            item.extra = {name: item.title, img: item.pic_url}
            item.url = $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                sousuo2();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}
//搜索
function sousuo() {
    let d = [];
    let name = MY_URL.split('##')[1];
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
        let parse;
        eval("let source = " + sourcedata[0].parse);
        if(source.ext && /^http/.test(source.ext)){
            requireCache(source.ext, 48);
            parse = yidata;
        }else{
            parse = source;
        }
        MY_HOME = parse['链接'];
        let data = [];
        try{
            eval("let 搜索 = " + parse['搜索'])
            data = 搜索();
        }catch(e){
            log(e.message);
        }
        data.forEach(item => {
            item.url = $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                erji();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}
//二级+源搜索
function erji() {
    let name = MY_PARAMS.name;
    //获取之前历史记录
    function getMask(input){
        try {
            eval('var SrcMark = ' + fetch("hiker://files/cache/src/JmMark.json"));
            if (SrcMark != "") {
                if (SrcMark.route[input] != undefined) {
                    return SrcMark.route[input];
                }
            }
        } catch (e) { }
        return "";
    }
    let isload;//是否正确加载
    let d = [];
    //取之前源选择记录，用于自动定位之前的漫源
    let erjisource = storage0.getMyVar('erjisource'+name) || getMask(name);
    if(erjisource){
        let parse;
        try{
            let sourcedata = datalist.length>0?datalist.filter(it=>{
                return it.name==erjisource.sname&&it.erparse;
            })[0]:{};
            if(sourcedata.erparse){
                eval("let source = " + sourcedata.erparse);
                if(source.ext && /^http/.test(source.ext)){
                    requireCache(source.ext, 48);
                    parse = erdata;
                }else{
                    parse = source;
                }
            }else{
                toast("源接口已不存在，需要重新选源");
            }
        }catch(e){

        }
        try{
            if(parse){
                let html = request(erjisource.url);
                MY_HOME = parse['链接'];
                if(parse['前提']){eval(parse['前提']);}
                let 详情 = parse['详情'];
                let detail1 = 详情['标题1'].split('$$$')[0]+"："+eval(详情['标题1'].split('$$$')[1])+"\n"+详情['标题2'].split('$$$')[0]+"："+eval(详情['标题2'].split('$$$')[1]);
                let detail2 = 详情['描述'].split('$$$')[0]+"："+eval(详情['描述'].split('$$$')[1]);
                d.push({
                    title: detail1,
                    desc: detail2,
                    pic_url: MY_PARAMS.img + '@Referer=',
                    url: MY_PARAMS.img + '@Referer=',
                    col_type: 'movie_1_vertical_pic_blur',
                    extra: {
                        gradient: true,
                        id: "listloading"
                    }
                });
                d.push({
                    title: "下载阅读",
                    url: $("#noLoading#").lazyRule((name) => {
                        
                        return 'hiker://empty'
                    }, name),
                    pic_url: 'https://lanmeiguojiang.com/tubiao/messy/116.svg',
                    col_type: 'icon_small_3',
                    extra: {
                        cls: "loadlist"
                    }
                })
                d.push({
                    title: "加入书架",
                    url: $("#noLoading#").lazyRule((name) => {
                        
                        return 'hiker://empty'
                    }, name),
                    pic_url: 'https://lanmeiguojiang.com/tubiao/messy/70.svg',
                    col_type: 'icon_small_3',
                    extra: {
                        cls: "loadlist"
                    }
                })
                d.push({
                    title: "切换书源",
                    url: $("#noLoading#").lazyRule((name) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                        deleteItemByCls('loadlist');
                        search(name);
                        return 'hiker://empty'
                    }, name),
                    pic_url: 'https://lanmeiguojiang.com/tubiao/messy/23.svg',
                    col_type: 'icon_small_3',
                    extra: {
                        cls: "loadlist"
                    }
                })
                let 解析 = eval(parse['解析']) || "";
                let lists = eval(parse['选集']) || [];
                lists.forEach((item,id) =>{
                    d.push({
                        title: item.title,
                        url: item.url + 解析,
                        col_type: "text_2",
                        extra: {
                            id: name + "_选集_" + id,
                            cls: "loadlist"
                        }
                    });
                })
                isload = 1;
            }
        }catch(e){
            toast('有异常，看日志');
            log(erjisource.sname+'>加载详情失败>'+e.message);
        }
    }
    if(isload){
        setResult(d);
    }else{
        d.push({
            title: "",
            desc: "\n\n选择一个源观看吧👇",
            pic_url: MY_PARAMS.img + '@Referer=',
            url: MY_PARAMS.img + '@Referer=',
            col_type: 'movie_1_vertical_pic_blur',
            extra: {
                gradient: true,
                id: "listloading"
            }
        });
        setResult(d);
        search(name);
    }
}
//搜索页面
function sousuo2() {
    let d = [];
    d.push({
        title: "\n接口搜索结果",
        desc: "\n\n选择一个源观看吧👇",
        pic_url: MY_PARAMS.img + '@Referer=',
        url: 'toast://点我干啥，点下面源',
        col_type: 'movie_1_vertical_pic_blur',
        extra: {
            gradient: true,
            id: "listloading"
        }
    });
    setResult(d);
    search(MY_PARAMS.name);
}
//搜索图源
function search(name) {
    let searchMark = storage0.getMyVar('searchMark') || {};
    if(searchMark[name]){
        addItemAfter('listloading', searchMark[name]);
    }else{
        showLoading('搜源中,请稍后.');
        let searchMark = storage0.getMyVar('searchMark') || {};
        datalist = datalist.filter(it => {return it.erparse})
        let task = function(obj) {
            try{
                let parse;
                eval("let source = " + obj.erparse);
                if(source.ext && /^http/.test(source.ext)){
                    requireCache(source.ext, 48);
                    parse = erdata;
                }else{
                    parse = source;
                }
                MY_HOME = parse['链接'];
                let data = [];
                eval("let 搜索 = " + parse['搜索'])
                data = 搜索();
                data.forEach(item => {
                    item.title = item.title==name?item.desc:item.title;
                    item.desc = '源：'+obj.name;
                    item.url = $("#noLoading#").lazyRule((sname,name,url) => {
                        storage0.putMyVar('erjisource'+name, {sname:sname,url:url});
                        try {
                            eval('var SrcMark = ' + fetch("hiker://files/cache/src/JmMark.json"));
                        } catch (e) {
                            var SrcMark = "";
                        }
                        if (SrcMark == "") {
                            SrcMark = { route: {} };
                        } else if (SrcMark.route == undefined) {
                            SrcMark.route = {};
                        }
                        SrcMark.route[name] = {sname:sname,url:url};
                        let key = 0;
                        let one = "";
                        for (var k in SrcMark.route) {
                            key++;
                            if (key == 1) { one = k }
                        }
                        if (key > 50) { delete SrcMark.route[one]; }
                        writeFile("hiker://files/cache/src/JmMark.json", JSON.stringify(SrcMark));
                        refreshPage();
                        return "toast://选择源："+sname
                    },obj.name,name,item.url);
                    item.col_type = "avatar";
                    item.extra = {name: item.title,img: item.pic_url,parse: parse};
                })
                searchMark[name] = searchMark[name] || [];
                searchMark[name] = searchMark[name].concat(data);
                addItemAfter('listloading', data);
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
            storage0.putMyVar('searchMark',searchMark);
            //clearMyVar('diskSearch');
            toast('搜源完成');
        }else{
        toast('无接口，未找到源');
        }
        hideLoading();
    }
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
