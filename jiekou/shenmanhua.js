let parse = {
    "链接": "https://m.taomanhua.com/",
    "主页": function () {
        let d = [];
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
                    url: 'hiker://empty#immersiveTheme##autoCache##noHistory#?url=' + pd(datas, 'a&&href') + '@rule=js:$.require("hiker://page/details")',
                    pic_url: (item.length/3) % 1 === 0 ? pd(datas, 'img&&data-src').replace('-300x400.jpg', '') : pd(datas, 'img&&data-src'),
                    col_type: (item.length/3) % 1 === 0 ? "movie_3_marquee" : "movie_2",
                    extra: {
                        name: pdfh(datas, '.card-title&&Text')
                    }
                });
            });
        });
        return d;
    }
}