////本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
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

function SRCSet() {
    addListener("onClose", $.toString(() => {
        clearMyVar('duoselect');
        clearMyVar("seacrhjiekou");
    }));
    clearMyVar('duoselect');
    setPageTitle("♥管理"+getMyVar('SrcJu-Version', ''));
    let d = [];
    d.push({
        title: '增加',
        url: $('hiker://empty#noRecordHistory##noHistory#').rule((sourcefile) => {
            setPageTitle('增加 | 聚阅接口');
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
            jiekouapi(sourcefile);
        }, sourcefile),
        img: "https://hikerfans.com/tubiao/more/25.png",
        col_type: "icon_4",
        extra: {
            longClick: [{
                title: getMyVar("调试模式")?'退出调试':'调试模式',
                js: $.toString(() => {
                    return $().lazyRule(() => {
                        if(getMyVar("调试模式")){
                            clearMyVar("调试模式");
                        }else{
                            putMyVar("调试模式", "1");
                        }
                        return "toast://已设置"
                    })
                })
            }]
        }
    });
    d.push({
        title: '操作',
        url: $(["接口更新","清空接口"], 2).select(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
            if(input=="接口更新"){
                showLoading("更新中...");
                let updatelist = [];
                yxdatalist.forEach(it=>{
                    try{
                        eval("let yparse = " + it.parse);
                        if (yparse && yparse.ext && /^http/.test(yparse.ext) && updatelist.indexOf(yparse.ext)==-1) {
                            fetchCache(yparse.ext, 0);
                            updatelist.push(yparse.ext);
                        }
                        eval("let eparse = " + it.erparse);
                        if (eparse && eparse.ext && /^http/.test(eparse.ext) && updatelist.indexOf(eparse.ext)==-1) {
                            fetchCache(eparse.ext, 0);
                        }
                        eval("let gparse = " + it.public);
                        if (gparse && gparse.ext && /^http/.test(gparse.ext) && updatelist.indexOf(gparse.ext)==-1) {
                            fetchCache(gparse.ext, 0);
                        }
                    }catch(e){

                    }
                })
                hideLoading();
                return "toast://在线接口更新完成";
            }else if(input=="清空接口"){
                return $("确定清空所有接口吗？").confirm((sourcefile)=>{
                    return $("确定想好了吗，清空后无法恢复！").confirm((sourcefile)=>{
                        let datalist = [];
                        writeFile(sourcefile, JSON.stringify(datalist));
                        clearMyVar('searchMark');
                        refreshPage(false);
                        return 'toast://已清空';
                    },sourcefile)
                },sourcefile)
            }
        }),
        img: "https://hikerfans.com/tubiao/more/290.png",
        col_type: "icon_4"
    });
    d.push({
        title: '导入',
        url: $(["聚阅口令","文件导入"], 2 , "选择导入方式").select(() => {
            if(input=="聚阅口令"){
                return $("", "聚阅分享口令").input(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                    JYimport(input)
                })
            }else if(input=="文件导入"){
                return `fileSelect://`+$.toString(()=>{
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                    input = '聚阅接口￥' + aesEncode('SrcJu', input) + '￥文件导入';
                    JYimport(input)
                })
            }
        }),
        img: "https://hikerfans.com/tubiao/more/43.png",
        col_type: "icon_4",
        extra: {
            longClick: [{
                title: Juconfig['ImportType']!="Skip"?'导入模式：覆盖':'导入模式：跳过',
                js: $.toString((cfgfile, Juconfig) => {
                    return $(["覆盖", "跳过"],2).select((cfgfile,Juconfig) => {
                        Juconfig["ImportType"] = input=="覆盖"?"Coverage":"Skip";
                        writeFile(cfgfile, JSON.stringify(Juconfig));
                        refreshPage(false);
                        return 'toast://导入模式已设置为：' + input;
                    }, cfgfile, Juconfig)
                },cfgfile, Juconfig)
            }]
        }
    });
    d.push({
        title: '分享',
        url: yxdatalist.length == 0 ? "toast://有效聚阅接口为0，无法分享" : $().b64().lazyRule(() => {
            let sharelist;
            let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
            if(duoselect.length>0){
                sharelist = duoselect;
            }else{
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                sharelist = yxdatalist;
            }
            let pastes = getPastes();
            pastes.push('文件分享');
            return $(pastes, 2 , "选择剪贴板").select((sharelist) => {
                if(input=='文件分享'){
                    let sharetxt = aesEncode('SrcJu', JSON.stringify(sharelist));
                    //let code = '聚阅接口￥' + sharetxt + '￥共' + sharelist.length + '条('+input+')';
                    //let sharefile = 'hiker://files/_cache/share_'+$.dateFormat(new Date(),"yyyyMMddHHmmss")+'.hiker';
                    //writeFile(sharefile,'云口令：'+code+`@import=js:$.require("hiker://page/import?rule=`+MY_RULE.title+`");`);
                    let sharefile = 'hiker://files/_cache/share_'+$.dateFormat(new Date(),"yyyyMMddHHmmss")+'.txt';
                    writeFile(sharefile, sharetxt);
                    if(fileExist(sharefile)){
                        return 'share://'+sharefile;
                    }else{
                        return 'toast://分享文件生成失败';
                    }
                }else{
                    showLoading('分享上传中，请稍后...');
                    let pasteurl = sharePaste(aesEncode('SrcJu', JSON.stringify(sharelist)), input);
                    hideLoading();
                    if (/^http/.test(pasteurl)) {
                        let code = '聚阅接口￥' + aesEncode('SrcJu', pasteurl) + '￥共' + sharelist.length + '条('+input+')';
                        copy('云口令：'+code+`@import=js:$.require("hiker://page/import?rule=`+MY_RULE.title+`");`);
                        refreshPage(false);
                        return "toast://聚阅分享口令已生成";
                    } else {
                        return "toast://分享失败，剪粘板或网络异常"+pasteurl;
                    }
                }
            },sharelist)
        }),
        img: "https://hikerfans.com/tubiao/more/3.png",
        col_type: "icon_4"
    });
    d.push({
        col_type: "line"
    });
    for (let i = 0; i < 8; i++) {
        d.push({
            col_type: "blank_block"
        })
    }
    let jkdatalist;
    if(getMyVar("seacrhjiekou")){
        jkdatalist = datalist.filter(it=>{
            return it.name.indexOf(getMyVar("seacrhjiekou"))>-1;
        })
    }else{
        jkdatalist = datalist.filter(it=>{
            return getMyVar("SrcJuJiekouType","全部")=="全部" || getMyVar("SrcJuJiekouType","全部")==it.type;
        })
    }

    let typebtn = runModes;
    typebtn.unshift("全部");
    typebtn.forEach(it =>{
        let typename = it;
        /*
        if(it != "全部" && getItem(it+'stoptype')=="1"){
            typename = typename+"(关)";
        }
        */
        let obj = {
            title: getMyVar("SrcJuJiekouType","全部")==it?`““””<b><span style="color: #3399cc">`+typename+`</span></b>`:typename,
            url: $('#noLoading#').lazyRule((it) => {
                putMyVar("SrcJuJiekouType",it);
                refreshPage(false);
                return "hiker://empty";
            },it),
            col_type: 'scroll_button'
        }
/*{
                title: (getItem(it+'stoptype')=="1"?"启用":"停用")+it,
                js: $.toString((it) => {
                    if(getItem(it+'stoptype')=="1"){
                        clearItem(it+'stoptype');
                    }else{
                        setItem(it+'stoptype','1');
                    }
                    refreshPage(false);
                    return "hiker://empty";
                },it)
            }*/
        if(it != "全部"){
            obj.extra = {};
            let longClick = [];
            if(getMyVar("SrcJuJiekouType")==it){
                longClick.push({
                    title: '批量选择',
                    js: $.toString((jkdatalist) => {
                        let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                        jkdatalist.forEach(data=>{
                            let id = data.type+"_"+data.name;
                            if(!duoselect.some(item => item.name == data.name && item.type==data.type) && !data.stop){
                                duoselect.push(data);
                                updateItem(id, {title:'<font color=#3CB371>'+data.name})
                            }
                        })
                        storage0.putMyVar('duoselect',duoselect);
                        return "hiker://empty";
                    },jkdatalist)
                })
            }
            if(longClick.length>0){obj["extra"].longClick = longClick;}
        }

        d.push(obj);
    })
    d.push({
        title: "🔍",
        url: $.toString(() => {
            putMyVar("seacrhjiekou",input);
            refreshPage(false);
        }),
        desc: "搜你想要的...",
        col_type: "input",
        extra: {
            titleVisible: true
        }
    });
    
    jkdatalist.forEach(item => {
        if(getMyVar("SrcJuJiekouType","全部")=="全部" || getMyVar("SrcJuJiekouType","全部")==item.type){
            d.push({
                title: (item.stop?`<font color=#f20c00>`:"") + item.name + (item.parse ? " [主页源]" : "") + (item.erparse ? " [搜索源]" : "") + (item.stop?`</font>`:""),
                url: $(["分享", "编辑", "删除", item.stop?"启用":"禁用","选择","改名"], 2).select((sourcefile, data) => {
                    data = JSON.parse(base64Decode(data));
                    if (input == "分享") {
                        showLoading('分享上传中，请稍后...');
                        let oneshare = []
                        oneshare.push(data);
                        let pasteurl = sharePaste(aesEncode('SrcJu', JSON.stringify(oneshare)));
                        hideLoading();
                        if (pasteurl) {
                            let code = '聚阅接口￥' + aesEncode('SrcJu', pasteurl) + '￥' + data.name;
                            copy('云口令：'+code+`@import=js:$.require("hiker://page/import?rule=`+MY_RULE.title+`");`);
                            return "toast://(单个)分享口令已生成";
                        } else {
                            return "toast://分享失败，剪粘板或网络异常";
                        }
                    } else if (input == "编辑") {
                        return $('hiker://empty#noRecordHistory##noHistory#').rule((sourcefile, data) => {
                            setPageTitle('编辑 | 聚阅接口');
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                            jiekouapi(sourcefile, JSON.parse(base64Decode(data)));
                        }, sourcefile, base64Encode(JSON.stringify(data)))
                    } else if (input == "删除") {
                        return $("确定删除："+data.name).confirm((sourcefile,data)=>{
                            let sourcedata = fetch(sourcefile);
                            eval("var datalist=" + sourcedata + ";");
                            let index = datalist.indexOf(datalist.filter(d => d.name==data.name && d.type==data.type)[0]);
                            datalist.splice(index, 1);
                            writeFile(sourcefile, JSON.stringify(datalist));
                            clearMyVar('searchMark');
                            refreshPage(false);
                            return 'toast://已删除';
                        },sourcefile,data)
                    } else if (input == "禁用" || input == "启用" ) {
                        let sourcedata = fetch(sourcefile);
                        eval("var datalist=" + sourcedata + ";");
                        let index = datalist.indexOf(datalist.filter(d => d.name==data.name && d.type==data.type)[0]);
                        let sm;
                        if(input == "禁用"){
                            datalist[index].stop = 1;
                            sm = data.name + "已禁用";
                        }else{
                            delete datalist[index].stop;
                            sm = data.name + "已启用";
                        }
                        writeFile(sourcefile, JSON.stringify(datalist));
                        clearMyVar('searchMark');
                        refreshPage(false);
                        return 'toast://' + sm;
                    } else if (input=="选择") {
                        let id = data.type+"_"+data.name;
                        let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                        if(!duoselect.some(item => item.name == data.name && item.type==data.type)){
                            duoselect.push(data);
                            updateItem(id, {title:'<font color=#3CB371>'+data.name})
                        }else{
                            for(var i = 0; i < duoselect.length; i++) {
                                if(duoselect[i].type+"_"+duoselect[i].name == id) {
                                    duoselect.splice(i, 1);
                                    break;
                                }
                            }
                            updateItem(id, {title:(data.stop?`<font color=#f20c00>`:"") + data.name + (data.parse ? " [主页源]" : "") + (data.erparse ? " [搜索源]" : "") + (data.stop?`</font>`:"")})
                        }
                        storage0.putMyVar('duoselect',duoselect);
                        return "hiker://empty";
                    } else if (input == "改名") {
                        return $(data.name,"输入新名称").input((sourcefile,data)=>{
                            let sourcedata = fetch(sourcefile);
                            eval("var datalist=" + sourcedata + ";");
                            let index = datalist.indexOf(datalist.filter(d => d.name==data.name && d.type==data.type)[0]);
                            datalist[index].name = input;
                            writeFile(sourcefile, JSON.stringify(datalist));
                            clearMyVar('searchMark');
                            refreshPage(false);
                            return 'toast://已重命名';
                        },sourcefile,data)
                    }
                }, sourcefile, base64Encode(JSON.stringify(item))),
                desc: (item.group?"["+item.group+"] ":"") + item.type,
                img: item.img || "https://hikerfans.com/tubiao/ke/31.png",
                col_type: "avatar",
                extra: {
                    id: item.type+"_"+item.name
                }
            });
        }
    })
    d.push({
        title: "‘‘’’<small><font color=#f20c00>当前接口数：" + jkdatalist.length + "，有效数："+yxdatalist.length+"</font></small>",
        url: 'hiker://empty',
        col_type: 'text_center_1'
    });
    setResult(d);
}

