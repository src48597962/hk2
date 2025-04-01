function JYLazy(vipUrl) {
    if (/www\.aliyundrive\.com|www\.alipan\.com/.test(vipUrl)) {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
        aliShareUrl(vipUrl)
    }
}
var SrcParseS = {
    聚阅: function (vipUrl) {
        if(/www\.aliyundrive\.com|www\.alipan\.com/.test(vipUrl)) {
            return $("hiker://empty#noRecordHistory##noHistory#").rule((input) => {
                initConfig({
                    聚影: 'https://raw.gitcode.com/src48597962/juying/raw/master/'
                })
                require(config.聚影 + 'SrcJyAliDisk.js');
                aliShareUrl(input);
            },vipUrl);
        }else if(/pan\.quark\.cn|drive\.uc\.cn/.test(vipUrl)) {
            return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(vipUrl) + "&sharePwd=";
        }
    }
}
