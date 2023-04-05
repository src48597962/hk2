//分类、更新、排行
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJmPublic.js');

//更新
function Update() {
    getData('更新');
}
//分类
function Category() {
    getData('分类');
}