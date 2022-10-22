function homepage(helper) {
    var cloudVersion = 7.09;//插件版本号，判断是否需要更新
    if(config.SrcSet=='hiker://files/cache/SrcSet.js'){
        confirm({
            title:'更新提示', 
            content:'发现新版本，是否立即更新？', 
            confirm:()=>{return parsePaste("https://pasteme.tyrantg.com/xxxxxx/1kh9o33jk5jo3kjp@OcVpSw");}, 
            cancel:()=>{return 'toast://哥帅不';}
        })
        setResult([]);
    }else{
        if (!fileExist('hiker://files/rules/Src/Auto/config.json')&&fileExist('hiker://files/cache/SrcSet.js')) {
            try{
                eval(fetch('hiker://files/cache/SrcSet.js').replace('userconfig','oldconfig'));
                writeFile('hiker://files/rules/Src/Auto/config.json', JSON.stringify(oldconfig));
            }catch(e){} 
        }
        if (!fileExist('hiker://files/rules/Src/Auto/SrcSort.json')&&fileExist('hiker://files/cache/SrcSort.json')) {
            try{
                eval("var oldsort=" + fetch('hiker://files/cache/SrcSort.json'));
                writeFile('hiker://files/rules/Src/Auto/SrcSort.json', JSON.stringify(oldsort));
            }catch(e){}
        }

        var d = [];
        //判断是否有断插小程序
        var Dnzt = 0;
        if(fileExist('hiker://files/cache/MyParseSet.json')&&fileExist('hiker://files/rules/DuanNian/MyParse.json')){var isDn = 1}else{var isDn = 0};
        if(isDn==0){
            d.push({
                title: "告警提示：断插必要条件检测不通过<br>建议检查步聚：<br>1.其他渠道安装断插小程序<br>2.断插小程序更新脚本依赖<br>3.断插配置页保存一次配置" ,
                col_type: "rich_text"
            });
        }else{
            try{
                eval('var DnSet = ' + fetch(config.DnSetOld));
                var Dnoldcj = DnSet.cj;
                Dnzt = 1;
            } catch(e) {
                d.push({
                    title: "告警提示：断插旧配置文件损坏<br>建议检查步聚：<br>1.删除hiker://files/cache/MyParseSet.json文件<br>2.断插配置页保存一次配置",
                    col_type: "rich_text"
                });
            }
        }
        if(Dnzt==1){
            //判断是否有插件，是否首次使用
            let cfgfile = fetch(config.SrcSet);
            if(cfgfile){
                eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
            }
            if(fetch(config.SrcCj)==""||typeof userconfig == "undefined"){
                var isCj = 0;
                var nowVersion = 0;
            }else{
                var isCj = 1;
                var nowVersion = fetch(config.SrcCj).match(/SrcVersion = ([\s\S]*?);/)[1];
            }     

            d.push({
                title: '‘‘’’<big><span style="color:#0C0000">私家定制',
                desc: '断插 附加功能',
                url: `@lazyRule=.js:if(getMyVar('debug','0')=='0'){putMyVar('debug','1');'toast://哥帅不'}else{'toast://哥很帅'}`,
                col_type: 'text_center_1'
            });
            if(isCj==1){
                if(DnSet.cj ==config.SrcCj){var cjzt = "开"}else{var cjzt = "关"}
                if(helper == undefined){var helper="0"}
                d.push({
                    title:'解析',
                    col_type: 'input',
                    desc: "请输入解析地址",
                    url: cjzt == "关" ? "'toast://本插件还没有启用呢，无法测试'" : $.toString((userconfig,helper)=>{
                        let url = getMyVar("playTestUrl", "").trim();
                        if (url=="") {
                            return "toast://还没有输入链接";
                        }
                        showLoading('调用本插件，智能解析中...');
                        if(userconfig.testcheck == 1){
                            refreshPage(false);
                            putMyVar('ischeck','1');
                            putMyVar('Stitle',MY_RULE.title);
                            putMyVar('Sversion',MY_RULE.version);
                            putMyVar('helper',helper);
                        }
                        eval(fetch(config.SrcCj));
                        if(getMyVar('playTestjx', '')==""||getMyVar('playTestjx', '')=="不指定"){
                            return aytmParse(url);
                        }else{
                            return aytmParse(url,getMyVar('playTestjx'));
                        }
                    },userconfig,helper),
                    extra: {
                        titleVisible: true,
                        //ua:PC_UA,
                        jsLoadingInject: true,
                        blockRules: ['.m4a','.mp3','.mp4','.flv','.avi','.3gp','.mpeg','.wmv','.mov','.rmvb','.gif','.jpeg','.png','hm.baidu.com','/ads/*.js','.css'],
                        defaultValue: getMyVar('playTestUrl', '') || "",
                        onChange: 'putMyVar("playTestUrl",input)'
                    }
                });

                eval('let fromUrl =' + request('hiker://page/fromUrl'));
                eval(fromUrl.rule);
                d.push({
                    title:'来个影片',
                    url: $(sitelist,3).select((urls)=>{
                            let url = urls[input];
                            putMyVar('playTestUrl', url);
                            refreshPage(true);
                            return'toast://已选测试片源：' + input;
                        },urls),
                    col_type: "scroll_button"
                }); 
                eval('var DnNew =' + fetch(config.DnSetNew));
                var jxs = DnNew.title;
                jxs.unshift('不指定');
                d.push({
                    title:getMyVar('playTestjx', "")==""?'不指定':getMyVar('playTestjx'),
                    url: $(jxs,3).select(()=>{
                            let jx = input;
                            putMyVar('playTestjx', jx);
                            refreshPage(true);
                            return'toast://已选指定解析：' + input;
                        }),
                    col_type: "scroll_button"
                }); 
                d.push({
                    title:'断插设置',
                    url: isDn==0?'toast://未找到断插程序，功能受限':fetch('hiker://files/cache/Parse_Dn.js').indexOf('updateDate')==-1?setupPages("设置"):"hiker://page/Route?rule=MyFieldᴰⁿ&type=设置#noRecordHistory#",
                    col_type: "scroll_button"
                });
                d.push({
                    title:'解析接口',
                    url: isDn==0?'toast://未找到断插程序，功能受限':fetch('hiker://files/cache/Parse_Dn.js').indexOf('updateDate')==-1?setupPages("编辑"):"hiker://page/Route?rule=MyFieldᴰⁿ&type=编辑#noRecordHistory#",
                    col_type: "scroll_button"
                });
                d.push({
                    title:'生成免嗅',
                    url: $("#noHistory##noRecordHistory#hiker://empty").rule((createJParse) => {
                            createJParse();
                        },createJParse),
                    col_type: "scroll_button"
                });
                d.push({
                    title:'建议处理',
                    url: $('#noLoading#').lazyRule((faildeal) => {
                            eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
                            if(userconfig.dellist==undefined||userconfig.dellist.length==0){
                                return 'toast://运行良好，没有建议处理的解析';
                            }else{
                                return $("#noHistory##noRecordHistory#hiker://empty").rule((dellist,faildeal) => {
                                            faildeal(dellist)
                                    },userconfig.dellist,faildeal);    
                            }
                        },faildeal),
                    col_type: "scroll_button"
                });
                d.push({
                    title:'说明',
                    url: 'hiker://empty#' + `@rule=js:var d = [];d.push({title:'本插件是在断插基础上做的一些附加功能<br/>主要特点如下： <br/> 1.实现自动顺序或乱序按成功优先级匹配，自动匹配片源适用解析<br/>2.实现自动排序，对解析失败的接口降权降序、直到超过次数剔除，越用越快<br/>3.支持不同类型解析，顺序为js免嗅+json+明码直链》嗅探<br/>4.智能优选模式下，可配合排除片源手工剔除+断插配置优先，达到智能化+个性化<br/>5.自动处理播放地址，加ua、存本地等操作，尽量提高播放成功率<br/>6.无需测试，本插件会自动跳过失效的，会在日志提示或通过建议删除处理<br/>7.其他项，就请自行探索吧，最后需感谢断佬提供的原版插件！<br/>更新日志<br/>1.整体逻辑全新优先升级，2.处理逻辑更加快捷，3.支持解析结果为对象的形式，4.自动拦截失效的视频地址',col_type: 'rich_text'});setHomeResult(d);`,
                    col_type: "scroll_button"
                });
                d.push({
                    title:'♥',
                    url: $(getMyVar('mmgntgmm',""),"秘密功能通关密码").input((onSelect,userconfig)=>{
                            putMyVar('mmgntgmm',input);
                            evalPrivateJS("egl9Ie3p8c62hTcY/7uf5QOBFogc9JoL5TzjDI8y7FHLK8tI1lZz+wif+9ZIAdT2U4kW6OB3xHn/4DntdHdgR3n1itkW5qt324e/TIUXzyPLK8tI1lZz+wif+9ZIAdT2yyvLSNZWc/sIn/vWSAHU9heDK8MvAuaeXn99VjHX9GDLK8tI1lZz+wif+9ZIAdT2M6PA9I6Cw1IaeBlI1EueOcocRQPhsOHHIFz2Li4ajujd22Yj+u4odWN15iH1VyOByyvLSNZWc/sIn/vWSAHU9sQnQ8kqIbxqwJSP0AIe+sPLK8tI1lZz+wif+9ZIAdT2jbUT5CRpNMvC0u7rWdsA7xBp1fqeubKC0GZw+eP9pZjLK8tI1lZz+wif+9ZIAdT2yyvLSNZWc/sIn/vWSAHU9oFDvpNO8ikETwJSzGWplOPLK8tI1lZz+wif+9ZIAdT2T3vswDWnXFX9puTrXgi5EMsry0jWVnP7CJ/71kgB1PYn19QRxIda+Tx+nKfD4GRghdlEwnrBbGyJcHloEQbL1ssry0jWVnP7CJ/71kgB1PbT/drCgPUivvzR7Kn9dwjryyvLSNZWc/sIn/vWSAHU9vKDrRGwYMdB6vUbdkuIA6M=")
                            let jsid = verification(input);
                            if(jsid == "1"){
                                putMyVar('isadmin', '1');
                                refreshPage(false);
                                if(userconfig.ismulti==undefined||userconfig.ismulti==0){var multi = "开启"}else{var multi = "关闭"}
                                return $([multi+"多线路","多线程数量"],2,"哈喽LSP,被你发现了秘密功能").select((onSelect)=>{
                                    return onSelect(input);
                                },onSelect);
                            }else if(jsid == "2"){
                                putMyVar('isadmin', '1');
                                refreshPage(false);
                                return $(["幸运大抽奖"],2,"没错，你就是“lsp”").select((onSelect)=>{
                                    if(input=="幸运大抽奖"){
                                        return onSelect(input);
                                    }
                                },onSelect);
                            }else if(jsid == "3"){
                                return $(["幸运大抽奖"],2,"").select((onSelect)=>{
                                    if(input=="幸运大抽奖"){
                                        var myDate = new Date();
                                        var luckDate = myDate.getMonth()+1+'-'+myDate.getDate();
                                        if(luckDate==getItem('luckDate')&&getMyVar('isadmin', '0')=="0"){
                                            return "toast://今天的机会已用完，客官明天再来吧";
                                        }else{
                                            return onSelect(input);
                                        }
                                    }
                                },onSelect);
                            }else{
                                return "toast://欢迎有缘人，记住“哥就是帅”♥";
                            }
                        },onSelect,userconfig),
                    col_type: "scroll_button"
                });
                d.push({
                    col_type: 'line'
                });
                var nowVersion = fetch(config.SrcCj).match(/SrcVersion = ([\s\S]*?);/)[1];
                d.push({
                    title:cjzt=='关'?'‘‘’’<span style="color:red">插件状态('+cjzt+')':'‘‘’’<span style="color:#04B431">插件状态('+cjzt+')',
                    url: $('#noLoading#').lazyRule((DnSet) => {
                            eval('var newDnSet = ' + fetch(config.DnSetNew));
                            if(DnSet.cj ==config.SrcCj){
                                DnSet.cj = config.DnCj;
                                newDnSet.settings.cj = config.DnCj;
                            var sm = "恢复默认插件"
                            }else{
                                DnSet.cj = config.SrcCj;
                                newDnSet.settings.cj = config.SrcCj;
                            var sm = "欢迎进入自动、智能、便捷的视界"
                            }
                            writeFile(config.DnSetOld, $.stringify(DnSet));
                            writeFile(config.DnSetNew, $.stringify(newDnSet));
                            refreshPage(false);
                            return 'toast://'+sm;
                    },DnSet),
                    desc: cjzt=='关'?'当前插件为：Parse_Dn.js':'当前插件为：SrcAuto'+nowVersion,
                    col_type: "text_center_1"
                });

                d.push({
                    title:userconfig.printlog==1?'打印日志(开)':'打印日志(关)',
                    url:$('#noLoading#').lazyRule((userconfig) => {
                            if(userconfig.printlog == 0){
                                userconfig.printlog = 1;
                            }else{
                                userconfig.printlog = 0;
                                userconfig.testcheck = 0;
                            }
                            writeFile(config.SrcSet, JSON.stringify(userconfig));
                            refreshPage(false);
                            return 'toast://切换成功';
                        },userconfig),
                    col_type: "text_2"
                });
                d.push({
                    title:userconfig.autoselect==1?'智能优选(开)':'智能优选(关)',
                    url: $('#noLoading#').lazyRule((userconfig) => {
                            if(userconfig.autoselect == 0){
                            userconfig.autoselect = 1;
                            var sm = "开启智能优选模式，全自动匹配解析口"
                            }else{
                            userconfig.autoselect = 0;
                            var sm = "关闭智能优选，按断插设置调用解析口"
                            }
                            writeFile(config.SrcSet, JSON.stringify(userconfig));
                            refreshPage(false);
                            return 'toast://'+sm;
                        },userconfig),
                    col_type: "text_2"
                });
                if(getMyVar('isadmin', '0')=="1"){
                    d.push({
                        title:userconfig.iscustom==1?'亲情关怀(开)':'亲情关怀(关)',
                        url: $('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.iscustom == 0){
                                    userconfig.iscustom = 1;
                                    var sm = "当前处于远程亲情关怀模式，请关注远程解析接口文件"
                                }else{
                                    userconfig.iscustom = 0;
                                    var sm = "当前处于本地模式"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                        },userconfig),
                        col_type: "text_2"
                    });
                    if(userconfig.iscustom == 1){
                        d.push({
                            title: userconfig.remotepath!=undefined&&userconfig.remotepath!=""?'远程地址(有)':'远程地址(无)',
                            url: userconfig.iscustom==0?'toast://亲情关怀未启用，无需设置远程解析地址':$(userconfig.remotepath||"","需自行搭建云文件").input((userconfig) => {
                                if(!/^http/.test(input)&&input!=""){ return "toast://远程链接地址无效"; }else{
                                    userconfig.remotepath=input;
                                    writeFile(config.SrcSet, JSON.stringify(userconfig));
                                    refreshPage(false);
                                    return 'toast://设置成功'+input;
                                }
                            },userconfig),
                            col_type: 'text_2'
                        });
                    }
                }
                if(userconfig.autoselect == 1){
                    d.push({
                        title:userconfig.disorder==1?'乱序模式(开)':'乱序模式(关)',
                        url: $('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.disorder == 0){
                                    userconfig.disorder = 1;
                                    var sm = "开启乱序模式，在同解析接口类型中，排序同级的解析随机重排序"
                                }else{
                                    userconfig.disorder = 0;
                                    var sm = "关闭乱序模式，按常规智能顺序处理"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                            },userconfig),
                        col_type: "text_2"
                    });
                    d.push({
                        title:userconfig.parsereserve==1?'优先断插(开)':'优先断插(关)',
                        url: $('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.parsereserve == 0){
                                    userconfig.parsereserve = 1;
                                    var sm = "开启强制优先断插配置的解析，在同解析接口类型中，强制手工配置的解析优先"
                                }else{
                                    userconfig.parsereserve = 0;
                                    var sm = "关闭强制优先断插配置的解析，按常规智能排序处理"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                            },userconfig),
                        col_type: "text_2"
                    });
                    d.push({
                        title:'失败剔除('+userconfig.fromcount+')',
                        url: $(userconfig.fromcount,"智能优选开启时\n失败多少个片源，剔除并提示删除").input((userconfig) => {
                                if(!parseInt(input)||parseInt(input)<1||parseInt(input)>13){return 'toast://输入有误，请输入1-13数字'}else{
                                userconfig.fromcount=parseInt(input);
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://当开启智能优选，失败片源达'+userconfig.fromcount+'个，加入建议删除';
                            }
                        },userconfig),
                        col_type: "text_2"
                    });
                }else{
                    d.push({
                        title: '失败剔除('+userconfig.failcount+'次)',
                        url: $(userconfig.failcount,"智能优选关闭时\n失败多少次，剔除并提示删除").input((userconfig) => {
                                if(!parseInt(input)||parseInt(input)<1||parseInt(input)>5){return 'toast://输入有误，请输入1-5数字'}else{
                                userconfig.failcount=parseInt(input);
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://失败次数设置为'+userconfig.failcount+'，超过次数剔除解析';
                                }
                        },userconfig),
                        col_type: 'text_2'
                    });
                }
                d.push({
                    title: 'X5超时('+userconfig.x5timeout+'秒)',
                    url: $(userconfig.x5timeout,"针对x5通免的超时时长").input((userconfig) => {
                            if(!parseInt(input)||parseInt(input)<1||parseInt(input)>10){return 'toast://输入有误，请输入1-10数字'}else{
                            userconfig.x5timeout=parseInt(input);
                            writeFile(config.SrcSet, JSON.stringify(userconfig));
                            refreshPage(false);
                            return 'toast://x5通免解析超时时间设为：'+userconfig.x5timeout+'秒';
                            }
                    },userconfig),
                    col_type: 'text_2'
                });
                d.push({
                        title:userconfig.jstoweb==1?'允许js>web(开)':'允许js>web(关)',
                        url: $('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.jstoweb == 0){
                                    userconfig.jstoweb = 1;
                                    var sm = "开启允许js>web，当遇到js套x5/web通免的解析时，会中断帅助手逻辑，直接跳转通免执行，特殊情况下使用，不建议开启"
                                }else{
                                    userconfig.jstoweb = 0;
                                    var sm = "关闭允许js>web，按常规逻辑处理，推荐关闭"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                            },userconfig),
                        col_type: "text_2"
                    });
                    d.push({
                        title:userconfig.cachem3u8==1?'缓存m3u8(开)':'缓存m3u8(关)',
                        url: $('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.cachem3u8 == 0){
                                    userconfig.cachem3u8 = 1;
                                    var sm = "开启缓存m3u8模式，此功能优点很多，可以增强播放成功率，播放地址不失效，特别是不浪费解析，推荐开启"
                                }else{
                                    userconfig.cachem3u8 = 0;
                                    var sm = "关闭缓存m3u8模式，只针对不使用波澜投屏时的传统投屏或其他特殊情况下使用"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                            },userconfig),
                        col_type: "text_2"
                    });
                var myDate = new Date();
                var checkDate = myDate.getMonth()+1+'-'+myDate.getDate();
                if(getMyVar('ischeck','0')=="1"&&getMyVar('debug','0')!="86"){
                    userconfig.testcheck = 0;
                    setItem('checkDate',checkDate);
                    clearMyVar('luckadmin');
                    writeFile(config.SrcSet, 'var userconfig = ' + JSON.stringify(userconfig));
                }
                if(getMyVar('isadmin', '0')=="1"||getMyVar('luckadmin', '0')=="1"){
                    d.push({
                        title: userconfig.testcheck==1?'测试检测(开)':'测试检测(关)',
                        url: userconfig.printlog==0&&userconfig.testcheck==0?'toast://需先打开日志开关，才能观察到结果':checkDate==getItem('checkDate')&&userconfig.testcheck==0?'toast://要讲武德，不要反复测试，且用且珍惜':$('#noLoading#').lazyRule((userconfig) => {
                                if(userconfig.testcheck == 0){
                                    userconfig.testcheck = 1;
                                    var sm = "当前处于检测状态，注意查看日志"
                                }else{
                                    userconfig.testcheck = 0;
                                    var sm = "检测解析功能已关闭"
                                }
                                writeFile(config.SrcSet, JSON.stringify(userconfig));
                                refreshPage(false);
                                return 'toast://'+sm;
                        },userconfig),
                        col_type: "text_2"
                    });
                }
                d.push({
                    col_type: 'line'
                });
                d.push({
                    title: '调整排序策略',
                    url: $(['‘‘’’<span style="color:red" title="排除片源">排除片源', '‘‘’’<span style="color:#04B431" title="重置回厂">重置回厂'],
                        2).select((onSelect) => {
                            return onSelect(input);
                        },onSelect),
                    desc: '重置所有排序记录、强制剔除解析片源',
                    col_type: 'text_center_1'
                });
            }
            d.push({
                col_type: 'line_blank'
            });
            if(typeof userconfig == "undefined"||userconfig.remotepath==""){
            var custompath = ""; 
            }else{
            var custompath = userconfig.remotepath; 
            }

            d.push({
                title: '‘‘’’<big>更新脚本依赖',
                url: isDn==0?$("断插都没有？无法使用！").confirm(()=>"toast://哥就是帅"):isCj==1&&nowVersion==cloudVersion&&getMyVar('debug','0')!='86'?"toast://已经是最新版本了":$('#noLoading#').lazyRule((isCj,remotepath) => {
                    //var myDate = new Date();
                    //var updateDate = myDate.getMonth()+1+'-'+myDate.getDate();
                    //if(updateDate!=getItem('updateDate')||isCj==0||getMyVar('debug','0')=='86'){
                        let filepath = getMyVar('SrcCloud','0');
                        var cjFile = request(filepath,{timeout:2000});
                        if(cjFile.indexOf('SrcVersion') > -1){
                            //if(MY_RULE.version<parseInt(cjFile.match(/SrcVersion = ([\s\S]*?);/)[1])){
                            //    return 'toast://无法更新新版脚本依赖';
                            //}else{
                                writeFile(config.SrcCj, cjFile);
                                eval(cjFile.match(/var defaultconfig = {[\s\S]*?}/)[0] + '');
                                defaultconfig.remotepath = remotepath;
                                writeFile(config.SrcSet, JSON.stringify(defaultconfig));
                                //setItem('updateDate',updateDate);
                                clearMyVar('debug');
                                deleteCache();
                                refreshPage(false);
                                return 'toast://更新成功';
                            //}
                        }else{
                            return 'toast://未成功获取内容，更新失败';
                        }
                    //}else{return 'toast://要讲武德，不要反复更新'}
                },isCj,custompath),
                desc: isCj==1&&cloudVersion>nowVersion?'‘‘’’<span style="color:#CC9900">发现新版本：'+cloudVersion.toString():'不用频繁更新、有新版本时会提示',
                col_type: 'text_center_1'
            });
        }
        setResult(d);
    }
}

