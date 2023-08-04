//修正按钮元素
function toerji(item,info) {
    info = info || storage0.getMyVar('一级源接口信息');
    let extra = item.extra || {};
    extra.name = extra.name || extra.pageTitle || (item.title?item.title.replace(/‘|’|“|”|<[^>]+>/g,""):"");
    extra.img = extra.img || item.pic_url || item.img;
    extra.stype = info.type;
    extra.pageTitle = extra.pageTitle || extra.name;
    if(item.url && !/js:|select:|\(|\)|=>|@|toast:/.test(item.url)){
        extra.surl = item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
        extra.sname = info.name;
    }
    if((item.col_type!="scroll_button") || item.extra){
        item.extra = extra;
    }
    item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
        require(config.依赖);
        erji();
    }):item.url
    return item;
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcSimple.js');
    return PYStr(str,x);
}
//写接口数据临时缓存
function cacheData(jkdata){
    let fileid = jkdata.type + '_'+ jkdata.name;
    let cachefile = `hiker://files/_cache/${fileid}.json`;
    if (!fileExist(cachefile)) {
        writeFile(cachefile,JSON.stringify(jkdata));
    }
}
//来自阿尔法大佬的主页幻灯片
function banner(start, arr, data, cfg){
    let id = 'juyue';
    let rnum = Math.floor(Math.random() * data.length);
    let item = data[rnum];
    putMyVar('rnum', rnum);
    let time = 5000;
    let col_type='pic_1_card';
    let desc='';
    if (cfg != undefined) {
        time = cfg.time ? cfg.time : time;
        col_type=cfg.col_type?cfg.col_type:col_type;
        desc=cfg.desc?cfg.desc:desc;
    }
    arr.push({
        col_type: col_type,
        img: item.img,
        desc:desc,
        title: item.title,
        url: item.url,
        extra: {
            id: 'bar',
        }
    })
    if (start == false || getMyVar('benstart', 'true') == 'false') {
        unRegisterTask(id)
        return
    }
    let obj = {
        data: data,
        method: config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js',
        info: storage0.getMyVar('一级源接口信息')
    };
    registerTask(id, time, $.toString((obj) => {
        var data = obj.data;
        var rum = getMyVar('rnum');
        var i = Number(getMyVar('banneri', '0'));
        if (rum != '') {
            i = Number(rum) + 1
            clearMyVar('rnum')
        } else {
            i = i + 1;
        }
        if (i > data.length - 1) {
            i = 0
        }
        var item = data[i];
        try {
            require(obj.method);
            updateItem('bar', toerji(item,obj.info));
        } catch (e) {
            log(e.message)
            unRegisterTask('juyue')
        }
        putMyVar('banneri', i);
    }, obj))
}
//图片压缩
function imageCompress(imgurl,fileid) {
    function compress(path, topath) {
        if (!path) {
            return false;
        }
        let tmpfile = "hiker://files/_cache/1.txt";
        if (!fileExist(tmpfile)) {
            writeFile(tmpfile, '');
        }
        const Bitmap = android.graphics.Bitmap;
        const BitmapFactory = android.graphics.BitmapFactory;
        const FileOutputStream = java.io.FileOutputStream;
        let options = new BitmapFactory.Options();
        options.inSampleSize = 3;
        options.inPurgeable = true;
        let bitmap;
        if (topath && typeof path === "object" && path.getClass) {
            bitmap = BitmapFactory.decodeStream(path, null, options);
            closeMe(path);
        } else {
            bitmap = BitmapFactory.decodeFile(path, options);
            topath = topath || path;
        }
        let os = new FileOutputStream(topath);
        let s = false;
        try {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, os);
            s = true;
        } catch (e) {
            log(e.toString());
        }
        os.flush();
        os.close();
        return s;
    }
    function getName(path) {
        const File = java.io.File;
        return new File(path).getName() + "";
    }
    let f = fetch(imgurl, {
        inputStream: true
    });
    let newpath = "/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/_cache/"+(fileid||"")+"_"+getName(imgurl);
    compress(f, newpath); 
    return "file://"+newpath;   
}
