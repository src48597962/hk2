function JYLazy(vipUrl) {
    if (vipUrl.indexOf("https://www.aliyundrive.com") > -1) {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
        aliShareUrl(vipUrl)
    }
}
