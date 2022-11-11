var cfgfile = "hiker://files/rules/Src/Juying/config.json";
var Juyingcfg=fetch(cfgfile);
if(Juyingcfg != ""){
    eval("var JYconfig=" + Juyingcfg+ ";");
}else{
    var JYconfig= {};
}
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
        title: JYconfig['recordentry']!=2?"历史":"收藏",
        url: JYconfig['recordentry']!=2?"hiker://history":"hiker://collection",
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
        title: "直播",
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

function homepage(datasource){    
    var d = [];
    const Color = "#3399cc";
    const categorys = datasource=="sougou"?['电视剧','电影','动漫','综艺','纪录片']:['电视剧','电影','动漫','综艺'];
    const listTabs = datasource=="sougou"?['teleplay','film','cartoon','tvshow','documentary']:['2','1','4','3'];//['/dianshi/list','/dianying/list','/dongman/list','/zongyi/list'];
    const fold = getMyVar('SrcJuying$fold', "0");
    const 类型 = getMyVar('SrcJuying$类型', '');
    const 地区 = getMyVar('SrcJuying$地区', '');
    const 年代 = getMyVar('SrcJuying$年代', '');
    const 资源 = getMyVar('SrcJuying$资源', '');
    const 明星 = getMyVar('SrcJuying$明星', '');
    const 排序 = getMyVar('SrcJuying$排序', '');
    if(datasource=="sougou"){
        MY_URL = "https://waptv.sogou.com/napi/video/classlist?abtest=0&iploc=CN1304&spver=&listTab=" + getMyVar('SrcJuying$listTab', 'teleplay') + "&filter=&start="+ (MY_PAGE-1)*15 +"&len=15&fr=filter";
        if(类型 != ""){
            MY_URL = MY_URL + "&style=" + 类型;
        }
        if(地区 != ""){
            MY_URL = MY_URL + "&zone=" + 地区;
        }
        if(年代 != ""){
            MY_URL = MY_URL + "&year=" + 年代;
        }
        if(资源 != ""){
            MY_URL = MY_URL + "&fee=" + 资源;
        }
        if(明星 != ""){
            MY_URL = MY_URL + "&emcee=" + 明星;
        }
        if(排序 != ""){
            MY_URL = MY_URL + "&order=" + (排序=="最新"?"time":"score");
        }
    }else{
        MY_URL = "https://api.web.360kan.com/v1/filter/list?catid=" + getMyVar('SrcJuying$listTab', '2') + "&size=35&pageno=" + MY_PAGE;
        if(排序 != ""){
            MY_URL = MY_URL + "&rank=" + 排序;
        }
        if(类型 != ""){
            MY_URL = MY_URL + "&cat=" + 类型;
        }
        if(地区 != ""){
            MY_URL = MY_URL + "&area=" + 地区;
        }
        if(年代 != ""){
            MY_URL = MY_URL + "&year=" + 年代;
        }
        if(明星 != ""){
            MY_URL = MY_URL + "&act=" + 明星;
        }
    }
    

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
        d.push({
            title: fold === '1' ? '““””<b><span style="color: #F54343">∨</span></b>' : '““””<b><span style="color:' + Color + '">∧</span></b>',
            url: $('#noLoading#').lazyRule((fold) => {
                putMyVar('SrcJuying$fold', fold === '1' ? '0' : '1');
                refreshPage(false);
                return "hiker://empty";
            }, fold),
            col_type: 'scroll_button',
        })
        for (var i in categorys) {
            d.push({
                title: getMyVar('SrcJuying$listTab', '2') === listTabs[i] ? '““””<b><span style="color:' + Color + '">' + categorys[i] + '</span></b>' : categorys[i],
                url: $('#noLoading#').lazyRule((listTab) => {
                        putMyVar('SrcJuying$listTab', listTab);
                        refreshPage(false);
                        return "hiker://empty";
                    }, listTabs[i]),
                col_type: 'scroll_button'
            });
        }

        d.push({
            col_type: "blank_block"
        });
        
        var html = JSON.parse(request(MY_URL));
        /*
        if(fold==='1'){
            var filter = html.listData.list.filter_list;
            for (var i in filter) {
                d.push({
                    title: filter[i].name=="排序"?排序==""?'““””<span style="color:red">最热</span>':"最热":(类型==""&&filter[i].name=="类型")||(地区==""&&filter[i].name=="地区")||(年代==""&&filter[i].name=="年代")||(资源==""&&filter[i].name=="资源")||(明星==""&&filter[i].name=="明星")?'““””<span style="color:red">全部</span>':"全部",
                    url: $('#noLoading#').lazyRule((name) => {
                            putMyVar('SrcJuying$'+name, '');
                            refreshPage(false);
                            return "hiker://empty";
                        }, filter[i].name),
                    col_type: 'scroll_button',
                })
                let option_list = filter[i].option_list;
                for (var j in option_list) {
                    d.push({
                        title: getMyVar('SrcJuying$'+filter[i].name, '')==option_list[j]?'““””<span style="color:red">'+option_list[j]+'</span>':option_list[j],
                        url: $('#noLoading#').lazyRule((name,option) => {
                                putMyVar('SrcJuying$'+name, option);
                                refreshPage(false);
                                return "hiker://empty";
                            }, filter[i].name, option_list[j]),
                        col_type: 'scroll_button'
                    });
                }
                d.push({
                    col_type: "blank_block"
                });
            }
        }*/
    }else{
        var html = JSON.parse(request(MY_URL));
    }
    var seachurl = $('').lazyRule(() => {
        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyXunmi.js');
            xunmi(name);
        }, input);
    });
    log(html);
    if(datasource=="sougou"){
        var list = html.listData.results;
        for (var i in list) {
            d.push({
                title: list[i].name,
                img: list[i].v_picurl + '@Referer=',
                url: JYconfig['erjimode']!=2?"hiker://empty##https://v.sogou.com" + list[i].url.replace('teleplay', 'series').replace('cartoon', 'series') + "#immersiveTheme##autoCache#":list[i].name + seachurl,
                desc: list[i].ipad_play_for_list.finish_episode?list[i].ipad_play_for_list.episode==list[i].ipad_play_for_list.finish_episode?"全集"+list[i].ipad_play_for_list.finish_episode:"连载"+list[i].ipad_play_for_list.episode+"/"+list[i].ipad_play_for_list.finish_episode:"",
                extra: {
                    pic: list[i].v_picurl,
                    name: list[i].name
                }
            });
        }
    }else{
        var list = html.data.movies;
        for (var i in list) {
            let img = 'https:'+list[i].cdncover;
            d.push({
                title: list[i].title,
                img: img + '@Referer=',
                url: JYconfig['erjimode']!=2?"hiker://empty##https://www.360kan.com/tv/" + list[i].id + ".html#immersiveTheme##autoCache#":list[i].name + seachurl,
                desc: list[i].total?list[i].total==list[i].upinfo?"全集"+list[i].total:"连载"+list[i].upinfo+"/"+list[i].total:list[i].tag?list[i].tag:list[i].pubdate,
                extra: {
                    pic: img,
                    name: list[i].title
                }
            });
        }
    }
    setResult(d);
}