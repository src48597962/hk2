////本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
function SRCSet() {
    addListener("onClose", $.toString(() => {
        clearMyVar('guanli');
        clearMyVar('guanlicz');
        clearMyVar('duoselect');
        clearMyVar('datalist');
        clearMyVar('groupmenu');
        //refreshPage(false);
    }));
    setPageTitle("♥管理"+getMyVar('SrcJuying-Version', ''));
    if(getMyVar('guanli','')==""){putMyVar('guanli','jk');}
    clearMyVar('duoselect');
    clearMyVar('datalist');
    function getTitle(title, Color) {
        return '<font color="' + Color + '">' + title + '</font>';
    }
    var d = [];
    d.push({
        title: getMyVar('guanli', 'jk')=="jk"?getTitle('接口管理', '#f13b66a'):'接口管理',
        url: `#noLoading#@lazyRule=.js:putMyVar('guanli','jk');refreshPage(false);'toast://已切换到接口管理';`,
        img: "https://lanmeiguojiang.com/tubiao/movie/98.svg",
        col_type: "icon_small_3"
    });
    d.push({
        title: getMyVar('guanli', 'jk')=="jk"?'解析管理':getTitle('解析管理', '#f13b66a'),
        url: `#noLoading#@lazyRule=.js:putMyVar('guanli','jx');refreshPage(false);'toast://已切换到解析管理';`,
        img: "https://lanmeiguojiang.com/tubiao/movie/105.svg",
        col_type: "icon_small_3"
    });
    d.push({
        title: '扩展中心',
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            extension();
        }),
        img: "https://lanmeiguojiang.com/tubiao/ke/156.png",
        col_type: "icon_small_3"
    });

    if(getMyVar('guanli', 'jk')=="jk"){
        var filepath = "hiker://files/rules/Src/Read/source.json";
    }else if(getMyVar('guanli', 'jk')=="jx"){
        var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
    }
    var datafile = fetch(filepath);
    if(datafile != ""){
        try{
            eval("var datalist=" + datafile+ ";");
        }catch(e){
            var datalist = [];
        }
    }else{
        var datalist = [];
    }
    storage0.putMyVar('datalist',datalist);
    d.push({
        col_type: "line_blank"
    });

    function guanlidata(data) {
        try{
            if(getMyVar('guanli', 'jk')=="jx"&&data.length > 0){
                for(var i in data){
                    data[i]['id'] = i;
                    data[i]['sort'] = data[i]['sort']||0;
                }
                data.sort((a, b) => {
                    if(a.sort!=b.sort){
                        return a.sort - b.sort
                    }else{
                        return a.id - b.id;
                    }
                });
            }
            var czdatalist = data.map((datalist)=>{
                if(getMyVar('guanli', 'jk')=="jk"){
                    var dataurl = datalist.url;
                    var dataname = datalist.name;
                    var dataua = datalist.ua;
                    var datatype = datalist.type;
                    var datagroup = datalist.group;
                    var datatitle = dataname + ' ('+datatype+')' + (datagroup&&datagroup!=datatype?' [' + datagroup + ']':"");
                    var datadesc = dataurl;
                    var dataarr = {name:dataname, url:dataurl, ua:dataua, type:datatype};
                    if(datagroup){dataarr['group'] = datagroup}
                    if(datalist.data){dataarr['data'] = datalist.data}
                    var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                }else{
                    var dataurl = datalist.parse;
                    var dataname = datalist.name;
                    var datastopfrom = datalist.stopfrom||[];
                    var datapriorfrom = datalist.priorfrom||"";
                    var datasort = datalist.sort||0;
                    var datatitle = datasort+'-'+dataname+'-'+dataurl;
                    var datadesc = "优先强制：" + datapriorfrom + "" + "\n排除片源：" + datastopfrom + "";
                    var dataarr = {name:dataname, url:dataurl, stopfrom:datastopfrom+"", priorfrom:datapriorfrom+""};
                    if(datalist.header){dataarr['header'] = datalist.header}
                    if(datalist.web){dataarr['web'] = datalist.web}
                    var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                }
                if(datalist.retain){dataarr['retain'] = 1}
                
                return {
                    title: datatitle,
                    desc: datadesc,
                    url: getMyVar('guanlicz')=="1"?$('#noLoading#').lazyRule((name,url)=>{
                            copy(name+'#'+url);
                            return "hiker://empty";
                        },dataname, dataurl):getMyVar('guanlicz')=="2"?$('hiker://empty#noRecordHistory##noHistory#').rule((data) => {
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
                            if(getMyVar('guanli', 'jk')=="jk"){
                                jiekou('update', data);
                            }else{
                                jiexi('update', data);
                            }
                        }, dataarr):getMyVar('guanlicz')=="3"?$("确定删除："+dataname).confirm((dataurl,filepath)=>{
                            var datafile = fetch(filepath);
                            eval("var datalist=" + datafile+ ";");
                            if(getMyVar('guanli', 'jk')=="jk"){
                                for(var i=0;i<datalist.length;i++){
                                    if(datalist[i].url==dataurl){
                                        datalist.splice(i,1);
                                        break;
                                    }
                                }
                                writeFile(filepath, JSON.stringify(datalist));

                                let cfgfile = "hiker://files/rules/Src/Juying/config.json";
                                let Juyingcfg=fetch(cfgfile);
                                if(Juyingcfg != ""){
                                    eval("var JYconfig=" + Juyingcfg+ ";");
                                }else{
                                    var JYconfig= {};
                                }
                                if(JYconfig.zsjiekou&&JYconfig.zsjiekou.api_url==dataurl){
                                    delete JYconfig['zsjiekou'];
                                    writeFile(cfgfile, JSON.stringify(JYconfig));
                                }
                            }else{
                                for(var i=0;i<datalist.length;i++){
                                    if(datalist[i].parse==dataurl){
                                        datalist.splice(i,1);
                                        break;
                                    }
                                }
                                writeFile(filepath, JSON.stringify(datalist));
                            }
                            refreshPage(false);
                            return "toast://已删除";
                        }, dataurl,filepath):getMyVar('guanlicz')=="4"?$('#noLoading#').lazyRule((datatitle,dataurl)=>{
                            let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                            if(duoselect.indexOf(dataurl)==-1){
                                duoselect.push(dataurl);
                                updateItem(dataurl,{title:'‘‘’’<span style="color:red">'+datatitle})
                            }else{
                                function removeByValue(arr, val) {
                                    for(var i = 0; i < arr.length; i++) {
                                        if(arr[i] == val) {
                                        arr.splice(i, 1);
                                        break;
                                        }
                                    }
                                }
                                removeByValue(duoselect,dataurl);
                                updateItem(dataurl,{title:datatitle})
                            }
                            storage0.putMyVar('duoselect',duoselect);
                            return "hiker://empty";
                        }, datatitle,dataurl):"toast://功能异常",
                    col_type: 'text_1',
                    extra: {
                        id: dataurl,
                        cls: "guanlidatalist"
                    }
                }
            })

            return czdatalist;
        } catch (e) {
            log(e.message);
            return [];
        }
    }
    d.push({
        title: '增加',
        url: getMyVar('guanli', 'jk')=="jk"?$('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            jiekou('add')
        }):$('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            jiexi('add');
        }),
        img: "https://lanmeiguojiang.com/tubiao/more/25.png",
        col_type: "icon_small_4"
    });
    d.push({
        title: getMyVar('guanlicz')=="1"?'复制':getMyVar('guanlicz')=="2"?'变更':getMyVar('guanlicz')=="3"?'删除':getMyVar('guanlicz')=="4"?'多选':'操作',
        url: $(["复制","变更","删除","清空","多选"],2,"选择操作功能项").select(()=>{
            clearMyVar('groupmenu');
            if(input=="复制"){
                putMyVar('guanlicz','1');
                refreshPage(false);
                return 'toast://已切换到复制模式';
            }else if(input=="变更"){
                putMyVar('guanlicz','2');
                refreshPage(false);
                return 'toast://已切换到变更模式';
            }else if(input=="删除"){
                putMyVar('guanlicz','3');
                refreshPage(false);
                return 'toast://已切换到删除模式';
            }else if(input=="多选"){
                putMyVar('guanlicz','4');
                refreshPage(false);
                return 'toast://已切换到多选模式';
            }else if(input=="清空"){
                if(getMyVar('guanli', 'jk')=="jk"){
                    var sm = "接口";
                }else{
                    var sm = "私有解析";
                }
                return $("确定要删除本地所有的"+sm+"吗？").confirm(()=>{
                    if(getMyVar('guanli', 'jk')=="jk"){
                        var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                    }else if(getMyVar('guanli', 'jk')=="jx"){
                        var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                    }
                    var datalist = [];
                    writeFile(filepath, JSON.stringify(datalist));
                    refreshPage(false);
                    return 'toast://已全部清空';
                })
            }
        }),
        img: getMyVar('guanlicz')=="1"?"https://lanmeiguojiang.com/tubiao/more/292.png":getMyVar('guanlicz')=="2"?"https://lanmeiguojiang.com/tubiao/more/275.png":getMyVar('guanlicz')=="3"?"https://lanmeiguojiang.com/tubiao/more/216.png":getMyVar('guanlicz')=="4"?"https://lanmeiguojiang.com/tubiao/more/213.png":"https://lanmeiguojiang.com/tubiao/more/290.png",
        col_type: "icon_small_4"
    });
    d.push({
        title: '导入',
        url: $("","聚影口令").input(()=>{
            if(input==""){
                return 'toast://不能为空';
            }
            if(input.indexOf('@import=js:')>-1){
                input = input.split('@import=js:')[0].replace('云口令：','');
            }
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            return JYimport(input);
        }),
        img: "https://lanmeiguojiang.com/tubiao/more/43.png",
        col_type: "icon_small_4"
    });
    let iscloudshare = (MY_NAME=="海阔视界"&&getAppVersion()>=3470)||(MY_NAME=="嗅觉浏览器"&&getAppVersion()>=852)?1:0;
    d.push({
        title: '分享',
        url: datalist.length==0?'toast://数据为空，无法分享':iscloudshare?$(['云口令(时)','云口令(周)','云口令(月)','云口令(年)'],2).select(()=>{
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            if(input=="云口令(时)"){
                var time = 3600;
            }else if(input=="云口令(周)"){
                var time = 604800;
            }else if(input=="云口令(月)"){
                var time = 2592000;
            }else if(input=="云口令(年)"){
                var time = 31536000;
            }
            return JYshare(2,time);
        }):$().lazyRule(()=>{
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
            return JYshare(1,3600);
        }),
        img: "https://lanmeiguojiang.com/tubiao/more/3.png",
        col_type: "icon_small_4"
    });
    d.push({
        col_type: "line"
    });

    if(getMyVar('guanlicz','0')!="0"){
        d.push({
            title: "🔍",
            url: $.toString((guanlidata,datalist) => {
                    if(datalist.length>0){
                        deleteItemByCls('guanlidatalist');
                        var lists = datalist.filter(item => {
                            if(item.url){
                                return item.name.includes(input) || item.url.includes(input);
                            }else{
                                return item.name.includes(input) || item.parse.includes(input);
                            }
                        })
                        let gldatalist = guanlidata(lists);
                        addItemBefore('guanliloading', gldatalist);
                    }
                    return "hiker://empty";
                },guanlidata,datalist),
            desc: "搜你想要的...",
            col_type: "input",
            extra: {
                titleVisible: true
            }
        });
        if(getMyVar('guanlicz')=="4"){
            d.push({
                title: "全选",
                url: $('#noLoading#').lazyRule(()=>{
                        let datalist = storage0.getMyVar('datalist')?storage0.getMyVar('datalist'):[];
                        let duoselect = [];
                        for(let i=0;i<datalist.length;i++){
                            if(getMyVar('guanli', 'jk')=="jk"){
                                let dataname = datalist[i].name;
                                let datatype = datalist[i].type;
                                let datagroup = datalist[i].group;
                                var dataurl = datalist[i].url;
                                var datatitle = dataname + ' ('+datatype+')' + (datagroup&&datagroup!=datatype?' [' + datagroup + ']':"");
                            }else{
                                let dataname = datalist[i].name;
                                let datasort = datalist[i].sort||0;
                                var dataurl = datalist[i].parse;
                                var datatitle = datasort+'-'+dataname+'-'+dataurl;
                            }
                            updateItem(dataurl,{title:'‘‘’’<span style="color:red">'+datatitle})
                            duoselect.push(dataurl);
                        }
                        storage0.putMyVar('duoselect',duoselect);
                        return "toast://合计选择："+duoselect.length;
                    }),
                col_type: "scroll_button"
            });
            d.push({
                title: "批量删除",
                url: $('#noLoading#').lazyRule(()=>{
                        let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                        if(duoselect.length>0){
                            if(getMyVar('guanli', 'jk')=="jk"){
                                var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                                var sm = "确定删除选定的"+duoselect.length+"个接口吗？";
                            }else if(getMyVar('guanli', 'jk')=="jx"){
                                var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                                var sm = "确定删除选定的"+duoselect.length+"个解析吗？";
                            }
                            return $(sm).confirm((duoselect, filepath)=>{
                                var datafile = fetch(filepath);
                                eval("var datalist=" + datafile+ ";");
                                for(var i=0;i<datalist.length;i++){
                                    let dataurl = datalist[i].url?datalist[i].url:datalist[i].parse;
                                    if(duoselect.indexOf(dataurl)>-1){
                                        datalist.splice(i,1);
                                        i = i - 1;
                                    }
                                }
                                writeFile(filepath, JSON.stringify(datalist));
                                refreshPage(false);
                                return "toast://已删除"+duoselect.length;
                            }, duoselect, filepath)
                        }else{
                            return "toast://请选择";
                        }
                    }),
                col_type: "scroll_button"
            });
            if(getMyVar('guanli', 'jk')=="jk"){
                d.push({
                    title: "调整分组",
                    url: $('#noLoading#').lazyRule(()=>{
                            let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                            if(duoselect.length>0){
                                return $("","选定的"+duoselect.length+"个接口新分组名").input((duoselect)=>{
                                    var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                                    var datafile = fetch(filepath);
                                    eval("var datalist=" + datafile+ ";");
                                    for(var i=0;i<datalist.length;i++){
                                        if(duoselect.indexOf(datalist[i].url)>-1){
                                            if(input){
                                                datalist[i].group  = input;
                                            }else{
                                                delete datalist[i].group;
                                            }
                                            delete datalist[i].failnum;
                                        }
                                    }
                                    writeFile(filepath, JSON.stringify(datalist));
                                    refreshPage(false);
                                    return "toast://已批量调整接口分组";
                                }, duoselect)
                            }else{
                                return "toast://请选择";
                            }
                        }),
                    col_type: "scroll_button"
                });
            }else{
                d.push({
                    title: "重置排除",
                    url: $('#noLoading#').lazyRule(()=>{
                            let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                            if(duoselect.length>0){
                                return $("确定重置选定的"+duoselect.length+"个解析排除片源记录吗？").confirm((duoselect)=>{
                                    var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                                    var datafile = fetch(filepath);
                                    eval("var datalist=" + datafile+ ";");
                                    for(var i=0;i<datalist.length;i++){
                                        if(duoselect.indexOf(datalist[i].parse)>-1){
                                            datalist[i].stopfrom = [];
                                        }
                                    }
                                    writeFile(filepath, JSON.stringify(datalist));
                                    refreshPage(false);
                                    return "toast://已批量重置选定解析的排除片源记录";
                                }, duoselect)
                            }else{
                                return "toast://请选择";
                            }
                        }),
                    col_type: "scroll_button"
                });
                d.push({
                    title: "重置排序",
                    url: $('#noLoading#').lazyRule(()=>{
                            let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                            if(duoselect.length>0){
                                return $("确定重置选定的"+duoselect.length+"个解析失败排序记录吗？").confirm((duoselect)=>{
                                    var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                                    var datafile = fetch(filepath);
                                    eval("var datalist=" + datafile+ ";");
                                    for(var i=0;i<datalist.length;i++){
                                        if(duoselect.indexOf(datalist[i].parse)>-1){
                                            datalist[i].sort = 0;
                                        }
                                    }
                                    writeFile(filepath, JSON.stringify(datalist));
                                    refreshPage(false);
                                    return "toast://已批量重置选定解析的排除片源记录";
                                }, duoselect)
                            }else{
                                return "toast://请选择";
                            }
                        }),
                    col_type: "scroll_button"
                });
            }
            d.push({
                title: "批量保留",
                url: $('#noLoading#').lazyRule(()=>{
                        let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                        if(duoselect.length>0){
                            if(getMyVar('guanli', 'jk')=="jk"){
                                var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                                var sm = "确定在订阅更新时保留选定的"+duoselect.length+"个接口吗？";
                            }else if(getMyVar('guanli', 'jk')=="jx"){
                                var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                                var sm = "确定在订阅更新时保留选定的"+duoselect.length+"个解析吗？";
                            }
                            return $(sm).confirm((duoselect, filepath)=>{
                                var datafile = fetch(filepath);
                                eval("var datalist=" + datafile+ ";");
                                for(var i=0;i<datalist.length;i++){
                                    let dataurl = datalist[i].url?datalist[i].url:datalist[i].parse;
                                    if(duoselect.indexOf(dataurl)>-1){
                                        datalist[i].retain = 1;
                                    }
                                }
                                writeFile(filepath, JSON.stringify(datalist));
                                refreshPage(false);
                                return "toast://已保留"+duoselect.length;
                            }, duoselect, filepath)
                        }else{
                            return "toast://请选择";
                        }
                    }),
                col_type: "scroll_button"
            });
            d.push({
                title: "取消保留",
                url: $('#noLoading#').lazyRule(()=>{
                        let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
                        if(duoselect.length>0){
                            if(getMyVar('guanli', 'jk')=="jk"){
                                var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                                var sm = "确定在订阅更新时取消保留选定的"+duoselect.length+"个接口吗？";
                            }else if(getMyVar('guanli', 'jk')=="jx"){
                                var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                                var sm = "确定在订阅更新时取消保留选定的"+duoselect.length+"个解析吗？";
                            }
                            return $(sm).confirm((duoselect, filepath)=>{
                                var datafile = fetch(filepath);
                                eval("var datalist=" + datafile+ ";");
                                for(var i=0;i<datalist.length;i++){
                                    let dataurl = datalist[i].url?datalist[i].url:datalist[i].parse;
                                    if(duoselect.indexOf(dataurl)>-1){
                                        delete datalist[i].retain;
                                    }
                                }
                                writeFile(filepath, JSON.stringify(datalist));
                                refreshPage(false);
                                return "toast://已取消保留"+duoselect.length;
                            }, duoselect, filepath)
                        }else{
                            return "toast://请选择";
                        }
                    }),
                col_type: "scroll_button"
            });
        }
        if(getMyVar('guanli', 'jk')=="jk"){
            d.push({
                col_type: "blank_block"
            })
            let grouplist = datalist.map((list)=>{
                return list.group||list.type;
            })
            //去重复
            function uniq(array){
                var temp = []; //一个新的临时数组
                for(var i = 0; i < array.length; i++){
                    if(temp.indexOf(array[i]) == -1){
                        temp.push(array[i]);
                    }
                }
                return temp;
            }
            let datalist2 = [];
            grouplist = uniq(grouplist);

            let grouparr = storage0.getItem('grouparr')||[];
            grouparr = grouparr.filter((item1) => grouplist.some((item2) => item1 === item2)).concat(grouplist);
            grouplist = uniq(grouparr);
            storage0.setItem('grouparr',grouplist);
                
            for(var i in grouplist){
                let groupname = grouplist[i];
                var lists = datalist.filter(item => {
                    return item.group==groupname || !item.group&&item.type==groupname;
                })
                if(groupname==getMyVar('groupmenu')){
                    datalist2 = lists;
                }
                d.push({
                    title: groupname+'('+lists.length+')',
                    url: $('#noLoading#').lazyRule((guanlidata,lists,groupmenu)=>{
                            if(lists.length>0){
                                deleteItemByCls('guanlidatalist');
                                let gldatalist = guanlidata(lists);
                                addItemBefore('guanliloading', gldatalist);
                                storage0.putMyVar('datalist',lists);
                                putMyVar('groupmenu',groupmenu);
                            }
                            return "hiker://empty";
                        },guanlidata,lists,groupname),
                    col_type: "scroll_button",
                    extra: {
                        id: groupname,
                        longClick: [{
                            title: "⏪分组置顶",
                            js: $.toString((groupname) => {
                                let grouparr = storage0.getItem('grouparr');
                                grouparr.unshift(grouparr.splice(grouparr.indexOf(groupname), 1)[0]);
                                storage0.setItem('grouparr',grouparr);
                                refreshPage(false);
                                return "hiker://empty";
                            },groupname)
                        },{
                            title: "⏩分组置底",
                            js: $.toString((groupname) => {
                                let grouparr = storage0.getItem('grouparr');
                                grouparr.push(grouparr.splice(grouparr.indexOf(groupname), 1)[0]);
                                storage0.setItem('grouparr',grouparr);
                                refreshPage(false);
                                return "hiker://empty";
                            },groupname)
                        }]
                    }
                });
            }
            if(datalist2.length>0){
                datalist = datalist2;
            }
        }
        let gldatalist = guanlidata(datalist);
        d = d.concat(gldatalist);
    }
    d.push({
        title: '当前共有'+datalist.length+'个'+(getMyVar('guanli', 'jk')=="jk"?"接口":"私有解析"),
        url: "hiker://empty",
        col_type: "text_center_1",
        extra: {
            id: "guanliloading"
        }
    });
    setResult(d);
}

