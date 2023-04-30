let yidata = {
    "作者": "帅",//接口作者
    "页码": {"分类":1, "排行":0, "更新":0},//页码元素可不传，如果传1则会传fypage，用getParam('page')获取
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
        let update_url = MY_RULE.title + "更新"
        if (!getMyVar(update_url)) {
            putMyVar(update_url, request("https://m.taomanhua.com/api/updatelist/?product_id=3&productname=smh&platformname=wap"))
        }
        let code = JSON.parse(getMyVar(update_url)).data.update
        let lisr_s = [];
        let update_date = MY_RULE.title + "更新日期"
        let date = getMyVar(update_date, '今天')
        code.forEach((data) => {
            var title = data.comicUpdateDate_new
            var url_qz = $("#noLoading#").lazyRule((update_date, title) => {
                putMyVar(update_date, title)
                refreshPage(false);
                return "hiker://empty"
            }, update_date, title)
            if (date == title) {
                setPageTitle(title);
                title = '““””<b><font color=#FA7298>' + title + '</font></b>';
                lisr_s = data.info;
            }
            d.push({
                title: title,
                url: url_qz,
                col_type: "scroll_button"
            });
        });
        lisr_s.forEach((data) => {
            d.push({//主页源不需要url
                title: '‘‘’’<b>'+data.comic_name+'</b> <small>\n最新：<font color="#FA7298">'+data.comic_chapter_name+'</font>\n作者：'+data.author_name+'</small>',
                desc:'‘‘’’<font color="#274c5e">分类：'+data.comic_type.join(" | ")+'\n简介：'+data.comic_feature+'</font>' ,
                pic_url: data.feature_img + "@Referer=https://m.taomanhua.com/",
                col_type: "movie_1_vertical_pic",
                url: 'https://m.taomanhua.com/'+data.comic_newid,//如果只有主页源，这里就可以不用传url
                extra: {
                    name : data.comic_name//如果title不等于片名，则可以单独传extra.name
                }
            });

        })
        return d;
    },
    "排行": function() {
        let d = [];
        let list_name = MY_RULE.title + "排行榜"
        let list_url = getMyVar(list_name, 'https://m.taomanhua.com/top/dianji.html');
        let code = request(list_url);
        let url_wzqz = 'https://m.taomanhua.com';
        MY_URL=url_wzqz;
        let list_class = pdfa(code, '#J_rankOptionMenu&&li')
        list_class.forEach((data) => {
            let title = pdfh(data, 'a&&Text')
            let url_qz = $("#noLoading#").lazyRule((list_name, Url) => {
                putMyVar(list_name, Url)
                refreshPage(false);
                return "hiker://empty"
            }, list_name, url_wzqz + pdfh(data, 'a&&href'))
            if (data.includes('active')) {
                setPageTitle(title);
                title = '““””<b><font color=#FA7298>' + title + '</font></b>';
            }
            d.push({
                title: title,
                url: url_qz,
                col_type: "scroll_button"
            });
        });
        pdfa(code, 'li.comic-rank-top&&.comic-item').forEach((data, id) => {
            d.push({//主页源不需要url
                title: pdfh(data, 'a&&title').split(',')[0],
                url: 'https://m.taomanhua.com'+pdfh(data, 'a&&href'),//如果只有主页源，这里就可以不用传url
                desc: '：第' + (id + 1) + '名',
                pic_url: 'https:'+pdfh(data, '.comic-cover&&data-src').replace('-300x400.jpg', '') + "@Referer=https://m.taomanhua.com/",
                col_type: "movie_3_marquee"
            });
        })
        pdfa(code, '.rank-comic-list&&.list').forEach(function(data) {
            d.push({//主页源不需要url
                title: '‘‘’’<b>' + pdfh(data, 'h3&&Text') + '</b> <small>&nbsp;&nbsp;&nbsp;&nbsp;排名：<font color="#FA7298"><b> ' + pdfh(data, '.order&&Text') + '  名</b></font>&nbsp;&nbsp;&nbsp;&nbsp;作者：' + pdfh(data, '.comic-author&&Text') + '</small>',
                desc: '‘‘’’<font color="#004e66">动态：' + pdfh(data, '.clearfix&&.statistics&&Text') + '&nbsp;&nbsp;&nbsp;&nbsp;分类：' + pdfa(data, '.sort-list&&a').map(datas => pdfh(datas, 'Text')).join(" | ") + '</font>',
                url: 'https://m.taomanhua.com'+pdfh(data, 'a&&href'),//如果只有主页源，这里就可以不用传url
                col_type: 'text_1',
                extra: {
                    name: pdfh(data, 'h3&&Text')//如果title不等于片名，则可以单独传extra.name
                }
            });
        });
        return d;
    }
}

let erdata = {
    "作者": "帅",
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
            分页列表.title = pdfh(data, 'option&&Text')
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
            }
        }
    },
    "解析": function(url) {
        return 'webRule://' + url + '@' + $.toString(() => {
            if (typeof (request) == 'undefined' || !request) {
                eval(fba.getInternalJs());
            };
            if (window.c == null) {
                window.c = 0;
            };
            window.c++;
            if (window.c * 250 >= 15 * 1000) {
                fba.hideLoading();
                return "toast://解析超时";
            }
            //fba.log(fy_bridge_app.getUrls());
            var urls = _getUrls();
            var exclude = /m3u8\.tv/;
            var contain = /\.m4a|\.mp3/;
            for (var i in urls) {
                if (!exclude.test(urls[i]) && contain.test(urls[i])) {
                    //fba.log(urls[i]);
                    return $$$("#noLoading#").lazyRule((url) => {
                        return url;
                    }, fy_bridge_app.getHeaderUrl(urls[i]));
                }
            }
        })
    },
    "最新": function(url) {
        setResult(pdfh(request(url, {timeout:8000}), '#js_chapter-reverse&&.last-chapter&&Text'));
    }
}

let ggdata = {
    host: "https://m.ting13.com"
}