function jiekouapi(sourcefile, data) {
    addListener("onClose", $.toString(() => {
        clearMyVar('jiekoudata');
        clearMyVar('jiekouname');
        clearMyVar('jiekouimg');
        clearMyVar('jiekoutype');
        clearMyVar('jiekougroup');
        clearMyVar('jiekouparse');
        clearMyVar('jiekouerparse');
        clearMyVar('jiekoupublic');
        clearMyVar('jiekouedit');
    }));
    if (data&&getMyVar('jiekouedit')!="1") {
        storage0.putMyVar('jiekoudata', data);
        putMyVar('jiekouedit', '1');
        putMyVar('jiekouname', data.name);
        putMyVar('jiekouimg', data.img||"");
        putMyVar('jiekoutype', data.type||"漫画");
        putMyVar('jiekougroup', data.group||"");
        storage0.putMyVar('jiekouparse', data.parse);
        storage0.putMyVar('jiekouerparse', data.erparse ? data.erparse : "");
        storage0.putMyVar('jiekoupublic', data.public ? data.public : "");
    }
    let d = [];
    d.push({
        title: '名称',
        col_type: 'input',
        desc: "接口名称",
        extra: {
            defaultValue: getMyVar('jiekouname') || "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('jiekouname', input);
            })
        }
    });
    d.push({
        title: '接口类型：'+ getMyVar('jiekoutype','漫画'),
        col_type: 'text_1',
        url: $(runModes,2,"接口类型").select(() => {
            putMyVar('jiekoutype',input);
            refreshPage(false);
            return 'toast://接口类型已设置为：' + input;
        }),
        extra: {
            lineVisible: false
        }
    });
    d.push({
        title: '接口图标',
        col_type: 'input',
        desc:"接口图标可留空",
        extra: {
            defaultValue: getMyVar('jiekouimg') || "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('jiekouimg', input);
            })
        }
    });
    d.push({
        title: '搜索分组：'+ getMyVar('jiekougroup',''),
        col_type: 'input',
        desc:"搜索分组可留空,强制搜索输入全全",
        extra: {
            defaultValue: getMyVar('jiekougroup') || "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('jiekougroup', input);
            })
        }
    });
    d.push({
        title: '一级主页数据源',
        col_type: 'input',
        desc: "一级主页数据源, 可以留空",
        extra: {
            defaultValue: storage0.getMyVar('jiekouparse') || "",
            titleVisible: false,
            type: "textarea",
            highlight: true,
            height: 3,
            onChange: $.toString(() => {
                if (/{|}/.test(input) || !input) {
                    storage0.putMyVar("jiekouparse", input)
                }
            })
        }
    });
    d.push({
        title: '二级搜索数据源',
        col_type: 'input',
        desc: "二级搜索数据源, 可以留空",
        extra: {
            defaultValue: storage0.getMyVar('jiekouerparse') || "",
            titleVisible: false,
            type: "textarea",
            highlight: true,
            height: 2,
            onChange: $.toString(() => {
                if (/{|}/.test(input) || !input) {
                    storage0.putMyVar("jiekouerparse", input)
                }
            })
        }
    });
    d.push({
        title: '公共变量',
        col_type: 'input',
        desc: "公共变量, {}对象",
        extra: {
            defaultValue: storage0.getMyVar('jiekoupublic') || "",
            titleVisible: false,
            type: "textarea",
            highlight: true,
            height: 1,
            onChange: $.toString(() => {
                if (/{|}/.test(input) || !input) {
                    storage0.putMyVar("jiekoupublic", input)
                }
            })
        }
    });
    if(data&&data.updatetime){
        d.push({
            title: '更新时间：'+ data.updatetime,
            col_type: 'text_1',
            url: 'hiker://empty',
            extra: {
                lineVisible: false
            }
        });
    }
    d.push({
        title: '测试搜索',
        col_type: 'text_2',
        url: $(getItem('searchtestkey', '斗罗大陆'),"输入测试搜索关键字").input(()=>{
            setItem("searchtestkey",input);
            let name = getMyVar('jiekouname');
            let type = getMyVar('jiekoutype','漫画');
            let erparse = getMyVar('jiekouerparse');
            let public = getMyVar('jiekoupublic');
            if(!name || !erparse){
                return "toast://名称或搜索源接口不能为空";
            }
            try{
                var source = {
                    name: name,
                    type: type,
                    erparse: erparse
                }
                if(public){
                    source.public = public;
                }
            }catch(e){
                log('√源接口异常>'+e.message);
                return "toast://搜索源接口有异常，看日志"
            }
            if(source){
                return $("hiker://empty#noRecordHistory##noHistory###fypage").rule((name,sdata) => {
                    addListener("onClose", $.toString(() => {
                        clearMyVar('SrcJuSousuoTest');
                    }));
                    putMyVar('SrcJuSousuoTest','1');
                    let d = [];
                    require(config.依赖);
                    d = search(name,"sousuotest",sdata);
                    d.push({
                        title: "测试搜索第"+MY_PAGE+"页结束",
                        url: "hiker://empty",
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    });
                    setResult(d);
                },input,source)
            }else{
                return "toast://确认搜索源接口数据？"
            }
        })
    })
    d.push({
        title: '保存接口',
        col_type: 'text_2',
        url: $().lazyRule((sourcefile,oldtype,runModes) => {
            if (!getMyVar('jiekouname')) {
                return "toast://名称不能为空";
            }
            if (!getMyVar('jiekouparse') && !getMyVar('jiekouerparse')) {
                return "toast://主页源数据和搜索源数据不能同时为空";
            }
            try {
                let name = getMyVar('jiekouname');
                let img = getMyVar('jiekouimg');
                if (runModes.indexOf(name)>-1) {
                    return "toast://接口名称不能属于类型名";
                }
                let type = getMyVar('jiekoutype','漫画');
                let group = getMyVar('jiekougroup');
                let parse = getMyVar('jiekouparse');
                let erparse = getMyVar('jiekouerparse');
                let public = getMyVar('jiekoupublic');
                let newapi = {
                    name: name,
                    type: type
                }
                if(group){
                    newapi['group'] = group;
                }
                if (parse) {
                    try{
                        eval("let yparse = " + parse);
                    }catch(e){
                        log('√一级主页源代码异常>'+e.message);
                        return "toast://一级主页源有错误，看日志"
                    }
                    newapi['parse'] = parse;
                }
                if (erparse) {
                    try{
                        eval("let eparse = " + erparse);
                    }catch(e){
                        log('√二级搜索源代码异常>'+e.message);
                        return "toast://二级搜索源有错误，看日志"
                    }
                    newapi['erparse'] = erparse;
                }
                if (public) {
                    try{
                        eval("let gparse = " + public);
                    }catch(e){
                        log('√公共代码异常>'+e.message);
                        return "toast://公共代码有错误，看日志"
                    }
                    newapi['public'] = public;
                }
                if (img) {
                    newapi['img'] = img;
                }
                newapi['updatetime'] = $.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss");
                let sourcedata = fetch(sourcefile);
                if (sourcedata != "") {
                    try {
                        eval("var datalist=" + sourcedata + ";");
                    } catch (e) {
                        var datalist = [];
                    }
                } else {
                    var datalist = [];
                }
                let index = datalist.indexOf(datalist.filter(d => d.name==name && (d.type==type||!d.type))[0]);
                if (index > -1 && getMyVar('jiekouedit') != "1") {
                    return "toast://已存在-" + name;
                } else {
                    index = datalist.indexOf(datalist.filter(d => d.name==name && (d.type==oldtype||!d.type))[0]);
                    if (getMyVar('jiekouedit') == "1" && index > -1) {
                        datalist.splice(index, 1);
                    }
                    datalist.push(newapi);
                    writeFile(sourcefile, JSON.stringify(datalist));
                    clearMyVar('searchMark');
                    deleteFile('hiker://files/_cache/'+type+'_'+name+'.json');
                    back(true);
                    return "toast://已保存";
                }
            } catch (e) {
                return "toast://接口数据异常，请确认对象格式";
            }
        }, sourcefile,data?data.type:"",runModes)
    });
    setResult(d);
}

