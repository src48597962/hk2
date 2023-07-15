function 聚阅(vipUrl) {
    if (vipUrl.indexOf("https://www.aliyundrive.com") > -1) {
        let cfgfile = "hiker://files/rules/Src/config.json";
        let juyingLink;
        eval("let JYconfig=" + (fetch(cfgfile)||"{}") + ";");
        if(!JYconfig["juying"]){
            JYconfig["juying"] = config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/');
            writeFile(cfgfile, JSON.stringify(Juconfig));
        }
        juyingLink = JYconfig["juying"];
        require(juyingLink + 'SrcJyAliDisk.js');
        aliShareUrl(vipUrl)
    }
}
