function erji(item) {
    let bookSourceUrl = item.bookSourceUrl;
    if(item.searchUrl.includes("POST")){
        return {
            "作者": "开源阅读",
            "搜索": function (name,page) {
                let d = [];
                let ssurl = bookSourceUrl + "https://m.taomanhua.com/api/getsortlist/?product_id=3&productname=smh&platformname=wap&orderby=click&search_key=" + name + "&page="+page+"&size=30";
                let code = JSON.parse(request(ssurl)).data.data
                code.forEach(item => {
                    if (item.comic_name.includes(name)) {
                        d.push({
                            title: item.comic_name,//名称
                            desc: item.last_chapter_name,//更新状态或最新章节
                            pic_url: item.cover_img + "@Referer=",//网站图标
                            url: "https://m.taomanhua.com/" + item.comic_newid,//原站二级链接,因为在多线程中MY_URL会变，所以不要用pd取
                        });
                    }
                });
                return d;
            },
            "二级": function(surl) {//surl为详情页链接
                let html = request(surl, {timeout:8000});
                let dataid = pdfh(html, "#COMMENT&&data-ssid");
                let 作者 = pdfh(html, '#detail&&.author&&Text');
                let 分类 = pdfa(html, '#detail&&.type').map(data => pdfh(data, 'Text')).join("  ");
                let 更新 = pdfh(html, '#js_chapter-reverse&&.update_time&&Text');
                let 简介 = pdfh(html, '#js_desc_content&&Text');
                let detail1 = "作者："+作者+"\n"+"分类："+分类;
                let detail2 = "时间："+更新;
                let 图片 = pd(html, '#detail&&.thumbnail&&img&&data-src');
                let 选集 = pdfa(html, '#js_chapters&&li').map((data) => {
                    let 选集列表 = {};
                    选集列表.title = pdfh(data, 'Text')
                    选集列表.url = "https://m.taomanhua.com/api/getchapterinfov2?product_id=1&productname=kmh&platformname=wap&isWebp=1&quality=high&comic_id="+dataid+"&chapter_newid="+pdfh(data, 'a&&href').replace('.html', '').split('/')[2];
                    return 选集列表;//列表数组含title和url就行
                })
                return { //如果有多线路，则传line: 线路数组, 则list应为多线路合并后的数组[线路1选集列表，线路2选集列表]
                    detail1: "‘‘’’<font color=#FA7298>"+detail1+"</font>", 
                    detail2: "‘‘’’<font color=#f8ecc9>"+detail2+"</font>", 
                    desc: 简介,
                    img: 图片, //图片也可以不传，则用上一级的原图片
                    list: 选集 
                }//按格式返回
            },
            "解析": function(url,公共) {//url为播放链接必传，公共没有可不传，小说的解析按第1个d.title写标题，第2个d.title写下载，确保小说可下载
                let code = JSON.parse(request(url, {timeout:8000})).data.current_chapter.chapter_img_list;
                return "pics://" + code.join("@Referer=https://m.taomanhua.com/&&") + '@Referer=https://m.taomanhua.com/';
            },
            "最新": function(url,公共) {//收藏获取最新章节，surl为详情页链接
                setResult(pdfh(request(url, {timeout:8000}), '#js_chapter-reverse&&.last-chapter&&Text'));
            }
        }
    }
    return "";
}