function faildeal(list) {
    addListener("onClose", $.toString(() => {
        clearMyVar("动作");
        clearMyVar("片源");
        eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
        userconfig['dellist'] = config.faillist;
        writeFile(config.SrcSet, JSON.stringify(userconfig));
        initConfig({faillist:'0'});
    }));
    setPageTitle("失败解析处理");
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

    if(config.faillist==undefined||config.faillist=="0"){
        initConfig({faillist:uniq(list)});
        refreshPage(false);
    }
    
    var d = [];
    d.push({
        title: '选择处理动作▼',
        col_type: "rich_text"
    });
    d.push({
        col_type: 'line'
    });
    for (let i = 0; i < 9; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
    var Color = "#f13b66a";
    function getHead(title) {
        return '‘‘’’<strong><font color="' + Color + '">' + title + '</front></strong>';
    }
    d.push({
        title:getMyVar('动作', '0') == '复检' ? getHead('复检↓') : '复检',
        url: $("#noLoading#").lazyRule(() => {putMyVar('动作', '复检');refreshPage(false);return "toast://选择动作:复检";}),
        col_type: "scroll_button"
    });
    d.push({
        title:getMyVar('动作', '0') == '删除' ? getHead('删除↓') : '删除',
        url: $("#noLoading#").lazyRule(() => {putMyVar('动作', '删除');refreshPage(false);return "toast://选择动作:删除";}),
        col_type: "scroll_button"
    });
    d.push({
        title:getMyVar('动作', '0') == '标记' ? getHead('标记↓') : '标记',
        url: $("#noLoading#").lazyRule(() => {putMyVar('动作', '标记');refreshPage(false);return "toast://选择动作:标记";}),
        col_type: "scroll_button"
    });
    d.push({
        title:getMyVar('动作', '0') == '重置' ? getHead('重置↓') : '重置',
        url: $("#noLoading#").lazyRule(() => {putMyVar('动作', '重置');refreshPage(false);return "toast://选择动作:重置";}),
        col_type: "scroll_button"
    });
    if(getMyVar('动作', '0') == '复检'){
        d.push({
            col_type: 'line_blank'
        });
        d.push({
            title: '选择复检片源▼' ,
            col_type: "rich_text"
        });
        d.push({
            col_type: 'line'
        });
        for (let i = 0; i < 9; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
        eval('var fromUrl =' + request('hiker://page/fromUrl'));
		eval(fromUrl.rule);
        if(getMyVar('片源', '0')=="0"){
            var vipUrl = "";
        }else{
            var vipUrl = urls[getMyVar('片源')];
        }
        for (var i in sitelist) {
            d.push({
                title:getMyVar('片源', '0') == sitelist[i] ? getHead(sitelist[i]+'↓') : sitelist[i],
                url: $("#noLoading#").lazyRule((site) => {putMyVar('片源', site);refreshPage(false);return "toast://片源:"+site;},sitelist[i]),
                col_type: "scroll_button"
            });
        }
    }
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: "检测失败的解析▼  点击执行处理" ,
        col_type: "rich_text"
    });
    d.push({
        col_type: 'line'
    });
    for (let i = 0; i < 5; i++) {
        d.push({
            col_type: "blank_block"
        })
    }
    if(getMyVar('动作', '0') == '复检'){
        d.push({
            title:">>>批量复检<<<",
            url: getMyVar('片源', '0')=="0"?"toast://需选择上方的复检片源":$('#noLoading#').lazyRule((vipUrl,list) => {
                    eval(fetch('hiker://files/cache/SrcAuto.js'));
                    return aytmParse(vipUrl,list.join(','));
            },vipUrl,config.faillist),
            desc: '批量对当前所有失败解析口，重新批量复检',
            col_type: "text_center_1"
        });
    }
    for (var i in config.faillist) {
        d.push({
            title:config.faillist[i],
            url: getMyVar('动作', '0')=="0"?"toast://需选择上方的处理动作":getMyVar('动作', '0')=="复检"&&getMyVar('片源', '0')=="0"?"toast://需选择上方的复检片源":$().lazyRule((vipUrl,parseStr,faillist) => {
                    if(getMyVar('动作', '0')=="复检"){
                        eval(fetch('hiker://files/cache/SrcAuto.js'));
                        return aytmParse(vipUrl,parseStr);
                    }
                    if(getMyVar('动作', '0')=="删除"){
                        return $(parseStr+"：是否确认删除？").confirm((faillist,parseStr)=>{
                           function removeByValue(arr, val) {
                                for(var i = 0; i < arr.length; i++) {
                                    if(arr[i] == val) {
                                    arr.splice(i, 1);
                                    break;
                                    }
                                }
                            }
                            log(faillist);
                            removeByValue(faillist,parseStr);
                            log(faillist);
                            initConfig({faillist:faillist});
                            log(config.faillist);
                            //从建议处理中删除
                            eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
                            removeByValue(userconfig.dellist,parseStr);
                            writeFile(config.SrcSet, $.stringify(userconfig));
                            
                            var DnSetNew = config.DnSetNew;
                            eval('var json =' + fetch(DnSetNew));
                            if(json.title.indexOf(parseStr)>-1){
                                if (json.codes.hasOwnProperty(parseStr)) {
                                    delete json.codes[parseStr];
                                }
                                removeByValue(json.title,parseStr);
                                writeFile(DnSetNew, $.stringify(json));
                                refreshPage(false);
                                return "toast://已将〖" + parseStr + "〗删除";
                            }else{
                                refreshPage(false);
                                return "toast://〖" + parseStr + "〗为无效配置，需手工从配置项去掉";
                            }
                        },faillist,parseStr);
                    }
                    if(getMyVar('动作', '0')=="标记"){
                        return $("✗"+parseStr,"新的解析名，只修改解析名").input((faillist,parseStr) => {
                            function removeByValue(arr, val) {
                                for(var i = 0; i < arr.length; i++) {
                                    if(arr[i] == val) {
                                    arr.splice(i, 1);
                                    break;
                                    }
                                }
                            }
                            removeByValue(faillist,parseStr);
                            initConfig({faillist:faillist});
                            
                            var DnSetNew = config.DnSetNew;
                            eval('var json =' + fetch(DnSetNew));
                            if(json.title.indexOf(parseStr)>-1){
                                if (json.codes.hasOwnProperty(parseStr)) {
                                    json.codes[input] = json.codes[parseStr];
                                    delete json.codes[parseStr];
                                }
                                json.title.splice(json.title.indexOf(parseStr),1,input);
                                writeFile(DnSetNew, $.stringify(json));

                                var filepath = "hiker://files/rules/Src/Auto/SrcSort.json";
                                var sortfile = fetch(filepath);
                                if(sortfile != ""){
                                    eval("var sortlist=" + sortfile+ ";");
                                    for (var i in sortlist) {
                                        if(sortlist[i].name==parseStr){
                                            sortlist[i].name = input;
                                            writeFile(filepath, JSON.stringify(sortlist));			
                                            break;
                                        }
                                    }
                                }

                                refreshPage(false);
                                return "toast://已更名为〖" + input + "〗";
                            }else{
                                return "toast://〖" + parseStr + "〗为无效配置，需手工从配置项去掉";
                            }
                        },faillist,parseStr);
                    }
                    if(getMyVar('动作', '0')=="重置"){
                        return $(parseStr+"：是否确认重置（重新启用）？").confirm((faillist,parseStr)=>{
                            function removeByValue(arr, val) {
                                for(var i = 0; i < arr.length; i++) {
                                    if(arr[i] == val) {
                                    arr.splice(i, 1);
                                    break;
                                    }
                                }
                            }
                            removeByValue(faillist,parseStr);
                            initConfig({faillist:faillist});
                            
                            var DnSetNew = config.DnSetNew;
                            eval('var json =' + fetch(DnSetNew));
                            if(json.title.indexOf(parseStr)>-1){
                                var filepath = "hiker://files/rules/Src/Auto/SrcSort.json";
                                var sortfile = fetch(filepath);
                                if(sortfile != ""){
                                    eval("var sortlist=" + sortfile+ ";");
                                    for (var i in sortlist) {
                                        if(sortlist[i].name==parseStr){
                                            sortlist[i].sort = 0;
                                            sortlist[i].stopfrom = [];
                                            writeFile(filepath, JSON.stringify(sortlist));			
                                            break;
                                        }
                                    }
                                }

                                refreshPage(false);
                                return "toast://已重置排序并启用〖" + parseStr + "〗";
                            }else{
                                return "toast://〖" + parseStr + "〗为无效配置，需手工从配置项去掉";
                            }
                        },faillist,parseStr);
                    }
                },vipUrl,config.faillist[i],config.faillist),
            col_type: "text_3"
        });
    }
    setResult(d);
}

