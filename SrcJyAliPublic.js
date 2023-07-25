let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
try {
  if(fetch(alistfile)){
    eval("var alistData = " + fetch(alistfile));
  }else{
    var alistData = {};
  }
} catch (e) {
  var alistData = {};
}
let alistconfig = alistData.config || {};
let fileFilter = alistconfig['fileFilter'] == 0 ? 0 : 1;
let audiovisual = alistconfig.contain ? alistconfig.contain.replace(/\./, "") : 'mp4|avi|mkv|rmvb|flv|mov|ts|mp3|m4a|wma|flac';//影音文件
let contain = new RegExp(audiovisual, "i");//设置可显示的影音文件后缀
let music = new RegExp("mp3|m4a|wma|flac", "i");//进入音乐播放器
let image = new RegExp("jpg|png|gif|bmp|ico|svg", "i");//进入图片查看
let transcoding = {UHD: "4K 超清", QHD: "2K 超清", FHD: "1080 全高清", HD: "720 高清", SD: "540 标清", LD: "360 流畅" };
let alitoken = alistconfig.alitoken;
if (!alitoken && getMyVar('getalitoken') != "1") {
  putMyVar('getalitoken', '1');
  try {
    //节约资源，如果有获取过用户信息，就重复利用一下
    let icyfilepath = "hiker://files/rules/icy/icy-ali-token.json";
    let joefilepath = "hiker://files/rules/joe/ali.json";
    let alifile = fetch(icyfilepath);
    if (alifile) {
      let tokenlist = eval(alifile);
      if (tokenlist.length > 0) {
        alitoken = tokenlist[0].refresh_token;
      }
    }
    if (!alitoken) {
      alifile = fetch(joefilepath);
      if (alifile) {
        let token = eval(alifile);
        alitoken = token.refresh_token;
      }
    }
    if (alitoken) {
      alistconfig.alitoken = alitoken;
      alistData.config = alistconfig;
      writeFile(alistfile, JSON.stringify(alistData));
    }
  } catch (e) {
    log('自动取ali-token失败' + e.message);
  }
}
let headers = {
  'content-type': 'application/json;charset=UTF-8',
  "origin": "https://www.aliyundrive.com",
  "referer": "https://www.aliyundrive.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41"
};
let userinfo = {};
if (alitoken) {
  let nowtime = Date.now();
  let oldtime = parseInt(getMyVar('userinfoChecktime', '0').replace('time', ''));
  let aliuserinfo = storage0.getMyVar('aliuserinfo');
  if (aliuserinfo && aliuserinfo.user_id && nowtime < (oldtime + 2 * 60 * 60 * 1000)) {
    userinfo = aliuserinfo;
  } else {
    userinfo = JSON.parse(request('https://auth.aliyundrive.com/v2/account/token', { headers: headers, body: { "refresh_token": alitoken, "grant_type": "refresh_token" }, method: 'POST', timeout: 3000 }));
    storage0.putMyVar('aliuserinfo', userinfo);
    putMyVar('userinfoChecktime', nowtime + 'time');
    alistconfig.alitoken = userinfo.refresh_token;
    alistData.config = alistconfig;
    writeFile(alistfile, JSON.stringify(alistData));
  }
}

function SortList(v1, v2) {
  var a = v1.name;
  var b = v2.name;
  var reg = /[0-9]+/g;
  var lista = a.match(reg);
  var listb = b.match(reg);
  if (!lista || !listb) {
    return a.localeCompare(b);
  }
  for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
    //数字所在位置序号
    var indexa = a.indexOf(lista[i]);
    var indexb = b.indexOf(listb[i]);
    //数字前面的前缀
    var prefixa = a.substring(0, indexa);
    var prefixb = a.substring(0, indexb);
    //数字的string
    var stra = lista[i];
    var strb = listb[i];
    //数字的值
    var numa = parseInt(stra);
    var numb = parseInt(strb);
    //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
    if (indexa != indexb || prefixa != prefixb) {
      return a.localeCompare(b);
    }
    else {
      //数字的string全等
      if (stra === strb) {
        //如果是最后一个数字，比较数字的后缀
        if (i == minLen - 1) {
          return a.substring(indexa).localeCompare(b.substring(indexb));
        }
        //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
        else {
          a = a.substring(indexa + stra.length);
          b = b.substring(indexa + stra.length);
        }
      }
      //如果数字的string不全等，但值相等
      else if (numa == numb) {
        //直接比较数字前缀0的个数，多的更小
        return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
      }
      else {
        //如果数字不等，直接比较数字大小
        return numa - numb;
      }
    }
  }
}