function jiekousave(urls,update,codedytype) {
    if(urls.length==0){return 0;}
    try{
        var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
        var datafile = fetch(filepath);
        if(datafile != ""){
            eval("var datalist=" + datafile+ ";");
        }else{
            var datalist = [];
        }
        if(codedytype==1){
            for(let i=0;i<datalist.length;i++){
                if(datalist[i].retain!=1){
                    datalist.splice(i,1);
                    i = i - 1;
                }
            }
        }

        var num = 0;
        for (var i in urls) {
            let urlname = urls[i].name.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])|\(XPF\)|\(萝卜\)|\(神马\)|\(切\)|\(聚\)|\(优\)|\(神马\)|\(XB\)|\(SP\)|\(XP\)|[\x00-\x1F\x7F]/g,'');
            let urlurl = urls[i].url;
            let urlua = urls[i].ua||"MOBILE_UA";
            let urltype = urls[i].type;
            let urlgroup = urls[i].group||"";

            if(update==1||urltype=="custom"){
                for(var j=0;j<datalist.length;j++){
                    if(datalist[j].url==urlurl||datalist[j].url==urls[i].oldurl){
                        datalist.splice(j,1);
                        break;
                    }
                }
            }

            function checkitem(item) {
                return item.url==urlurl||(urltype==item.type&&urlname==item.name)||(urltype=="biubiu"&&item.data&&urls[i].data.url==item.data.url);
            }

            if(!datalist.some(checkitem)&&urlname&&/^http|^csp/.test(urlurl)&&urltype){
                let arr  = { "name": urlname, "url": urlurl, "ua": urlua, "type": urltype };
                if(urls[i].data){arr['data'] = urls[i].data}
                if(urlgroup){arr['group'] = urlgroup}
                if(urls[i].retain){arr['retain'] = 1}
                if(urls.length == 1){
                    datalist.unshift(arr);
                }else{
                    datalist.push(arr);
                }
                num = num + 1;
            }
        }
        if(num>0){writeFile(filepath, JSON.stringify(datalist));}
    } catch (e) {
        log('导入失败：'+e.message); 
        return -1;
    }
    return num;
}

