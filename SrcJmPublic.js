let cfgfile = "hiker://files/rules/Src/Juman/config.json";
let Jumancfg=fetch(cfgfile);
if(Jumancfg != ""){
    eval("var JMconfig=" + Jumancfg+ ";");
}else{
    var JMconfig= {};
}
let yijisource = JMconfig['yijisource'] || "";

let sourcefile = "hiker://files/rules/Src/Juman/jiekou.json";
let sourcedata = fetch(sourcefile);
if(sourcedata != ""){
    eval("var datalist=" + sourcedata+ ";");
}else{
    var datalist = [];
}

let yidatalist = datalist.filter(it=>{
    return it.parse;
});
let erdatalist = datalist.filter(it=>{
    return it.erparse;
});

function getYiData(type) {
    let d = [];
    let sourcedata = yidatalist.filter(it=>{
        return it.name==yijisource;
    });
    if(sourcedata.length==0){
        d.push({
            title: "请先配置一个主页源",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }else{
        let parse;
        eval("let source = " + sourcedata[0].parse);
        if(source.ext && /^http/.test(source.ext)){
            requireCache(source.ext, 48);
            parse = yidata;
        }else{
            parse = source;
        }
        let data = [];
        try{
            eval("let 数据 = " + parse[type])
            data = 数据();
        }catch(e){
            log(e.message);
        }
        if(data.length==0){
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            let extra = item.extra || {};
            extra.name = extra.name || item.title;
            extra.img = extra.img || item.pic_url || item.img;
            if(!item.col_type=="scroll_button" || item.extra){
                item.extra = extra;
            }
            item.url = item.url || $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuman.js');
                erji();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}