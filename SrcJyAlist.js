//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
var Alistfile = "hiker://files/rules/Src/Juying/Alist.json";
var AlistData = fetch(cfgfile);
if(AlistData != ""){
    eval("var datalist=" + AlistData+ ";");
}else{
    var datalist = [];
}

function yiji() {
    let d = d || [];
    datalist.forEach(item => {
        d.push({
            title: item.name,
            url: $('#noLoading#').lazyRule((item) => {
                
                refreshPage(false);
                return "hiker://empty";
            },item),
            col_type: 'scroll_button',
        })
    })
    setResult(d);
}