//巨漫，接口型空壳小程序，接口分为主页源和搜索源
//一级
function yiji() {
    Version();
    
    /*
    if(getMyVar('jydingyue','0')=="0"&&JYconfig['codedyid']&&JYconfig['codeid']!=JYconfig['codedyid']){
        putMyVar('jydingyue','1');
        try{
            var nowtime = Date.now();
            var oldtime = parseInt(getItem('dingyuetime','0').replace('time',''));
            if(nowtime > (oldtime+6*60*60*1000)){
                let pasteurl = JYconfig['codedyid'];
                let text = parsePaste('https://netcut.cn/p/'+aesDecode('Juying', pasteurl));
                if(pasteurl&&!/^error/.test(text)){
                    let pastedata = JSON.parse(base64Decode(text));
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
                    let jknum = 0;
                    let jxnum = 0;
                    var jkdatalist = pastedata.jiekou||[];
                    if(jkdatalist.length>0){
                        jknum = jiekousave(jkdatalist, 0, JYconfig['codedytype']||1);
                    }
                    var jxdatalist = pastedata.jiexi||[];
                    if(jxdatalist.length>0){
                        jxnum = jiexisave(jxdatalist, 0, JYconfig['codedytype']||1);
                    }
                    if(pastedata.live){
                        let livefilepath = "hiker://files/rules/Src/Juying/liveconfig.json";
                        let liveconfig = pastedata.live;
                        writeFile(livefilepath, JSON.stringify(liveconfig));
                    }
                    log("订阅资源码自动同步完成，接口："+jknum+"，解析："+jxnum);
                }else{
                    log("订阅资源码自动同步口令错误或已失效");
                }
                setItem('dingyuetime',nowtime+"time");
            }
        } catch (e) {
            log('自动订阅更新失败：'+e.message); 
        }
    }
    */
}