function onSelect(input) {
    var type = parseDomForHtml(input, 'span&&title')||input;
    switch (type) {
        case "重置回厂":
            return $("清空智能排序记录，是否确认？").confirm(()=>{
                writeFile('hiker://files/rules/Src/Auto/SrcSort.json', '');
                return 'toast://已重置排序历史';
            });
            break;
        case "排除片源":
            return $("hiker://empty#noRecordHistory#").rule((stop) => {
			      eval('var fromUrl =' + request('hiker://page/fromUrl'));
			      eval(fromUrl.rule);
                  stop(fromlist,sitelist);
            },stopfrom) 
            break;
        case "开启多线路":
            eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
            userconfig['ismulti'] = 1;
            writeFile(config.SrcSet, JSON.stringify(userconfig));
            return 'toast://已开启JS免嗅、明码直链多线程解析';
            break;
        case "关闭多线路":
            eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
            userconfig['ismulti'] = 0;
            writeFile(config.SrcSet, JSON.stringify(userconfig));
            return 'toast://已关闭JS免嗅、明码直链多线程解析';
            break;
        case "多线程数量":
            eval("var userconfig=" + fetch(config.SrcSet));//加载用户参数
            return $(userconfig.multiline,"JS免嗅、JSON直链\n多线程解析运行数量(1-5)").input((userconfig) => {
                    if(!parseInt(input)||parseInt(input)<1||parseInt(input)>5){return 'toast://输入有误，请输入1-5数字'}else{
                    userconfig.multiline=parseInt(input);
                    userconfig['adminuser'] = 1;
                    writeFile(config.SrcSet, JSON.stringify(userconfig));
                    refreshPage(false);
                    return 'toast://多线程数量设为：'+userconfig.multiline;
                }
            },userconfig);
            break;
        case "幸运大抽奖":
            showLoading('开奖中，期待🙏...');
            let jxarray=pdfa(request("https://www.yisiclub.cn/1725/.html", {timeout:5000}),".u-text-format&&p");
            let list=[];
            for(let i in jxarray){
                try{
                    let title=pdfh(jxarray[i],'Text').split("—")[0].split("http")[0];
                    let url=pdfh(jxarray[i],'a&&href');
                    if(title&&url&&!/www.yisiclub.cn/.test(url)){
                        let it={
                            title:title,
                            url:url
                        };
                        list.push(it);
                    }
                }catch(e){
                    log(e.message);
                }
            }
            function random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            if(list.length>0){
                var myDate = new Date();
                var luckDate = myDate.getMonth()+1+'-'+myDate.getDate();
                setItem('luckDate',luckDate);
                hideLoading();
                let j = random(0,parseInt(list.length*1.3));
                if(j>=list.length){
                    return 'toast://😪啥也没有抽到，客官明日再来吧！';
                }else if(j==8||j==18||j==28||j==38){
                    putMyVar('luckadmin','1');
                    refreshPage(false);
                    return 'toast://😀幸运值爆炸，发现一个超级隐藏功能！';
                }else{
                    return $("😀幸运值爆表，抽到了一个解析，是否收下？").confirm((jx)=>{
                        return $("hiker://empty#noRecordHistory#").rule((jx) => {
                            addListener("onClose", $.toString(() => {
                                clearMyVar("luckcheck");
                            }));
                            this.d = [];
                            d.push({
                                title: "🎉恭喜幸运儿，得到了只有五成几率的奖品",
                                col_type: "rich_text"
                            });
                            d.push({
                                col_type: "line_blank"
                            });
                            d.push({
                                title: "解析名称：" + jx.title,
                                col_type: "rich_text"
                            });
                            d.push({
                                title: "解析地址：" + jx.url,
                                col_type: "rich_text"
                            });
                            d.push({
                                title: getMyVar('luckcheck','0')=="0"?"解析状态：未检测":getMyVar('luckcheck','0')=="1"?"解析状态：有效":"解析状态：无效",
                                col_type: "rich_text"
                            });
                            d.push({
                                col_type: "line_blank"
                            });
                            for (let i = 0; i < 9; i++) {
                                d.push({
                                    col_type: "blank_block"
                                })
                            }
                            d.push({
                                title: "测试",
                                url: getMyVar('luckcheck','0')=="1"?"toast://已检测成功，放心保存！":$("#noLoading#").lazyRule((x5jx) => {
                                        var vipUrl = [];
                                        eval('let fromUrl =' + request('hiker://page/fromUrl'));
                                        eval(fromUrl.rule);
                                        vipUrl.push(urls['爱奇艺']);
                                        vipUrl.push(urls['优酷']);
                                        vipUrl.push(urls['腾讯']);
                                        showLoading('x5检测中，超过30秒则代表失败')
                                        return x5Player(x5jx, vipUrl);
                                        function x5Player(x5jx, vipUrl) {
                                            return 'x5Rule://' + x5jx + vipUrl[0]  + '@' + (typeof $$$ == 'undefined' ? $ : $$$).toString((x5jx, vipUrl, x5Player) => {
                                                if (window.c == null) {
                                                    window.c = 0;
                                                    fba.showLoading('x5检测中，超过30秒则代表失败');
                                                };
                                                window.c++;
                                                if (window.c * 250 >= 10000) {
                                                    if (vipUrl.length == 1) { 
                                                        //最后一个X5解析失败了
                                                        fba.hideLoading();
                                                        fba.log("幸运抽奖-检测结束");
                                                        putMyVar('luckcheck','2');
                                                        refreshPage(false);
                                                        return "toast://检测失败，这个解析看来和你无缘";
                                                    } else {
                                                        //X5解析失败了
                                                        fba.log("幸运抽奖-检测下一个片源");
                                                        return x5Player(x5jx, vipUrl.slice(1));
                                                    }
                                                }
                                                
                                                var urls = _getUrls();
                                                var exclude = /playm3u8|m3u8\.tv|min\.css|404\.m3u8/;
                                                var contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4/;
                                                for (var i in urls) {
                                                    if (!exclude.test(urls[i]) && contain.test(urls[i])) {
                                                        fy_bridge_app.log("幸运抽奖-检测成功>"+urls[i]);
                                                        fba.hideLoading();
                                                        return $$$("#noLoading#").lazyRule(()=>{
                                                            putMyVar('luckcheck','1');
                                                            refreshPage(false);
                                                            return "toast://检测成功，可以放心保存";
                                                        });
                                                        
                                                    }
                                                } 
                                            }, x5jx, vipUrl, x5Player)
                                        }
                                },jx.url),
                                extra: {
                                    ua:PC_UA
                                },
                                col_type: 'text_3'
                            });
                            if(getMyVar('luckcheck','0')=="0"){var issave = "还未通过检测，确认要保存吗？"}else{var issave = "已通过检测，确认保存吧！"}
                            d.push({
                                title: "保存",
                                url: $(issave).confirm((jx)=>{
                                        return $("#noLoading#").lazyRule((jx) => {
                                            var DnSetNew = config.DnSetNew;
                                            eval('var json =' + fetch(DnSetNew));
                                            if(json.title.indexOf(jx.title)==-1){
                                                json.title.push(jx.title);
                                                json.codes[jx.title] = jx.url;
                                                writeFile(DnSetNew, $.stringify(json));
                                                back(true);
                                                return 'toast://💪已保存';
                                            }else{
                                                return "toast://〖" + jx.title + "〗已存在了，无法保存";
                                            }
                                        },jx)
                                    },jx),
                                col_type: 'text_3'
                            });
                            d.push({
                                title: "放弃",
                                url: $("#noLoading#").lazyRule(() => {
                                    back(true);
                                    return 'toast://👉已放弃';
                                }),
                                col_type: 'text_3'
                            });
                            setResult(d);
                        },jx);
                    },list[j]);
                }
            }else{
                hideLoading();
                return 'toast://😢貌似抽奖系统坏了，请稍后再试！';
            }
            break;
        default:
            return 'toast://暂不支持';
            break;
    } 

    function stopfrom(fromlist,sitelist) {
        addListener("onClose", $.toString(() => {
            //clearMyVar("parsename");
            clearMyVar("allowfrom");
            clearMyVar("stopfrom");
        }));
        setPageTitle("当前解析策略");
        var d = [];
        d.push({
            col_type: "line_blank"
        });
        eval('var newDnSet = ' + fetch(config.DnSetNew));
        var parsenames = newDnSet.title;
        d.push({
            title: "选择解析=>  " + getMyVar("parsename"),
            url: $(parsenames,2).select(() => {
                    putMyVar("parsename", input);
                    refreshPage(true);
                }),
            col_type: 'text_1'
        });
        d.push({
            col_type: "line_blank"
        });
        if(getMyVar("parsename","0")!="0"){
            d.push({
                title: "已排除：" ,
                col_type: "rich_text"
            });
            d.push({
                col_type: 'line'
            });
            function removeByValue(arr, val) {
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                    }
                }
            }
            var pname = getMyVar("parsename");
            var issort = 0;
            var Globalexclude = 0;
            var allowlist = sitelist;
            var filepath = "hiker://files/rules/Src/Auto/SrcSort.json";
            var sortfile = fetch(filepath);
            if(sortfile != ""){
                eval("var sortlist=" + sortfile+ ";");
                for (var i in sortlist) {
                    if(sortlist[i].name==pname){
                        var stoplist =sortlist[i].stopfrom;
                        if(getMyVar('allowfrom','0')!="0"){//允许解析片源，从stopfrom中删除 
                            removeByValue(stoplist,getMyVar('allowfrom'));
                            sortlist[i].stopfrom = stoplist;
                            writeFile(filepath, JSON.stringify(sortlist));			
                        }
                        if(getMyVar('stopfrom','0')!="0"){//排除解析片源，添加到stopfrom
                            stoplist[stoplist.length] = getMyVar('stopfrom');
                            sortlist[i].stopfrom = stoplist;
                            writeFile(filepath, JSON.stringify(sortlist));			
                        }	
                        issort = 1;
                        if(sortlist[i].Globalexclude==1){Globalexclude = 1};
                        break;
                    }
                }
                clearMyVar("allowfrom");
                clearMyVar("stopfrom");
                for (let j in stoplist) {
                    let fromname = fromlist[stoplist[j]];
                    d.push({
                        title: fromname,
                        url: issort==0?'toast://'+getMyVar("parsename")+' 还没有被调用过，无法设置':$("#noLoading#").lazyRule((ypfrom) => {
                            putMyVar('allowfrom',ypfrom)
                            refreshPage(true);
                            return 'toast://解析“'+getMyVar("parsename")+'” 已允许“'+ypfrom +'”片源';
                        },stoplist[j]),
                        col_type: 'text_4'
                    });
                    removeByValue(allowlist, fromname);
                }
                
                d.push({
                    col_type: 'line'
                });
                d.push({
                    col_type: 'line'
                });
                d.push({
                    title: "未排除：" ,
                    col_type: "rich_text"
                });
                d.push({
                    col_type: 'line'
                });
                for (let j in allowlist) {
                    let fromname = allowlist[j];
                    d.push({
                        title: fromname,
                        url: issort==0?'toast://'+getMyVar("parsename")+' 还没有被调用过，无法设置':$("#noLoading#").lazyRule((ypfrom) => {
                            putMyVar('stopfrom',ypfrom)
                            refreshPage(true);
                            return 'toast://解析“'+getMyVar("parsename")+'” 已排除“'+ypfrom +'”片源';
                        },fromlist[allowlist[j]]),
                        col_type: 'text_4'
                    });
                }
                d.push({
                    col_type: 'line'
                });
                d.push({
                    col_type: 'line'
                });
                d.push({
                    title: Globalexclude == 1?'‘‘’’<span style="color:red">全局排除(开)':'‘‘’’<span style="color:#04B431">全局排除(关)',
                    url: issort==0?'toast://'+getMyVar("parsename")+' 还没有被调用过，无法设置':$('#noLoading#').lazyRule((pname,sortfile,filepath,Globalexclude) => {
                            if(Globalexclude==1){var isexclude = 0;var sm ="关闭";}else{var isexclude = 1;var sm ="开启";}
                            eval("var sortlist=" + sortfile+ ";");
                            for (var i in sortlist) {
                                if(sortlist[i].name==pname){
                                    sortlist[i]['Globalexclude'] = isexclude;
                                    writeFile(filepath, JSON.stringify(sortlist));			
                                    break;
                                }
                            }
                            refreshPage(true);
                            return 'toast://“'+getMyVar("parsename")+'” 已'+sm+'全局排除';
                    },pname,sortfile,filepath,Globalexclude),
                    desc: Globalexclude == 1?'将当前解析剔除，仅用于特殊调用':'当前解析参与正常调用',
                    col_type: 'text_center_1'
                });
                d.push({
                col_type: "line_blank"
                });
                d.push({
                    title: '重置当前解析',
                    url: sortfile == ""?'toast://未找到排序历史，先去享受一下':$('#noLoading#').lazyRule((pname,sortfile,filepath) => {
                            eval("var sortlist=" + sortfile+ ";");
                            for (var i in sortlist) {
                            if(sortlist[i].name==pname){
                            sortlist[i].sort = 0;
                            sortlist[i].stopfrom = [];
                            sortlist[i]['Globalexclude'] = 0;
                            writeFile(filepath, JSON.stringify(sortlist));			
                                break;
                            }
                            }
                            refreshPage(true);
                            return 'toast://“'+getMyVar("parsename")+'” 已重置';
                    },pname,sortfile,filepath),
                    desc: '将当前解析的排序重置为0\n一键重置已排除片源',
                    col_type: 'text_center_1'
                });
            }else{
                d.push({
                    title: "首次使用本插件或者重置回厂后，需先去观看影片调用一次本插件才能手工设定" ,
                    col_type: "rich_text"
                });
            }
        }
        setResult(d);
    }
}

