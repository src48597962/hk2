function yiji() {
    var d = [];
    let yijimenu = [
        {
            title: "管理",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
                    SRCSet();
                }),
            pic_url: 'https://lanmeiguojiang.com/tubiao/more/129.png',
            col_type: 'icon_5'
        },
        {
            title: "布局",
            url: "hiker://collection",
            pic_url: 'https://lanmeiguojiang.com/tubiao/more/109.png',
            col_type: 'icon_5'
        },
        {
            title: "搜索",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖);
                    sousuo2();
                }),
            pic_url: 'https://lanmeiguojiang.com/tubiao/more/101.png',
            col_type: 'icon_5'
        },
        {
            title: "展示",
            url: $("hiker://empty##fypage#noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖);
                    jiekouyiji();
                }),
            pic_url: 'https://lanmeiguojiang.com/tubiao/more/105.png',
            col_type: 'icon_5'
        },
        {
            title: "编辑",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcLive.js');
                    Live();
                }),
            pic_url: 'https://lanmeiguojiang.com/tubiao/more/87.png',
            col_type: 'icon_5'
        },
        {
            col_type: 'line'
        }
    ]
    if(MY_PAGE==1){
        for(var i in yijimenu){
            d.push(
                yijimenu[i]
            )
        }
        for (let i = 0; i < 10; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
        var shelffile = "hiker://files/rules/Src/Read/bookshelf.js";
        var shelf=fetch(shelffile);
        if(shelf != ""){
            eval("var bookshelf=" + shelf+ ";");
        }else{
            var bookshelf= [];
        }
        if(bookshelf.length==0){
            d.push({
                title: '⚠书架是空的',
                url: "hiker://empty",
                col_type: "text_center_1"
            });
        }
    }
    setResult(d);
}