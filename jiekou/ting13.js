let yidata = {
    "作者": "",
    "页码": {"分类":1, "排行":0, "更新":1},
    "主页": function () {
        let d = [];
        MY_URL = 公共.host;
        let html = request(MY_URL);
        let blist = pdfa(html, '.focusBox&&ul&&li').map(it=>{
            let url = pd(it,'a&&href');
            let title = pdfh(it,'img&&alt');
            let img = pdfh(it,'img&&data-original');
            return {
                title: title,
                img: img,
                url: url
            }
        })
        require($.require('config').method);
        banner(true, d, blist,{col_type:'card_pic_1',desc:'0',time:5000})
        var Label_set = pdfa(html, 'body&&.list')
        Label_set.forEach((data) => {
            d.push({
                title: pdfh(data, 'h2&&Text'),
                col_type: "rich_text"
            });
            var item = pdfa(data, 'ul&&li');
            item.forEach((datas) => {
                d.push({
                    title: pdfh(datas, 'a&&figcaption&&Text'),
                    desc: pdfh(datas, 'a&&.score&&Text'),
                    pic_url: pdfh(datas, 'a&&img&&data-original'),
                    col_type: "movie_3_marquee",
                    url: pd(datas, 'a&&href')
                });
            });
        });
        return d;
    },
    "分类": function () {
        let d = [];
        var 当前页 = getParam('page') || "1";
        var 类别 = MY_RULE.title + "类别";
        var 类别名 = getMyVar(类别, 公共.host+"/yousheng/xuanhuan/lastupdate.html");
        var 排序 = MY_RULE.title + "排序"
        var 排序名 = getMyVar(排序, "lastupdate");
        var class_Name = MY_RULE.title + "分类";
        if (当前页 == 1) {
            if (!getMyVar(class_Name)) {
                var codes = request(公共.host+"/book/");
                putMyVar(class_Name, codes)
            }else{
                var codes = getMyVar(class_Name)
            }
            var 分类项1 = pdfa(codes, '.module&&.pd-module-box&&dl&&dd').map((data) => {
                var 项数据 = {};
                项数据.title = pdfh(data, 'a&&Text')
                项数据.bs = 公共.host+pdfh(data, 'a&&href')
                项数据.sz = 项数据.bs == 类别名 ? true : false;
                return 项数据;
            })
            var 分类项2 = pdfa(codes, '.module&&.pd-module-box,1&&dl&&dd').map((data) => {
                var 项数据 = {};
                项数据.title = pdfh(data, 'a&&Text')
                项数据.bs = 公共.host+pdfh(data, 'a&&href')
                项数据.sz = 项数据.bs == 类别名 ? true : false;
                return 项数据;
            })
            function List_of_options(数据源, 赋值名) {
                d.push({
                    col_type: 'blank_block'
                });
                数据源.forEach((data) => {
                    var title = data.title;
                    if (data.sz||getMyVar(排序, "lastupdate")==data.bs) {
                        title = '““””<b><font color=#FA7298>' + title + '</font></b>';
                    }
                    var url_qz = $("#noLoading#").lazyRule((list_name, Url) => {
                        putMyVar(list_name, Url)
                        refreshPage(false);
                        return "hiker://empty"
                    }, 赋值名, data.bs)
                    d.push({
                        title: title,
                        url: url_qz,
                        col_type: "scroll_button"
                    });
                })
            }
            List_of_options(分类项1, 类别);
            List_of_options(分类项2, 类别);
            let 排序项 = [{title:"新书",bs:"postdate",id:"2"},{title:"最新",bs:"lastupdate",id:"1"},{title:"人气",bs:"allvisit",id:"3"}]
            List_of_options(排序项, 排序);
            var 排序index = 排序项.filter(d => d.bs==排序名)[0].id;
        }
        eval(pdfh(fetch(/html/.test(类别名)?类别名.match(/http(s)?:\/\/.*\//)[0]+排序名+'.html':类别名+"/"+排序index+"/1"),'body&&script&&Html'))
        let json = JSON.parse(request(公共.host+'/api/ajax/list', { body: "token="+_API_KEYS+"&time="+_API_TI+"&sort="+__API_SORT+"&key="+__API_KEY+"&order="+__API_ORDER+"&page="+page, method: 'POST'})).list;
        json.forEach((data) => {
            d.push({
                title: data.novel.name+'\n““””<small>'+data.novel.lastname+'</small>',
                desc: data.novel.intro,
                pic_url: data.novel.cover + "@Referer=",
                col_type: "movie_1_vertical_pic",
                url: 公共.host+data.novel.url,
                extra: {
                    name: data.novel.name
                }
            });
        })
        return d;
    },
    "更新": function() {
        let d = [];
        let list_url = "lastupdate";
        let code = JSON.parse(request("https://m.ting13.com/api/ajax/toplist?sort=1&type="+list_url+"&page="+page));
        code.forEach((data) => {
            d.push({
                title: data.novel.name,
                desc: '🎧 ' + data.data.allvisit,
                url: 公共.host + data.novel.url,
                img: data.novel.cover,
                col_type: 'movie_3'
            });
        });
        return d;
    },
    "排行": function() {
        let d = [];
        let list_name = MY_RULE.title + "排行榜";
        let list_url = getMyVar(list_name, "allvisit");
        let paihang_name = ["人气榜","收藏榜","推荐榜","新书榜","更新榜","下载榜"];
        let paihang_id = ["allvisit","marknum","votenum","postdate","lastupdate","downnum"];
        paihang_id.forEach((data,i) => {
            let title = paihang_name[i];
            let url_qz = $("#noLoading#").lazyRule((list_name, data) => {
                putMyVar(list_name, data)
                refreshPage(false);
                return "hiker://empty"
            }, list_name, data)
            if (data==list_url) {
                setPageTitle(title);
                title = '““””<b><font color=#FA7298>' + title + '</font></b>';
            }
            d.push({
                title: title,
                url: url_qz,
                col_type: "scroll_button"
            });
        });
        let code = JSON.parse(request("https://m.ting13.com/api/ajax/toplist?sort=1&type="+list_url+"&page=1"));
        code.forEach((data) => {
            d.push({
                title: data.novel.name,
                desc: '🎧 ' + data.data.allvisit,
                url: 公共.host + data.novel.url,
                img: data.novel.cover,
                col_type: 'movie_3'
            });
        });
        return d;
    }
}

let erdata = {
    "作者": "",
    "搜索": function (name,page) {
        let d = [];
        let ssurl = 公共.host+"/api/ajax/solist?word="+name+"&type=name&page="+page+"&order=1";
        let code = JSON.parse(request(ssurl)).data;
        code.forEach(item => {
            if (item.novel.name.includes(name)) {
                d.push({
                    title: item.novel.name,
                    desc: item.novel.lastname,
                    content: item.novel.intro,
                    pic_url: item.novel.cover + "@Referer=",
                    url: 公共.host + item.novel.url
                });
            }
        });
        return d;
    },
    "二级": function(surl) {
        let html = request(surl, {timeout:8000});
        let 作者 = pdfh(html, '.book-cell&&.book-rand-a,2&&Text');
        let 分类 = pdfh(html, '.book-cell&&.book-rand-a,0&&Text');
        let 更新 = pdfh(html, '.book-cell&&.book-rand-a,4&&Text');
        let 播音 = pdfh(html, '.book-cell&&.book-rand-a,3&&Text');
        let 简介 = pdfh(html, '.ellipsis&&Text');
        let detail1 = "作者："+作者+"\n"+"分类："+分类;
        let detail2 = "状态："+更新+"\n"+"播讲："+播音;
        let 图片 = pd(html, '.book&&div&&img&&src');
        let 选集 = pdfa(html, '.play-list&&li').map((data) => {
            let 选集列表 = {};
            选集列表.title = pdfh(data, 'a--span--i&&Text')
            选集列表.url = pd(data, 'a&&href');
            //选集列表.extra = {test: 1};
            return 选集列表;
        })
        let 分页 = pdfa(html, '.hd-sel&&option').map((data) => {
            let 分页列表 = {};
            分页列表.title = pdfh(data, 'option&&Text');
            分页列表.url = pd(data,"option&&value");
            return 分页列表;
        });
        
        return {
            "detail1": "‘‘’’<font color=#FA7298>"+detail1+"</font>", 
            "detail2": "‘‘’’<font color=#f8ecc9>"+detail2+"</font>", 
            //"detailurl"：封面url自己写点击想执行的,
            "desc": 简介,
            "img": 图片,
            //"line": 线路,
            "list": 选集,
            //"listparse": function(线路索引,线路名){写列表解析代码，结后返回选集},//传值代表点击线路时动态获取对应选集
            "page": 分页,
            "pageparse": function (input) {
                let html = request(input, {timeout:8000});
                let 选集 = pdfa(html, '.play-list&&li').map((data) => {
                    let 选集列表 = {};
                    选集列表.title = pdfh(data, 'a--span--i&&Text')
                    选集列表.url = pd(data, 'a&&href');
                    //选集列表.extra = {};
                    return 选集列表;
                })
                return 选集;
            },
            "extra":{
                "blockRules": ['.css']
            }
        }
    },
    "解析": function(url) {
        showLoading('√解析中，请稍候...');
        return 'webRule://' + url + '@' + $.toString(() => {
            //fba.log(fy_bridge_app.getUrls());
            var urls = _getUrls();
            var exclude = /m3u8\.tv/;
            var contain = /\.m4a|\.mp3/;
            for (var i in urls) {
                if (!exclude.test(urls[i]) && contain.test(urls[i])) {
                    //fba.log(urls[i]);
                    return $$$("#noLoading#").lazyRule((url) => {
                        return base64Decode(url);
                    }, fy_bridge_app.base64Encode(fy_bridge_app.getHeaderUrl(urls[i])));
                }
            }
        })
    },
    "最新": function(url) {
        return pdfh(request(url, {timeout:8000}), 'body&&em&&Text');
    }
}

let ggdata = {
    host: "https://m.ting13.com"
}