//扩展中心
function extension(){
    addListener("onClose", $.toString(() => {
        clearMyVar('importjiekou');
        clearMyVar('importjiexi');
        clearMyVar('importlive');
        clearMyVar('importtype');
        clearMyVar('importinput');
        clearMyVar('guanlicz');
        clearMyVar('uploads');
        clearMyVar('uploadjiekou');
        clearMyVar('uploadjiexi');
        clearMyVar('uploadlive');
        refreshPage(false);
    }));
    var d = [];
    var cfgfile = "hiker://files/rules/Src/Juying/config.json";
    var Juyingcfg=fetch(cfgfile);
    if(Juyingcfg != ""){
        eval("var JYconfig=" + Juyingcfg+ ";");
    }else{
        var JYconfig= {};
    }
    //临时保存几个版本，以后删除
    if(JYconfig['codeid2']){
        JYconfig['codedyid'] = JYconfig['codeid2'];
        delete JYconfig['codeid2'];
        let dyname = JYconfig['codedyname'];
        JYconfig['codedyname'] = dyname;
        delete JYconfig['codedyname'];
        writeFile(cfgfile, JSON.stringify(JYconfig));
    }
    //上面临时存放几个版本，将订阅id名称改一下
    if(JYconfig['Jydouli']){
        JYconfig['zsjiekou'] = JYconfig['Jydouli'];
        delete JYconfig['Jydouli'];
        writeFile(cfgfile, JSON.stringify(JYconfig));
    }
    //上面临时存放几个版本，独立展示接口改个名
    
    function getide(is) {
        if(is==1){
            return '‘‘’’<strong><font color="#f13b66a">◉ </front></strong>';
        }else{
            return '‘‘’’<strong><font color="#F54343">◉ </front></strong>';
        }
    }
    /*
    d.push({
        col_type: "line_blank"
    });
    */
    d.push({
        title: '🌐 聚影分享',
        col_type: "rich_text"
    });
    
    d.push({
        title: JYconfig['codeid']?'复制聚影资源码口令':'申请聚影资源码',//sharetime
        desc: JYconfig['codetime']?JYconfig['codetime']+' 有效期三年\n'+(JYconfig['sharetime']?JYconfig['sharetime']+" 上次同步时间":"暂未分享同步"):'点击申请三年长期资源码',
        url: JYconfig['codeid']?$().lazyRule((codeid)=>{
                let code = '聚影资源码￥'+codeid;
                copy(code);
                return "hiker://empty";
            },JYconfig['codeid']):$().lazyRule((JYconfig,cfgfile) => {
                var num = ''; 
                for (var i = 0; i < 6; i++) {
                    num += Math.floor(Math.random() * 10);
                }
                
                try{
                    var pastecreate = JSON.parse(request('https://netcut.cn/api/note/create/', {
                        headers: { 'Referer': 'https://netcut.cn/' },
                        body: 'note_name=Juying'+num+'&note_content=&note_pwd=0&expire_time=94608000',
                        method: 'POST'
                    })).data;
                    var codeid = pastecreate.note_id;
                    var codetime = pastecreate.created_time;
                } catch (e) {
                    log('申请失败：'+e.message); 
                    return 'toast://申请失败，请重新再试';
                }
                JYconfig['codeid'] = aesEncode('Juying', codeid);
                JYconfig['codetime'] = codetime;
                writeFile(cfgfile, JSON.stringify(JYconfig));
                refreshPage(false);
                return 'toast://申领成功';
            }, JYconfig, cfgfile),
        col_type: "text_center_1"
    });
    d.push({
        title: '✅ 分享同步',
        url: JYconfig['codeid']?$('#noLoading#').lazyRule(()=>{
            putMyVar('uploads','1');
            putMyVar('uploadjiekou','1');
            putMyVar('uploadjiexi','0');
            putMyVar('uploadlive','0');
            refreshPage(false);
            return 'toast://选择上传同步云端的项';
        }):'toast://请先申请聚影资源码',
        col_type: "text_2"
    });
    d.push({
        title: '❎ 删除云端',
        url: JYconfig['codeid']?$("确定要删除吗，删除后无法找回？").confirm((JYconfig,cfgfile)=>{
                try{
                    var pastedelete = JSON.parse(request('https://netcut.cn/api/note/del_note/', {
                        headers: { 'Referer': 'https://netcut.cn/' },
                        body: 'note_id='+aesDecode('Juying', JYconfig['codeid']),
                        method: 'POST'
                    }));
                    var status = pastedelete.status

                    delete JYconfig['codeid'];
                    delete JYconfig['codetime'];
                    delete JYconfig['sharetime'];
                    writeFile(cfgfile, JSON.stringify(JYconfig));
                    refreshPage(false);
                    
                    if(status==1){
                        return "toast://聚影资源码云端已删除";
                    }else{
                        return 'toast://无需删除，云端已不存在';
                    }
                } catch (e) {
                    log('删除失败：'+e.message); 
                    return 'toast://删除资源失败，云端异常';
                }
            }, JYconfig, cfgfile):'toast://请先申请聚影资源码',
        col_type: "text_2"
    });
    if(getMyVar('uploads','0')=="1"){
        d.push({
            title: '选择分享同步云端的项目',
            col_type: "rich_text",
            extra:{textSize:12}
        });
        d.push({
            title:(getMyVar('uploadjiekou','0')=="1"?getide(1):getide(0))+'影视接口',
            col_type:'text_3',
            url:$('#noLoading#').lazyRule(() => {
                if(getMyVar('uploadjiekou')=="1"){
                    putMyVar('uploadjiekou','0');
                }else{
                    putMyVar('uploadjiekou','1');
                }
                refreshPage(false);
                return "hiker://empty";
            })
        });
        d.push({
            title:(getMyVar('uploadjiexi','0')=="1"?getide(1):getide(0))+'解析接口',
            col_type:'text_3',
            url:$('#noLoading#').lazyRule(() => {
                if(getMyVar('uploadjiexi')=="1"){
                    putMyVar('uploadjiexi','0');
                    var sm = "hiker://empty";
                }else{
                    putMyVar('uploadjiexi','1');
                    var sm = "toast://友情提醒：公开分享的解析容易失效";
                }
                refreshPage(false);
                return sm;
            })
        });
        d.push({
            title:(getMyVar('uploadlive','0')=="1"?getide(1):getide(0))+'直播接口',
            col_type:'text_3',
            url:$('#noLoading#').lazyRule(() => {
                if(getMyVar('uploadlive')=="1"){
                    putMyVar('uploadlive','0');
                }else{
                    putMyVar('uploadlive','1');
                }
                refreshPage(false);
                return "hiker://empty";
            })
        });
        d.push({
            title: '🔙 取消上传',
            url: $('#noLoading#').lazyRule(() => {
                clearMyVar('uploads');
                clearMyVar('uploadjiekou');
                clearMyVar('uploadjiexi');
                clearMyVar('uploadlive');
                refreshPage(false);
                return "hiker://empty";
            }),
            col_type: "text_2"
        });
        d.push({
            title: '🔝 确定上传',
            url: $().lazyRule((JYconfig,cfgfile) => {
                var text = {};
                if(getMyVar('uploadjiekou','0')=="1"){
                    var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
                    var datafile = fetch(filepath);
                    if(datafile==""){
                        var datalist = [];
                    }else{
                        eval("var datalist=" + datafile+ ";");
                    }
                    text['jiekou'] = datalist;
                }
                if(getMyVar('uploadjiexi','0')=="1"){
                    var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                    var datafile = fetch(filepath);
                    if(datafile==""){
                        var datalist = [];
                    }else{
                        eval("var datalist=" + datafile+ ";");
                    }
                    text['jiexi'] = datalist;
                }
                if(getMyVar('uploadlive','0')=="1"){
                    var filepath = "hiker://files/rules/Src/Juying/liveconfig.json";
                    var datafile = fetch(filepath);
                    if(datafile==""){
                        var liveconfig={};
                    }else{
                        eval("var liveconfig=" + datafile+ ";");
                    }
                    text['live'] = liveconfig;
                }
                let textcontent = base64Encode(JSON.stringify(text));
                if(textcontent.length>=200000){
                    log('分享失败：字符数超过最大限制，请精简接口，重点减少xpath和biubiu类型'); 
                    return 'toast://分享同步失败，超过最大限制，请精简接口';
                }
                try{
                    var pasteupdate = JSON.parse(request('https://netcut.cn/api/note/update/', {
                        headers: { 'Referer': 'https://netcut.cn/' },
                        body: 'note_id='+aesDecode('Juying', JYconfig['codeid'])+'&note_content='+textcontent,
                        method: 'POST'
                    }));
                    var status = pasteupdate.status
                    var sharetime = pasteupdate.data.updated_time;
                    clearMyVar('uploads');
                    clearMyVar('uploadjiekou');
                    clearMyVar('uploadjiexi');
                    clearMyVar('uploadlive');
                    refreshPage(false);
                    if(status==1){
                        JYconfig['sharetime'] = sharetime;
                        writeFile(cfgfile, JSON.stringify(JYconfig));
                        refreshPage(false);
                        //let code = '聚影资源码￥'+JYconfig['codeid'];
                        //copy(code);
                        return "toast://分享同步云端数据成功";
                    }else{
                        return 'toast://分享同步失败，资源码应该不存在';
                    }
                } catch (e) {
                    log('分享失败：'+e.message); 
                    return 'toast://分享同步失败，请重新再试';
                }
            }, JYconfig, cfgfile),
            col_type: "text_2"
        });
    }

    d.push({
        col_type: "line"
    });
    d.push({
        title: '⚡ 订阅管理',
        col_type: "rich_text"
    });
    
    d.push({
        title: JYconfig['codedyid']?'已订阅聚影资源码':'订阅聚影资源码',
        desc: JYconfig['codedyid']?'点击订阅、复制、切换资源码'+(JYconfig['codedyname']?'\n当前订阅的资源码为：'+JYconfig['codedyname']:""):'订阅后将与分享者云端数据保持同步',
        url: $(["订阅","复制","切换"],3).select((JYconfig,cfgfile)=>{
                if(input=="订阅"){
                    return $("","输入聚影资源码口令\n订阅会自动和云端同步，覆盖本地非保留接口").input((JYconfig,cfgfile) => {
                        if(input.split('￥')[0]!="聚影资源码"){
                            return 'toast://口令有误';
                        }
                        showLoading('正在较验有效性')
                        let codeid = input.split('￥')[1];
                        let text = parsePaste('https://netcut.cn/p/'+aesDecode('Juying', codeid));
                        hideLoading();
                        if(codeid&&!/^error/.test(text)){
                            return $("","当前资源码有效，起个名保存吧").input((JYconfig,cfgfile,codeid) => {
                                let dydatalist = JYconfig.dingyue||[];
                                if(dydatalist.some(item => item.name ==input)){
                                    return 'toast://名称重复，无法保存';
                                }else if(input!=""){
                                    if(!dydatalist.some(item => item.url ==codeid)){
                                        JYconfig['codedyid'] = codeid;
                                        JYconfig['codedyname'] = input;
                                        dydatalist.push({name:input, url:codeid})
                                        JYconfig['dingyue'] = dydatalist;
                                        writeFile(cfgfile, JSON.stringify(JYconfig));
                                        refreshPage(false);
                                        return 'toast://已保存，订阅成功';
                                    }else{
                                        return 'toast://已存在，订阅未成功';
                                    }
                                }else{
                                    return 'toast://名称为空，无法保存';
                                }
                            }, JYconfig, cfgfile, codeid);
                        }else{
                            return "toast://口令错误或资源码已失效";
                        }
                    }, JYconfig, cfgfile)
                }else if(input=="复制"){
                    let codeid = JYconfig['codedyid'];
                    return codeid?$().lazyRule((codeid)=>{
                        let code = '聚影资源码￥'+codeid;
                        copy(code);
                        return "hiker://empty";
                    },codeid):'toast://请先订阅'
                }else if(input=="切换"){
                    let codeid = JYconfig['codedyid'];
                    let dydatalist = JYconfig.dingyue||[];
                    let list = dydatalist.map((list)=>{
                        if(list.url !=codeid){
                            return list.name;
                        }
                    })
                    list = list.filter(n => n);
                    if(list.length>0){
                        return $(list,3,"选择需切换的订阅源").select((dydatalist,JYconfig,cfgfile)=>{
                            var url = "";
                            for (var i in dydatalist) {
                                if(dydatalist[i].name==input){
                                    url = dydatalist[i].url;
                                    break;
                                }
                            }
                            if(url){
                                JYconfig['codedyid'] = url;
                                JYconfig['codedyname'] = input;
                                writeFile(cfgfile, JSON.stringify(JYconfig));
                                refreshPage(false);
                                return 'toast://订阅已切换为：'+input+'，更新资源立即生效';
                            }else{
                                return 'toast://本地订阅记录文件异常，是不是干了坏事？';
                            }
                        },dydatalist,JYconfig,cfgfile)
                    }else{
                        return 'toast://未找到可切换的历史订阅';
                    }
                }
            },JYconfig,cfgfile),
        col_type: "text_center_1"
    });

    
    d.push({
        title: '<br>',
        col_type: 'rich_text'
    });
    setHomeResult(d);
}
//资源导入
function Resourceimport(input,importtype,boxdy){
    if(importtype=="1"){//tvbox导入
        if(boxdy){
            var isboxdy = boxdy.is;
            var datasl = boxdy.sl;
            var dydatas = {};
        }
        try{
            showLoading('检测'+(isboxdy?'TVBox订阅':'')+'文件有效性');
            if(/\/storage\/emulated\//.test(input)){input = "file://" + input}
            var html = request(input,{timeout:2000});
            var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
            html = html.replace(/api\"\:csp/g,'api":"csp').replace(reg, function(word) { 
                return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
            }).replace(/^.*#.*$/gm,"").replace(/\,\,/g,',');//.replace(/=\\n\"/g,'="')|[\t\r\n].replace(/\s+/g, "").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "")
            //log(html);
            eval('var data = ' + html)
            //var data = JSON.parse(html);                        
            var jiekou = data.sites||[];
            var jiexi = data.parses||[];
        } catch (e) {
            hideLoading();
            log('TVBox文件检测失败>'+e.message); 
            return isboxdy?{jiekou:[],jiexi:[]}:"toast://TVBox导入失败：链接文件无效或内容有错";
        }
        hideLoading();
        var jknum = -1;
        var jxnum = -1;
        var livenum = -1;
        var livesm = "";
        if((isboxdy||getMyVar('importjiekou','')=="1")&&jiekou.length>0){
            showLoading('正在多线程抓取数据中');
            var urls= [];
            //多线程处理
            var task = function(obj) {
                if(/^csp_AppYs/.test(obj.api)){
                    urls.push({ "name": obj.name, "url": obj.ext, "type": "", "group": isboxdy?datasl>0?"TVBox订阅":"":"新导入"})
                }else if((obj.type==1||obj.type==0)&&obj.api.indexOf('cms.nokia.press')==-1){
                    urls.push({ "name": obj.name, "url": obj.api, "type": "cms", "group": isboxdy?datasl>0?"TVBox订阅":"":"新导入"})
                }else if(/^csp_XBiubiu/.test(obj.api)){
                    try{
                        let urlfile = obj.ext;
                        if(/^clan:/.test(urlfile)){
                            urlfile = urlfile.replace("clan://TVBox/",input.match(/file.*\//)[0]);
                        }
                        let biuhtml = request(urlfile,{timeout:2000});
                        biuhtml = biuhtml.replace(reg, function(word) { 
                            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
                        }).replace(/^.*#.*$/mg,"").replace(/[\x00-\x1F\x7F]|[\t\r\n]/g,'');
                        let biujson = JSON.parse(biuhtml);
                        let biudata = {};
                        biudata.url = biujson.url;
                        biudata.jiequshuzuqian = biujson.jiequshuzuqian;
                        biudata.jiequshuzuhou = biujson.jiequshuzuhou;
                        biudata.tupianqian = biujson.tupianqian;
                        biudata.tupianhou = biujson.tupianhou;
                        biudata.biaotiqian = biujson.biaotiqian;
                        biudata.biaotihou = biujson.biaotihou;
                        biudata.lianjieqian = biujson.lianjieqian;
                        biudata.lianjiehou = biujson.lianjiehou;
                        biudata.sousuoqian = biujson.sousuoqian;
                        biudata.sousuohou = biujson.sousuohou;
                        biudata.sousuohouzhui = biujson.sousuohouzhui;
                        biudata.ssmoshi = biujson.ssmoshi;
                        biudata.bfjiequshuzuqian = biujson.bfjiequshuzuqian;
                        biudata.bfjiequshuzuhou = biujson.bfjiequshuzuhou;
                        biudata.zhuangtaiqian = biujson.zhuangtaiqian;
                        biudata.zhuangtaihou = biujson.zhuangtaihou;
                        biudata.daoyanqian = biujson.daoyanqian;
                        biudata.daoyanhou = biujson.daoyanhou;
                        biudata.zhuyanqian = biujson.zhuyanqian;
                        biudata.zhuyanhou = biujson.zhuyanhou;
                        biudata.juqingqian = biujson.juqingqian;
                        biudata.juqinghou = biujson.juqinghou;
                        urls.push({ "name": obj.name, "url": obj.key, "type": "biubiu", "ua": "PC_UA", "data": biudata, "group": isboxdy?datasl>0?"TVBox订阅":"":"新导入"})
                    }catch(e){
                        //log(obj.name + '>抓取失败>' + e.message)
                    }
                }else if(/^csp_XPath/.test(obj.api)&&!boxdy){
                    try{
                        let urlfile = obj.ext;
                        if(/^clan:/.test(urlfile)){
                            urlfile = urlfile.replace("clan://TVBox/",input.match(/file.*\//)[0]);
                        }
                        let xphtml = request(urlfile,{timeout:2000});
                        xphtml = xphtml.replace(reg, function(word) { 
                            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
                        }).replace(/^.*#.*$/mg,"").replace(/[\x00-\x1F\x7F]|[\t\r\n]/g,'');
                        let xpjson = JSON.parse(xphtml);
                        let xpdata = {};
                        xpdata.filter = "";
                        xpdata.dtUrl = xpjson.dtUrl;
                        xpdata.dtImg = xpjson.dtImg;
                        xpdata.dtCate = xpjson.dtCate;
                        xpdata.dtYear = xpjson.dtYear;
                        xpdata.dtArea = xpjson.dtArea;
                        xpdata.dtMark = xpjson.dtMark;
                        xpdata.dtDirector = xpjson.dtDirector;
                        xpdata.dtActor = xpjson.dtActor;
                        xpdata.dtDesc = xpjson.dtDesc;
                        xpdata.dtFromNode = xpjson.dtFromNode;
                        xpdata.dtFromName = xpjson.dtFromName;
                        xpdata.dtUrlNode = xpjson.dtUrlNode;
                        xpdata.dtUrlSubNode = xpjson.dtUrlSubNode;
                        xpdata.dtUrlId = xpjson.dtUrlId;
                        xpdata.dtUrlName = xpjson.dtUrlName;
                        xpdata.dtUrlIdR = xpjson.dtUrlIdR;
                        xpdata.playUrl = xpjson.playUrl;
                        xpdata.searchUrl = xpjson.searchUrl;
                        xpdata.scVodNode = xpjson.scVodNode;
                        xpdata.scVodName = xpjson.scVodName;
                        xpdata.scVodId = xpjson.scVodId;
                        xpdata.scVodImg = xpjson.scVodImg;
                        xpdata.scVodMark = xpjson.scVodMark;
                        urls.push({ "name": obj.name, "url": obj.key, "type": "xpath", "ua": xpjson.ua?xpjson.ua:"PC_UA", "data": xpdata, "group": isboxdy?datasl>0?"TVBox订阅":"":"新导入"})
                    }catch(e){
                        //log(obj.name + '>抓取失败>' + e.message)
                    }
                }
                return 1;
            }
            let jiekous = jiekou.map((list)=>{
                return {
                    func: task,
                    param: list,
                    id: list.name
                }
            });

            be(jiekous, {
                func: function(obj, id, error, taskResult) {                            
                },
                param: {
                }
            });
            if(isboxdy){
                dydatas['jiekou'] = urls;
            }else{
                try{
                    jknum = jiekousave(urls);
                }catch(e){
                    jknum =-1;
                    log('TVBox导入接口保存有异常>'+e.message);
                } 
            }
            hideLoading();    
        }
        if((isboxdy||getMyVar('importjiexi','')=="1")&&jiexi.length>0){
            try{
                let urls = [];
                for (let i=0;i<jiexi.length;i++) {
                    if(/^http/.test(jiexi[i].url)){
                        let arr  = { "name": jiexi[i].name, "parse": jiexi[i].url, "stopfrom": [], "priorfrom": [], "sort": 1 };
                        if(jiexi[i].ext&&jiexi[i].ext.header){
                            arr['header'] = jiexi[i].ext.header;
                        }
                        urls.push(arr);
                    }
                }
                if(isboxdy){
                    dydatas['jiexi'] = urls;
                }else{
                    jxnum = jiexisave(urls);
                }
            } catch (e) {
                jxnum = -1;
                log('TVBox导入解析保存失败>'+e.message);
            }
        }
        if(getMyVar('importlive','')=="1"){
            try{
                let urls = [];
                let lives = data.lives;
                for (let i=0;i<lives.length;i++) {
                    let channels = lives[i].channels;
                    for (let j=0;j<channels.length;j++) {
                        let live = channels[i].urls;
                        for (let k=0;k<live.length;k++) {
                            let url = live[i].replace('proxy://do=live&type=txt&ext=','');
                            if(/^http/.test(url)){
                                urls.push(url);
                            }else{
                                urls.push(base64Decode(url));
                            }
                        }
                    }
                }
                if(urls.length>0){
                    livenum = 0;
                    let livecfgfile = "hiker://files/rules/Src/Juying/liveconfig.json";
                    let livecfg = fetch(livecfgfile);
                    if(livecfg != ""){
                        eval("var liveconfig = " + livecfg);
                    }else{
                        var liveconfig = {};
                    }
                    let livedata = liveconfig['data']||[];
                    for(let i=0;i<urls.length;i++){
                        if(!livedata.some(item => item.url==urls[i])){
                            let YChtml = request(urls[i],{timeout:5000}).replace(/TV-/g,'TV');
                            if(YChtml.indexOf('#genre#')>-1){
                                let id = livedata.length + 1;
                                livedata.push({name:'JY订阅'+id,url:urls[i]});
                                livenum++;
                            }else{
                                livesm = "链接无效或非通用tv格式文件";
                            }
                        }else{
                            livesm = "已存在";
                        }
                    }
                    if(livenum>0){
                        liveconfig['data'] = livedata;
                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                    }
                }
            } catch (e) {
                log('TVBox导入live保存失败>'+e.message);
            }
        }
        if(isboxdy){
            return dydatas;
        }else{
            let sm = (jknum>-1?' 接口保存'+jknum:'')+(jxnum>-1?' 解析保存'+jxnum:'')+(livenum>-1?livenum==0?' 直播订阅'+livesm:' 直播保存'+livenum:'');
            if(jknum>0||jxnum>0){back();}
            if(jknum==-1&&jxnum==-1&&livenum>-1){
                clearMyVar('importinput');
                refreshPage(false);
            }
            return 'toast://TVBox导入：'+(sm?sm:'导入异常，详情查看日志');
        }       
    }else if(importtype=="2"){//tvbox订阅
        try{
            let cfgfile = "hiker://files/rules/Src/Juying/config.json";
            let Juyingcfg=fetch(cfgfile);
            if(Juyingcfg != ""){
                eval("var JYconfig=" + Juyingcfg+ ";");
            }else{
                var JYconfig= {};
            }
            JYconfig['TVBoxDY'] = input;
            writeFile(cfgfile, JSON.stringify(JYconfig));
            writeFile("hiker://files/rules/Src/Juying/DYTVBoxTmp.json", "");
            clearMyVar('importinput');
            refreshPage(false);
            return 'toast://TVBox订阅：'+(input?'保存成功':'已取消');
        }catch(e){
            log('TVBox订阅：失败>'+e.message);
            return 'toast://TVBox订阅：失败，详情查看日志';
        }
    }else if(importtype=="3"){//biubiu导入
        try{
            showLoading('检测文件有效性');
            var html = request(input,{timeout:2000});
            var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
            html = html.replace(reg, function(word) { 
                return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
            }).replace(/\\ '/g,"\'").replace(/\\ "/g,`\"`).replace(/\\>/g,">").replace(/\\'"/g,`'"`).replace(/[\x00-\x1F\x7F]/g,'');
            //var bbdata = JSON.parse(html);
            eval('var bbdata = ' + html)
            var bbjiekou = bbdata.zhuyejiekou||[];
            var bbcaiji = bbdata.caijizhan||[];
            var bbzidingyi = bbdata.zidingyi||[];
        } catch (e) {
            hideLoading();
            log('biu导入接口失败：'+e.message); 
            return "toast://biu导入：远程链接文件无效或内容有错"
        }
        var jknum = -1;
        var jxnum = -1;
        var livenum = -1;
        var livesm = "";
        if(getMyVar('importjiekou','')=="1"){
            showLoading('正在抓取数据中')
            let urls= [];
            for(var i in bbjiekou){
                urls.push({ "name": bbjiekou[i].name, "url": bbjiekou[i].url, "group": "新导入"})
            }
            for(var i in bbcaiji){
                urls.push({ "name": bbcaiji[i].name, "url": /\/api.php^/.test(bbcaiji[i].url)?bbcaiji[i].url+"/provide/vod":bbcaiji[i].url, "group": "新导入"})
            }
            for(var i in bbzidingyi){
                try{
                    let biudata = {};
                    biudata.url = bbzidingyi[i].url;
                    biudata.jiequshuzuqian = bbzidingyi[i].jiequshuzuqian;
                    biudata.jiequshuzuhou = bbzidingyi[i].jiequshuzuhou;
                    biudata.tupianqian = bbzidingyi[i].tupianqian;
                    biudata.tupianhou = bbzidingyi[i].tupianhou;
                    biudata.biaotiqian = bbzidingyi[i].biaotiqian;
                    biudata.biaotihou = bbzidingyi[i].biaotihou;
                    biudata.lianjieqian = bbzidingyi[i].lianjieqian;
                    biudata.lianjiehou = bbzidingyi[i].lianjiehou;
                    biudata.sousuoqian = bbzidingyi[i].sousuoqian;
                    biudata.sousuohou = bbzidingyi[i].sousuohou;
                    biudata.sousuohouzhui = bbzidingyi[i].sousuohouzhui;
                    biudata.ssmoshi = bbzidingyi[i].ssmoshi;
                    biudata.bfjiequshuzuqian = bbzidingyi[i].bfjiequshuzuqian;
                    biudata.bfjiequshuzuhou = bbzidingyi[i].bfjiequshuzuhou;
                    biudata.zhuangtaiqian = bbzidingyi[i].zhuangtaiqian;
                    biudata.zhuangtaihou = bbzidingyi[i].zhuangtaihou;
                    biudata.daoyanqian = bbzidingyi[i].daoyanqian;
                    biudata.daoyanhou = bbzidingyi[i].daoyanhou;
                    biudata.zhuyanqian = bbzidingyi[i].zhuyanqian;
                    biudata.zhuyanhou = bbzidingyi[i].zhuyanhou;
                    biudata.juqingqian = bbzidingyi[i].juqingqian;
                    biudata.juqinghou = bbzidingyi[i].juqinghou;
                    urls.push({ "name": bbzidingyi[i].name, "url": bbzidingyi[i].url, "type": "biubiu", "ua": "PC_UA", "data": biudata, "group": "新导入"})
                }catch(e){
                    //log(bbzidingyi[i].name + '>抓取失败>' + e.message)
                }
            }
            hideLoading();
            try{
                jknum = jiekousave(urls);
            }catch(e){
                jknum =-1;
                log('biu导入接口保存有异常>'+e.message);
            }             
        }
        if(getMyVar('importjiexi','')=="1"){
            let zhujiexi = bbdata.zhujiexi||"";
            try{
                var zjiexi = zhujiexi.split('#');
                zjiexi = zjiexi.map(item=>{
                    return {url:item};
                })
            }catch(e){
                var zjiexi = zhujiexi;
            }
            let beiyongjiexi = bbdata.beiyongjiexi||"";
            try{
                var bjiexi = beiyongjiexi.split('#');
                bjiexi = bjiexi.map(item=>{
                    return {url:item};
                })
            }catch(e){
                var bjiexi = beiyongjiexi;
            }
            let jiexi = zjiexi.concat(bjiexi);
            if(jiexi.length>0){
                function randomid(){
                    let id = ''; 
                    for (var i = 0; i < 6; i++) {
                        id += Math.floor(Math.random() * 10);
                    }
                    return id;
                }
                try{
                    let urls = [];
                    for (let i=0;i<jiexi.length;i++) {
                        if(/^http/.test(jiexi[i].url)){
                            let arr  = { "name": jiexi[i].name||"bb"+randomid(), "parse": jiexi[i].url, "stopfrom": [], "priorfrom": [], "sort": 1 };
                            urls.push(arr);
                        }
                    }
                    jxnum = jiexisave(urls);
                } catch (e) {
                    jxnum = -1;
                    log('biu导入解析失败>'+e.message); 
                }
            }
        }
        if(getMyVar('importlive','')=="1"){
            try{
                let urls = [];
                let lives = bbdata.dianshizhibo;
                if(lives&&/^http/.test(lives)){
                    urls.push(lives);
                }
                if(urls.length>0){
                    livenum = 0;
                    let livecfgfile = "hiker://files/rules/Src/Juying/liveconfig.json";
                    let livecfg = fetch(livecfgfile);
                    if(livecfg != ""){
                        eval("var liveconfig = " + livecfg);
                    }else{
                        var liveconfig = {};
                    }
                    let livedata = liveconfig['data']||[];
                    for(let i=0;i<urls.length;i++){
                        if(!livedata.some(item => item.url==urls[i])){
                            let YChtml = request(urls[i],{timeout:5000}).replace(/TV-/g,'TV');
                            if(YChtml.indexOf('#genre#')>-1){
                                let id = livedata.length + 1;
                                livedata.push({name:'JY订阅'+id,url:urls[i]});
                                livenum++;
                            }else{
                                livesm = "链接无效或非通用tv格式文件";
                            }
                        }else{
                            livesm = "已存在";
                        }
                    }
                    if(livenum>0){
                        liveconfig['data'] = livedata;
                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                    }
                }
            } catch (e) {
                log('biubiu导入live保存失败>'+e.message);
            }
        }
        let sm = (jknum>-1?' 接口保存'+jknum:'')+(jxnum>-1?' 解析保存'+jxnum:'')+(livenum>-1?livenum==0?' 直播订阅'+livesm:' 直播保存'+livenum:'');
        if(jknum>0||jxnum>0){back();}
        if(jknum==-1&&jxnum==-1&&livenum>-1){
            clearMyVar('importinput');
            refreshPage(false);
        }
        return 'toast://biu导入：'+(sm?sm:'导入异常，详情查看日志');
    }   
}

//资源分享
function JYshare(lx,time) {
    time = time||3600;
    if(getMyVar('guanli', 'jk')=="jk"){
    var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
        var sm = "聚影接口";
    }else{
        var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
        var sm = "聚影解析";
    }
    var datafile = fetch(filepath);
    eval("var datalist=" + datafile+ ";");
    var sm2 = "聚影分享口令已生成";
    let duoselect = storage0.getMyVar('duoselect')?storage0.getMyVar('duoselect'):[];
    if(duoselect.length>0){
        var lists = datalist.filter(item => {
            if(item.url){
                return duoselect.indexOf(item.url)>-1;
            }else{
                return duoselect.indexOf(item.parse)>-1;
            }
        })
        if(lists.length>0){
            var datalist = lists;
            sm2 = "(选定)聚影分享口令已生成";
            //clearMyVar('duoselect');
        }
    }
    
    let text = JSON.stringify(datalist);
    var num = ''; 
    for (var i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
    }
    let textcontent = base64Encode(text);
    if(textcontent.length>=200000){
        log('分享失败：接口字符数超过最大限制，请精简接口，重点减少xpath和biubiu类型'); 
        return 'toast://分享同步失败，接口字符数超过最大限制';
    }
    try{
        var pasteurl = JSON.parse(request('https://netcut.cn/api/note/create/', {
            headers: { 'Referer': 'https://netcut.cn/' },
            body: 'note_name=Juying'+num+'&note_content='+textcontent+'&note_pwd=0&expire_time='+time,//3600时，604800周，2592000月，31536000年
            method: 'POST'
        })).data.note_id || "";
    }catch(e){
        var pasteurl = "";
    }

    if(pasteurl){
        let code = sm+'￥'+aesEncode('Juying', pasteurl)+'￥'+(time==3600?'1小时':time==604800?'1周':time==2592000?'1个月':time==31536000?'1年':'限期')+'内有效';
        if(lx!=2){
            copy(code);
        }else{
            copy('云口令：'+code+`@import=js:$.require("hiker://page/cloudimport?rule=聚影√");`);
        }
        return "toast://"+sm2;
    }else{
        return "toast://分享失败，剪粘板或网络异常";
    }
}
//资源导入
function JYimport(input) {
    if(/^云口令：/.test(input)){
        input = input.replace('云口令：','');
        var cloudimport = 1;
    }
    try{
        var inputname = input.split('￥')[0];
        if(cloudimport&&inputname=="聚影接口"){
            var cloudtype = "jk";
        }else if(cloudimport&&inputname=="聚影解析"){
            var cloudtype = "jx";
        }
    }catch(e){
        return "toast://聚影√：口令有误";
    }
    try{
        if(((inputname=="聚影接口"||input.split('￥')[0]=="聚影资源码")&&getMyVar('guanli')=="jk")||cloudtype=="jk"){
            var sm = "聚影√：接口";
        }else if(((inputname=="聚影解析"||input.split('￥')[0]=="聚影资源码")&&getMyVar('guanli')=="jx")||cloudtype=="jx"){
            var sm = "聚影√：解析";
        }else{
            return "toast://聚影√：无法识别的口令";
        }
        if(inputname=="聚影资源码"){
            var codelx = "dingyue";
        }else{
            var codelx = "share";
        }
        let pasteurl = input.split('￥')[1];
        let text = parsePaste('https://netcut.cn/p/'+aesDecode('Juying', pasteurl));
        if(pasteurl&&!/^error/.test(text)){
            let pastedata = JSON.parse(base64Decode(text));
            let urlnum = 0;
            if(getMyVar('guanli')=="jk"||cloudtype=="jk"){
                if(codelx=="share"){
                    var pastedatalist = pastedata;
                }else if(codelx=="dingyue"){
                    var pastedatalist = pastedata.jiekou;
                }
                urlnum = jiekousave(pastedatalist);
            }else if(getMyVar('guanli')=="jx"||cloudtype=="jx"){
                if(codelx=="share"){
                    var pastedatalist = pastedata;
                }else if(codelx=="dingyue"){
                    var pastedatalist = pastedata.jiexi;
                }
                urlnum = jiexisave(pastedatalist);
            }
            if(urlnum>0&&cloudimport!=1){
                refreshPage(false);
            }
            return "toast://"+sm+"合计："+pastedatalist.length+"，保存："+urlnum;
        }else{
            return "toast://聚影√：口令错误或已失效";
        }
    } catch (e) {
        return "toast://聚影√：无法识别的口令";
    }
}