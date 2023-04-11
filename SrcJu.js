//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
//聚集型、接口型、平台型空壳小程序，接口分为主页源和搜索源
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');

//一级
function yiji() {
    let sourcedata = yidatalist.filter(it => {
        return it.name == sourcename;
    });
    let parse;
    let 页码;
    try {
        if (sourcedata.length > 0) {
            eval("let source = " + sourcedata[0].parse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
            页码 = parse["页码"];
            if(!getMyVar(runMode+"_"+sourcename)){
                toast("当前主页源：" + sourcename + (parse["作者"] ? "，作者：" + parse["作者"] : ""));
            }
        }
    } catch (e) {
        log("一级源接口加载异常>" + e.message);
    }
    页码 = 页码 || {};
    let d = [];
    if(MY_PAGE==1){
        Version();
        downloadicon();
        d.push({
            title: "管理",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                SRCSet();
            }),
            pic_url: "https://lanmeiguojiang.com/tubiao/more/129.png",
            col_type: 'icon_5',
            extra: {
                newWindow: true,
                windowId: MY_RULE.title + "管理"
            }
        })
        d.push({
            title: "排行",
            url: rulePage('排行',页码["排行"]),
            pic_url: "https://lanmeiguojiang.com/tubiao/more/229.png",
            col_type: 'icon_5'
        })
        d.push({
            title: "分类",
            url: rulePage('分类',页码["分类"]),
            pic_url: "https://lanmeiguojiang.com/tubiao/more/287.png",
            col_type: 'icon_5'
        })
        d.push({
            title: "更新",
            url: rulePage('更新',页码["更新"]),
            pic_url: "https://lanmeiguojiang.com/tubiao/more/288.png",
            col_type: 'icon_5'
        })
        d.push({
            title: Juconfig["btnmenu5"] || "书架",
            url: Juconfig["btnmenu5"] == "历史" ? "hiker://history?rule="+MY_RULE.title : Juconfig["btnmenu5"] == "收藏" ? "hiker://collection?rule="+MY_RULE.title : $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcBookCase.js');
                bookCase();
            }),
            pic_url: "https://lanmeiguojiang.com/tubiao/more/286.png",
            col_type: 'icon_5',
            extra: {
                longClick: [{
                    title: "切换按钮",
                    js: $.toString(() => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                        return $(["书架", "收藏", "历史"], 1).select((cfgfile, Juconfig) => {
                            Juconfig["btnmenu5"] = input;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                            return 'toast://已切换为' + input;
                        }, cfgfile, Juconfig)
                    })
                }]
            }
        })
        d.push({
            col_type: 'line'
        })
        putMyVar(runMode+"_"+sourcename, "1");
    }
    getYiData('主页', d);
}