evalPrivateJS('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')
evalPrivateJS('LMUBjarZ5eOGA/z1aks6fNNBHPn4N+xNr5JpUh71s2P9e+J6BhEF12L8JFIfeYrnj+pMPdP2pq4RTyQYWwSCW/sOK+rmBauO+krr6G4ZSFJJip1lnwRp5U0SlNnMPprAKRKZd4Xc8EjVNXtU52rrJyvTslFW+6IB6F7e+ZQcMLUaqWsEiqekcWERkauvRTo82E9FCWCToNkSocKnAog109gHJpRyC8vyMnXfyzvM3hXRE4DP9j8Wf+lkHsvPADRYGlMSM86YzsGPGMrinusmZhtq512Ahuji0YLOrCjDMzf/NwghsA0Hxb7dycAQ5nrt/f+WcVWvNzpq3WU9GFxPANzOe+4V3SV12rYacxfR5+XGTUjUFvzUqXDoIy5HAEzV83O62M7p0qL+E/rrq6SrNLHkBzEPbNHlmF1APsj9KgGIEtfHmCYIrmM6UAnsfraXti/L1WBHk2scP8Sy9nluAJZ0NFCkUNRt97DCr2Iiu5/sLjhXjCAhglvL52p6K0Jot3UBtfRZkBaWcyB2QazQCr3VaBUdvtmG0d3Shf8X7SgMwNHObnG6GR2a/YUBjnaxts6BjzYiSNv9R5/zExdFFr0WILdCk+3+Jri40/XWxNAVKD69/zXFEQD/eiLwiyYpM/rOwMCCsEWSTKozGHXzdIA//kEOUX3pTgEGRfk7e6dTptDZu3sjVdOExCG9S+7rOiy+O5z69fiL2kQtFWjVbvZPrhzoWyhTSfA7Q3zFtBmXQ+h6KrkEbcZW7x5QYqH32hClG4LJph+8f/4njFniNnGo5ihco9+0gaQK6XaY4o8HvtUM261ox3hzZB4k/iEIr+BuBU5iNA99GujAQtZ7eUjoS2SFAvPRZyV0dki9bDQYtG2wIP9SDdOVHFjtG4IoM4mWphrEMdCZr2n/Hfhixc4EVwQzflbPaw9GlytCabS6lTpKjJfHTYojK0+4XLBWxMWKTXGWQrhh0YzVSLy7yBTQHyGlIiPdwQ24QKWkVlq5UYRBCaqhZUhCkLNRV0qqepc215u0pd5yGMmopIDkSQSDtQgzT1k2IJfV0oNzfSL5cbTY5jjIJYCoKtKgMRnbXYd7KatHeOlodWKScxekMptZ5+ksl087btqD6P+DySZpw+DKfxDFaVu3bqNH/IJCcWzQpzMchsh2KRgOaK8CX7Ebxe3JeWyY159pgDTr7ChtFlU5gqlpBe3K6NDUKhQtaavISc0dqyV0OIpu2dH7wzMH7jxEwtRxTcvcmIymdsbw/10c3/ZMBF8OzuSBeKIRn63gPrIJZ3udFLGEAiGMA4z2v9c1fhIjcwI4MZAsBY/m9t74/8rBpcGwGrDxgc7kFYJCQ4PQcLr+34tjE3qnmGvC4ly8nx0r7xJVpKjMfAT80XpJAguQX6t5u0EJAbAKMdpjeNsdwAtZSEP4kejrQfGc4TiyezUOexy7awqQBMC86AX2GyV5H+q6Rc76n+NlAalHLx514FWYXR+7zEJagq/TKTobf5Fn5KO8b2XO0nleVwy56S+SLaYug3dZeZwVB4VPjcY5xqKDTA27yCB0pxfdLeJPTxSQRuSccRwhvdB6S3xNQOXLi/1R489eA0TZOttEmPS6qr8nTDjhMyViK5qHASp9I0/4ANBz0IV4+FGyW2+Xqob5Es6lYwA5Y0wORLd7FHgTVCezXO9vJs6LYfoAWOy4LHPRh3jFKMw5iJxEpMmjVlt7egB5vZafEACUDZ7+1kd4zo4qEbMCpapRNv3o+YeaviddZVSOBPcnOdVnL11wyZiKhvkMoHbUMh7S6kMWobRKkGrMavKzJXhlPN7jbBo++jZbAPQ2sSsEArGK5rupc1DPblPZ1jopKePghdGUf8HJImHQJT3X5Ey0iA==')
function getAliUrl(share_id, file_id, share_pwd) {
  try {
    let urls = [];
    let names = [];
    let heads = [];
    let u = startProxyServer($.toString((share_id,file_id,share_pwd,config) => {
      function geturl(fileid,line){
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliPublic.js');
        let playUrlList = aliSharePlayUrl(share_id,fileid,share_pwd) || [];
        let aliurl;
        playUrlList.forEach((item) => {
          if(item.template_id == line){
            aliurl = item.url;
            //JSON.parse(request(item.url, { headers: { 'Referer': 'https://www.aliyundrive.com/' }, onlyHeaders: true, redirect: false, timeout: 3000 })).headers.location[0];
          }
        })
        //上面是获取阿里的播放地址
        //log("我在代理" + aliurl);
        let home = aliurl.split('media.m3u8')[0];
        let f = fetch(aliurl, { headers: { 'Referer': 'https://www.aliyundrive.com/' }, timeout: 3000}).split("\n");
        let ff = f.map(it => {
            if (it.startsWith("media-")) {
                return "/proxy?url=" + base64Encode(home+it);
            }
            return it;
        }).join("\n");
        //log('ufid-'+fileid);
        writeFile('hiker://files/cache/_fileSelect_'+fileid+'.m3u8',ff);
        return ff;
      }
      let url = base64Decode(MY_PARAMS.url);
      if(url.includes(".ts")){
        let fid = url.split('&f=')[1].split('&')[0];
        //log('sfid-'+fid);
        let f = fetch('hiker://files/cache/_fileSelect_'+fid+'.m3u8').split("\n");
        f.forEach(it => {
          if(it&&it.startsWith('/proxy?url=')){
            let furl = base64Decode(it.replace('/proxy?url=',''));
            if(url.substr(url.indexOf('/media-'),url.indexOf('.ts')) == furl.substr(furl.indexOf('/media-'),furl.indexOf('.ts'))){
              url = furl;
            }
          }
        })
        let expires = url.split('x-oss-expires=')[1].split('&')[0];
        const lasttime = parseInt(expires) - Date.now() / 1000;
        if(lasttime < 40){
          //log('过期更新')
          let line  = url.split('/media')[0];//取之前播放的ts段线路
          line = line.substring(line.lastIndexOf('/')+1);
          let f = geturl(fid,line).split("\n");
          f.forEach(it => {
            if(it&&it.startsWith('/proxy?url=')){
              let furl = base64Decode(it.replace('/proxy?url=',''));
              if(url.substr(url.indexOf('/media-'),url.indexOf('.ts')) == furl.substr(furl.indexOf('/media-'),furl.indexOf('.ts'))){
                url = furl;
              }
            }
          })

        }else{
          //log('未过期')
          //log("代理ts：" + url);
        }
        return JSON.stringify({
              statusCode: 302,
              headers: {
                  "Location": url,
                  'Referer': 'https://www.aliyundrive.com/'
              }
          });
      }else{
        //log('首次更新')
        let line  = url.split('|')[1];
        let ff = geturl(file_id,line);
        return ff;
      }
    },share_id,file_id,share_pwd,config));
    if(getItem('aliyun_playMode', '智能')=="智能" || getItem('aliyun_playMode')=="原画"){
      let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 3000 })).share_token;
      let openUrl = aliOpenPlayUrl(file_id,{sharetoken:sharetoken,share_id:share_id});
      if(openUrl){
        urls.push(openUrl + "#isVideo=true##pre#");
        names.push("原始 画质");
        heads.push({ 'Referer': 'https://www.aliyundrive.com/' });
      }else{
        log('获取开放接口原画播放地址失败');
      }
    }
    if((getItem('aliyun_playMode', '智能')=="智能" && urls.length==0) || getItem('aliyun_playMode')=="转码"){
      let playUrlList = aliSharePlayUrl(share_id,file_id,share_pwd) || [];
      if(playUrlList.length>0){
        playUrlList.forEach((item) => {
          urls.push(u + "?url=" + base64Encode(item.url+"|"+item.template_id) + "#.m3u8#pre#");
          names.push(transcoding[item.template_id] ? transcoding[item.template_id] : item.template_height);
          heads.push({ 'Referer': 'https://www.aliyundrive.com/' });
        })
      }else{
        log('未获取阿里播放地址，建议重进软件再试一次')
      }
    }
    return {
        urls: urls,
        names: names,
        headers: heads
    };
  } catch (e) {
    log('获取共享链接播放地址失败>' + e.message);
    return {};
  }
}
function getSubtitle(share_id,sub_file_id,share_pwd){
    try{
        share_pwd = share_pwd&&share_pwd.length==4?share_pwd:"";
        let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 3000 })).share_token;
        headers["authorization"] = userinfo.access_token;
        headers["x-share-token"] = sharetoken;
        let data = {"expire_sec":600,"file_id":sub_file_id,"share_id":share_id};
        let downurl = JSON.parse(request("https://api.aliyundrive.com/v2/file/get_share_link_download_url", { headers: headers, body: data, timeout: 3000 })).download_url;
        let subfile = 'hiker://files/_cache/subtitles/'+sub_file_id+'.srt';
        downloadFile(downurl, subfile, {"referer": "https://www.aliyundrive.com/"})
        if(fetch(subfile)){
            return getPath(subfile);
        }else{
            return "";
        }
    }catch(e){
        log('获取字幕失败>'+e.message);
    }
    return "";
}

