let yidata = {
    "作者": "嗨又是我",//接口作者
    "主页": function () {
        let d = [];
        MY_URL = "https://m.taomanhua.com";
        let html = request(MY_URL);
        var Label_set = pdfa(html, '#js_content&&.mult.sow')
        Label_set.forEach((data) => {
            d.push({
                title: pdfh(data, 'h2&&Text'),
                col_type: "rich_text"
            });
            var item = pdfa(data, '.mult-warp.siw&&li.r1c3');
            item = item.length ? item : pdfa(data, '.mult-warp.siw&&li.r1c2');
            item.forEach((datas) => {
                d.push({//主页源不需要url
                    title: pdfh(datas, '.card-title&&Text'),
                    desc: pdfh(datas, '.card-text&&Text'),
                    pic_url: (item.length / 3) % 1 === 0 ? pd(datas, 'img&&data-src').replace('-300x400.jpg', '') : pd(datas, 'img&&data-src'),
                    col_type: (item.length / 3) % 1 === 0 ? "movie_3_marquee" : "movie_2"
                });
            });
        });
        return d;
    },
    "分类": function () {
        let d = [];
        var 当前页 = getParam('page');
        var 类别 = MY_RULE.title + "类别"
        var 类别名 = getVar(类别, "");
        var 排序 = MY_RULE.title + "排序"
        var 排序名 = getVar(排序, "click");
        var class_Name = MY_RULE.title + "分类"
        if (当前页 == 1) {
            if (!getVar(class_Name)) {
                var codes = request('https://m.taomanhua.com/sort/');
                putVar(class_Name, codes)
            }else{
                var codes = getVar(class_Name)
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
                        putVar(list_name, Url)
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
                extra: {
                    name: data.comic_name,
                    url: 'https://m.taomanhua.com/'+ data.comic_newid +'/'
                }
            });
        })
        return d;
    },
    "更新": function() {
        let d = [];
        let update_url = MY_RULE.title + "更新"
        if (!getVar(update_url)) {
            putVar(update_url, request("https://m.taomanhua.com/api/updatelist/?product_id=3&productname=smh&platformname=wap"))
        }
        let code = JSON.parse(getVar(update_url)).data.update
        let lisr_s = [];
        let update_date = MY_RULE.title + "更新日期"
        let date = getVar(update_date, '今天')
        code.forEach((data) => {
            var title = data.comicUpdateDate_new
            var url_qz = $("#noLoading#").lazyRule((update_date, title) => {
                putVar(update_date, title)
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
                extra: {
                    name : data.comic_name//如果上面的title不是单纯的名称可以单独写在附加中
                }
            });

        })
        return d;
    },
    "排行": function() {
        let d = [];
        let list_name = MY_RULE.title + "排行榜"
        let list_url = getVar(list_name, 'https://m.taomanhua.com/top/dianji.html');
        let code = request(list_url);
        let url_wzqz = 'https://m.taomanhua.com';
        MY_URL=url_wzqz;
        let list_class = pdfa(code, '#J_rankOptionMenu&&li')
        list_class.forEach((data) => {
            let title = pdfh(data, 'a&&Text')
            let url_qz = $("#noLoading#").lazyRule((list_name, Url) => {
                putVar(list_name, Url)
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
                desc: '：第' + (id + 1) + '名',
                pic_url: 'https:'+pdfh(data, '.comic-cover&&data-src').replace('-300x400.jpg', '') + "@Referer=https://m.taomanhua.com/",
                col_type: "movie_3_marquee"
            });
        })
        pdfa(code, '.rank-comic-list&&.list').forEach(function(data) {
            d.push({//主页源不需要url
                title: '‘‘’’<b>' + pdfh(data, 'h3&&Text') + '</b> <small>&nbsp;&nbsp;&nbsp;&nbsp;排名：<font color="#FA7298"><b> ' + pdfh(data, '.order&&Text') + '  名</b></font>&nbsp;&nbsp;&nbsp;&nbsp;作者：' + pdfh(data, '.comic-author&&Text') + '</small>',
                desc: '‘‘’’<font color="#004e66">动态：' + pdfh(data, '.clearfix&&.statistics&&Text') + '&nbsp;&nbsp;&nbsp;&nbsp;分类：' + pdfa(data, '.sort-list&&a').map(datas => pdfh(datas, 'Text')).join(" | ") + '</font>',
                col_type: 'text_1',
                extra: {
                    name: pdfh(data, 'h3&&Text')//如果上面的title不是单纯的名称可以单独写在附加中
                }
            });
        });
        return d;
    }
}

let erdata = {
    "作者": "嗨又是我",//接口作者
    "搜索": function () {//做为搜索源时，聚合搜索换源列表数据
        let d = [];
        MY_URL = "https://m.taomanhua.com/api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key=" + name + "&page=1&size=30";
        let code = JSON.parse(request(MY_URL)).data.data
        code.forEach(item => {
            if (item.comic_name.includes(name)) {
                d.push({
                    title: item.comic_name,//名称
                    desc: item.last_chapter_name,//更新状态或最新章节
                    pic_url: item.cover_img + "@Referer=",//网站图标
                    url: "https://m.taomanhua.com/" + item.comic_newid,//原站二级链接
                });
            }
        });
        return d;
    },
    "二级": function(surl) {//surl为详情页链接
        let html = request(surl);
        let dataid = pdfh(html, "#COMMENT&&data-ssid");
        let 作者 = pdfh(html, '#detail&&.author&&Text');
        let 分类 = pdfa(html, '#detail&&.type').map(data => pdfh(data, 'Text')).join("  ");
        let 简介 = pdfh(html, '#js_desc_content&&Text');
        let detail1 = "作者："+作者+"\n"+"分类："+分类;
        let detail2 = "简介："+简介;
        let 图片 = pd(html, '#detail&&.thumbnail&&img&&data-src');
        let 选集 = pdfa(html, '#js_chapters&&li').map((data) => {
            let 选集列表 = {};
            选集列表.title = pdfh(data, 'Text')
            选集列表.url = "https://m.taomanhua.com/api/getchapterinfov2?product_id=1&productname=kmh&platformname=wap&isWebp=1&quality=high&comic_id="+dataid+"&chapter_newid="+pdfh(data, 'a&&href').replace('.html', '').split('/')[2];
            return 选集列表;
        })
        return {detail1:detail1,detail2:detail2,img:图片,list:选集}//按格式返回
    },
    "解析": `$('').lazyRule(() => {//解析放在lazyRule里面
        let code = JSON.parse(request(input)).data.current_chapter.chapter_img_list;
        return "pics://" + code.join("@Referer=https://m.taomanhua.com/&&") + '@Referer=https://m.taomanhua.com/';
    })`
}