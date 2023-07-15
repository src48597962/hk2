//引入Ali公用文件
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliPublic.js');

function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace('提取码: ', '');
        }
        if (it.indexOf("https://www.aliyundrive.com") > -1) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    aliShare(share_id, folder_id, share_pwd);
}

function myDiskMenu(islogin){
    let setalitoken = $().lazyRule((alistfile, alistData) => {
        let alistconfig = alistData.config || {};
        let alitoken = alistconfig.alitoken;
        return $(alitoken||"","refresh_token").input((alistfile,alistData,alistconfig)=>{
            alistconfig.alitoken = input;
            alistData.config = alistconfig;
            writeFile(alistfile, JSON.stringify(alistData));
            clearMyVar('getalitoken');
            refreshPage(false);
            return "toast://已设置";
        },alistfile,alistData,alistconfig)
    }, alistfile, alistData)

    let onlogin = [{
        title: userinfo.nick_name,
        url: setalitoken,
        img: userinfo.avatar,
        col_type: 'avatar'
    },{
        col_type: "line"
    }];
    let nologin = [{
        title: "⚡登录获取token⚡",
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            let d = [];
            let url = 'https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login'
            let js = $.toString(() => {
                const tokenFunction = function () {
                    var token = JSON.parse(localStorage.getItem('token'))
                    if (token && token.user_id) {
                        let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
                        if(fy_bridge_app.fetch(alistfile)){
                            eval("var alistData = " + fy_bridge_app.fetch(alistfile));
                        }else{
                            var alistData = {};
                        }
                        let alistconfig = alistData.config || {};
                        alistconfig.alitoken = token.refresh_token;
                        alistData.config = alistconfig;
                        fy_bridge_app.writeFile(alistfile, JSON.stringify(alistData));
                        localStorage.clear();
                        alert('TOKEN获取成功，返回后刷新页面！');
                        fy_bridge_app.parseLazyRule(`hiker://empty@lazyRule=.js:refreshX5WebView('');`);
                        fy_bridge_app.back();
                        return;
                    } else {
                        token_timer();
                    }
                }
                var token_timer = function () {
                    setTimeout(tokenFunction, 500)
                };
                tokenFunction();
            })
            d.push({
                url: url,
                col_type: 'x5_webview_single',
                desc: '100%&&float',
                extra: {
                    canBack: true,
                    js: js
                }
            })
            setResult(d);
        }),
        col_type: 'text_center_1'
    },{
        title: "⭐手工填写token⭐",
        url: setalitoken,
        col_type: 'text_center_1'
    }]
    if(islogin){
        return onlogin;
    }else{
        return nologin;
    }
}

evalPrivateJS('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')
evalPrivateJS('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')
evalPrivateJS('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')