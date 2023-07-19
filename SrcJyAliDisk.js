//引入Ali公用文件
require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliPublic.js');

function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace('提取码: ', '');
        }
        if (it.indexOf("https://www.aliyundrive.com") > -1) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    aliShare(share_id, folder_id, share_pwd);
}

function myDiskMenu(islogin){
    let setalitoken = $().lazyRule((alistfile, alistData) => {
        let alistconfig = alistData.config || {};
        let alitoken = alistconfig.alitoken;
        return $(alitoken||"","refresh_token").input((alistfile,alistData,alistconfig)=>{
            alistconfig.alitoken = input;
            alistData.config = alistconfig;
            writeFile(alistfile, JSON.stringify(alistData));
            clearMyVar('getalitoken');
            refreshPage(false);
            return "toast://已设置";
        },alistfile,alistData,alistconfig)
    }, alistfile, alistData)

    let onlogin = [{
        title: userinfo.nick_name,
        url: setalitoken,
        img: userinfo.avatar,
        col_type: 'avatar'
    },{
        col_type: "line"
    }];
    let nologin = [{
        title: "⚡登录获取token⚡",
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            let d = [];
            let url = 'https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login'
            let js = $.toString(() => {
                const tokenFunction = function () {
                    var token = JSON.parse(localStorage.getItem('token'))
                    if (token && token.user_id) {
                        let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
                        if(fy_bridge_app.fetch(alistfile)){
                            eval("var alistData = " + fy_bridge_app.fetch(alistfile));
                        }else{
                            var alistData = {};
                        }
                        let alistconfig = alistData.config || {};
                        alistconfig.alitoken = token.refresh_token;
                        alistData.config = alistconfig;
                        fy_bridge_app.writeFile(alistfile, JSON.stringify(alistData));
                        localStorage.clear();
                        fy_bridge_app.back(true);
                        alert('TOKEN获取成功，请勿泄漏！');
                        //fy_bridge_app.parseLazyRule(`hiker://empty@lazyRule=.js:refreshX5WebView('');`);
                        //fy_bridge_app.back();
                        return;
                    } else {
                        token_timer();
                    }
                }
                var token_timer = function () {
                    setTimeout(tokenFunction, 300)
                };
                tokenFunction();
            })
            d.push({
                url: url,
                col_type: 'x5_webview_single',
                desc: '100%&&float',
                extra: {
                    canBack: true,
                    js: js,
                    urlInterceptor: $.toString(() => true)
                }
            })
            setResult(d);
        }),
        col_type: 'text_center_1'
    },{
        title: "⭐手工填写token⭐",
        url: setalitoken,
        col_type: 'text_center_1'
    }]
    if(islogin){
        return onlogin;
    }else{
        return nologin;
    }
}
function aliShare(share_id, folder_id, share_pwd) {
    let d = [];
    setPageTitle(typeof(MY_PARAMS)!="undefined" && MY_PARAMS.dirname ? MY_PARAMS.dirname : '云盘共享文件 | 聚影√');
    share_pwd = share_pwd || "";
    try{
        let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { headers: headers, body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 6000 })).share_token;
        let orders = {
            名称正序: 'name#ASC',
            名称倒序: 'name#DESC',
            时间正序: 'updated_at#ASC',
            时间倒序: 'updated_at#DESC',
            聚影排序: 'name#DESC'
        };
        let ordersKeys = Object.keys(orders);
        let orderskey = orders[getItem('aliyun_order', '聚影排序')];
        let style = getItem('aliyun_style', 'avatar');
        let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
        headers['x-share-token'] = sharetoken;
        let sharelist = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' })).items;
        if(sharelist.length>0){
            if(!userinfo.nick_name){
                d = d.concat(myDiskMenu(0));
                /*
                d.push({
                    title: "⚡登录我的云盘☁️",
                    url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                        addListener("onClose", $.toString(() => {
                            refreshPage(false);
                        }));
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        let d = myDiskMenu(0);
                        setResult(d);
                    }),
                    col_type: 'text_center_1'
                })
                */
            }else{
                /*
                d.push({
                    title: "💾保存到我的云盘☁️",
                    url: "smartdrive://share/browse?shareId="+share_id+"&sharePwd="+share_pwd,
                    col_type: 'text_center_1'
                })
                */
                d.push(
                    {
                        title: getItem('aliyun_style', 'avatar'),
                        url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar']).select(() => {
                        setItem('aliyun_style', input);
                        refreshPage();
                        return 'toast://已切换';
                        }),
                        col_type: 'icon_round_small_4',
                        img: 'https://hikerfans.com/img/ali_icon.svg',
                    },
                    {
                        title: getItem('aliyun_order', '聚影排序'),
                        url: $(ordersKeys, 2).select(() => {
                        setItem('aliyun_order', input);
                        refreshPage();
                        return 'toast://切换成功';
                        }),
                        col_type: 'icon_round_small_4',
                        img: 'https://hikerfans.com/img/ali_sort.svg',
                    },
                    {
                        title: getItem('aliyun_playMode', '智能') + '播放',
                        url: $(['转码', '原画', '智能']).select(() => {
                        setItem('aliyun_playMode', input);
                        refreshPage();
                        return 'toast://切换成功';
                        }),
                        col_type: 'icon_round_small_4',
                        img: 'https://hikerfans.com/img/ali_play.svg',
                    },
                    {
                        title: '转存网盘',
                        url: `smartdrive://share/browse?shareId=${share_id}&sharePwd=${share_pwd}`,
                        col_type: 'icon_round_small_4',
                        img: 'https://hikerfans.com/img/ali_fileinto.svg',
                    },
                    {
                        col_type: 'line_blank',
                    }
                )
                let sublist = sharelist.filter(item => {
                    return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                })
                let dirlist = sharelist.filter((item) => {
                    return item.type == "folder";
                })
                dirlist.forEach((item) => {
                    d.push({
                        title: item.name,
                        img: "hiker://files/cache/src/文件夹.svg",//#noRecordHistory##noHistory#
                        url: $("hiker://empty##https://www.aliyundrive.com/s/"+item.share_id+(item.file_id?"/folder/"+item.file_id:"")).rule((share_id, folder_id, share_pwd) => {
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                            aliShare(share_id, folder_id, share_pwd);
                        }, item.share_id, item.file_id, share_pwd),
                        col_type: style,
                        extra: {
                            dirname: item.name
                        }
                    })
                })
                let filelist = sharelist.filter((item) => {
                    return item.type == "file";
                })
                if(getItem('aliyun_order','聚影排序')=="聚影排序"){
                    filelist.sort(SortList);
                }
                filelist.forEach((item) => {
                    if (item.category == "video") {
                        let sub_file_id;
                        if (sublist.length == 1) {
                            sub_file_id = sublist[0].file_id;
                        } else if (sublist.length > 1) {
                            sublist.forEach(it => {
                                let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g,'');
                                if (item.name.includes(subnmae)) {
                                    sub_file_id = it.file_id;
                                }
                            })
                        }
                        let filesize = item.size/1024/1024;
                        d.push({
                            title: item.name,
                            img: item.thumbnail || (item.category == "video" ? "hiker://files/cache/src/影片.svg" : item.category == "audio" ? "hiker://files/cache/src/音乐.svg" : item.category == "image" ? "hiker://files/cache/src/图片.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png"),
                            url: $("hiker://empty##").lazyRule((share_id, file_id, sub_file_id, share_pwd) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliPublic.js');
                                let play = getAliUrl(share_id, file_id, share_pwd);
                                if (play.urls) {
                                    let subtitle;
                                    if (sub_file_id) {
                                        subtitle = getSubtitle(share_id, sub_file_id, share_pwd);
                                    }
                                    if (subtitle) {
                                        play['subtitle'] = subtitle;
                                    }
                                    return JSON.stringify(play);
                                }else{
                                    return "toast://获取播放列表失败，看日志有无异常或token无效";
                                }
                            }, item.share_id, item.file_id, sub_file_id||"", share_pwd),
                            desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize/1024).toFixed(2) + 'GB',
                            col_type: style,
                            extra: {
                                id: item.file_id
                            }
                        })
                    }
                })
                d.push({
                    title: "““””<small><font color=#f20c00>已开启文件过滤，仅显示视频文件</font></small>",
                    url: "hiker://empty",
                    col_type: "text_center_1"
                })
            }
        }else{
            toast('列表为空');
        }
    }catch(e){
        d.push({
            title: '该分享已失效或异常',
            url: 'hiker://empty##',
            col_type: "text_center_1"
        })
        toast('该分享已失效或异常，可刷新确认下');
    }
    setResult(d);
    setLastChapterRule('js:' + $.toString(()=>{
        setResult('');
    }))
}
//evalPrivateJS('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')
evalPrivateJS('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')
evalPrivateJS('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')