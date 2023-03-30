let parse = {
    "链接": "https://m.taomanhua.com/",
    "推荐": function () {
        let d = [];
        var Label_set = pdfa(html, '#js_content&&.mult.sow')
        var ci = 0;
        Label_set.forEach((data, id) => {
            d.push({
                title: '““””<br><font color="' + colorsz[ci] + '">' + pdfh(data, 'h2&&Text') + '</font>',
                url: '',
                col_type: "text_1",
                extra: {
                    lineVisible: false
                }
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
        return d;
    }
}