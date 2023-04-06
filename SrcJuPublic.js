let cfgfile = "hiker://files/rules/Src/Ju/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
}
let runType = Juconfig["runType"] || "漫画";
let yijisource = Juconfig['yijisource'] || "";

let sourcefile = "hiker://files/rules/Src/Ju/jiekou.json";
let sourcedata = fetch(sourcefile);
if(sourcedata != ""){
    try{
        eval("var datalist=" + sourcedata+ ";");
    }catch(e){
        var datalist = [];
    }
}else{
    var datalist = [];
}

let yidatalist = datalist.filter(it=>{
    return it.parse && it.type==runType;
});
let erdatalist = datalist.filter(it=>{
    return it.erparse && it.type==runType;
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
                require(config.依赖);
                erji();
            })
        })
        d = d.concat(data);
    }
    setResult(d);
}