//二级+源搜索
function erji() {
    addListener("onClose", $.toString(() => {
        clearMyVar('erjiextra');
        clearMyVar('SrcJudescload');
        clearMyVar('已选择换源列表');
        if(getMyVar('SrcBookCase')){
            clearMyVar('SrcBookCase');
            refreshPage(false);
        }
    }));
    clearMyVar('SrcJudescload');
    let name = MY_PARAMS.name;
    let isload;//是否正确加载
    let sauthor = "未知";
    let detailsfile = "hiker://files/cache/src/details.json";
    let d = [];
    let parse;
    let 公共;
    let details;
    let stype = MY_PARAMS.stype;
    let datasource = [storage0.getMyVar('erjiextra'), MY_PARAMS, getMark(name, stype)];
    let erjiextra;
    let sname;
    let surl;
    let detailload;
    for(let i=0; i<datasource.length; i++){
        if(datasource[i]){
            sname = datasource[i].sname || "";
            surl = datasource[i].surl || "";
            if(sname&&surl){
                erjiextra = datasource[i];
                break;
            }
        }
    }
    let sourcedata = datalist.filter(it => {
        return it.name == sname && it.erparse && it.type == stype;
    });
    let sourcedata2;//用于正常加载时，将二级接口存入当前页面PARAMS，确保分享时可以打开
    try {
        if (sourcedata.length == 0 && MY_PARAMS && MY_PARAMS.sourcedata) {
            log('分享页面，且本地无对应接口');
            sourcedata.push(MY_PARAMS.sourcedata);
        }
        if (sourcedata.length > 0 && sourcedata[0].erparse) {
            eval("let source = " + sourcedata[0].erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
            sourcedata2 = sourcedata[0];
            if(parse&&parse['公共']){
                公共 = parse['公共'] || {};
            }
            if(parse){
                eval("let gonggong = " + sourcedata[0].public);
                公共 = gonggong || parse['公共'] || {};
            }
        }
    } catch (e) {
        log(e.message);
    }
    try {
        if (parse && surl) {
            MY_URL = surl;
            sauthor = parse["作者"] || sauthor;
            let detailsmark;
            if(getMyVar('是否取缓存文件')){
                let detailsdata = fetch(detailsfile);
                if (detailsdata != "") {
                    try{
                        eval("let detailsjson=" + detailsdata + ";");
                        if(detailsjson.sname==sname && detailsjson.surl==surl){
                            detailsmark = detailsjson;//本地缓存接口+链接对得上则取本地，用于切换排序和样式时加快
                        }
                    }catch(e){ }
                }
            }
            
            details = detailsmark || parse['二级'](surl);
            let pic = (details.img || MY_PARAMS.img || "https://p1.ssl.qhimgs1.com/sdr/400__/t018d6e64991221597b.jpg") + '@Referer=';
            d.push({
                title: details.detail1 || "",
                desc: details.detail2 || "",
                pic_url: pic.indexOf("@Referer=") == -1 ? pic + "@Referer=" : pic,
                url: surl,
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    id: "detailid",
                    gradient: true
                }
            })
            detailload = 1;
            let indexid = getMyVar(surl, '0');
            let 线路s = details.line?details.line:["线路"];
            let 列表s = details.line?details.list:[details.list];
            try{
                if(indexid > 线路s.length){
                    indexid = 0;
                }
                if(线路s.length != 列表s.length){
                    log(sname+'接口返回的线路和列表不相等')
                }
            }catch(e){
                log(sname+">线路或列表返回数据有误"+e.message);
                线路s = ["线路"];
            }
            
            let 列表 = 列表s[indexid];
            if(列表.length>0){
                try{
                    let i1 = parseInt(列表.length / 5);
                    let i2 = parseInt(列表.length / 2);
                    if(i1==i2){
                        i1 = 0;
                        i2 = list.length-1;
                    }
                    let list1 = 列表[i1].title;
                    let list2 = 列表[i2].title;
                    if(parseInt(list1.match(/(\d+)/)[0])>parseInt(list2.match(/(\d+)/)[0])){
                        列表.reverse();
                    }
                }catch(e){
                    //log('修正选集顺序失败>'+e.message)
                }
            }
            if (getMyVar(sname + 'sort') == '1') {
                列表.reverse();
            }
            let 解析 = parse['解析'];
            let lazy;
            let download;
            let itype;
            if (stype=="漫画") {
                lazy = $("").lazyRule((解析, 公共) => {
                    let url = input.split("##")[1];
                    return 解析(url,公共);
                }, 解析, 公共);
                download = $.toString((解析, 公共) => {
                    return 解析(input,公共);
                }, 解析, 公共);
                itype = "comic";
            }else if (stype=="阅读") {
                lazy = $("").rule((解析, 公共) => {
                    let url = MY_PARAMS.url || "";
                    解析(url,公共);
                }, 解析, 公共);
                download = $.toString((解析, 公共) => {
                    return 解析(input,公共);
                }, 解析, 公共);
                itype = "novel";
            }

            d.push({
                title: "详情简介",
                url: $("#noLoading#").lazyRule((desc) => {
                    if(getMyVar('SrcJudescload')=="1"){
                        clearMyVar('SrcJudescload');
                        deleteItemByCls("SrcJudescload");
                    }else{
                        putMyVar('SrcJudescload',"1");
                        addItemAfter('detailid', [{
                            title: `<font color="#098AC1">详情简介 </font><small><font color="#f47983"> ></font></small>`,
                            col_type: "avatar",
                            url: "hiker://empty",
                            pic_url: "https://lanmeiguojiang.com/tubiao/ke/91.png",
                            extra: {
                                cls: "SrcJudescload"
                            }
                        },{
                            title: desc,
                            col_type: "rich_text",
                            extra: {
                                cls: "SrcJudescload"
                            }
                        }]);
                    }
                    return "hiker://empty";
                }, details.desc||""),
                pic_url: "https://lanmeiguojiang.com/tubiao/messy/32.svg",
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist"
                }
            })
            d.push({
                title: "我的书架",
                url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcBookCase.js');
                    bookCase();
                }),
                pic_url: 'https://lanmeiguojiang.com/tubiao/messy/70.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist",
                    longClick: [{
                        title: "下载本地📥",
                        js: $.toString(() => {
                            return "hiker://page/download.view#noRecordHistory##noRefresh##noHistory#?rule=本地资源管理"
                        })
                    }],
                    chapterList: 列表,
                    "defaultView": "1",
                    "info": {
                        "bookName": name,
                        "bookTopPic": pic,
                        "parseCode": download,
                        "ruleName": MY_RULE.title,
                        "type": itype,
                        "decode": 公共["imgdec"] || ""
                    }
                }
            })
            d.push({
                title: "切换书源",
                url: $("#noLoading#").lazyRule((name) => {
                    if(getMyVar('SrcJuSousuoTest')){
                        return "toast://编辑测试模式下不允许换源.";
                    }else if(!getMyVar('SrcJuSearching')){
                        clearMyVar('已选择换源列表');
                        require(config.依赖);
                        deleteItemByCls('loadlist');
                        showLoading('搜源中,请稍后.');
                        search(name,"erji");
                        return  "hiker://empty";
                    }else{
                        return "toast://上一个搜索线程还未结束，稍等...";
                    }
                }, name),
                pic_url: 'https://lanmeiguojiang.com/tubiao/messy/20.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist"
                }
            })
            d.push({
                col_type: "line_blank"
            });
            for (let i = 0; i < 10; i++) {
                d.push({
                    col_type: "blank_block"
                })
            }
            d.push({
                title: getMyVar(sname + 'sort') == '1' ? `““””<b><span style="color: #66CCEE">排序⇅</span></b>` : `““””<b><span style="color: #55AA44">排序⇅</span></b>`,
                url: $("#noLoading#").lazyRule((列表,name,sname,lazy) => {
                    log('1');
                    deleteItemByCls('playlist');
                    log('2');
                    if (getMyVar(sname + 'sort') == '1') {
                        putMyVar(sname + 'sort', '0');
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #55AA44">排序⇅</span></b>`
                        });
                    } else {
                        putMyVar(sname + 'sort', '1')
                        列表.reverse();
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #66CCEE">排序⇅</span></b>`
                        });
                    };
                    let d = [];
                    let list_col_type = getItem('SrcJuList_col_type', 'text_2');
                    for(let i=0; i<列表.length; i++) {
                        d.push({
                            title: 列表[i].title,
                            url: "hiker://empty##" + 列表[i].url + (stype=="漫画"?"":"#readTheme##autoPage#") + lazy,
                            col_type: list_col_type,
                            extra: {
                                id: name + "_选集_" + i,
                                url: 列表[i].url,
                                cls: "loadlist playlist"
                            }
                        });
                    }
                    addItemBefore('listloading', d);
                    return 'toast://切换排序成功'
                }, 列表,name,sname,lazy),
                col_type: 'scroll_button',
                extra: {
                    id: "listsort",
                    cls: "loadlist"
                }
            })
            d.push({
                title: `““””<b><span style="color: #f47983">样式<small>🎨</small></span></b>`,
                url: $(["text_1","text_2","text_3","flex_button"],1,"选集列表样式").select((列表, name,lazy) => {
                    deleteItemByCls('playlist');
                    let d = [];
                    for(let i=0; i<列表.length; i++) {
                        d.push({
                            title: 列表[i].title,
                            url: "hiker://empty##" + 列表[i].url + (stype=="漫画"?"":"#readTheme##autoPage#") + lazy,
                            col_type: input,
                            extra: {
                                id: name + "_选集_" + i,
                                url: 列表[i].url,
                                cls: "loadlist playlist"
                            }
                        });
                    }
                    addItemBefore('listloading', d);
                    setItem('SrcJuList_col_type', input);
                    return 'hiker://empty'
                }, 列表,name,lazy),
                col_type: 'scroll_button',
                extra: {
                    cls: "loadlist"
                }
            })
            if(线路s.length>1){
                d.push({
                    title: `““””<b><span style="color: #AABBFF">`+线路s[indexid]+`<small>⚡</small></span></b>`,
                    url: $(线路s,2,"选择线路").select((线路s,surl) => {
                        let index = 线路s.indexOf(input);
                        putMyVar(surl,index);
                        refreshPage(false);
                        return 'hiker://empty'
                    }, 线路s, surl),
                    col_type: 'scroll_button',
                    extra: {
                        cls: "loadlist"
                    }
                })
            }
            let list_col_type = getItem('SrcJuList_col_type', 'text_2');
            for(let i=0; i<列表.length; i++) {
                d.push({
                    title: 列表[i].title,
                    url: "hiker://empty##" + 列表[i].url + (stype=="漫画"?"":"#readTheme##autoPage#") + lazy,
                    col_type: list_col_type,
                    extra: {
                        id: name + "_选集_" + i,
                        url: 列表[i].url,
                        cls: "loadlist playlist"
                    }
                });
            }
            if(列表.length>0 || getMyVar('jiekouedit')){
                isload = 1;
            }else if(列表.length==0){
                toast("选集列表为空，请更换其他源");
            }
        }
    } catch (e) {
        toast('有异常，看日志');
        log(sname + '>加载详情失败>' + e.message);
    }

    if (isload) {
        d.push({
            title: "‘‘’’<small><font color=#f20c00>当前数据源：" + sname + ", 作者：" + sauthor+"</font></small>",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "listloading",
                lineVisible: false
            }
        });
        setResult(d);
        //setPageTitle(name);//不能用了，会影响收藏状态和足迹，软件反应不过来
        if(!getMyVar(sname+"_"+name)){
            toast('当前数据源：' + sname + ', 作者：' + sauthor);
        }
        putMyVar(sname+"_"+name, "1");
        //二级源浏览记录保存
        let erjidata = { name: name, sname: sname, surl: surl, stype: stype };
        setMark(erjidata);
        if (typeof (setPageParams) != "undefined") {
            delete sourcedata2['parse']
            erjiextra.sourcedata = sourcedata2;
            setPageParams(erjiextra);
        }
        //当前二级详情数据保存
        details.sname = sname;
        details.surl = surl;
        writeFile(detailsfile, JSON.stringify(details));
        //收藏更新最新章节
        if (parse['最新']) {
            setLastChapterRule('js:' + $.toString((surl, 最新, 公共) => {
                最新(surl,公共);
            }, surl, parse['最新'], 公共))
        }
        putMyVar('是否取缓存文件','1');//判断是否取本地缓存文件,软件打开初次必需在线取同名数据
    } else {
        if(!detailload){
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
        }
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
        if(!getMyVar('SrcJuSousuoTest')){
            search(name,"erji");
        }
    }
    clearMyVar('已选择换源列表');
}
//搜索页面
function sousuo() {
    let name = MY_URL.split('##')[1];
    let d = [];
    d.push({
        title: "搜索中...",
        url: "hiker://empty",
        extra: {
            id: "sousuoloading"
        }
    });
    setResult(d);
    search(name,'sousuo');
}
//搜索接口
function search(keyword, mode, sdata) {
    if(getMyVar('SrcJuSearching')=="1"){
        toast("上次搜索线程还未结束，等等再来");
        if(mode=="sousuotest"){
            return [];
        }else{
            return "hiker://empty";
        }
    }
    let page = 1;
    if(mode=="sousuo"){
        if(MY_PAGE==1){
            putMyVar('MY_PAGE', '0');
        }
        page = parseInt(getMyVar('MY_PGAE','0'))+1;
        putMyVar('MY_PGAE',page);
    }else if(mode=="sousuotest"){
        page = MY_PAGE;
    }

    let name = keyword.split('  ')[0];
    let sssname;
    if(keyword.indexOf('  ')>-1){
        sssname = keyword.split('  ')[1] || sourcename;
    }
    
    let searchMark = storage0.getMyVar('searchMark') || {};
    if(mode=="erji" && searchMark[name]){
        addItemBefore("listloading", searchMark[name]);
        updateItem("listloading", { title: "‘‘’’<small>当前搜索为缓存</small>" });
        let i = 0;
        let one = "";
        for (var k in searchMark) {
            i++;
            if (i == 1) { one = k }
        }
        if (i > 20) { delete searchMark[one]; }
        return "hiker://empty";
    }

    putMyVar('SrcJuSearching','1');
    let success = 0;
    let results = [];
    if (sdata) {
        erdatalist = [];
        erdatalist.push(sdata);
    }else if (sssname){
        erdatalist = erdatalist.filter(it=>{
            return it.name==sssname;
        });
    }
    
    let task = function (obj) {
        try {
            let parse;
            let 公共;
            eval("let source = " + obj.erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
            if(parse){
                eval("let gonggong = " + obj.public);
                公共 = gonggong || parse['公共'] || {};
            }
            let data = [];
            eval("let 搜索 = " + parse['搜索'])
            data = 搜索(name,page) || [];
            data.forEach(item => {
                let extra = item.extra || {};
                extra.name = extra.name || item.title;
                if((mode=="erji"&&extra.name==name)||mode!="erji"){
                    extra.img = extra.img || item.img || item.pic_url;
                    extra.stype = obj.type;
                    extra.sname = obj.name;
                    extra.pageTitle = extra.name;
                    extra.surl = item.url ? item.url.replace(/#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#readTheme#|#autoPage#/, "") : "";
                    item.extra = extra;
                    item.url = /sousuo/.test(mode) ? $("hiker://empty#immersiveTheme##autoCache#").rule(() => {
                        require(config.依赖);
                        erji();
                    }) : item.url + $("#noLoading#").lazyRule((extra) => {
                        if(getMyVar('已选择换源列表')){
                            return "toast://请勿重复点击，稍等...";
                        }else{
                            putMyVar('已选择换源列表','1');
                            clearMyVar(extra.sname+"_"+extra.name);
                            storage0.putMyVar('erjiextra', extra);
                            refreshPage(false);
                            return "toast://已切换源：" + extra.sname;
                        }
                    }, extra);
                    item.content = item.desc;
                    item.title = mode=="erji"?obj.name:item.title;
                    item.desc = mode=="sousuo"  ? MY_RULE.title + ' · ' + obj.name :mode=="sousuotest"?item.desc: (extra.sdesc || item.desc);
                    item.col_type = mode=="sousuo"  ? "video":mode=="sousuotest"?"movie_1_vertical_pic": "avatar";
                }
            })
            return {result:data, success:1};
        } catch (e) {
            log(obj.name + '>搜索失败>' + e.message);
            return {result:[], success:0};
        }
    }
    let list = erdatalist.map((item) => {
        return {
            func: task,
            param: item,
            id: item.name
        }
    });
    if (list.length > 0) {
        be(list, {
            func: function (obj, id, error, taskResult) {
                if(taskResult.success==1){
                    let data = taskResult.result;
                    if(data.length>0){
                        success++;
                        if(mode=="erji"){
                            searchMark[name] = searchMark[name] || [];
                            searchMark[name] = searchMark[name].concat(data);
                            if(!getMyVar('已选择换源列表')){
                                addItemBefore("listloading", data);
                            }
                            hideLoading();
                        }else if(mode=="sousuo"){
                            addItemBefore("sousuoloading", data);
                        }else if(mode=="sousuotest"){
                            results = data;
                        }
                    }
                }
            },
            param: {
            }
        });
        if (mode=="erji") {
            storage0.putMyVar('searchMark', searchMark);
        }
        clearMyVar('SrcJuSearching');
        if(mode=="sousuotest"){
            return results;
        }else{
            let sousuosm = mode=="sousuo" ? success + "/" + list.length + "，第"+page+"页搜索完成" : "‘‘’’<small><font color=#f13b66a>" + success + "</font>/" + list.length + "，搜索完成</small>";
            updateItem(mode=="sousuo"?"sousuoloading":"listloading", { title: sousuosm });
        }
    } else {
        toast("无接口");
    }
    clearMyVar('SrcJuSearching');
    hideLoading();
}

//取本地足迹记录
function getMark(name, stype) {
    let markfile = "hiker://files/rules/Src/Ju/mark.json";
    let markdata = fetch(markfile);
    if (markdata != "") {
        eval("var marklist=" + markdata + ";");
    } else {
        var marklist = [];
    }
    let mark = marklist.filter(it => {
        return it.name == name && it.stype == stype;
    })
    if (mark.length > 0) {
        return mark[0];
    } else {
        return "";
    }
}
//保存本地足迹记录
function setMark(data) {
    let markfile = "hiker://files/rules/Src/Ju/mark.json";
    let markdata = fetch(markfile);
    if (markdata != "") {
        eval("var marklist=" + markdata + ";");
    } else {
        var marklist = [];
    }
    let mark = marklist.filter(it => {
        return it.name == data.name && it.stype == data.stype;
    })
    if (mark.length > 0) {
        let index = marklist.indexOf(mark[0]);
        marklist.splice(index, 1)
    }
    marklist.push(data);
    if (marklist.length > 100) {
        marklist.splice(0, 1);
    }
    writeFile(markfile, JSON.stringify(marklist));
    return 1;
}
//图标下载
function downloadicon() {
    try {
        if (!fileExist('hiker://files/cache/src/管理.svg')) {
            downloadFile('https://lanmeiguojiang.com/tubiao/messy/13.svg', 'hiker://files/cache/src/管理.svg');
        }
        if (!fileExist('hiker://files/cache/src/更新.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/更新.webp", 'hiker://files/cache/src/更新.webp');
        }
        if (!fileExist('hiker://files/cache/src/分类.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/分类.webp", 'hiker://files/cache/src/分类.webp');
        }
        if (!fileExist('hiker://files/cache/src/排行.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/排行.webp", 'hiker://files/cache/src/排行.webp');
        }
        if (!fileExist('hiker://files/cache/src/收藏.svg')) {
            downloadFile('https://lanmeiguojiang.com/tubiao/messy/165.svg', 'hiker://files/cache/src/收藏.svg');
        }
    } catch (e) { }
}
//版本检测
function Version() {
    var nowVersion = "0.3";//现在版本 
    var nowtime = Date.now();
    var oldtime = parseInt(getItem('VersionChecktime', '0').replace('time', ''));
    if (getMyVar('SrcJu-VersionCheck', '0') == '0' && nowtime > (oldtime + 12 * 60 * 60 * 1000)) {
        try {
            eval(request(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcTmplVersion.js'))
            if (parseFloat(newVersion.SrcJu) > parseFloat(nowVersion)) {
                confirm({
                    title: '发现新版本，是否更新？',
                    content: nowVersion + '=>' + newVersion.SrcJu + '\n' + newVersion.SrcJudesc[newVersion.SrcJu],
                    confirm: $.toString((nowtime) => {
                        setItem('VersionChecktime', nowtime + 'time');
                        deleteCache();
                        delete config.依赖;
                        refreshPage();
                    }, nowtime),
                    cancel: ''
                })
                log('检测到新版本！\nV' + newVersion.SrcJu + '版本》' + newVersion.SrcJudesc[newVersion.SrcJu]);
            }
            putMyVar('SrcJu-Version', '-V' + newVersion.SrcJu);
        } catch (e) { }
        putMyVar('SrcJu-VersionCheck', '1');
    } else {
        putMyVar('SrcJu-Version', '-V' + nowVersion);
    }
}