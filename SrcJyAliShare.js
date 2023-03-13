/*
let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
try{
  var alistData = JSON.parse(fetch(alistfile));
  let jknum = alistData.yunpans.length;
}catch(e){
  var alistData = {};
}
let datalist = alistData.yunpans || [];
let alistconfig = alistData.config || {};
*/
function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码")>-1){
            share_pwd = it.replace('提取码: ','');
        }
        if(it.indexOf("https://www.aliyundrive.com")>-1){
            it = it.replace('https://www.aliyundrive.com/s/','');
            share_id = it.indexOf('/folder/')>-1?it.split('/folder/')[0]:it;
            folder_id = it.indexOf('/folder/')>-1?it.split('/folder/')[1]:"root";
        }
    })
    aliShare(share_id,share_pwd,folder_id);
}

function aliShare(share_id,share_pwd,folder_id) {
    let headers = {
      'content-type': 'application/json;charset=UTF-8',
      "origin": "https://www.aliyundrive.com",
      "referer": "https://www.aliyundrive.com/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
      "x-canary": "client=web,app=share,version=v2.3.1"
    };
    let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { headers:headers,body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 3000 })).share_token;
    let postdata = {"share_id":share_id,"parent_file_id":folder_id||"root","limit":20,"image_thumbnail_process":"image/resize,w_256/format,jpeg","image_url_process":"image/resize,w_1920/format,jpeg/interlace,1","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_256","order_by":"name","order_direction":"DESC"};
    headers['x-share-token'] = sharetoken;
    let sharelist = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers:headers, body: postdata, method: 'POST', timeout: 3000 })).items;
    let d = [];
    sharelist.forEach((item) => {
        if (item.type=="folder") {
            d.push({
                title: item.name,
                img: "hiker://files/cache/src/文件夹.svg",//#noRecordHistory##noHistory#
                url: $("hiker://empty##").rule((share_id,share_pwd,folder_id) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliShare.js');
                    aliShare(share_id,share_pwd,folder_id);
                }, item.share_id, share_pwd, item.file_id),
                col_type: 'avatar',
                extra: {
                    cls: "loadlist"
                }
            })
        } else {
            d.push({
                title: item.name,
                img: item.thumbnail || item.category=="video"?"hiker://files/cache/src/影片.svg":item.category=="audio"?"hiker://files/cache/src/音乐.svg":"",
                url: $("hiker://empty##").lazyRule((share_id,file_id) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
                    let alitoken = alistconfig.alitoken;
                    let play = getAliUrl(share_id, file_id, alitoken);
                    if (play.urls) {
                        return JSON.stringify(play);
                    }
                }, item.share_id, item.file_id),
                col_type: 'avatar'
            })
        }
    })
    setResult(d);
}