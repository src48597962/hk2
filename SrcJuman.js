//聚漫，接口型空壳小程序，接口分为主页源和搜索源
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmPublic.js');

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
        pic_url: "hiker://files/cache/src/管理.svg",
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
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmClass.js');
            Category();
        }),
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
        title: getItem('collectionorhistory')=="history"?"历史":"收藏",
        url: getItem('collectionorhistory')=="history"?"hiker://history":"hiker://collection",
        pic_url: "hiker://files/cache/src/收藏.svg",
        col_type: 'icon_5',
        extra: {
            longClick: [{
                title: "切换按钮",
                js: $.toString(() => {
                    if(getItem('collectionorhistory')=="history"){
                        setItem('collectionorhistory','collection');
                    }else{
                        setItem('collectionorhistory','history');
                    }
                    refreshPage(false);
                })
            }]
        }
    })
    d.push({
        col_type: 'line'
    })
    let sourcedata = yidatalist.filter(it=>{
        return it.name==yijisource;
    });
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
                erji();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}
//搜索页面
function sousuo() {
    putMyVar('SrcJmSousuo','1');
    let name = MY_URL.split('##')[1];
    let d = [];
    d.push({
        title: "搜索中...",
        url: "hiker://empty",
        extra: {
            id: "listloading"
        }
    });
    setResult(d);
    java.lang.Thread.sleep(1000);
    search(name);
    clearMyVar('SrcJmSousuo');
}

//二级+源搜索
function erji() {
    addListener("onClose", $.toString(() => {
        clearMyVar('erjidata');
    }));
    let name = MY_PARAMS.name;
    let isload;//是否正确加载
    let d = [];
    let parse;
    let erjidata = storage0.getMyVar('erjidata') || getMark(name);
    let sname = erjidata.sname || MY_PARAMS.sname || "";
    let surl = erjidata.surl || MY_PARAMS.surl || "";
    let sauthor = "未知";
    let sourcedata = erdatalist.filter(it=>{
        return it.name==sname;
    });
    try{
        if(sourcedata.length==0){
            sourcedata.push({erparse: MY_PARAMS.parse});
        }
        if(sourcedata[0].erparse){
            eval("let source = " + sourcedata[0].erparse);
            if(source.ext && /^http/.test(source.ext)){
                requireCache(source.ext, 48);
                parse = erdata;
            }else{
                parse = source;
            }
        }
    }catch(e){
        log(e.message);
    }
    try{
        if(parse){
            sauthor = parse["作者"] || sauthor;
            let html = request(surl);
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
                    gradient: true
                }
            })
            d.push({
                title: "倒转排序",
                url: $("#noLoading#").lazyRule(() => {
                    if (getMyVar('shsort') == '1') { putMyVar('shsort', '0'); } else { putMyVar('shsort', '1') };
                    refreshPage(false);
                    return 'toast://切换排序成功'
                }),
                pic_url: getMyVar('shsort') == '1'?'https://lanmeiguojiang.com/tubiao/messy/127.svg':'https://lanmeiguojiang.com/tubiao/messy/126.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist"
                }
            })
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
                title: "切换书源",
                url: getMyVar('backsousuo')=="1"?`#noLoading#@lazyRule=.js:back(false);'hiker://empty'`:$("#noLoading#").lazyRule((name) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                    deleteItemByCls('loadlist');
                    search(name);
                    return 'hiker://empty'
                }, name),
                pic_url: 'https://lanmeiguojiang.com/tubiao/messy/25.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist"
                }
            })
            let 解析 = eval(parse['解析']) || "";
            let lists = eval(parse['选集']) || [];
            if(getMyVar('shsort') == '1'){
                lists.reverse();
            }
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
        log(MY_PARAMS.sname+'>加载详情失败>'+e.message);
    }
    
    if(isload){
        d.push({
            title: "‘‘’’<small><font color=#f20c00>当前数据来自接口源："+sname+"，作者："+sauthor+"</font></small>",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "listloading",
                lineVisible: false
            }
        });
        setResult(d);
        //二级源浏览记录保存
        let erjidata = {name:name,sname:sname,surl:surl};
        setMark(erjidata);
        /*收藏更新最新章节，等后面再写
        setLastChapterRule('js:' + $.toString((type,ua,data)=>{
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
            xunmi(type,ua,data);
        }, type, ua, MY_PARAMS.data))
        */
    }else{
        d.push({
            title: "\n搜索接口源结果如下",
            desc: "\n\n选择一个源观看吧👇",
            pic_url: MY_PARAMS.img + '@Referer=',
            url: MY_PARAMS.img + '@Referer=',
            col_type: 'movie_1_vertical_pic_blur',
            extra: {
                gradient: true
            }
        });
        d.push({
            title: "",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "listloading",
                lineVisible: false
            }
        });
        setResult(d);
        search(name);
    }
}