function aliMyPlayUrl(file_id) {
  try {
    let authorization = 'Bearer ' + userinfo.access_token;
    let deviceId = userinfo.device_id;
    let userId = userinfo.user_id;
    let drive_id = userinfo.default_drive_id;
    headers['authorization'] = authorization;
    headers['x-device-id'] = deviceId;
    let aliecc = createsession(headers,deviceId,userId);
    let aliyunUrl = [];
    if(aliecc.success){
      headers['x-signature'] = aliecc.signature;
      let data = { "drive_id": drive_id, "file_id": file_id, "category": "live_transcoding", "template_id": "", "get_subtitle_info": true }
      let json = JSON.parse(request('https://api.aliyundrive.com/v2/file/get_video_preview_play_info', { headers: headers, body: data, method: 'POST', timeout: 3000 }));
      aliyunUrl = json.video_preview_play_info.live_transcoding_task_list;
      aliyunUrl.reverse();
    }
    let urls = [];
    let names = [];
    let heads = [];
    if (aliyunUrl.length > 0) {
      aliyunUrl.forEach((item) => {
        urls.push(item.url + "#pre#");
        names.push(transcoding[item.template_id] ? transcoding[item.template_id] : item.template_height);
        heads.push({ 'Referer': 'https://www.aliyundrive.com/' });
      })
    } else {
      log('未获取阿里转码播放地址，建议重进软件再试一次')
    }
    let file_url = aliOpenPlayUrl(file_id);
    if(file_url){
      urls.unshift(file_url+ "#isVideo=true##pre#");
      names.unshift("原始 画质");
      heads.unshift({'Referer':'https://www.aliyundrive.com/'});
    }else{
      clearMyVar('aliopeninfo');
    }
    return {
      urls: urls,
      names: names,
      headers: heads
    };
  } catch (e) {
    log('获取我的云盘播放地址失败>' + e.message);
    return { message: '获取我的云盘播放地址失败>' + e.message };
  }
}

