////本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
function SRCSet() {
    setPageTitle('聚漫接口 | ♥管理');
    let filepath = "hiker://files/rules/Src/Juman/jiekou.json";
    let datafile = fetch(filepath);
    if(datafile != ""){
        eval("var datalist=" + datafile+ ";");
    }else{
        var datalist = [];
    }
    function manhuaapi(filepath,data){
        addListener("onClose", $.toString(() => {
            clearMyVar('manhuaname');
            clearMyVar('manhuaparse');
            clearMyVar('manhuaerparse');
            clearMyVar('manhuaedit');
        }));
        if(data){
            putMyVar('manhuaedit','1');
            putMyVar('manhuaname',data.name);
            putMyVar('manhuaparse',data.parse);
            putMyVar('manhuaerparse',data.erparse?data.erparse:"");
        }
        let d = [];
        d.push({
            title:'名称',
            col_type: 'input',
            desc: "接口名称",
            extra: {
                defaultValue: getMyVar('manhuaname')?getMyVar('manhuaname'):"",
                titleVisible: false,
                onChange: $.toString(() => {
                    putMyVar('manhuaname',input);
                })
            }
        });
        d.push({
            title:'主页数据源',
            col_type: 'input',
            desc: "主页数据源, 可以留空",
            extra: {
                defaultValue: getMyVar('manhuaparse')?JSON.stringify(JSON.parse(getMyVar('manhuaparse')), null, "\t"):"",
                titleVisible: false,
                type: "textarea",
                highlight: true,
                height: 5,
                onChange: $.toString(() => {
                    if(/{|}/.test(input)){
                        putMyVar("manhuaparse",JSON.stringify(JSON.parse(input)))
                    }
                })
            }
        });
        d.push({
            title:'搜索数据源',
            col_type: 'input',
            desc: "搜索数据源, 可以留空",
            extra: {
                defaultValue: getMyVar('manhuaerparse')?JSON.stringify(JSON.parse(getMyVar('manhuaerparse')), null, "\t"):"",
                titleVisible: false,
                type: "textarea",
                highlight: true,
                height: 5,
                onChange: $.toString(() => {
                    if(/{|}/.test(input)){
                        putMyVar("manhuaerparse",JSON.stringify(JSON.parse(input)))
                    }
                })
            }
        });
        d.push({
            title: '保存',
            col_type: 'text_center_1',
            url: $().lazyRule((filepath)=>{
                if(!getMyVar('manhuaname')){
                    return "toast://名称不能为空";
                }
                if(!getMyVar('manhuaparse') && !getMyVar('manhuaerparse')){
                    return "toast://主页源数据和搜索源数据不能同时为空";
                }
                try{
                    let name = getMyVar('manhuaname');
                    let parse = getMyVar('manhuaparse');
                    let erparse = getMyVar('manhuaerparse');
                    let newapi = {
                        name: name,
                        parse: parse
                    }
                    if(erparse){newapi['erparse'] = erparse;}
                    let datafile = fetch(filepath);
                    if(datafile != ""){
                        try{
                            eval("var datalist=" + datafile+ ";");
                        }catch(e){
                            var datalist = [];
                        }
                    }else{
                        var datalist = [];
                    }
                    let index = datalist.indexOf(datalist.filter(d=> d.name==name)[0]);
                    if(index>-1 && getMyVar('manhuaedit')!="1"){
                        return "toast://已存在-"+name;
                    }else{
                        if(getMyVar('manhuaedit')=="1" && index>-1){
                            datalist.splice(index,1);
                        }
                        datalist.push(newapi);
                        writeFile(filepath, JSON.stringify(datalist));
                        back(true);
                        return "toast://已保存";
                    }
                }catch(e){
                    return "toast://接口数据异常，请确认对象格式";
                }
            },filepath)
        });
        setResult(d);
    }
    var d = [];
    d.push({
        title: '增加',
        url: $('hiker://empty#noRecordHistory##noHistory#').rule((filepath,manhuaapi) => {
            setPageTitle('增加 | 聚漫接口');
            manhuaapi(filepath);
        },filepath,manhuaapi),
        img: "https://lanmeiguojiang.com/tubiao/more/25.png",
        col_type: "icon_small_3"
    });
    d.push({
        title: '导入',
        url: $("", "聚漫分享口令的云剪贴板").input((filepath) => {
            try {
                let inputname = input.split('￥')[0];
                if (inputname == "聚漫接口") {
                    showLoading("正在导入，请稍后...");
                    let parseurl = aesDecode('Juman', input.split('￥')[1]);
                    let content = parsePaste(parseurl);
                    let datalist2 = JSON.parse(aesDecode('Juman', content));
                    let datafile = fetch(filepath);
                    if(datafile != ""){
                        try{
                            eval("var datalist=" + datafile+ ";");
                        }catch(e){
                            var datalist = [];
                        }
                    }else{
                        var datalist = [];
                    }
                    let num = 0;
                    for (let i = 0; i < datalist2.length; i++) {
                        if (!datalist.some(item => item.name==datalist2[i].name)) {
                            datalist.push(datalist2[i]);
                            num = num + 1;
                        }
                    }
                    writeFile(filepath, JSON.stringify(datalist));
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
        }, filepath),
        img: "https://lanmeiguojiang.com/tubiao/more/43.png",
        col_type: "icon_small_3"
    });
    d.push({
        title: '分享',
        url: datalist.length == 0 ? "toast://聚漫接口为0，无法分享" : $().lazyRule((datalist) => {
            let pasteurl = sharePaste(aesEncode('Juman', JSON.stringify(datalist)));
            if (pasteurl) {
                let code = '聚漫接口￥' + aesEncode('Juman', pasteurl) + '￥共' + datalist.length + '条';
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
            title: "🎃 " + item.name + (item.parse?"（主页源）":"") + (item.erparse?"（搜索源）":""),
            url: $(["分享", "编辑", "删除"], 1).select((filepath,manhuaapi,data) => {
                if(input == "分享"){
                    showLoading('分享上传中，请稍后...');
                    let oneshare = []
                    oneshare.push(data);
                    let pasteurl = sharePaste(aesEncode('Juman', JSON.stringify(oneshare)));
                    hideLoading();
                    if(pasteurl){
                        let code = '聚漫接口￥'+aesEncode('Juman', pasteurl)+'￥'+data.name;
                        copy(code);
                        return "toast://(单个)聚漫分享口令已生成";
                    }else{
                        return "toast://分享失败，剪粘板或网络异常";
                    }
                }else if(input == "编辑"){
                    return $('hiker://empty#noRecordHistory##noHistory#').rule((filepath,manhuaapi,data) => {
                        setPageTitle('编辑 | 聚漫接口');
                        manhuaapi(filepath,data);
                    },filepath,manhuaapi,data)
                } else if (input == "删除") {
                    let datafile = fetch(filepath);
                    eval("var datalist=" + datafile+ ";");
                    let index = datalist.indexOf(datalist.filter(d => d.name==data.name)[0]);
                    datalist.splice(index, 1);
                    writeFile(filepath, JSON.stringify(datalist));
                    refreshPage(false);
                    return 'toast://已删除';
                } 
            },filepath,manhuaapi,item),
            desc: '',
            col_type: "text_1"
        });
    })

    setResult(d);
}
