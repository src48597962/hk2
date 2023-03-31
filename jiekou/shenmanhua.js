let parse = {
    "链接": "https://m.kanman.com/",//"https://m.taomanhua.com/",
    "主页": function () {
        let d = [];
        var colorsz = ['#519D9E', '#285943', '#098AC1'];
        let html = request(MY_URL);
        var Label_set = pdfa(html, '#js_content&&.mult.sow')
        var ci = 0;
        Label_set.forEach((data, id) => {
            d.push({
                title: pdfh(data, 'h2&&Text'),
                col_type: "rich_text"
            });
            ci = ci == 2 ? 0 : ci + 1
            var item = pdfa(data, '.mult-warp.siw&&li.r1c3');
            item = item.length ? item : pdfa(data, '.mult-warp.siw&&li.r1c2');
            var item_sl = item.length;
            item.forEach((datas) => {
                d.push({
                    title: pdfh(datas, '.card-title&&Text'),
                    desc: pdfh(datas, '.card-text&&Text'),
                    url: 'hiker://empty#immersiveTheme##autoCache##noHistory#?url=' + pd(datas, 'a&&href') + '@rule=js:$.require("hiker://page/details")',
                    pic_url: pd(datas, 'img&&data-src').replace('-300x400.jpg', ''),
                    col_type: item_sl == 4 ? "movie_2" : "movie_3_marquee",
                    extra: {
                        name: pdfh(datas, '.card-title&&Text'),
                        url: pd(datas, 'a&&href'),
                        qz: MY_HOME
                    }
                });
            });
        });
        var Label_set = JSON.parse(request(MY_URL+'api/getBookByType?product_id=3&productname=smh&platformname=wap&pagesize=5&page=2&pytype=tuijian&booktype=132')).data.book
        Label_set.forEach((data, id) => {
            d.push({
                title: '““””<br><font color="' + colorsz[ci] + '">' + data.title + '</font>',
                url: '',
                col_type: "text_1",
                extra: {
                    lineVisible: false
                }
            });
            ci = ci >= 2 ? 0 : ci + 1
            var item = data.comic_info
            var item_sl = item.length;
            item.forEach((datas) => {
                d.push({
                    title: datas.comic_name,
                    desc: id % 2 ? datas.last_comic_chapter_name : datas.content,
                    url: 'hiker://empty#immersiveTheme##autoCache##noHistory#?url=' + MY_HOME + '/' + datas.comic_newid + '/@rule=js:$.require("hiker://page/details")',
                    pic_url: id % 2 ? 'https://image.yqmh.com/mh/' + datas.comic_id + '.jpg-300x400.webp' : 'https://cms.samanlehua.com' + '/' + datas.img_url + '-noresize.webp',
                    col_type: !(id % 2) ? "movie_2" : "movie_3_marquee",
                    extra: {
                        name: datas.comic_name,
                        url: MY_HOME + '/' + datas.comic_newid + '/',
                        qz: MY_HOME
                    }
                });
            });
        });
        return d;
    }
}