function aliOpenPlayUrl(file_id,sharedata) {
  try {
    function getopentoken(authorization) {
      headers['authorization'] = authorization;
      headers['x-canary'] = "client=web,app=adrive,version=v4.3.1";
      let data = {"authorize":"1","scope":"user:base,file:all:read,file:all:write"}
      let json = JSON.parse(request('https://open.aliyundrive.com/oauth/users/authorize?client_id=76917ccccd4441c39457a04f6084fb2f&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state=', { headers: headers, body: data, method: 'POST', timeout: 3000 }));
      let code = json.redirectUri.split("code=")[1];
      let data2 = {"code":code,"grant_type":"authorization_code"}
      let json2;
      try{
        json2 = JSON.parse(request('https://api-cf.nn.ci/alist/ali_open/code', { body: data2, method: 'POST', timeout: 3000 }));
      } catch(e) {
        json2 = JSON.parse(request('https://api.xhofe.top/alist/ali_open/code', { body: data2, method: 'POST', timeout: 3000 }));
      }
      return json2.access_token || "";
    }
    function copy(obj) {
        try {
            let json = fetch('https://api.aliyundrive.com/adrive/v2/batch', {
                headers: {
                    'User-Agent': PC_UA,
                    'Referer': 'https://www.aliyundrive.com/',
                    'authorization': obj.authorization,
                    'x-canary': 'client=web,app=share,version=v2.3.1',
                    'x-share-token': obj.sharetoken
                },
                body: {
                    "requests": [{
                        "body": {
                            "file_id": obj.file_id,
                            "share_id": obj.share_id,
                            "auto_rename": true,
                            "to_parent_file_id": "root",
                            "to_drive_id": obj.drive_id
                        },
                        "headers": {"Content-Type": "application/json"},"id": "0","method": "POST","url": "/file/copy"
                    }],
                    "resource": "file"
                },
                method: 'POST'
            });
            log(json);
            return JSON.parse(json).responses[0].body.file_id;
        } catch (e) {
            return "";
        }
    };
    function del(obj) {
        fetch('https://api.aliyundrive.com/adrive/v2/batch', {
            headers: {
                'User-Agent': PC_UA,
                'Referer': 'https://www.aliyundrive.com/',
                'authorization': obj.authorization,
                'x-canary': 'client=web,app=share,version=v2.3.1',
                'x-share-token': obj.sharetoken
            },
            body: {
                "requests": [{
                    "body": {
                        "drive_id": obj.drive_id,
                        "file_id": obj.file_id
                    },
                    "headers": {"Content-Type": "application/json"},
                    "id": obj.file_id,
                    "method": "POST",
                    "url": "/file/delete"
                }],
                "resource": "file"
            },
            method: 'POST'
        });
    }
    let authorization = 'Bearer ' + userinfo.access_token;
    let drive_id = userinfo.default_drive_id;
    let newfile_id;
    if(sharedata){
      sharedata.file_id = file_id;
      sharedata.drive_id = drive_id;
      sharedata.authorization = authorization;
      newfile_id = copy(sharedata);
      if(!newfile_id){
        return "";
      }
    }
    let opentoken;
    let nowtime = Date.now();
    let oldtime = parseInt(getMyVar('opentokenChecktime', '0').replace('time', ''));
    let aliopentoken = getMyVar('aliopentoken');
    if (aliopentoken && nowtime < (oldtime + 1 * 60 * 60 * 1000)) {
      opentoken = aliopentoken;
    } else {
      opentoken = getopentoken(authorization);
      putMyVar('aliopeninfo', opentoken);
      putMyVar('opentokenChecktime', nowtime + 'time');
    }
    headers['authorization'] = 'Bearer ' + opentoken;
    let data3 = {"drive_id":drive_id,"file_id":newfile_id||file_id}
    let json3 = JSON.parse(request('https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl', { headers: headers, body: data3, method: 'POST', timeout: 3000 }));
    if (newfile_id) {
        sharedata.file_id = newfile_id;
        del(sharedata);
    }
    return json3.url || "";
  } catch (e) {
    log('获取我的云盘开放原画播放地址失败>' + e.message);
  }
  return "";
}
//evalPrivateJS('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')
//evalPrivateJS('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')
//evalPrivateJS('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')