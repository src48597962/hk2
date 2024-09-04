//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
//聚集型、接口型、平台型空壳小程序，接口分为主页源和搜索源
let publicfile;
try{
    publicfile = config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js';
}catch(e){
    let cfgfile = "hiker://files/rules/Src/Ju/config.json";
    if (fileExist(cfgfile)) {
        eval("let Juconfig=" + fetch(cfgfile) + ";");
        publicfile = Juconfig["依赖"].match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js';
    }
}
require(publicfile);

//一级
function yiji() {
    let sourcedata = yidatalist.filter(it => {
        return it.name==sourcename && it.type==runMode;
    });
    let parse = {};
    let 页码 = {};
    let 转换 = {};
    let runType;
    try {
        if (sourcedata.length > 0) {
            eval("let source = " + sourcedata[0].parse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
            runType = sourcedata[0].type;
            storage0.putMyVar('一级源接口信息',{name: sourcename, type: runType, group: sourcedata[0].group, img: sourcedata[0].img});//传导给方法文件
            try{
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                cacheData(sourcedata[0]);
            }catch(e){
                //xlog("√缓存临时文件失败>"+e.message);
            }
            页码 = parse["页码"];
            转换 = parse["转换"];
            let 提示 = "当前主页源：" + sourcename + (parse["作者"] ? "，作者：" + parse["作者"] : "");
            if(!getMyVar(runMode+"_"+sourcename)){
                toast(提示);
            }
        }
    } catch (e) {
        xlog("√一级源接口加载异常>" + e.message);
    }
    页码 = 页码 || {};
    转换 = 转换 || {};
    let d = [];
    if(MY_PAGE==1){
        if(getMyVar('SrcJu_versionCheck', '0') == '0'){
            let programversion = $.require("config").version || 0;
            if(programversion<14){
                confirm({
                    title: "温馨提示",
                    content: "发现小程序新版本",
                    confirm: $.toString(() => {
                        return "海阔视界首页频道规则【聚阅√】￥home_rule_url￥http://hiker.nokia.press/hikerule/rulelist.json?id=6337"
                    }),
                    cancel: $.toString(() => {
                        return "toast://不升级小程序，则功能不全或有异常"
                    })
                });
            }
            Version();
            downloadicon();
        }
        
        d.push({
            title: "管理",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                SRCSet();
            }),
            pic_url: "https://hikerfans.com/tubiao/more/129.png",
            col_type: 'icon_5',
            extra: {
                newWindow: true,
                windowId: MY_RULE.title + "管理"
            }
        })
        let zz = 转换["排行"] || "排行";
        if(parse&&parse[zz]){
            d.push({
                title: zz,
                url: rulePage(zz,页码[zz]),
                pic_url: "https://hikerfans.com/tubiao/more/229.png",
                col_type: 'icon_5'
            })
        }else{
            d.push({
                title: "收藏",
                url: "hiker://collection?rule="+MY_RULE.title,
                pic_url: "https://hikerfans.com/tubiao/more/109.png",
                col_type: 'icon_5'
            })
        }
        let sousuoextra = {
            id: "sousuopageid",
            newWindow: true,
            windowId: MY_RULE.title + "搜索页",
            longClick: [{
                title: "🔍搜索",
                js: $.toString(() => {
                    return $("hiker://empty#noRefresh##noRecordHistory##noHistory##fullTheme###fypage").rule(() => {
                        require(config.依赖);
                        newsousuopage();
                    })
                })
            },{
                title: "🔎聚搜代理："+(getItem('searchmode')=="jusousuo"?"是":"否"),
                js: $.toString(() => {
                    if(getItem('searchmode')=="jusousuo"){
                        clearItem('searchmode');
                        return "toast://取消软件聚搜代理，走小程序聚搜";
                    }else{
                        setItem('searchmode', "jusousuo");
                        return "toast://开启软件聚搜代理，走软件聚搜";
                    }
                })
            }]
        }
        
        zz = 转换["分类"] || "分类";
        if(parse&&parse[zz]){
            d.push({
                title: zz,
                url: $('#noLoading#').lazyRule((sousuoextra,ispage,zz) => {
                        delete sousuoextra.newWindow;
                        updateItem("sousuopageid",{extra:sousuoextra});
                        return $("hiker://empty#noRecordHistory##noHistory#" + (ispage ? "?page=fypage" : "")).rule((sousuoextra,zz) => {
                            addListener("onClose", $.toString((sousuoextra) => {
                                sousuoextra.newWindow = true;
                                updateItem("sousuopageid",{extra:sousuoextra});
                            },sousuoextra));
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                            getYiData(zz);
                        },sousuoextra,zz)
                    },sousuoextra,页码[zz],zz),
                pic_url: "https://hikerfans.com/tubiao/more/287.png",
                col_type: 'icon_5',
                extra: sousuoextra
            })
        }else{
            d.push({
                title: "搜索",
                url: $("hiker://empty#noRefresh##noRecordHistory##noHistory##fullTheme###fypage").rule(() => {
                    require(config.依赖);
                    newsousuopage();
                }),
                pic_url: "https://hikerfans.com/tubiao/more/101.png",
                col_type: 'icon_5',
                extra: sousuoextra
            })
        }
        zz = 转换["更新"] || "更新";
        if(parse&&parse[zz]){
            d.push({
                title: zz,
                url: rulePage(zz,页码[zz]),
                pic_url: "https://hikerfans.com/tubiao/more/288.png",
                col_type: 'icon_5'
            })
        }else{
            d.push({
                title: "历史",
                url: "hiker://history?rule="+MY_RULE.title,
                pic_url: "https://hikerfans.com/tubiao/more/213.png",
                col_type: 'icon_5'
            })
        }
        
        d.push({
            title: Juconfig["btnmenu5"] || "书架",
            url: Juconfig["btnmenu5"] == "历史" ? "hiker://history?rule="+MY_RULE.title : Juconfig["btnmenu5"] == "收藏" ? "hiker://collection?rule="+MY_RULE.title : $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcBookCase.js');
                bookCase();
            }),
            pic_url: "https://hikerfans.com/tubiao/more/286.png",
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

        let typemenubtn = getTypeNames("主页");
        typemenubtn.forEach((it) =>{
            let item = {
                title: runMode==it?`““””<b><span style="color: #3399cc">`+it+`</span></b>`:it,
                url: runMode==it?$('#noLoading#').lazyRule((input) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                    return selectSource(input);
                }, it):$('#noLoading#').lazyRule((cfgfile,Juconfig,input) => {
                    Juconfig["runMode"] = input;
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(false);
                    return 'toast://主页源分类分组已切换为：' + input;
                }, cfgfile, Juconfig ,it),
                col_type: "scroll_button"//runModes_btntype
            }
            if(runMode==it){
                item.extra = {
                    longClick: [{
                        title: "删除当前",
                        js: $.toString((sourcefile,id) => {
                            return $("确定删除："+id).confirm((sourcefile,id)=>{
                                let sourcedata = fetch(sourcefile);
                                eval("var datalist=" + sourcedata + ";");
                                let index = datalist.indexOf(datalist.filter(d => d.type+"_"+d.name == id)[0]);
                                datalist.splice(index, 1);
                                writeFile(sourcefile, JSON.stringify(datalist));
                                clearMyVar('SrcJu_searchMark');
                                return 'toast://已删除';
                            },sourcefile,id)
                        }, sourcefile, runType+"_"+sourcename)
                    },{
                        title: "列表排序：" + getItem("sourceListSort", "update"),
                        js: $.toString(() => {
                            return $(["更新时间","接口名称"], 1).select(() => {
                                if(input=='接口名称'){
                                    setItem("sourceListSort","name");
                                }else{
                                    clearItem("sourceListSort");
                                }
                                refreshPage(false);
                            })
                        })
                    },{
                        title: "选源方式：" + (getItem("selectSource_col_type")=='hikerPop'?"hikerPop":"原生组件"),
                        js: $.toString(() => {
                            return $(["hikerPop","原生组件"], 1).select(() => {
                                if(input=='hikerPop'){
                                    setItem("selectSource_col_type","hikerPop");
                                }else{
                                    clearItem("selectSource_col_type");
                                }
                                refreshPage(false);
                            })
                        })
                    }]
                }
            }
            d.push(item);
        })
        d.push({
            col_type: "blank_block"
        })
        putMyVar(runMode+"_"+sourcename, "1");
    }
    //加载主页内容
    getYiData('主页', d);
}