function setupPages(type) {
    switch (type) {
        case "设置":
            return $("hiker://empty#noRecordHistory#").rule(() => {
                this.d = [];
                setPageTitle("断插配置");
                this.d = [];
                d.push({
                    desc: 'auto',
                    url: 'file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/Parse_Dn.html',
                    col_type: 'x5_webview_single'
                });
                setResult(d);
            })
            break;
        case "编辑":
            return $("hiker://empty#noRecordHistory#").rule(() => {
                setPageTitle("解析管理");
                this.d = [];
                require('https://hikerfans.com/js/jxItem.js');
                jxList();
                setResult(d);
            })
            break;
        default:
            return 'toast://需要传入正确参数'
            break;
    }
}

function createJParse() {
    addListener("onClose", $.toString(() => {
        clearVar('m_token_key');
    }));
    setPageTitle("直链生成免嗅解析");
    var d = [];
    d.push({
        title: "支持json、明码、mao类型生成js免嗅" ,
        col_type: "rich_text",
        extra:{textSize:17}
    });
    d.push({
        col_type: "line_blank"
    });
    function create(Parse,vipUrl,ref) {
        clearMyVar('createJg');
        clearVar('m_token_key');
        if(ref!=""){
            var html = request(Parse + vipUrl, {headers: {'Referer': ref}, timeout:5000});
            var refref = `{headers: {'Referer': '`+ref+`'}, timeout:5000}`;
        } else {
            var html = request(Parse + vipUrl, {timeout:5000});
            var refref = `{timeout:5000}`;
        }
        try{
            let turl = pdfh(html,"iframe&&src");
            if(turl!=""){
                if (/^http/.test(turl)) {
                    Parse = turl.split('=')[0]+'=';
                }else if (!/^\//.test(turl)) {
                    Parse = Parse.replace('?url=','')+turl.split('=')[0]+'=';
                }else{
                    Parse = Parse.match(/http.*?:\/\/[^\/]+/i)[0]+turl.split('=')[0]+'=';
                }
                if(ref!=""){
                    var html = request(Parse + vipUrl, {headers: {'Referer': ref}, timeout:5000});
                } else {
                    var html = request(Parse + vipUrl, {timeout:5000});
                }
            }
        } catch (e) {

        }

        if(typeof(html)!='undefined' && html !=""){
            var url = "";
            var lx = "";
            var JXstr = "";
            try {
                url = JSON.parse(html).url||JSON.parse(html).data.url||JSON.parse(html).data;
                lx = "O";
            } catch (e) {
                //log('不是json解析');
                if(html.indexOf("_token =") != -1){
                    lx = "M";
                    if(ref!=""){
                        refreshX5WebView(ref);
                    } else {
                        refreshX5WebView(Parse + vipUrl);
                    }
                    for (var i=0;i<6;i++)
                    { 
                        if(getVar('m_token_key','')==""){
                            java.lang.Thread.sleep(1000);
                        }
                    }
                    //log(getVar('m_token_key',''));
                    if(getVar('m_token_key','')==""){
                        return "0"; 
                    }
                }else if(/\.m3u8|\.mp4|\.flv/.test(html)){
                    try {
                        lx = "U";
                        if(html.indexOf('urls = "') != -1){
                            url = `html.match(/urls = "(.*?)"/)[1]`;
                        }else if(html.indexOf('"url":"') != -1){
                            url = `html.match(/"url":"(.*?)"/)[1]`;
                        }else if(html.indexOf('id="video" src="') != -1){
                            url = `html.match(/id="video" src="(.*?)"/)[1]`;
                        }else if(html.indexOf('url: "') != -1){
                            url = `html.match(/url: "(.*?)"/)[1]`;
                        }else{
                            lx = "";
                        }
                    } catch (e) {
                        log(e.message);
                        lx = "";
                        return "0";
                    }
                }else{
                    return "0";
                }
            }
            if(lx=="O"){
                JXstr = `★解析名★function (vipUrl) {\n    try {\n        var url = JSON.parse(request('`+Parse+`' + vipUrl,`+refref+`)).url;\n        return url;\n    } catch (e) {\n        return '';\n    }\n}`;
            }else if(lx=="U"){
                JXstr = `★解析名★function (vipUrl) {\n    try {\n        var html = request('`+Parse+`' + vipUrl,`+refref+`);\n        url = `+url+`;\n        return url;\n    } catch (e) {\n        return '';\n    }\n}`;
            }else if(lx=="M"){
                JXstr = `★解析名★function (vipUrl) {\n    try {\n        var url = this.maoss('`+Parse+`' + vipUrl, '`+ref+`', '`+getVar('m_token_key','key')+`');\n        return url;\n    } catch (e) {\n        return '';\n    }\n}`;
            }
            //putMyVar('JXlx',lx); 
            return JXstr;
        }else{
            return "";
        }
    }
    d.push({
        title:'生成',
        col_type: 'input',
        desc: "请输入URL直链形式的地址",
        url: $.toString((create)=>{
            let Parse = getMyVar("UrlParse", "").trim();
            if (!/^http/.test(Parse)) {
                return "toast://解析接口输入不正确";
            }
            let vipUrl = getMyVar("UrlvipUrl", "https://v.qq.com/x/cover/mzc00200jtxd9ap.html").trim();
            if (vipUrl=="") {
                return "toast://视频地址不能为空";
            }
            let ref = getMyVar('UrlReferer', '').trim(); 
            refreshPage(false);
            showLoading('智能生成中...'); 
            let parse = create(Parse,vipUrl,ref);
            hideLoading();
            if(parse!=""){
                    
                if(parse=="0"){
                    refreshPage(false);
                    return "toast://此解析暂不支持生成，或者输入Referer再试一次";
                }else{
                    return $("","生成JS免嗅成功，给起个名字吧").input((parse) => {
                        if(input !=""){
                            parse = parse.replace('解析名',input);
                        }
                        putMyVar('createJg', parse);
                        refreshPage(false);
                    },parse)
                }
            }else{
                refreshPage(false);
                return "toast://此解析无法访问";
            }
        },create),
        extra: {
            titleVisible: true,
            defaultValue: getMyVar('UrlParse', ''),
            onChange: 'putMyVar("UrlParse",input)'
        }
    });
    d.push({
        title:'vipUrl',
        col_type: 'input',
        desc: "视频地址vipUrl",
        extra: {
            titleVisible: false,
            defaultValue: getMyVar('UrlvipUrl', 'https://v.qq.com/x/cover/mzc00200jtxd9ap.html'),
            onChange: 'putMyVar("UrlvipUrl",input)'
        }
    });
    d.push({
        title:'Referer',
        col_type: 'input',
        desc: "根据实际需要输入Referer",
        extra: {
            titleVisible: false,
            defaultValue: getMyVar('UrlReferer', ''),
            onChange: 'putMyVar("UrlReferer",input)'
        }
    });
    d.push({
        title:'结果',
        col_type: 'input',
        desc: "生成结果",
        extra: {
            titleVisible: false,
            type: "textarea",
            height: -1,
            defaultValue: getMyVar('createJg', ''),
        }
    });
    
    d.push({
        desc: '1',
        url: '',
        extra: {
            canBack: false,
            blockRules: ['.m4a', '.mp3', '.mp4', '.m3u8', '.flv', '.avi', '.3gp', '.mpeg', '.wmv', '.mov', '.rmvb', '.gif', '.jpg', '.jpeg', '.png', '.ico', '.svg', '.css'],
            js: $.toString((url) => {
                    //eval(fy_bridge_app.getInternalJs());
                    //fba.log(location.href);
                    if(!location.href.includes("about:blank")){
                        if(!location.href.includes(url)){
                            //fba.log('跳转'+url);
                            location.href=url;
                        }else{
                            try{
                                var key=window.CryptoJS.enc.Utf8.stringify(_token_key);
                                //fba.log(key);
                                fba.putVar('m_token_key', key);
                                fba.parseLazyRule(`hiker://empty@lazyRule=.js:refreshX5WebView('');`);
                            }catch(e){
                                //fba.log(e.message)
                            }
                        }
                    }
                },getMyVar("UrlParse", "").trim()+getMyVar("UrlvipUrl", "").trim()),
            jsLoadingInject: true
        },
        col_type: 'x5_webview_single'
    });

/*
    d.push({
        desc: '200',
        url: 'https://jiexi.f7ys.com/jiexi.php?url=http://www.mgtv.com/b/384019/15861747.html',
        extra: {
            canBack: false,
            referer: 'https://www.haokanju1.cc',//getMyVar('UrlReferer', ''), 
            //blockRules: ['.m4a', '.mp3', '.mp4', '.m3u8', '.flv', '.avi', '.3gp', '.mpeg', '.wmv', '.mov', '.rmvb', '.gif', '.jpg', '.jpeg', '.png', '.ico', '.svg', '.css'],
            js: $.toString(() => {
                        //eval(fy_bridge_app.getInternalJs());
                        try{
                            var key=window.CryptoJS.enc.Utf8.stringify(_token_key);
                            fba.log(key);
                            fba.putVar('m_token_key', key);
                            fba.parseLazyRule(`hiker://empty@lazyRule=.js:refreshX5WebView('');`);
                        }catch(e){
                            fba.log(e.message)
                        }
                    }),
            //jsLoadingInject: true
        },
        col_type: 'x5_webview_single'
    });
    */
    d.push({
        title:'清空',
        col_type:'text_2',
        url:$().lazyRule(()=>{
                clearMyVar('UrlParse');
                clearMyVar('UrlvipUrl');
                clearMyVar('UrlReferer');
                clearMyVar('createJg');
                clearVar('m_token_key');
                refreshPage(true);
                return "toast://已清空";
            })
    });
    if(getMyVar('createJg', '')!=""){
        d.push({
            title:'复制',
            col_type:'text_2',
            url:$().lazyRule(()=>{
                    copy(getMyVar('createJg', ''));
                    return 'hiker://empty'
                })
        });
    }
    d.push({
        desc: '‘‘’’<small><font color=#f20c00>生成不是100%能成功的，仅支持部份类型的解析！</font></small>',
        url: 'toast://哥就是帅，不接受反驳！',
        col_type: 'text_center_1'
    });
    setResult(d);
}
