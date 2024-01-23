function JYLazy(vipUrl) {
    if (/www\.aliyundrive\.com|www\.alipan\.com/.test(vipUrl)) {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
        aliShareUrl(vipUrl)
    }
}
