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
                d.push({
                    title: pdfh(datas, '.card-title&&Text'),
                    desc: pdfh(datas, '.card-text&&Text'),
                    url: $('hiker://empty#immersiveTheme##autoCache##noRecordHistory##noHistory#').rule(() => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                        erji();
                    }),
                    pic_url: (item.length/3) % 1 === 0 ? pd(datas, 'img&&data-src').replace('-300x400.jpg', '') : pd(datas, 'img&&data-src'),
                    col_type: (item.length/3) % 1 === 0 ? "movie_3_marquee" : "movie_2",
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
        MY_URL = MY_HOME + "api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key="+name+"&page="+page+"&size=30";
        let code = JSON.parse(request(MY_URL)).data.data
        code.forEach(item => {
            d.push({
                title: item.comic_name,
                desc: '最新：' + item.last_chapter_name,
                pic_url: item.cover_img + "@Referer=",
                url: $('hiker://empty#immersiveTheme##autoCache##noRecordHistory##noHistory#').rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                    erji();
                }),
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
    "搜索": function (sourcename) {//做为搜索源时，聚合搜索换源列表数据,变量传入接口名称
        let d = [];
        MY_URL = MY_HOME + "api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key="+name+"&page=1&size=30";
        let code = JSON.parse(request(MY_URL)).data.data
        code.forEach(item => {
            if(item.comic_name.includes(name)){
                d.push({
                    title: '源：'+sourcename+' '+(item.comic_name==name?"":item.comic_name),
                    desc: item.last_chapter_name,//建议取最新
                    pic_url: "https://m.taomanhua.com/static/images/favicon.ico@Referer=",//网站图标
                    url: '',//MY_HOME + '/' + data.comic_newid
                    col_type: 'avatar'
                });
            }
        });
        return d;
    }
}