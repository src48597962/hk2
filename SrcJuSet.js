////本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
function SRCSet() {
    setPageTitle('♥管理');
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
    
    let sourcenames = yidatalist.map(it=>{
        return it.name;
    })

    let d = [];
    d.push({
        title: yijisource?yijisource:'设置主页源',
        url: $(sourcenames,2).select((cfgfile,Juconfig) => {
            clearMyVar(MY_RULE.title + "分类");
            clearMyVar(MY_RULE.title + "更新");
            Juconfig["yijisource"] = input;
            writeFile(cfgfile, JSON.stringify(Juconfig));
            refreshPage(false);
            return 'toast://主页源已设置为：' + input;
        }, cfgfile, Juconfig),
        img: "https://lanmeiguojiang.com/tubiao/messy/13.svg",
        col_type: "icon_2"
    });

    let runModes = ["漫画", "阅读"];
    d.push({
        title: (Juconfig["runMode"]||runModes[0]) + "模式",
        url: $(runModes,2,"切换运行模式").select((cfgfile,Juconfig) => {
            Juconfig["runMode"] = input;
            writeFile(cfgfile, JSON.stringify(Juconfig));
            refreshPage(false);
            return 'toast://运行模式已设置为：' + input;
        }, cfgfile, Juconfig),
        img: "https://lanmeiguojiang.com/tubiao/messy/84.svg",
        col_type: "icon_2"
    });
    d.push({
        col_type: "blank_block"
    })
    d.push({
        title: '增加',
        url: $('hiker://empty#noRecordHistory##noHistory#').rule((sourcefile) => {
            setPageTitle('增加 | 聚漫接口');
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
            jiekouapi(sourcefile);
        }, sourcefile),
        img: "https://lanmeiguojiang.com/tubiao/more/25.png",
        col_type: "icon_small_3"
    });
    d.push({
        title: '导入',
        url: $("", "聚漫分享口令的云剪贴板").input((sourcefile,ImportType) => {
            try {
                let inputname = input.split('￥')[0];
                if (inputname == "聚漫接口") {
                    showLoading("正在导入，请稍后...");
                    let parseurl = aesDecode('SrcJu', input.split('￥')[1]);
                    let content = parsePaste(parseurl);
                    let datalist2 = JSON.parse(aesDecode('SrcJu', content));
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
                    let num = 0;
                    for (let i = 0; i < datalist2.length; i++) {
                        if (ImportType=="Coverage" && datalist.some(item => item.name == datalist2[i].name && item.type==datalist2[i].type)) {
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
                    return "toast://聚影√：非聚漫口令";
                }
            } catch (e) {
                log(e.message);
                return "toast://聚漫√：口令有误";
            }
        }, sourcefile, Juconfig['ImportType']),
        img: "https://lanmeiguojiang.com/tubiao/more/43.png",
        col_type: "icon_small_3",
        extra: {
            longClick: [{
                title: Juconfig['ImportType']=="Coverage"?'导入模式：覆盖':'导入模式：跳过',
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
        url: datalist.length == 0 ? "toast://聚漫接口为0，无法分享" : $().lazyRule((datalist) => {
            let pasteurl = sharePaste(aesEncode('SrcJu', JSON.stringify(datalist)));
            if (pasteurl) {
                let code = '聚漫接口￥' + aesEncode('SrcJu', pasteurl) + '￥共' + datalist.length + '条';
                copy(code);
                return "toast://(全部)聚漫分享口令已生成";
            } else {
                return "toast://分享失败，剪粘板或网络异常";
            }
        }, datalist),
        img: "https://lanmeiguojiang.com/tubiao/more/3.png",
        col_type: "icon_small_3"
    });
    d.push({
        col_type: "line"
    });

    datalist.forEach(item => {
        d.push({
            title: "🎃 " + item.name + (item.parse ? "（主页源）" : "") + (item.erparse ? "（搜索源）" : ""),
            url: $(["分享", "编辑", "删除"], 1).select((sourcefile, data) => {
                if (input == "分享") {
                    showLoading('分享上传中，请稍后...');
                    let oneshare = []
                    oneshare.push(data);
                    let pasteurl = sharePaste(aesEncode('SrcJu', JSON.stringify(oneshare)));
                    hideLoading();
                    if (pasteurl) {
                        let code = '聚漫接口￥' + aesEncode('SrcJu', pasteurl) + '￥' + data.name;
                        copy(code);
                        return "toast://(单个)聚漫分享口令已生成";
                    } else {
                        return "toast://分享失败，剪粘板或网络异常";
                    }
                } else if (input == "编辑") {
                    return $('hiker://empty#noRecordHistory##noHistory#').rule((sourcefile, data) => {
                        setPageTitle('编辑 | 聚漫接口');
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                        jiekouapi(sourcefile, data);
                    }, sourcefile, data)
                } else if (input == "删除") {
                    return $("确定删除："+dataname).confirm((sourcefile,data)=>{
                        let sourcedata = fetch(sourcefile);
                        eval("var datalist=" + sourcedata + ";");
                        let index = datalist.indexOf(datalist.filter(d => d.name == data.name && d.type==data.type)[0]);
                        datalist.splice(index, 1);
                        writeFile(sourcefile, JSON.stringify(datalist));
                        clearMyVar('searchMark');
                        refreshPage(false);
                        return 'toast://已删除';
                    },sourcefile,data)
                }
            }, sourcefile, item),
            desc: '',
            col_type: "text_1"
        });
    })
    setResult(d);
}

function jiekouapi(sourcefile, data) {
    addListener("onClose", $.toString(() => {
        clearMyVar('jiekoudata');
        clearMyVar('jiekouname');
        clearMyVar('jiekoutype');
        clearMyVar('jiekouparse');
        clearMyVar('jiekouerparse');
        clearMyVar('jiekouedit');
    }));
    if (data) {
        storage0.putMyVar('jiekoudata', data);
        putMyVar('jiekouedit', '1');
        putMyVar('jiekouname', data.name);
        putMyVar('jiekoutype', data.type);
        storage0.putMyVar('jiekouparse', data.parse);
        storage0.putMyVar('jiekouerparse', data.erparse ? data.erparse : "");
    }
    let d = [];
    d.push({
        title: '名称',
        col_type: 'input',
        desc: "接口名称",
        extra: {
            defaultValue: getMyVar('jiekouname') ? getMyVar('jiekouname') : "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('jiekouname', input);
            })
        }
    });
    d.push({
        title: '接口类型：'+ getMyVar('jiekoutype','漫画'),
        col_type: 'text_1',
        url: $(runModes,2,"接口类型").select((cfgfile,Juconfig) => {
            Juconfig["runMode"] = input;
            writeFile(cfgfile, JSON.stringify(Juconfig));
            refreshPage(false);
            return 'toast://接口类型已设置为：' + input;
        }, cfgfile, Juconfig),
    });
    d.push({
        title: '主页数据源',
        col_type: 'input',
        desc: "主页数据源, 可以留空",
        extra: {
            defaultValue: storage0.getMyVar('jiekouparse') || "",
            titleVisible: false,
            type: "textarea",
            highlight: true,
            height: 4,
            onChange: $.toString(() => {
                if (/{|}/.test(input)) {
                    storage0.putMyVar("jiekouparse", input)
                }
            })
        }
    });
    d.push({
        title: '搜索数据源',
        col_type: 'input',
        desc: "搜索数据源, 可以留空",
        extra: {
            defaultValue: storage0.getMyVar('jiekouerparse') || "",
            titleVisible: false,
            type: "textarea",
            highlight: true,
            height: 4,
            onChange: $.toString(() => {
                if (/{|}/.test(input)) {
                    storage0.putMyVar("jiekouerparse", input)
                }
            })
        }
    });
    d.push({
        title: '测试搜索',
        col_type: 'text_2',
        url: $(getItem('searchtestkey', '斗罗大陆'),"输入测试搜索关键字").input(()=>{
            setItem("searchtestkey",input);
            let name = getMyVar('jiekouname');
            let erparse = getMyVar('jiekouerparse');
            if(!name || !erparse){
                return "toast://名称或搜索源接口不能为空";
            }
            try{
                var source = {
                    name: name,
                    erparse: erparse
                }
            }catch(e){
                log(e.message);
                return "toast://搜索源接口有异常，看日志"
            }
            if(source){
                return $("hiker://empty#noRecordHistory##noHistory#").rule((name,sdata) => {
                    putMyVar('SrcJuSousuo','1');
                    let d = [];
                    d.push({
                        title: "搜索中...",
                        url: "hiker://empty",
                        col_type: 'text_center_1',
                        extra: {
                            id: "sousuoloading",
                            lineVisible: false
                        }
                    });
                    setResult(d);
                    require(config.依赖);
                    search(name,sdata);
                    clearMyVar('SrcJuSousuo');
                },input,source)
            }else{
                return "toast://确认搜索源接口数据？"
            }
        })
    })
    d.push({
        title: '保存接口',
        col_type: 'text_2',
        url: $().lazyRule((sourcefile) => {
            if (!getMyVar('jiekouname')) {
                return "toast://名称不能为空";
            }
            if (!getMyVar('jiekouparse') && !getMyVar('jiekouerparse')) {
                return "toast://主页源数据和搜索源数据不能同时为空";
            }
            try {
                let name = getMyVar('jiekouname');
                let parse = getMyVar('jiekouparse');
                let erparse = getMyVar('jiekouerparse');
                let newapi = {
                    name: name
                }
                if (parse) { newapi['parse'] = parse; }
                if (erparse) { newapi['erparse'] = erparse; }
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
                let index = datalist.indexOf(datalist.filter(d => d.name == name)[0]);
                if (index > -1 && getMyVar('jiekouedit') != "1") {
                    return "toast://已存在-" + name;
                } else {
                    if (getMyVar('jiekouedit') == "1" && index > -1) {
                        datalist.splice(index, 1);
                    }
                    datalist.push(newapi);
                    writeFile(sourcefile, JSON.stringify(datalist));
                    clearMyVar('searchMark');
                    back(true);
                    return "toast://已保存";
                }
            } catch (e) {
                return "toast://接口数据异常，请确认对象格式";
            }
        }, sourcefile)
    });
    setResult(d);
}