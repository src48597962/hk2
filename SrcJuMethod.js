function toerji(item,sname,stype) {
    let extra = item.extra || {};
    extra.name = extra.name || extra.pageTitle ||item.title;
    extra.img = extra.img || item.pic_url || item.img;
    extra.stype = stype;
    extra.pageTitle = extra.pageTitle || extra.name;
    if(item.url && !/js:|select:|\(|\)|=>|@/.test(item.url)){
        extra.surl = item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
        extra.sname = sname;
    }
    if((item.col_type!="scroll_button") || item.extra){
        item.extra = extra;
    }
    item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
        require(config.依赖);
        erji();
    }):item.url
    return item;
}