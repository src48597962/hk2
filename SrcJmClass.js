//分类、更新、排行
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmPublic.js');

//分类
function Update() {
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
            eval("let 更新 = " + parse['更新'])
            data = 更新();
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
            if(item.pic_url){
                item.extra = {name: item.extra&&item.extra.name?item.extra.name:item.title, img: item.pic_url}
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
//分类
function Category() {
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
            eval("let 分类 = " + parse['分类'])
            data = 分类();
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
            if(item.pic_url){
                item.extra = {name: item.extra&&item.extra.name?item.extra.name:item.title, img: item.pic_url}
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