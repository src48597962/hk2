//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
//聚集型、接口型、平台型空壳小程序，接口分为主页源和搜索源
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');

//一级
function yiji() {
    Version();
    downloadicon();
    let d = [];
    d.push({
        title: "管理",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
            SRCSet();
        }),
        pic_url: "hiker://files/cache/src/管理.svg",
        col_type: 'icon_5'
    })
    d.push({
        title: "排行",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
            getYiData('排行');
        }),
        pic_url: "hiker://files/cache/src/排行.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "分类",
        url: $("hiker://empty#noRecordHistory##noHistory#?page=fypage").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
            getYiData('分类');
        }),
        pic_url: "hiker://files/cache/src/分类.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: "更新",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
            getYiData('更新');
        }),
        pic_url: "hiker://files/cache/src/更新.webp",
        col_type: 'icon_5'
    })
    d.push({
        title: Juconfig["btnmenu5"]=="history" ? "历史" : "收藏",
        url: Juconfig["btnmenu5"]=="history" ? "hiker://history" : "hiker://collection",
        pic_url: "hiker://files/cache/src/收藏.svg",
        col_type: 'icon_5',
        extra: {
            longClick: [{
                title: "切换按钮",
                js: $.toString((cfgfile,Juconfig) => {
                    if(Juconfig["btnmenu5"]=="history"){
                        Juconfig["btnmenu5"]="collection";
                    }else{
                        Juconfig["btnmenu5"]="history";
                    }
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(false);
                    return 'toast://已切换';
                }, cfgfile, Juconfig)
            }]
        }
    })
    d.push({
        col_type: 'line'
    })
    let sourcedata = yidatalist.filter(it => {
        return it.name == yijisource;
    });
    if (sourcedata.length == 0) {
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    } else {
        let parse;
        eval("let source = " + sourcedata[0].parse);
        if (source.ext && /^http/.test(source.ext)) {
            requireCache(source.ext, 48);
            parse = yidata;
        } else {
            parse = source;
        }
        let data = [];
        try {
            eval("let 主页 = " + parse['主页'])
            data = 主页();
        } catch (e) {
            log(e.message);
        }
        if (data.length == 0) {
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            let extra = item.extra || {};
            extra.name = extra.name || item.title;
            extra.img = extra.img || item.pic_url || item.img;
            extra.stype = sourcedata[0].type;
            if((item.col_type!="scroll_button") || item.extra){
                item.extra = extra;
            }
            item.url = item.url || $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖);
                erji();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}
//搜索页面
function sousuo() {
    putMyVar('SrcJuSousuo', '1');
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
    java.lang.Thread.sleep(1000);
    search(name);
    clearMyVar('SrcJuSousuo');
}