//二级+源搜索
function erji() {
    addListener("onClose", $.toString((isback,surl) => {
        clearMyVar('二级详情临时对象');
        clearMyVar('二级附加临时对象');
        clearMyVar('二级简介打开标识');
        clearMyVar('换源变更列表id');
        clearMyVar('二级源接口信息');
        clearMyVar('加载异常自动换源');
        if(getMyVar('从书架进二级')){
            clearMyVar('从书架进二级');
            refreshPage(false);
        }
        if(isback && surl!=getMyVar('rulepageid')){
            back(false);
        }else{
            clearMyVar('rulepageid');
        }
    },MY_PARAMS.back||0, MY_PARAMS.surl));
    addListener('onRefresh', $.toString(() => {
        putMyVar('加载异常自动换源','1');
    }));
    //用于二级套娃自动返回计数
    if(MY_PARAMS.back && !getMyVar('rulepageid')){
        putMyVar('rulepageid', MY_PARAMS.surl);
    }
    clearMyVar('二级加载扩展列表');
    let isload;//是否正确加载
    let sauthor;
    let detailsfile = "hiker://files/_cache/SrcJu_details.json";
    let erjidetails = storage0.getMyVar('二级详情临时对象') || {};//二级海报等详情临时保存
    erjidetails.name = MY_PARAMS.name || erjidetails.name || "";
    let name = erjidetails.name.replace(/‘|’|“|”|<[^>]+>|全集|国语|粤语/g,"").trim();
    let myerjiextra = storage0.getMyVar('二级附加临时对象') || {};//二级换源时临时extra数据
    let d = [];
    let parse = {};
    let 公共;
    let 标识;
    let details;
    let stype = MY_PARAMS.stype;
    let smark = getMark(name, stype);//足迹记录
    let extrasource = [myerjiextra, MY_PARAMS, smark];
    let erjiextra;
    let sname;
    let surl;
    let sgroup;
    let lineid = smark.lineid || 0;
    let pageid = smark.pageid || 0;
    let detailload;
    let oldMY_PARAMS = Object.assign({}, MY_PARAMS);
    let pic;
    for(let i=0; i<extrasource.length; i++){
        sname = extrasource[i].sname || "";
        surl = extrasource[i].surl || "";
        if(sname&&surl){
            erjiextra = extrasource[i];
            break;
        }
    }
    
    //匹配取接口数据
    let sourcedata = erdatalist.filter(it => {
        return it.name == sname && it.type == stype;
    });
    let sourcedata2;//用于正常加载时，将二级接口存入当前页面PARAMS，确保分享时可以打开
    try {
        if (sourcedata.length == 0 && MY_PARAMS && MY_PARAMS.sourcedata) {
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
            sgroup = sourcedata2.group;
            storage0.putMyVar('二级源接口信息',{name: sname, type: stype, group: sgroup||"", img: sourcedata[0].img||""});
            
            try{
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                cacheData(sourcedata[0]);
            }catch(e){
                //log("√缓存临时文件失败>"+e.message);
            }
        }
        sauthor = parse["作者"];
    } catch (e) {
        xlog("√加载搜索源接口代码错误>"+e.message);
    }
    try {
        if (parse && surl) {
            try{
                eval("let gonggong = " + sourcedata[0].public);
                if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
                    requireCache(gonggong.ext, 48);
                    gonggong = ggdata;
                }
                公共 = gonggong || parse['公共'] || {};
                if(公共['预处理']){
                    try{
                        公共['预处理']();
                    }catch(e){
                        xlog('√执行预处理报错，信息>'+e.message);
                    }
                }
            }catch(e){
                xlog("√加载公共代码错误>"+e.message);
            }
            
            标识 = stype + "_" + sname;
            MY_URL = surl;
            let detailsmark;
            if(getMyVar('是否取缓存文件') && getMyVar('一级源接口信息') && !getMyVar("SrcJu_调试模式")){
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
            //方便换源时二级代码中使用MY_PARAMS
            MY_PARAMS = erjiextra;
            if(detailsmark){
                details = detailsmark;
            }else{
                try{
                    eval("let 二级获取 = " + parse['二级'])
                    details = 二级获取(surl);
                }catch(e){
                    details = {};
                    xlog("√二级获取数据错误>"+e.message);
                }
            }
            
            pic = details.img || oldMY_PARAMS.img;// || "https://p1.ssl.qhimgs1.com/sdr/400__/t018d6e64991221597b.jpg";
            pic = pic&&pic.indexOf("@Referer=") == -1 ? pic + "@Referer=" : pic;
            erjiextra.img = pic;
            erjidetails.img = erjiextra.img || erjidetails.img;
            erjidetails.detail1 = details.detail1 || erjidetails.detail1;
            erjidetails.detail2 =  details.detail2 || erjidetails.detail2;
            erjidetails.desc = details.desc || erjidetails.desc;
            let detailextra = details.detailextra || {};
            detailextra.id = "detailid";
            detailextra.gradient = detailextra.gradient || true;
            d.push({
                title: erjidetails.detail1 || "",
                desc: erjidetails.detail2 || "",
                pic_url: erjidetails.img,
                url: details.detailurl || (/^http/.test(surl)?surl+'#noRecordHistory##noHistory#':erjidetails.img),
                col_type: 'movie_1_vertical_pic_blur',
                extra: detailextra
            })
            detailload = 1;
            lineid = parseInt(getMyVar("SrcJu_"+surl+"_line", lineid.toString()));
            pageid = parseInt(getMyVar("SrcJu_"+surl+"_page", pageid.toString()));

            let 线路s = ["线路"];
            let 列表s = [[]];
            try{
                线路s = details.line?details.line:["线路"];
                列表s = details.line?details.list:[details.list];
                if(线路s.length != 列表s.length){
                    xlog('√'+sname+'>源接口返回的线路数'+线路s.length+'和列表数'+列表s.length+'不相等');
                }
            }catch(e){
                xlog('√'+sname+">线路或列表返回数据有误>"+e.message);
            }
            if(details.listparse){//选集列表需要动态解析获取
                let 线路选集 = details.listparse(lineid,线路s[lineid]) || [];
                if(线路选集.length>0){
                    列表s[lineid] = 线路选集;
                }
            }
            if(details.page && details.pageparse){//网站分页显示列表的，需要动态解析获取
                try{
                    if((detailsmark && pageid != details.pageid) || (!detailsmark && pageid>0)){
                        let 分页s = details.page;
                        if(pageid > 分页s.length){
                            pageid = 0;
                        }
                        let 分页选集 = details.pageparse(分页s[pageid].url);
                        if($.type(分页选集)=="array"){
                            列表s[lineid] = 分页选集;
                            details.list = details.line?列表s:分页选集;
                        }
                    }
                }catch(e){
                    xlog('√'+sname+'分页选集处理失败>'+e.message);
                }
            }
            
            if(lineid > 列表s.length-1){
                toast('选择的线路无选集，将显示第1线路');
                lineid = 0;
            }

            let 列表 = 列表s[lineid] || [];
            if(列表.length>0){
                function checkAndReverseArray(arr) {
                    const numbers = [];
                    arr.forEach(it=>{
                        const digits = it.title.match(/\d+/);
                        if (digits) {
                            numbers.push(parseInt(digits[0]));
                        }
                    })

                    if (numbers.length < 3) {
                        return arr;
                    }
                    let increasingCount = 0;
                    let decreasingCount = 0;
                    for (let i = 1; i < numbers.length; i++) {
                        if (numbers[i] > numbers[i - 1]) {
                            increasingCount++;
                        } else if (numbers[i] < numbers[i - 1]) {
                            decreasingCount++;
                        }
                    }
                    if (increasingCount > decreasingCount) {
                        return arr;
                    } else {
                        return arr.reverse();
                    }
                }
                try{
                    列表 = checkAndReverseArray(列表);
                }catch(e){
                    //xlog('√强制修正选集顺序失败>'+e.message)
                }
            }
            if (getMyVar(sname + 'sort') == '1') {
                列表.reverse();
            }

            let itype = stype=="漫画"?"comic":stype=="小说"?"novel":"";
            let 解析 = parse['解析'];
            let lazy = $("").lazyRule((解析,参数) => {
                let url = input.split("##")[1];
                let 公共 = {};
                try{
                    公共 = $.require('jiekou'+(/聚阅/.test(参数.规则名)?'':'?rule=聚阅√')).公共(参数.标识);
                }catch(e){
                    toast('未找到聚阅规则子页面');
                }
                eval("let 解析2 = " + 解析);
                let 标识 = 参数.标识;
                return 解析2(url,公共,参数);
            }, 解析, {"规则名": MY_RULE._title || MY_RULE.title, "标识": 标识});
            
            let download = $.toString((解析,公共,参数) => {
                eval("let 解析2 = " + 解析);
                let 标识 = 参数.标识;
                return 解析2(input,公共,参数);
            }, 解析, 公共, {"规则名": MY_RULE._title || MY_RULE.title, "标识": 标识});

            d.push({
                title: "详情简介",
                url: $("#noLoading#").lazyRule((desc) => {
                    if(getMyVar('二级简介打开标识')=="1"){
                        clearMyVar('二级简介打开标识');
                        deleteItemByCls("SrcJudescload");
                    }else{
                        putMyVar('二级简介打开标识',"1");
                        addItemAfter('detailid', [{
                            title: `<font color="#098AC1">详情简介 </font><small><font color="#f47983"> ></font></small>`,
                            col_type: "avatar",
                            url: $("#noLoading#").lazyRule(() => {
                                clearMyVar('二级简介打开标识');
                                deleteItemByCls("SrcJudescload");
                                return "hiker://empty";
                            }),
                            pic_url: "https://hikerfans.com/tubiao/ke/91.png",
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
                }, erjidetails.desc||""),
                pic_url: "https://hikerfans.com/tubiao/messy/32.svg",
                col_type: 'icon_small_3',
                extra: {
                    cls: "Juloadlist"
                }
            })
            let sskeyword = name.split('/')[0].trim();
            if(stype=="影视"){
                d.push({
                    title: "聚影搜索",
                    url: JySearch(sskeyword, getItem("juyingSeachType")),
                    pic_url: 'https://hikerfans.com/tubiao/messy/25.svg',
                    col_type: 'icon_small_3',
                    extra: {
                        cls: "Juloadlist",
                        longClick: [{
                            title: "搜索类型：" + getItem("juyingSeachType", "默认"),
                            js: $.toString(() => {
                                return $(["聚搜接口","云盘接口","Alist接口"], 3).select(() => {
                                    setItem("juyingSeachType",input);
                                    refreshPage(false);
                                })
                            })
                        }]
                    }
                })
            }else{
                d.push({
                    title: "书架/下载",
                    url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcBookCase.js');
                        bookCase();
                    }),
                    pic_url: 'https://hikerfans.com/tubiao/messy/70.svg',
                    col_type: 'icon_small_3',
                    extra: {
                        cls: "Juloadlist",
                        inheritTitle: false,
                        longClick: [{
                            title: "下载本地📥",
                            js: $.toString((itype) => {
                                if(itype){
                                    return "hiker://page/download.view#noRecordHistory##noRefresh##noHistory#?rule=本地资源管理"
                                }else{
                                    return "toast://不支持下载的类型"
                                }
                            },itype)
                        }],
                        chapterList: 列表,
                        "defaultView": "1",
                        "info": {
                            "bookName": name,
                            "bookTopPic": pic,
                            "parseCode": download,
                            "ruleName": MY_RULE._title || MY_RULE.title,
                            "type": itype,
                            "decode": 公共["imgdec"]?$.type(公共["imgdec"])=="function"?$.toString((imgdec)=>{
                                let imgDecrypt = imgdec;
                                return imgDecrypt();
                            },公共["imgdec"]):公共["imgdec"]:""
                        }
                    }
                })
            }

            d.push({
                title: "切换站源",
                url: $("#noLoading#").lazyRule((name,sgroup,stype) => {
                    updateItem("Julistloading2", { 
                        extra: {
                            id: "Julistloading",
                            lineVisible: false
                        } 
                    });
                    if(getMyVar('SrcJu_sousuoTest')){
                        return "toast://编辑测试模式下不允许换源.";
                    }else if(getMyVar('SrcJu_searchMode')=="sousuo"){
                        return "toast://搜索线程还未结束，稍等...";
                    }else{
                        clearMyVar('换源变更列表id');
                        require(config.依赖);
                        deleteItemByCls('Juloadlist');
                        showLoading('搜源中,请稍后.');
                        search(name,"erji",false,sgroup,stype);
                        hideLoading();
                        return  "hiker://empty";
                    }
                }, sskeyword, sgroup||"" ,stype),
                pic_url: 'https://hikerfans.com/tubiao/messy/20.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "Juloadlist",
                    newWindow: true,
                    windowId: MY_RULE.title + "搜索页",
                    longClick: [{
                        title: "新搜索页",
                        js: $.toString((sskeyword) => {
                            return $("hiker://empty#noRecordHistory##noHistory##fullTheme###fypage").rule((sskeyword) => {
                                require(config.依赖);
                                newsousuopage(sskeyword);
                            },sskeyword)
                        },sskeyword)
                    },{
                        title: "精准匹配："+(getItem('searchMatch','1')=="1"?"是":"否"),
                        js: $.toString(() => {
                            let sm;
                            if(getItem('searchMatch','1')=="1"){
                                setItem('searchMatch','2');
                                sm = "取消换源搜索精准匹配名称";
                            }else{
                                clearItem('searchMatch');
                                sm = "换源搜索精准匹配名称";
                            }
                            refreshPage(false);
                            return "toast://"+sm;
                        })
                    }]
                }
            })
            d.push({
                col_type: "line_blank"
            });
            let line_col_type = getItem('SrcJuLine_col_type', 'scroll_button');
            let addmoreitems = 0;
            if(getItem('extenditems','1')=="1" && details.moreitems && $.type(details.moreitems)=='array'){
                let moreitems = details.moreitems;
                if(moreitems.length>0){
                    moreitems.forEach(item => {
                        if(item.url!=surl){
                            item = toerji(item,{type:stype,name:sname});
                            item.extra = item.extra || {};
                            item.extra['back'] = 1;
                            item.extra['cls'] = "Juloadlist extendlist";
                            d.push(item);
                            addmoreitems = 1;
                        }
                    })
                }
            }
            if (line_col_type == 'scroll_button' && addmoreitems == 0) {
                for (let i = 0; i < 10; i++) {
                    d.push({
                        col_type: "blank_block"
                    })
                }
            }

            d.push({
                title: getMyVar(sname + 'sort') == '1' ? `““””<b><span style="color: #66CCEE">排序⇅</span></b>` : `““””<b><span style="color: #55AA44">排序⇅</span></b>`,
                url: $("#noLoading#").lazyRule((sname) => {
                    let 列表 = findItemsByCls('playlist') || [];
                    if(列表.length==0){
                        return 'toast://未获取到列表'
                    }
                    deleteItemByCls('playlist');
                    if (getMyVar(sname + 'sort') == '1') {
                        putMyVar(sname + 'sort', '0');
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #55AA44">排序⇅</span></b>`
                        });
                    } else {
                        putMyVar(sname + 'sort', '1')
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #66CCEE">排序⇅</span></b>`
                        });
                    };
                    列表.reverse();
                    列表.forEach(item => {
                        item.col_type = item.type;
                    })
                    
                    addItemBefore(getMyVar('二级加载扩展列表')?"extendlist":getMyVar('换源变更列表id')?"Julistloading2":"Julistloading", 列表);//排序和样式动态处理插入列表时查找id
                    return 'toast://切换排序成功'
                }, sname),
                col_type: line_col_type,
                extra: {
                    id: "listsort",
                    cls: "Juloadlist"
                }
            })
            let reviseLiTitle = getItem('reviseLiTitle','0');
            d.push({
                title: `““””<b><span style="color: #f47983">样式<small>🎨</small></span></b>`,
                url: $(["text_1","text_2","text_3","text_4","flex_button","text_2_left","text_3_left","分页设置"],2,"选集列表样式").select(() => {
                    if(input=="分页设置"){
                        return $(["开启分页","关闭分页","每页数量","分页阀值"],2).select(() => {
                            let partpage = storage0.getItem('partpage') || {};
                            if(input=="开启分页"){
                                partpage.ispage = 1;
                                storage0.setItem('partpage',partpage);
                            }else if(input=="关闭分页"){
                                partpage.ispage = 0;
                                storage0.setItem('partpage',partpage);
                            }else if(input=="每页数量"){
                                return $(partpage.pagenum||"40","每页选集数量").input((partpage) => {
                                    partpage.pagenum = parseInt(input);
                                    storage0.setItem('partpage',partpage);
                                    refreshPage(false);
                                    return 'hiker://empty'
                                },partpage)
                            }else if(input=="分页阀值"){
                                return $(partpage.partnum||"100","选集数量超过多少才分页").input((partpage) => {
                                    partpage.partnum = parseInt(input);
                                    storage0.setItem('partpage',partpage);
                                    refreshPage(false);
                                    return 'hiker://empty'
                                },partpage)
                            }
                            refreshPage(false);
                            return 'hiker://empty'
                        })
                    }else{
                        let 列表 = findItemsByCls('playlist') || [];
                        if(列表.length==0){
                            return 'toast://未获取到列表'
                        }
                        deleteItemByCls('playlist');
                        let list_col_type = input;
                        列表.forEach(item => {
                            item.col_type = list_col_type.replace("_left","");
                            if(list_col_type.indexOf("_left")>-1){
                                item.extra.textAlign = 'left';
                            }else{
                                delete item.extra.textAlign;
                            }
                        })
                        addItemBefore(getMyVar('二级加载扩展列表')?"extendlist":getMyVar('换源变更列表id')?"Julistloading2":"Julistloading", 列表);
                        setItem('SrcJuList_col_type', input);
                        return 'hiker://empty'
                    }
                }),
                col_type: line_col_type,
                extra: {
                    cls: "Juloadlist",
                    longClick: [{
                        title: "修正选集标题："+(reviseLiTitle=="1"?"是":"否"),
                        js: $.toString(() => {
                            let sm;
                            if(getItem('reviseLiTitle','0')=="1"){
                                clearItem('reviseLiTitle');
                                sm = "取消修正选集标题名称";
                            }else{
                                setItem('reviseLiTitle','1');
                                sm = "统一修正选集标题名称";
                            }
                            refreshPage(false);
                            return "toast://"+sm;
                        })
                    },{
                        title: "显示扩展项："+(getItem('extenditems','1')=="1"?"是":"否"),
                        js: $.toString(() => {
                            let sm;
                            if(getItem('extenditems','1')=="1"){
                                setItem('extenditems','0');
                                sm = "取消显示二级扩展项";
                            }else{
                                clearItem('extenditems');
                                sm = "显示二级扩展项";
                            }
                            refreshPage(false);
                            return "toast://"+sm;
                        })
                    },{
                        title: "线路样式："+getItem('SrcJuLine_col_type', 'scroll_button'),
                        js: $.toString(() => {
                            let sm;
                            if(getItem('SrcJuLine_col_type', 'scroll_button')=="flex_button"){
                                clearItem('SrcJuLine_col_type');
                                sm = "线路样式已切换为scroll_button";
                            }else{
                                setItem('SrcJuLine_col_type','flex_button');
                                sm = "线路样式已切换为flex_button";
                            }
                            refreshPage(false);
                            return "toast://"+sm;
                        })
                    }]
                }
            })
            
            if(线路s.length>0 && 线路s[0] !="线路"){
                线路s.forEach((it,i)=>{
                    d.push({
                        title: lineid==i?`““””<b><span style="color: #04B45F">`+it+`</span></b>`:it,
                        url: $("#noLoading#").lazyRule((lineurl,nowid,newid) => {
                            if(nowid != newid){
                                putMyVar(lineurl, newid);
                                refreshPage(false);
                            }
                            return 'hiker://empty'
                        }, "SrcJu_"+surl+"_line", lineid, i),
                        col_type: line_col_type,
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                })
            }
            //分页定义
            let partpage = storage0.getItem('partpage') || {};
            if(details.page && details.pageparse){//原网站有分页，不执行自定义分页
                let 分页s = details.page
                let 分页链接 = [];
                let 分页名 = [];
                分页s.forEach((it,i)=>{
                    分页链接.push($("#noLoading#").lazyRule((pageurl,nowid,newid) => {
                            if(nowid != newid){
                                putMyVar(pageurl, newid);
                                refreshPage(false);
                            }
                            return 'hiker://empty'
                        }, "SrcJu_"+surl+"_page", pageid, i)
                    )
                    分页名.push(pageid==i?'““””<span style="color: #87CEFA">'+it.title:it.title)
                })
                if(分页名.length>0){
                    d.push({
                        col_type: "blank_block",
                        extra: {
                            cls: "Juloadlist"
                        }
                    });
                        d.push({
                        title: pageid==0?"↪️尾页":"⏮️上页",
                        url: pageid==0?分页链接[分页名.length-1]:分页链接[pageid-1],
                        col_type: 'text_4',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                    d.push({
                        title: 分页名[pageid],
                        url: $(分页名, 2).select((分页名,分页链接) => {
                            return 分页链接[分页名.indexOf(input)];
                        },分页名,分页链接),
                        col_type: 'text_2',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                    d.push({
                        title: pageid==分页名.length-1?"首页↩️":"下页⏭️",
                        url: pageid==分页名.length-1?分页链接[0]:分页链接[pageid+1],
                        col_type: 'text_4',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                }
            }else if(partpage.ispage){//启用分页
                let 每页数量 = partpage.pagenum || 40; // 分页的每页数量       
                let 翻页阀值 = partpage.partnum || 100; // 分页的翻页阀值，超过多少才显示翻页
                
                if (列表.length > 翻页阀值) { 
                    let 最大页数 = Math.ceil(列表.length / 每页数量);  
                    let 分页页码 = pageid + 1; //当前页数
                    if (分页页码 > 最大页数) { //防止切换线路导致页数数组越界
                        分页页码 = 最大页数;
                    }
                    let 分页链接 = [];
                    let 分页名 = [];
                    function getNewArray(array, subGroupLength) {
                        let index = 0;
                        let newArray = [];
                        while(index < array.length) {
                            newArray.push(array.slice(index, index += subGroupLength));
                        }
                        return newArray;
                    }
                    let 分页s = getNewArray(列表, 每页数量);//按每页数据切割成小数组

                    分页s.forEach((it,i)=>{
                        分页链接.push($("#noLoading#").lazyRule((pageurl,nowid,newid) => {
                                if(nowid != newid){
                                    putMyVar(pageurl, newid);
                                    refreshPage(false);
                                }
                                return 'hiker://empty'
                            }, "SrcJu_"+surl+"_page", pageid, i)
                        )
                        let start = i * 每页数量 + 1;
                        let end = i * 每页数量 + it.length;
                        let title = start + ' - ' + end;
                        分页名.push(pageid==i?'““””<span style="color: #87CEFA">'+title:title)
                    })
                    d.push({
                        col_type: "blank_block",
                        extra: {
                            cls: "Juloadlist"
                        }
                    });
                    d.push({
                        title: 分页页码==1?"↪️尾页":"⏮️上页",
                        url: 分页页码==1?分页链接[分页名.length-1]:分页链接[pageid-1],
                        col_type: 'text_4',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                    d.push({
                        title: 分页名[pageid],
                        url: $(分页名, 2).select((分页名,分页链接) => {
                            return 分页链接[分页名.indexOf(input)];
                        },分页名,分页链接),
                        col_type: 'text_2',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                    d.push({
                        title: 分页页码==分页名.length?"首页↩️":"下页⏭️",
                        url: 分页页码==分页名.length?分页链接[0]:分页链接[pageid+1],
                        col_type: 'text_4',
                        extra: {
                            cls: "Juloadlist"
                        }
                    })
                    列表 = 分页s[pageid];//取当前分页的选集列表
                }
            }

            let list_col_type = getItem('SrcJuList_col_type', 'text_2');//列表样式
            for(let i=0; i<列表.length; i++) {
                let extra = Object.assign({}, details["extra"] || {});//二级返回数据中的extra设为默认
                try{
                    extra = Object.assign(extra, 列表[i].extra || {});//优先用选集的extra
                }catch(e){}
                extra.id = name + "_选集_" + (pageid?pageid+"_":"") + i;
                extra.cls = "Juloadlist playlist";
                if(stype=="听书"||stype=="影视"||stype=="音乐"){
                    extra.jsLoadingInject = true;
                    if(!extra.blockRules){
                        extra.blockRules = ['.m4a', '.mp3', '.gif', '.jpeg', '.jpg', '.ico', '.png', 'hm.baidu.com', '/ads/*.js', 'cnzz.com', '51.la'];
                    }
                }
                if(list_col_type.indexOf("_left")>-1){
                    extra.textAlign = 'left';
                }
                if (stype=="小说" || details["rule"] || details["novel"] || 列表[i].rule) {
                    extra.url = 列表[i].url;
                    lazy = lazy.replace("@lazyRule=.",((stype=="小说"||details["novel"])?"#readTheme##autoPage#":"#noRecordHistory#")+"@rule=").replace(`input.split("##")[1]`,`MY_PARAMS.url || ""`);
                }
                d.push({
                    title: reviseLiTitle=="1"?列表[i].title.replace(name,'').replace(/‘|’|“|”|<[^>]+>| |-|_|第|集|话|章|\</g,'').replace('（','(').replace('）',')'):列表[i].title,
                    url: "hiker://empty##" + 列表[i].url + lazy,
                    desc: 列表[i].desc,
                    img: 列表[i].img,
                    col_type: 列表[i].col_type || list_col_type.replace("_left",""),
                    extra: extra
                });
            }
            
            if(列表.length>0 || getMyVar('SrcJu_sousuoTest')){
                isload = 1;
            }else if(列表.length==0){
                if(!getMyVar('加载异常自动换源')){
                    putMyVar('加载异常自动换源','1');
                    refreshPage(false);
                }else{
                    toast("选集列表为空，请更换其他源");
                }
            }
        }
    } catch (e) {
        toast('有异常，看日志');
        xlog('√'+sname + '>加载详情失败>' + e.message);
    }

    if (isload) {
        if(getItem('extenditems','1')=="1" && details.extenditems && $.type(details.extenditems)=='array'){
            let extenditems = details.extenditems;
            if(extenditems.length>0){
                d.push({
                    col_type: "blank_block",
                    extra: {
                        cls: "Juloadlist extendlist",
                        id: "extendlist"
                    }
                })
                extenditems.forEach(item => {
                    if(item.url!=surl){
                        item = toerji(item,{type:stype,name:sname});
                        item.extra = item.extra || {};
                        item.extra['back'] = 1;
                        item.extra['cls'] = "Juloadlist extendlist";
                        d.push(item)
                    }
                })
            }
            putMyVar('二级加载扩展列表','1');
        }
        d.push({
            title: "‘‘’’<small><font color=#f20c00>当前数据源：" + sname + (sauthor?", 作者：" + sauthor:"") + "</font></small>",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: getMyVar('换源变更列表id')?"Julistloading2":"Julistloading",
                lineVisible: false
            }
        });
        setResult(d);
        if(!getMyVar(sname+"_"+name)){
            toast('当前数据源：' + sname + (sauthor?", 作者：" + sauthor:""));
        }
        putMyVar(sname+"_"+name, "1");
        //更换收藏封面
        if(erjidetails.img && oldMY_PARAMS.img!=erjidetails.img){
            setPagePicUrl(erjidetails.img);
        }
        //二级详情简介临时信息
        storage0.putMyVar('二级详情临时对象',erjidetails);
        //二级源浏览记录保存
        let erjidata = { name: name, sname: sname, surl: surl, stype: stype, lineid: lineid, pageid: pageid };
        setMark(erjidata);
        //当前二级详情数据保存
        if(!getMyVar("SrcJu_调试模式")){
            details.sname = sname;
            details.surl = surl;
            details.pageid = pageid;
            writeFile(detailsfile, $.stringify(details));
        }
        //收藏更新最新章节
        if (parse['最新']) {
            setLastChapterRule('js:' + $.toString((sname,surl,最新,公共,参数) => {
                let 最新str = 最新.toString().replace('setResult','return ').replace('getResCode()','request(surl)');
                eval("let 最新2 = " + 最新str);
                let 标识 = 参数.标识;
                try{
                    let zx = 最新2(surl,公共) || "";
                    setResult(sname + " | " + (zx||""));
                }catch(e){
                    最新2(surl,公共);
                }
            }, sname, surl, parse['最新'], 公共, {"规则名": MY_RULE._title || MY_RULE.title, "标识": 标识}))
        }
        //切换源时更新收藏数据，以及分享时附带接口
        if (typeof (setPageParams) != "undefined") {
            if ((surl && oldMY_PARAMS.surl!=surl) || !oldMY_PARAMS.sourcedata) {
                delete sourcedata2['parse']
                erjiextra.name = erjiextra.name || name;
                erjiextra.sourcedata = sourcedata2;
                delete erjiextra.sousuo;//正常加载的清除返回搜索标识，用于下次加载异常时自动搜源
                setPageParams(erjiextra);
            }
        }
        putMyVar('是否取缓存文件','1');//判断是否取本地缓存文件,软件打开初次在线取
    } else {
        if(!detailload){
            pic = MY_PARAMS.img || "";
            pic = pic&&pic.indexOf("@Referer=") == -1 ? pic + "@Referer=" : pic;
            d.push({
                title: "\n搜索接口源结果如下",
                desc: "\n\n选择一个源观看吧👇",
                pic_url: pic,
                url: pic,
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true,
                    id: "detailid"
                }
            });
        }
        d.push({
            title: "",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "Julistloading",
                lineVisible: false
            }
        });
        setResult(d);
        
        if(!getMyVar('SrcJu_sousuoTest') && !getMyVar("SrcJu_调试模式") && !oldMY_PARAMS.sousuo){
            if(getMyVar('加载异常自动换源')=="1"){
                showLoading('搜源中,请稍后.');
                search(name,"erji",false,sgroup,stype);
            }else{
                toast('下拉刷新看看');
            }
        }
    }
    clearMyVar('换源变更列表id');
}
//搜索页面
function sousuo() {
    let name = MY_URL.split('##')[1];
    
    if(getItem('searchmode')!="jusousuo"){
        let d = [];
        d.push({
            title: "搜索中...",
            url: "hiker://empty",
            extra: {
                id: "sousuoloading"
            }
        });
        setResult(d);
        let info = storage0.getMyVar('一级源接口信息') || {};
        search(name,'sousuo',false,info.group);
    }else{
        setResult([{
            title: "视界聚搜",
            url: "hiker://search?s=" + name.split('  ')[0].trim(),
            extra: {
                delegateOnlySearch: true,
                rules: $.toString((name) => {
                    let info = storage0.getMyVar('一级源接口信息') || {};
                    require(config.依赖);
                    let ssdatalist = erdatalist.filter(it=>{
                        if(info.group=="全全" || !info.group){
                            return it.type==info.type;
                        }else{
                            return it.type==info.type && (it.group==info.group||it.group=="全全");
                        }
                    });
                    let keyword = name.split('  ')[0].trim();
                    let keyword2;
                    if(name.indexOf('  ')>-1){
                        keyword2 = name.split('  ')[1].trim() || info.name;
                    }

                    if(keyword2){
                        ssdatalist = ssdatalist.filter(it=>{
                            return it.type==info.type && it.name==keyword2;
                        });
                    }

                    let data = [];
                    ssdatalist.forEach(it=>{
                        data.push({
                            "title": it.name,
                            "search_url": "hiker://empty##fypage",
                            "searchFind": `js: require(config.依赖); let d = search('` + keyword + `','jusousuo',` + JSON.stringify(it) + `); setResult(d);`
                        });
                    })
                    return JSON.stringify(data)
                },name)
            }
        }])
    }
}
//搜索接口
function search(keyword, mode, sdata, group, type) {
    //mode:sousuo(聚阅聚合)、sousuotest(接口测试)、erji(二级换源)、sousuopage(嗅觉新搜索页)、jusousuo(视界聚合)
    let updateItemid = mode=="sousuo" ?  "sousuoloading" : mode=="sousuopage"?"sousuoloading"+getMyVar('SrcJu_sousuoType',type||''):"Julistloading";
    if((mode=="sousuo") && getMyVar('SrcJu_searching')=="1"){
        if(MY_PAGE==1){
            putMyVar("SrcJu_停止搜索线程", "1");
            let waittime = 10;
            for (let i = 0; i < waittime; i++) {
                if(getMyVar("SrcJu_停止搜索线程","0")=="0"){
                    updateItem(updateItemid, { title: '搜索中...' });
                    break;
                }
                updateItem(updateItemid, { title: '等待上次线程结束，'+(waittime-i-1)+'s' });
                java.lang.Thread.sleep(1000);
            }
        }
    }
    let name = keyword.split('  ')[0].trim();
    let searchMark = storage0.getMyVar('SrcJu_searchMark') || {};//二级换源缓存
    if(mode=="erji" && searchMark[name]){
        addItemBefore(updateItemid, searchMark[name]);
        updateItem(updateItemid, {
            title: getMyVar('SrcJu_searching')=="1"?"‘‘’’<small>搜索中</small>":"‘‘’’<small>当前搜索为缓存</small>",
            url: $("确定删除“"+name+"”搜索缓存吗？").confirm((name)=>{
                let searchMark = storage0.getMyVar('SrcJu_searchMark') || {};
                delete searchMark[name];
                storage0.putMyVar('SrcJu_searchMark', searchMark);
                refreshPage(true);
                return "toast://已清除";
            },name)
        });
        let i = 0;
        let one = "";
        for (var k in searchMark) {
            i++;
            if (i == 1) { one = k }
        }
        if (i > 20) { delete searchMark[one]; }
        hideLoading();
        return "hiker://empty";
    }else{
        updateItem(updateItemid, {
            title: mode=="erji"?"搜源中...":"搜索中...",
            url: "hiker://empty",
        });
    }
    if(mode!="jusousuo" && mode!="sousuopage" && getMyVar('SrcJu_searching')=="1"){
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
            clearMyVar('MY_PGAE');
        }else{
            page = parseInt(getMyVar('MY_PGAE','1'))+1;
            putMyVar('MY_PGAE',page);
        }
    }else if(mode=="sousuotest" || mode=="sousuopage" || mode=="jusousuo"){
        page = MY_PAGE;
    }
    if(page==1){
        clearMyVar('nosousuolist');
    }

    let ssstype = type || runMode;
    let sssname;

    if(keyword.indexOf('  ')>-1){
        let keyword2 = keyword.split('  ')[1].trim();
        if(keyword2 && getTypeNames().indexOf(keyword2)>-1){
            ssstype = keyword2;
        }else{
            sssname = keyword2 || sourcename;
        }
    }

    putMyVar('SrcJu_searchMode',mode);
    putMyVar('SrcJu_searching','1');
    let success = 0;
    let results = [];
    let ssdatalist = [];
    if (sdata) {
        ssdatalist.push(sdata);
    }else if (sssname){
        ssdatalist = getListData("er", ssstype).filter(it=>{
            return it.name==sssname;
        });
    }else{
        ssdatalist = erdatalist.filter(it=>{
            if(group=="全全" || !group){//未分组或当前为全全分组的接口时，搜索所有此类型的接口
                return it.type==ssstype;
            }else{
                return it.type==ssstype && (it.group==group||it.group=="全全");//分组名为真则只搜指定分组和全全
            }
        });
    }
    let nosousuolist = storage0.getMyVar('nosousuolist') || [];
    if (nosousuolist.length>0){
        ssdatalist = ssdatalist.filter(it => {
            return nosousuolist.indexOf(it.name) == -1;
        })
    }
    
    let task = function (obj) {
        let objdata = obj.data;
        let objmode = obj.mode;
        let name = obj.name;

        try {
            let parse;
            let 公共;
            let 标识;
            eval("let source = " + objdata.erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
            if(parse){
                try{
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                    cacheData(objdata);
                }catch(e){
                    //xlog("√缓存临时文件失败>"+e.message);
                }
                eval("let gonggong = " + objdata.public);
                if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
                    requireCache(gonggong.ext, 48);
                    gonggong = ggdata;
                }
                公共 = gonggong || parse['公共'] || {};
                if(公共['预处理']){
                    try{
                        公共['预处理']();
                    }catch(e){
                        xlog('√执行预处理报错，信息>'+e.message);
                    }
                }
                标识 = objdata.type + "_" + objdata.name;
                let ssdata = [];
                let 搜索str = parse['搜索'].toString();
                if(!搜索str.includes('rule')){
                    搜索str = 搜索str.replace('setResult','return ');
                }
                eval("let 搜索 = " + 搜索str)
                let 参数 = {"规则名": MY_RULE._title || MY_RULE.title, "标识": 标识}
                function ocr(codeurl,headers) {
                    headers= headers || {};
                    let img = convertBase64Image(codeurl,headers).replace('data:image/jpeg;base64,','');
                    let code = request('https://api-cf.nn.ci/ocr/b64/text', { body: img, method: 'POST', headers: {"Content-Type":"text/html"}});
                    code = code.replace(/o/g, '0').replace(/u/g, '0').replace(/I/g, '1').replace(/l/g, '1').replace(/g/g, '9');
                    if(code.includes("+")&&code.includes("=")){
                        code = eval(code.split("=")[0]);
                    }
                    xlog('识别验证码：'+code);
                    return code;
                }
                ssdata = 搜索(name,page,公共,参数) || [];
                //xlog('√'+objdata.name+">搜索结果>"+ssdata.length);
                let resultdata = [];
                ssdata.forEach(item => {
                    let extra = item.extra || {};
                    extra.name = extra.name || extra.pageTitle || (item.title?item.title.replace(/‘|’|“|”|<[^>]+>|全集|国语|粤语/g,"").trim():"");
                    if((objmode=="erji" && ((getItem('searchMatch','1')=="1"&&extra.name.toLowerCase()==name.toLowerCase())||(getItem('searchMatch')=="2"&&extra.name.toLowerCase().includes(name.toLowerCase())))) || objmode!="erji"){
                        let keepurl = /js:|select:|\(|\)|=>|hiker:\/\/page|toast:|video:/;//定义保留传值的项目url
                        //if((!keepurl.test(item.url) && extra.name.toLowerCase().includes(name.toLowerCase())) || keepurl.test(item.url) || objmode!="erji"){
                            extra.img = extra.img || item.img || item.pic_url;
                            extra.stype = objdata.type;
                            extra.sname = objdata.name;
                            extra.pageTitle = extra.pageTitle || extra.name;
                            extra.surl = item.url && !keepurl.test(item.url) ? item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#readTheme#|#autoPage#|#noLoading#|#/g, "") : "";
                            if(/sousuo/.test(objmode)){
                                extra.sousuo = 1;
                            }
                            item.extra = extra;
                            item.url = /sousuo/.test(objmode) ? (keepurl.test(item.url) || item.url=='hiker://empty')?item.url:$("hiker://empty?type="+objdata.type+"#immersiveTheme##autoCache#").rule(() => {
                                require(config.依赖);
                                erji();
                            }) : "hiker://empty##"+ item.url + $("#noLoading#").b64().lazyRule((extra) => {
                                if(getMyVar('换源变更列表id')){
                                    return "toast://请勿重复点击，稍等...";
                                }else{
                                    putMyVar('换源变更列表id','1');
                                    clearMyVar(extra.sname+"_"+extra.name);
                                    storage0.putMyVar('二级附加临时对象', extra);
                                    refreshPage(false);
                                    return "toast://已切换源：" + extra.sname;
                                }
                            }, extra);
                            item.title = objmode=="erji"?objdata.name:item.title;
                            //item.content = item.content || item.desc;
                            item.desc = item.desc || "";
                            item.desc = objmode=="sousuo"||objmode=="sousuopage"  ? MY_RULE.title+' · '+objdata.name+' · '+item.desc :objmode=="sousuotest"?(item.content || item.desc): (extra.desc || item.desc);
                            item.col_type = objmode=="sousuo"||objmode=="jusousuo"  ? "video" : (objmode=="sousuotest"||objmode=="sousuopage") ? "movie_1_vertical_pic" : "avatar";
                            //log(item);
                            resultdata.push(item);
                        //}
                    }
                })
                return {result:resultdata, success:1};
            }
            return {result:[], success:0};
        } catch (e) {
            xlog('√'+objdata.name + '>搜索失败>' + e.message);
            return {result:[], success:0};
        }
    }
    let list = ssdatalist.map((item) => {
        return {
            func: task,
            param: {"data":item,"mode":mode,"name":name},
            id: item.name
        }
    });
    if (list.length > 0) {
        be(list, {
            func: function (obj, id, error, taskResult) {
                if(getMyVar("SrcJu_停止搜索线程")=="1"){
                    return "break";
                }else if(taskResult.success==1){
                    let data = taskResult.result;
                    if(data.length>0){
                        success++;
                        if(mode=="erji"){
                            let searchMark = storage0.getMyVar('SrcJu_searchMark') || {};//二级换源缓存
                            searchMark[name] = searchMark[name] || [];
                            searchMark[name] = searchMark[name].concat(data);
                            storage0.putMyVar('SrcJu_searchMark', searchMark);
                            if(!getMyVar('换源变更列表id')){
                                addItemBefore("Julistloading", data);
                            }
                            hideLoading();
                        }else if(mode=="sousuo"){
                            addItemBefore(updateItemid, data);
                        }else if(mode=="sousuopage"){
                            addItemBefore(updateItemid, data);
                        }else if(mode=="sousuotest"||mode=="jusousuo"){
                            results = data;
                        }
                    }else{
                        nosousuolist.push(id);
                        storage0.putMyVar('nosousuolist', nosousuolist);
                    }
                }
            },
            param: {
            }
        });
        /*
        if (mode=="erji") {
            storage0.putMyVar('searchMark', searchMark);
        }
        */
        clearMyVar('SrcJu_searching');
        clearMyVar('SrcJu_searchMode');
        hideLoading();
        clearMyVar("SrcJu_停止搜索线程");
        if(mode=="sousuotest"||mode=="jusousuo"){
            return results;
        }else{
            let sousuosm = mode=="sousuo"||mode=="sousuopage" ? success + "/" + list.length + "，第"+page+"页搜索完成" : "‘‘’’<small><font color=#f13b66a>" + success + "</font>/" + list.length + "，搜索完成</small>";
            updateItem(updateItemid, { title: sousuosm });
        }
    } else {
        clearMyVar('SrcJu_searching');
        clearMyVar('SrcJu_searchMode');
        hideLoading();
        clearMyVar("SrcJu_停止搜索线程");
        if(page==1){
            toast("无接口");
            if(mode=="sousuo"||mode=="sousuopage"){
                updateItem("sousuoloading", { title: "无接口" });
            }
        }
        if(mode=="sousuotest"||mode=="jusousuo"){
            return [];
        }
    }
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
            downloadFile('https://hikerfans.com/tubiao/messy/13.svg', 'hiker://files/cache/src/管理.svg');
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
            downloadFile('https://hikerfans.com/tubiao/messy/165.svg', 'hiker://files/cache/src/收藏.svg');
        }
    } catch (e) { }
}

//版本检测
function Version() {
    var nowVersion = getItem('Version', "0.1");//现在版本 
    var nowtime = Date.now();
    var oldtime = parseInt(getItem('VersionChecktime', '0').replace('time', ''));
    if (getMyVar('SrcJu_versionCheck', '0') == '0' && nowtime > (oldtime + 12 * 60 * 60 * 1000)) {
        try {
            eval(request(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcTmplVersion.js'))
            if (parseFloat(newVersion.SrcJu) > parseFloat(nowVersion)) {
                confirm({
                    title: '发现新版本，是否更新？',
                    content: nowVersion + '=>' + newVersion.SrcJu + '\n' + newVersion.SrcJudesc[newVersion.SrcJu],
                    confirm: $.toString((nowtime,newVersion) => {
                        setItem('Version', newVersion);
                        setItem('VersionChecktime', nowtime + 'time');
                        deleteCache();
                        delete config.依赖;
                        refreshPage();
                    }, nowtime, newVersion.SrcJu),
                    cancel: ''
                })
                xlog('√检测到新版本！\nV' + newVersion.SrcJu + '版本》' + newVersion.SrcJudesc[newVersion.SrcJu]);
            }
            putMyVar('SrcJu_Version', '-V' + newVersion.SrcJu);
        } catch (e) { }
        putMyVar('SrcJu_versionCheck', '1');
    } else {
        putMyVar('SrcJu_Version', '-V' + nowVersion);
    }
}
//新搜索页
function newsousuopage(keyword,searchtype,relyfile) {
    addListener("onClose", $.toString(() => {
        if(getMyVar('SrcJu_rely')){
            initConfig({
                依赖: getMyVar('SrcJu_rely')
            });
            clearMyVar('SrcJu_rely');
        }
        clearMyVar('SrcJu_sousuoName');
        clearMyVar('SrcJu_sousuoType');
        putMyVar("SrcJu_停止搜索线程", "1");
    }));
    addListener('onRefresh', $.toString(() => {
        clearMyVar('SrcJu_sousuoName');
    }));
    setPageTitle("搜索|聚阅√");
    if(relyfile){
        if(!getMyVar('SrcJu_rely') && config.依赖){
            putMyVar('SrcJu_rely',config.依赖);
        }
        initConfig({
            依赖: relyfile
        });
    }
    let name = getMyVar('SrcJu_sousuoName',keyword||'');
    let d = [];
    let descarr = ['可快速切换下面类型','关键字+2个空格，搜当前','关键字+2个空格+接口名','切换站源长按可进入这里','接口有分组，则搜索同分组'];
    if(MY_PAGE==1){
        d.push({
            title: "🔍",
            url: $.toString(() => {
                if(input){
                    putMyVar('SrcJu_sousuoName',input);
                    if(input){
                        let recordlist = storage0.getItem('searchrecord') || [];
                        if(recordlist.indexOf(input)>-1){
                            recordlist = recordlist.filter((item) => item !== input);
                        }
                        recordlist.unshift(input);
                        if(recordlist.length>20){
                            recordlist.splice(recordlist.length-1,1);
                        }
                        storage0.setItem('searchrecord', recordlist);
                    }
                    refreshPage(true);
                }
            }),
            desc: descarr[Math.floor(Math.random() * descarr.length)],
            col_type: "input",
            extra: {
                defaultValue: getMyVar('SrcJu_sousuoName',keyword||''),
                titleVisible: true
            }
        });
        let searchTypes = getTypeNames("搜索页");
        searchTypes.forEach((it) =>{
            let obj = {
                title: getMyVar("SrcJu_sousuoType",searchtype||runMode)==it?`““””<b><span style="color: #3399cc">`+it+`</span></b>`:it,
                url: $('#noLoading#').lazyRule((it) => {
                    putMyVar("SrcJu_sousuoType",it);
                    refreshPage(false);
                    return "hiker://empty";
                },it),
                col_type: 'text_5'
            }
            if(it=="影视" && name){
                obj.extra = {};
                obj["extra"].longClick = [{
                    title:"🔍聚影搜索",
                    js: $.toString((url)=>{
                        return url;
                    }, JySearch(name, getItem("juyingSeachType")))
                }];
            }
            d.push(obj);
        })

        let recordlist = storage0.getItem('searchrecord') || [];
        if(recordlist.length>0){
            d.push({
                title: '🗑清空',
                url: $('#noLoading#').lazyRule(() => {
                    clearItem('searchrecord');
                    deleteItemByCls('searchrecord');
                    return "toast://已清空";
                }),
                col_type: 'flex_button',//scroll_button
                extra: {
                    cls: 'searchrecord'
                }
            });
        }else{
            d.push({
                title: '↻无记录',
                url: "hiker://empty",
                col_type: 'flex_button',
                extra: {
                    cls: 'searchrecord'
                }
            });
        }
        recordlist.forEach(item=>{
            d.push({
                title: item,
                url: $().lazyRule((input) => {
                    putMyVar('SrcJu_sousuoName',input);
                    refreshPage(true);
                    return "hiker://empty";
                },item),
                col_type: 'flex_button',
                extra: {
                    cls: 'searchrecord'
                }
            });
        })
    }
    d.push({
        title: "",
        col_type: 'text_center_1',
        url: "hiker://empty",
        extra: {
            id: "sousuoloading"+getMyVar('SrcJu_sousuoType', searchtype||runMode),
            lineVisible: false
        }
    });
    setResult(d);
    
    if(name){
        deleteItemByCls('searchrecord');
        let info = storage0.getMyVar('一级源接口信息') || {};
        let type = getMyVar("SrcJu_sousuoType", searchtype||info.type);
        search(name,"sousuopage",false,info.group,type);
    }
}