let yidata = {
    "作者": "",//接口作者
    "页码": {"分类":1, "排行":0, "更新":1},//页码元素可不传，如果传1则会传fypage，用getParam('page')获取
    "主页": function () {
        let d = [];
        MY_URL = 公共.host;
        let html = request(MY_URL);
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
        var 类别 = MY_RULE.title + "类别"
        var 类别名 = getMyVar(类别, "");
        var 排序 = MY_RULE.title + "排序"
        var 排序名 = getMyVar(排序, "click");
        var class_Name = MY_RULE.title + "分类"
        if (当前页 == 1) {
            if (!getMyVar(class_Name)) {
                var codes = request('https://m.taomanhua.com/sort/');
                putMyVar(class_Name, codes)
            }else{
                var codes = getMyVar(class_Name)
            }
            var 分类项 = pdfa(codes, '.dl-sort-list&&a').map((data) => {
                var 项数据 = {};
                项数据.title = pdfh(data, 'Text')
                项数据.bs = pdfh(data, 'a&&href').replace('/sort/', '').replace('.html', '')
                项数据.sz = 项数据.bs == 类别名 ? true : false;
                return 项数据;
            })
            var 排序项 = pdfa(codes, '#js_orderList&&li').map((data) => {
                var 项数据 = {};
                项数据.title = pdfh(data, 'Text')
                项数据.bs = pdfh(data, 'li&&data-sort')
                项数据.sz = 项数据.bs == 排序名 ? true : false;
                return 项数据;
            })
            function List_of_options(数据源, 赋值名) {
                d.push({
                    col_type: 'blank_block'
                });
                数据源.forEach((data) => {
                    var title = data.title;
                    if (data.sz) {
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
            List_of_options(分类项, 类别)
            List_of_options(排序项, 排序)
        }
        var 分类post = 'https://m.taomanhua.com/api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=@@&search_key=&comic_sort=**&size=30&page=~~'
        var code = JSON.parse(request(分类post.replace('**', 类别名).replace('@@', 排序名).replace('~~', 当前页))).data.data;
        code.forEach((data) => {
            d.push({
                title: data.comic_name,
                desc: data.last_chapter_name,
                pic_url: data.cover_img + "@Referer=",
                col_type: "movie_3_marquee",
                url: 'https://m.taomanhua.com/'+data.comic_newid,//如果只有主页源，这里就可以不用传url
                extra: {
                    name: data.comic_name//如果title不等于片名，则可以单独传extra.name
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
            return 选集列表;
        })
        let 分页 = pdfa(html, '.hd-sel&&option').map((data) => {
            let 分页列表 = {};
            分页列表.title = pdfh(data, 'option&&Text').replace(/ |第|集/g,"");
            分页列表.url = pd(data,"option&&value");
            return 分页列表;
        });
        
        return {
            "detail1": "‘‘’’<font color=#FA7298>"+detail1+"</font>", 
            "detail2": "‘‘’’<font color=#f8ecc9>"+detail2+"</font>", 
            "desc": 简介,
            "img": 图片,
            "list": 选集,
            "page": 分页,
            "pageparse": function (input) {
                let html = request(input, {timeout:8000});
                let 选集 = pdfa(html, '.play-list&&li').map((data) => {
                    let 选集列表 = {};
                    选集列表.title = pdfh(data, 'a--span--i&&Text')
                    选集列表.url = pd(data, 'a&&href');
                    return 选集列表;
                })
                return 选集;
            },
            "blockRules": ['.css']
        }
    },
    "解析": function(url) {
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
        setResult("最新：" + pdfh(request(url, {timeout:8000}), 'body&&em&&Text'));
    }
}

let ggdata = {
    host: "https://m.ting13.com"
}