function JYimport(input) {
    try {
        input = input.replace("云口令：","");
        let inputname = input.split('￥')[0];
        if (inputname == "聚阅接口") {
            showLoading("正在导入，请稍后...");
            let parseurl = aesDecode('SrcJu', input.split('￥')[1]);
            let datalist2;
            if(/^http/.test(parseurl)){
                let content = parsePaste(parseurl);
                datalist2 = JSON.parse(aesDecode('SrcJu', content));
            }else if(/^\//.test(parseurl)){
                if(parseurl.endsWith('.txt')){
                    datalist2 = JSON.parse(aesDecode('SrcJu', fetch('file://'+parseurl)));
                }else{
                    return "toast://请选择聚阅分享txt文件"
                }
            }else{
                datalist2 = JSON.parse(parseurl);
            }
            let num = 0;
            datalist.reverse();
            for (let i = 0; i < datalist2.length; i++) {
                if (Juconfig['ImportType']!="Skip" && datalist.some(item => item.name == datalist2[i].name && item.type==datalist2[i].type)) {
                    let index = datalist.indexOf(datalist.filter(d => d.name == datalist2[i].name && d.type==datalist2[i].type)[0]);
                    datalist.splice(index, 1);
                    datalist.push(datalist2[i]);
                    num = num + 1;
                }else if (!datalist.some(item => item.name == datalist2[i].name && item.type==datalist2[i].type)) {
                    datalist.push(datalist2[i]);
                    num = num + 1;
                }
            }
            writeFile(sourcefile, JSON.stringify(datalist));
            clearMyVar('searchMark');
            hideLoading();
            refreshPage(false);
            return "toast://合计" + datalist2.length + "个，导入" + num + "个";
        } else {
            return "toast://非法口令";
        }
    } catch (e) {
        hideLoading();
        log('√口令解析失败>'+e.message);
        return "toast://口令有误";
    }
}