//二级+源搜索
function erji() {
    addListener("onClose", $.toString(() => {
        clearMyVar('erjidata');
        clearMyVar('erjiextra');
    }));
    let name = MY_PARAMS.name;
    setPageTitle(name);
    let isload;//是否正确加载
    let d = [];
    let parse;
    let stype = MY_PARAMS.stype;
    let erjidata = storage0.getMyVar('erjidata') || getMark(name,stype) || MY_PARAMS;
    let sname = erjidata.sname || "";
    let surl = erjidata.surl || "";
    
    MY_URL = surl;
    let sauthor = "未知";
    let sourcedata = datalist.filter(it => {
        return it.name == sname && it.erparse && it.type==stype;
    });
    try {
        if (sourcedata.length == 0) {
            sourcedata.push({ erparse: MY_PARAMS.parse });
        }
        if (sourcedata[0].erparse) {
            eval("let source = " + sourcedata[0].erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
        }
    } catch (e) {
        log(e.message);
    }
    try {
        if (parse) {
            sauthor = parse["作者"] || sauthor;
            let details = parse['二级'](surl);
            let pic = (details.img || MY_PARAMS.img || "https://p1.ssl.qhimgs1.com/sdr/400__/t018d6e64991221597b.jpg") + '@Referer=';
            d.push({
                title: details.detail1,
                desc: details.detail2,
                pic_url: pic,
                url: surl,
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true
                }
            })
            let lists = details.list;//选集列表
            let 解析 = parse['解析'];
            d.push({
                title: "倒转排序",
                url: $("#noLoading#").lazyRule(() => {
                    if (getMyVar('shsort') == '1') { putMyVar('shsort', '0'); } else { putMyVar('shsort', '1') };
                    refreshPage(false);
                    return 'toast://切换排序成功'
                }),
                pic_url: getMyVar('shsort') == '1' ? 'https://lanmeiguojiang.com/tubiao/messy/127.svg' : 'https://lanmeiguojiang.com/tubiao/messy/126.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist"
                }
            })
            d.push({
                title: "下载阅读",
                url: "hiker://page/download.view#noRecordHistory##noRefresh##noHistory#?rule=本地资源管理",
                pic_url: 'https://lanmeiguojiang.com/tubiao/messy/116.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "loadlist",
                    chapterList: lists,
                    "defaultView": "1",
                    "info": { 
                        "bookName": name, 
                        "bookTopPic": pic, 
                        "parseCode": "(\n(解析) => {\n return 解析(input);\n})("+解析+")", 
                        "ruleName": MY_RULE.title 
                    }
                }
            })
            d.push({
                title: "切换书源",
                url: getMyVar('backsousuo') == "1" ? `#noLoading#@lazyRule=.js:back(false);'hiker://empty'` : $("#noLoading#").lazyRule((name) => {
                    require(config.依赖);
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
            
            if (getMyVar('shsort') == '1') {
                lists.reverse();
            }
            lists.forEach((item, id) => {
                d.push({
                    title: item.title,
                    url: item.url + $("").lazyRule((解析) => {
                        return 解析(input);
                    }, 解析),
                    col_type: "text_2",
                    extra: {
                        id: name + "_选集_" + id,
                        cls: "loadlist"
                    }
                });
            })
            isload = 1;
        }
    } catch (e) {
        toast('有异常，看日志');
        log(MY_PARAMS.sname + '>加载详情失败>' + e.message);
    }

    if (isload) {
        d.push({
            title: "‘‘’’<small><font color=#f20c00>当前数据来自接口源：" + sname + "，作者：" + sauthor + "</font></small>",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "listloading",
                lineVisible: false
            }
        });
        setResult(d);
        //二级源浏览记录保存
        let erjidata = { name: name, sname: sname, surl: surl, stype: stype };
        setMark(erjidata);
        //收藏更新最新章节
        if (parse['最新']) {
            setLastChapterRule('js:' + $.toString((surl, 最新) => {
                最新(surl);
            }, surl, parse['最新']))
        }
    } else {
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
function search(name, sdata) {
    let searchMark = storage0.getMyVar('searchMark') || {};
    let loadid = getMyVar('SrcJuSousuo') == "1" ? 'sousuoloading' : 'listloading';
    if (searchMark[name] && !sdata) {
        //log("重复搜索>"+name+"，调用搜索缓存");
        addItemBefore(loadid, searchMark[name]);
        updateItem(loadid, { title: getMyVar('SrcJuSousuo') == "1" ? "当前搜索为缓存" : "‘‘’’<small>当前搜索为缓存</small>" })
    } else {
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
        let task = function (obj) {
            try {
                let parse;
                eval("let source = " + obj.erparse);
                if (source.ext && /^http/.test(source.ext)) {
                    requireCache(source.ext, 48);
                    parse = erdata;
                } else {
                    parse = source;
                }
                let data = [];
                eval("let 搜索 = " + parse['搜索'])
                data = 搜索() || [];
                if (data.length > 0) {
                    data.forEach(item => {
                        let extra = item.extra || {};
                        extra.img = extra.img || item.img || item.pic_url;
                        extra.name = extra.name || item.title;
                        extra.stype = obj.type;
                        extra.sname = obj.name;
                        extra.surl = item.url.replace(/#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#/,"");
                        item.extra = extra;
                        if (getMyVar('SrcJuSousuo') == "1") {
                            item.url = item.url + $("#immersiveTheme##autoCache#").rule(() => {
                                require(config.依赖);
                                erji();
                            })
                        } else {
                            item.url = item.url + $("#noLoading#").lazyRule((extra) => {
                                storage0.putMyVar('erjidata', extra);
                                storage0.putMyVar('erjiextra', extra);
                                refreshPage(false);
                                return "toast://已切换源：" + extra.sname;
                            }, extra);
                        }
                        item.content = item.desc;
                        item.desc = getMyVar('SrcJuSousuo') == "1" ? MY_RULE.title + ' · ' + obj.name : obj.name + ' · ' + item.desc;
                        item.col_type = getMyVar('SrcJuSousuo') == "1" ? "video" : "avatar";
                    })
                    searchMark[name] = searchMark[name] || [];
                    searchMark[name] = searchMark[name].concat(data);
                    addItemBefore(loadid, data);
                    success++;
                    hideLoading();
                }
            } catch (e) {
                log(obj.name + '>搜源失败>' + e.message);
            }
            return 1;
        }
        if (sdata) {
            erdatalist = [];
            erdatalist.push(sdata);
        }
        let list = erdatalist.map((item) => {
            return {
                func: task,
                param: item,
                id: item.name
            }
        });

        if (list.length > 0) {
            deleteItemByCls('loadlist');
            be(list, {
                func: function (obj, id, error, taskResult) {
                },
                param: {
                }
            });
            if (!sdata) {
                storage0.putMyVar('searchMark', searchMark);
            }
            let sousuosm = getMyVar('SrcJuSousuo') == "1" ? success + "/" + list.length + "，搜索完成" : "‘‘’’<small><font color=#f13b66a>" + success + "</font>/" + list.length + "，搜索完成</small>";
            updateItem(loadid, { title: sousuosm })
            toast('搜源完成');
        } else {
            toast('无接口，未找到源');
        }
        hideLoading();
    }
}

//取本地足迹记录
function getMark(name,stype) {
    let markfile = "hiker://files/rules/Src/Ju/mark.json";
    let markdata = fetch(markfile);
    if (markdata != "") {
        eval("var marklist=" + markdata + ";");
    } else {
        var marklist = [];
    }
    let mark = marklist.filter(item => {
        return item.name==name && it.type==stype;
    })
    if (mark.length == 1) {
        return mark[0];
    } else {
        return {};
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
        return it.name==data.name && it.type==data.stype;
    })
    if (mark.length == 1) {
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
    var nowVersion = "0.2";//现在版本 
    var nowtime = Date.now();
    var oldtime = parseInt(getItem('VersionChecktime', '0').replace('time', ''));
    if (getMyVar('SrcJu-VersionCheck', '0') == '0' && nowtime > (oldtime + 12 * 60 * 60 * 1000)) {
        try {
            eval(request(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('Comics', 'master') + 'SrcTmplVersion.js'))
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
