function 聚阅(vipUrl) {
    if (vipUrl.indexOf("https://www.aliyundrive.com") > -1) {
        aliparse(vipUrl);
    }
}

function aliparse(input){
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
    aliShareUrl(input);
}

function aliShare(share_id, folder_id, share_pwd) {
    let d = [];
    //setPageTitle(typeof(MY_PARAMS)!="undefined" && MY_PARAMS.dirname ? MY_PARAMS.dirname : '云盘共享文件 | 聚影√');
    share_pwd = share_pwd || "";
    try{
        let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { headers: headers, body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 15000 })).share_token;
        let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": "name", "order_direction": "DESC" };
        headers['x-share-token'] = sharetoken;
        let sharelist = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' })).items;
        if(sharelist.length>0){
            if(!userinfo.nick_name){
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
            }
            d.push({
                title: "💾保存到我的云盘☁️",
                url: "smartdrive://share/browse?shareId="+share_id+"&sharePwd="+share_pwd,
                col_type: 'text_center_1'
            })
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
                    col_type: 'avatar',
                    extra: {
                        dirname: item.name
                    }
                })
            })
            let filelist = sharelist.filter((item) => {
                return item.type == "file";
            })
            filelist.sort(SortList);
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
                                return "toast://获取转码播放列表失败，阿里token无效";
                            }
                        }, item.share_id, item.file_id, sub_file_id||"", share_pwd),
                        desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize/1024).toFixed(2) + 'GB',
                        col_type: 'avatar',
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
        }else{
            toast('列表为空');
        }
    }catch(e){
        d.push({
            title: '来晚啦，该分享已失效',
            url: 'hiker://empty##',
            col_type: "text_center_1"
        })
        toast('该分享已失效或超时，可刷新确认下');
    }
    setResult(d);
    setLastChapterRule('js:' + $.toString(()=>{
        setResult('');
    }))
}