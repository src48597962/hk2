function Live() {
    addListener("onClose", $.toString(() => {
        //clearMyVar('guanlicz');
    }));
    var d = [];
    let livefile = "hiker://files/rules/Src/Juying/live.txt";
    let JYlive=fetch(livefile);
    if(JYlive){
        var JYlives = JYlive.split('\n');
    }else{
        var JYlives = [];
    }
    if(JYlives.length>0){
        d.push({
            title: '<b>聚影√</b> &nbsp &nbsp <small>⚙直播设置⚙</small>',
            img: "https://img.vinua.cn/images/QqyC.png",
            url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcLive.js');
                    LiveSet();
                }),
            col_type: 'avatar'
        });
        let datalist = [];
        let datalist2 = [];
        let group = "";
        for(let i=0;i<JYlives.length;i++){
            if(JYlives[i].indexOf('#genre#')>-1){
                group = JYlives[i].split(',')[0];
            }else if(JYlives[i].indexOf(',')>-1){
                datalist.push({group: group, name: JYlives[i].split(',')[0]});
            }
        }
        let obj = {};
        datalist = datalist.reduce((newArr, next) => {
            obj[next.name] ? "" : (obj[next.name] = true && newArr.push(next));
            return newArr;
        }, []);
        
        d.push({
            title: "🔍",
            url: $.toString((guanlidata,datalist) => {
                    if(datalist.length>0){
                        deleteItemByCls('livelist');
                        var lists = datalist.filter(item => {
                            return item.name.includes(input);
                        })
                        let gldatalist = guanlidata(lists);
                        addItemAfter('liveloading', gldatalist);
                    }
                    return "hiker://empty";
                },guanlidata,datalist),
            desc: "搜你想要的...",
            col_type: "input",
            extra: {
                titleVisible: true
            }
        });
        d.push({
            col_type: 'line'
        });
        let grouplist = datalist.map((list)=>{
            return list.group;
        })
        function uniq(array){
            var temp = []; 
            for(var i = 0; i < array.length; i++){
                if(temp.indexOf(array[i]) == -1){
                    temp.push(array[i]);
                }
            }
            return temp;
        }
        grouplist = uniq(grouplist);
        let index = 0;
        for(var i in grouplist){
            let lists = datalist.filter(item => {
                return item.group==grouplist[i];
            })
            if(lists.length>0){
                if(index==0){
                    datalist2 = lists;
                    index = 1;
                }
                d.push({
                    title: grouplist[i],
                    url: $('#noLoading#').lazyRule((guanlidata,datalist) => {
                        if(datalist.length>0){
                            deleteItemByCls('livelist');
                            var lists = datalist.filter(item => {
                                return item.name.includes(input);
                            })
                            let gldatalist = guanlidata(lists);
                            addItemAfter('liveloading', gldatalist);
                        }
                        return "hiker://empty";
                    },guanlidata,lists),
                    col_type: "scroll_button",
                    extra: {
                        id: grouplist[i]
                    }
                });
            }
        }
        d.push({
            col_type: 'line',
            extra: {
                id: 'liveloading'
            }
        });
        datalist = datalist2;
        d = d.concat(guanlidata(datalist));
        d.push({
            title: '<br>',
            col_type: 'rich_text'
        });
    }else{
        d.push({
            title: '没有直播数据源',
            col_type: 'rich_text'
        });
    }
    setHomeResult(d);
}

function guanlidata(datalist) {
    function compare (attr,rev) {
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return (a,b) => {
            a = a[attr];
            b = b[attr];
            if(a.replace(/[^\d]/g, "")&&b.replace(/[^\d]/g, "")){
                if(parseInt(a.replace(/[^\d]/g, "")) < parseInt(b.replace(/[^\d]/g, ""))){
                    return rev * -1;
                }
                if(parseInt(a.replace(/[^\d]/g, "")) > parseInt(b.replace(/[^\d]/g, ""))){
                    return rev * 1;
                }
                return 0;
            }else{
                if(a < b){
                    return rev * -1;
                }
                if(a > b){
                    return rev * 1;
                }
                return 0;
            }
        }
    }
    let list = [];
    datalist = datalist.sort(compare('name',true));   
    for (let i=0;i<datalist.length;i++) {
        list.push({
            title: datalist[i].name,
            img: 'https://lanmeiguojiang.com/tubiao/ke/156.png',//https://lanmeiguojiang.com/tubiao/more/228.png
            col_type: 'icon_2_round',
            url: $('#noLoading#').lazyRule((name) => {
                let urls = [];
                let JYlive=fetch("hiker://files/rules/Src/Juying/live.txt");
                let JYlives = JYlive.split('\n');
                for(var i = 0; i < JYlives.length; i++){
                    if(JYlives[i].indexOf(',')>-1&&JYlives[i].split(',')[0]==name){
                        urls.push(JYlives[i].split(',')[1]);
                    }
                }
                return JSON.stringify({
                    urls: urls
                }); 
            },datalist[i].name),
            extra: {
                cls: 'livelist'
            }
        });
    }
    return list;
}

function LiveSet() {
    addListener("onClose", $.toString(() => {
        //clearMyVar('guanlicz');
        refreshPage(false);
    }));
    var d = [];
    d.push({
        title: '清空直播源',
        img: 'https://lanmeiguojiang.com/tubiao/ke/156.png',
        col_type: 'icon_2_round',
        url: $('#noLoading#').lazyRule(() => {
            writeFile("hiker://files/rules/Src/Juying/live.txt", "");
            return "hiker://empty";
        }),
        extra: {
            cls: 'livelist'
        }
    });
    setHomeResult(d);
}