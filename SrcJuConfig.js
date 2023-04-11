let cfgfile = "hiker://files/rules/Src/Ju/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
}
let sourcename = Juconfig[runMode+'sourcename'] || "";
let erji = $('hiker://empty#immersiveTheme##autoCache#').rule(() => {
    require(config.依赖);
    erji();
})
