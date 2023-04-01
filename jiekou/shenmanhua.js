let yidata = {
    "链接": "https://m.taomanhua.com/",//会写入MY_HOME
    "主页": function () {
        let d = [];
        MY_URL = MY_HOME;
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
                    col_type: (item.length / 3) % 1 === 0 ? "movie_3_marquee" : "movie_2",
                    extra: {
                        name: pdfh(datas, '.card-title&&Text'),
                        img: pd(datas, 'img&&data-src').replace('-300x400.jpg', '')
                    }
                });
            });
        });
        return d;
    },
    "搜索": function () {//做为主页源时，视界自带搜索
        let d = [];
        MY_URL = MY_HOME + "api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key=" + name + "&page=" + page + "&size=30";
        let code = JSON.parse(request(MY_URL)).data.data
        code.forEach(item => {
            d.push({
                title: item.comic_name,
                desc: '最新：' + item.last_chapter_name,
                pic_url: item.cover_img + "@Referer=",
                content: item.cartoon_desc,
                extra: {
                    name: item.comic_name,
                    img: item.cover_img
                }
            });
        });
        return d;
    }
}

let erdata = {
    "链接": "https://m.taomanhua.com/",//会写入MY_HOME
    "搜索": function () {//做为搜索源时，聚合搜索换源列表数据
        let d = [];
        MY_URL = MY_HOME + "api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key=" + name + "&page=1&size=30";
        let code = JSON.parse(request(MY_URL)).data.data
        code.forEach(item => {
            if (item.comic_name.includes(name)) {
                d.push({
                    title: item.comic_name == name ? item.last_chapter_name : item.comic_name,//名称等于当前显示为更新状态
                    pic_url: "https://m.taomanhua.com/static/images/favicon.ico@Referer=",//网站图标
                    url: MY_HOME + item.comic_newid,//原站二级链接
                    col_type: 'avatar'
                });
            }
        });
        return d;
    },
    "详情": {
        "作者": `pdfh(html, '#detail&&.author&&Text')`,
        "分类": `pdfa(html, '#detail&&.type').map(data => pdfh(data, 'Text')).join("  ")`,
        "简介": `pdfh(html, '#js_desc_content&&Text')`,
        "选集": `pdfa(html, '#js_chapters&&li').map((data) => {
            let id = pdfh(html, "#COMMENT&&data-ssid");
            let 选集列表 = {};
            选集列表.title = pdfh(data, 'Text')
            选集列表.url = MY_HOME + "getchapterinfov2?product_id=1&productname=kmh&platformname=wap&isWebp=1&quality=high&comic_id="+id+"&chapter_newid="+pdfh(data, 'a&&href').replace('.html', '').split('/')[2];
            return 选集列表;
        })`
    },
    "解析": ""
}