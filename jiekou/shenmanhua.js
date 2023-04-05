let yidata = {
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
        var 当前页 = 1;//getParam('page');
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
                url: 'hiker://empty#immersiveTheme##autoCache##noHistory#?url=' + 前缀 +'/'+ data.comic_newid + '/@rule=js:$.require("hiker://page/details")',
                col_type: "movie_3_marquee",
                extra: {
                    name: data.comic_name,
                    url: 前缀 +'/'+ data.comic_newid +'/',
                    qz: 前缀
                }
            });
        })
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
    "前提": `var dataid = pdfh(html, "#COMMENT&&data-ssid");`,//这里写后面加载需要的前提需要的数据，变量定义需要用var，也可以留空
    "详情": {
        "标题1": `作者$$$pdfh(html, '#detail&&.author&&Text')`,//用$$$间隔需要取值的标题和内容
        "标题2": `分类$$$pdfa(html, '#detail&&.type').map(data => pdfh(data, 'Text')).join("  ")`,
        "描述": `简介$$$pdfh(html, '#js_desc_content&&Text')`,
    },
    "选集": `pdfa(html, '#js_chapters&&li').map((data) => {
        let 选集列表 = {};
        选集列表.title = pdfh(data, 'Text')
        选集列表.url = "https://m.taomanhua.comapi/getchapterinfov2?product_id=1&productname=kmh&platformname=wap&isWebp=1&quality=high&comic_id="+dataid+"&chapter_newid="+pdfh(data, 'a&&href').replace('.html', '').split('/')[2];
        return 选集列表;
    })`,
    "解析": `$('').lazyRule(() => {let code = JSON.parse(request(input)).data.current_chapter.chapter_img_list;
        return "pics://" + code.join("@Referer=https://m.taomanhua.com/&&") + '@Referer=https://m.taomanhua.com/';
    });`
}