//搜索接口
function search(name) {
    let searchMark = storage0.getMyVar('searchMark') || {};
    if(searchMark[name]){
        log("重复搜索>"+name+"，调用搜索缓存");
        addItemBefore('listloading', searchMark[name]);
        updateItem("listloading",{title: getMyVar('SrcJmSousuo')=="1"?"当前搜索为缓存":"‘‘’’<small>当前搜索为缓存</small>"})
    }else{
        showLoading('搜源中,请稍后.');
        let searchMark = storage0.getMyVar('searchMark') || {};
        let i = 0;
        let one = "";
        for (var k in searchMark) {
            i++;
            if (i == 1) { one = k }
        }
        if (i > 20) { delete searchMark[one]; }
        let success = 0;
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
                let data = [];
                eval("let 搜索 = " + parse['搜索'])
                data = 搜索() || [];
                if(data.length>0){
                    data.forEach(item => {
                        if(getMyVar('SrcJmSousuo')=="1"){
                            item.extra = {name:item.title,img:item.pic_url,sname:obj.name,surl:item.url};
                            item.url = $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                                erji();
                            })
                        }else{
                            let erjidata = {name:item.title,sname:obj.name,surl:item.url};
                            item.extra = {name:item.title,img:item.pic_url};
                            item.url = item.url + $("#noLoading#").lazyRule((erjidata) => {
                                storage0.putMyVar('erjidata', erjidata);
                                refreshPage(false);
                                return "toast://已切换源："+erjidata.sname;
                            },erjidata);
                        }
                        item.content = item.desc;
                        item.desc = getMyVar('SrcJmSousuo')=="1"? MY_RULE.title + ' · ' + obj.name : obj.name + ' · ' + item.desc;
                        item.col_type = getMyVar('SrcJmSousuo')=="1"?"video":"avatar";
                    })
                    searchMark[name] = searchMark[name] || [];
                    searchMark[name] = searchMark[name].concat(data);
                    addItemBefore('listloading', data);
                    success++;
                }
            }catch(e){
                log(obj.name+'>搜源失败>'+e.message);
            }
            return 1;
        }
        let list = erdatalist.map((item)=>{
            return {
            func: task,
            param: item,
            id: item.name
            }
        });
        
        if(list.length>0){
            deleteItemByCls('loadlist');
            be(list, {
                func: function(obj, id, error, taskResult) {
                },
                param: {
                }
            });
            storage0.putMyVar('searchMark',searchMark);
            let sousuosm = getMyVar('SrcJmSousuo')=="1"?success+"/"+list.length+"，搜索完成":"‘‘’’<small><font color=#f13b66a>"+success+"</font>/"+list.length+"，搜索完成</small>";
            updateItem("listloading",{title: sousuosm})
            toast('搜源完成');
        }else{
            toast('无接口，未找到源');
        }
        hideLoading();
    }
}

//取本地足迹记录
function getMark(name){
    let markfile = "hiker://files/rules/Src/Juman/mark.json";
    let markdata = fetch(markfile);
    if(markdata != ""){
        eval("var marklist=" + markdata+ ";");
    }else{
        var marklist = [];
    }
    let mark = marklist.filter(item => {
        return item.name==name;
    })
    if(mark.length==1){
        return mark[0];
    }else{
        return {};
    }
}
//保存本地足迹记录
function setMark(data){
    let markfile = "hiker://files/rules/Src/Juman/mark.json";
    let markdata = fetch(markfile);
    if(markdata != ""){
        eval("var marklist=" + markdata+ ";");
    }else{
        var marklist = [];
    }
    let mark = marklist.filter(item => {
        return item.name==data.name;
    })
    if(mark.length==1){
        let index = marklist.indexOf(mark[0]);
        marklist.splice(index,1)
    }
    marklist.push(data);
    if(marklist.length>100){
        marklist.splice(0,1);
    }
    writeFile(markfile, JSON.stringify(marklist));
    return 1;
}
//图标下载
function downloadicon() {
    try{
        if(!fileExist('hiker://files/cache/src/管理.svg')){
            downloadFile('https://lanmeiguojiang.com/tubiao/messy/13.svg', 'hiker://files/cache/src/管理.svg');
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
        if(!fileExist('hiker://files/cache/src/收藏.svg')){
            downloadFile('https://lanmeiguojiang.com/tubiao/messy/165.svg', 'hiker://files/cache/src/收藏.svg');
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
