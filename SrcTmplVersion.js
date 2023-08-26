var newVersion = {
    "srcDyTmpl":5.5,
    "SrcJuying":"8.0",
    "SrcJuyingdesc":{
        "0.1":"原始搜狗改造",
        "0.2":"主页界面完成",
        "0.3":"搜索界面完成",
        "0.4":"管理界面完成",
        "0.5":"各界面联动修复bug，功能增加完善",
        "0.6":"搜索结果显示优化，清除无效显示；管理-扩展中心支持记录订阅历史和切换更新；管理接口和解析增加清空操作",
        "0.7":"管理接口和解析支持聚影资源码增量导入；支持自定义设置默认搜索线程数；支持自定义设置app解析保留数",
        "0.8":"管理-接口支持分组保存；搜索界面支持按分组进行搜索",
        "0.9":"管理-订阅切换删除逻辑加强；依赖自动更新间隔改为3小时；自动订阅更新间隔改为3小时；ua转换改为在搜索界面执行",
        "1.0":"管理-批量增加接口、解析时分隔符支持中英文逗号；其他资源导入时处理注释部份；增加TVb资源导入",
        "1.1":"修复版本号和分隔符提示",
        "1.2":"搜索界面增加快速删除；完善搜索异常错误的处理逻辑；测试记忆",
        "1.3":"管理界面-操作增加筛选定位功能",
        "1.4":"管理界面-定位搜索修复；其他资源导入解析未过虑问题修复；其他小问题修复",
        "1.5":"搜索接口增强兼容很多；主页底稿数据修复异常；其他资源导入提示解析是否导入",
        "1.6":"搜索接口显示类型和分组；增加优看明码直解支持；增加301跳转解析支持；重构解析逻辑，加强日志显示；cache增加超时；管理-解析增加排除片源手工操作",
        "1.7":"管理解析测试改用断插常规调用方式；修复优看选集错误；去除dd的的默认ua；增强片源标识取值准确性；管理扩展中的资源码更新和删除逻辑完善",
        "1.8":"解析逻辑升级，自动探测跳过防盗和跳舞小视频；解析增强日志显示；修复多处小bug",
        "1.9":"探测失效优化完善；解析增强日志显示；cms改为优先videolist列表；屏蔽优先改为app类的直接全局，私有的只排除单个片源；解析增加优先片源设置",
        "2.1":"全新解析改造升级，代码逻辑完整性优化；解析增加智能排序；私有解析失败后先降序5次以后再排除片源；自带解析失败的直接拉黑；搜索热片榜本地缓存更换位置及更新时效；自动更新检测间隔调整为6小时",
        "2.2":"解析支持header设置；框架调整，精简代码，拆分功能文件；增加多选指定分享功能；本次版本代码改动较大",
        "2.3":"解析测试由断插改为调用聚影解析，确保测试准确性；聚影解析增加磁力支持；管理解析排序准确性优化；多选支持删除操作；",
        "2.4":"优化解析结果判断，提高体验；更换失效的嗅探解析；修复测试解析受断插影响的问题",
        "2.5":"修复测试嗅探解析bug；修复屏蔽优先null取值bug；修复增加接口的自动分类bug；修复清优先时name和head未清bug；",
        "2.6":"解析优化，断插辅助只调用在第1轮；聚影接口增加支持xpath类型；",
        "2.7":"嗅探解析优化；增加xpath兼容度；修复bug，提高体验；",
        "2.8":"管理-扩展中增加主页记录入口切换；完善二级最新章节收藏中显示记录；自动修正选集顺序；",
        "2.9":"聚影接口增加支持biubiu类型；提升xpath/biubiu兼容度；修复bug，提高体验；",
        "3.0":"修复版本号",
        "3.1":"TVBox接口完善导入，支持更多文件了；管理-接口增加分组选择；",
        "3.2":"增加TVBox订阅在线接口；其他资源导入默认添加到新导入分组；data对象接口修改时对json格式化；",
        "3.3":"TVBox导入和订阅支持本地接口文件；视界搜索支持切换为聚合搜索；嗅探解析优化；",
        "3.4":"搜索逻辑性增加；增加选择分组颜色标识；增加线程判断，避免过快点击切换分组；扩展个性化增加默认搜索分组，方便指定优质分组搜索",
        "3.5":"增加失败接口自动处理，默认搜索失败10次(仅针对搜索出错)，将接口移动以分组-失败待处理；修复分组重复的bug；20220729",
        "3.6":"管理-多选操作增加批量菜单；搜索-失败接口统一展示入口，丰富失败处理菜单；解析逻辑优化；订阅自己的资源码不自动更新；20220805",
        "3.7":"修复管理-多选删除bug；放行m3u8.tv解析；增加接口独立展示页面；",
        "3.8":"针对cms接口增加xml类型接口；首页接口更名为展示；独立展示页除app/v2默认显示全部；代码优化升级；20220812",
        "3.9":"视界搜索接入聚影聚搜；二级图片取值优化；首页判断旧版本不显示展示版块；20220813",
        "4.0":"修复特殊接口二级的播放地址取值bug；增强单接口展示页ua判断及单片播放逻辑；增强嗅探解析逻辑避免识别为图片，提高xp和xb接口解析速度；20220827",
        "4.1":"对二级影片介绍加强处理，去前后空格、中文符号的替换；搜索界面多项优化，操作更加便捷（失败组成功的自动移出、测试失败的自动显示、菜单逻辑等）；嗅探解析逻辑加强；TVBOX资源导入和订阅大优化，兼容性更强，加入多线程处理速度更快；20220907",
        "4.2":"优化完善TVBOX导入，biubiu名称相似度>60排除，解析引用header；私有解析增加支持JS免嗅函数解析类型，支持断插格式和口令(添加类型为2)；20220914",
        "4.3":"观影设置改版，更加清晰美观；解析逻辑全新升级优化，聚影智能(断插辅助开时独立调用帅助手逻辑,且支持远程断插文件)、强制断插(走断插本地小程序逻辑)、强制嗅探(只走聚影自带几个url解析)；智能拦截无效视频地址升级优化；支持断插返回json对象解析结果；批量添加解析未去重bug修复；播放地址ua调整；其他细节调整；20220918",
        "4.4":"强制断插逻辑优化完善；优化修改若干bug；20220923",
        "4.5":"针对视界新版在观影设置中增加超级嗅探开关；解析管理及解析逻辑增加web普通解析标记以加快处理速度；20220927",
        "4.6":"管理模块优化代码，解析保存模块化；解析优先、排除统一模块管理；接口、解析多选功能增加菜单；订阅文件合并到配置文件中；其他代码细节优化；20221001",
        "4.7":"针对海阔视界7.16版本做适应性升级，1.二级354报错修复，2.播放器超级嗅探支持m3u8缓存开关设置；20221006",
        "4.8":"观影设置-断插设置及管理，因断插原因修改为调用七彩大佬的服务器文件；停用自动导入直链解析；修复增加接口-切换类型报错；调整tvbox导入代码；接口删除时同步删除展示记忆；20221010",
        "4.9":"智能解析逻辑针对优先上次解析做了大幅度调整；tvbox源导入增加对xpath接口的支持(存在兼容问题需自行确认好坏)；管理-扩展中心升级，界面代码大优化，增加资源导入历史记录；管理-扩展增加聚影说明；TVBox订阅做大幅度的升级，代码和导入进行整合，12小时文件缓存；20221015",
        "5.0":"增强TVBOX白嫖导入，添加直播模块，功能自行体验；20221018",
        "5.1":"直播模块优化，缓存文件调整；管理扩展中部份提示优化，界面微调；修复从未调用展示时删除接口报错；20221019",
        "5.2":"修复少许小bug；加强直播模块的逻辑处理，本地为空自动导入第一个订阅改为默认显示第一个订阅，本地源编辑全改为动态刷新；聚影资源码分享和订阅同步增加直播的订阅数据；接口导入保存自动剔除同类型且同名；20221020",
        "5.3":"配合软件版本新功能，添加云口令自动导入功能；嗅探解析支持屏蔽播放地址；加入github依赖库索引管理；20221021",
        "5.4":"优先嗅探解析处理,本地有解析时不再调用兜底；符合条件的默认开启播放器嗅探多线路；搜索界面增加强制删除开关；20221022",
        "5.5":"彻底空壳化，去除自带解析，去除关于聚影说明；接口和解析可以设置订阅更新时强制保留；管理接口分组记忆不刷新；自动更新策略调整；20221024",
        "5.6":"修复直播订阅被空资源码覆盖bug；个别网站无法嗅探兼容处理；直播无可用订阅时隐藏分组；修复解析header信息丢失问题；修复云口令导入bug；修复收藏不获取最新bug；20221101",
        "5.7":"分享功能调整，时限扩展；修复手工导入解析时未点击接口管理导致提示无法识别口令的bug；tvbox导入直播支持明链；香佬定制tvbox推送；20221106",
        "5.8":"修复直播地址名称匹配前后不一致及订阅无法访问时处理bug；box推送改为开关设置；视界原生聚搜逻辑调整，支持默认搜索分组接口；主页数据来源增加360-管理扩展中切换；360二级支持推送；需要仓库配合升级小程序版本；20221113",
        "5.9":"修复主页多源切换后收藏及历史进入bug；修复360的跳集导致获取列表bug；聚搜增强，代码优化，突破某些接口的request拦截；增加custom接口类型，自定义接口扩展性更强；20221120",
        "6.0":"展示模块优化；修复直播bug；观影设置中增加颜色设置；增加长按事件(V7.23)：1.历史收藏按钮支持长按切换，2.搜索界面热搜图标长按切换是否显示搜索历史记录，3.直播编辑本地源改为长按分名或频道,4.直播频道长按推送tvbox；2022-11-27",
        "6.1":"修复颜色设置；兼容新biubiu格式；更新策略调整；增加长按事件：1.更多片源-调用云盘君和AI影搜，2.展示-切换为历史，3.直播分组-推送tvbox,4.主页一级影片-快速聚搜,5.关于聚影-查看更新日志；2022-11-29",
        "6.2":"增加长按事件：1.管理接口-分组长按排序，2.管理扩展-更新资源-订阅类型可改为增量，3.主页搜索可改为调用视界搜索，4.搜索记录开关改到外面搜索上；聚搜逻辑微调整强制搜索线程数，尽量按分组排序进线程；修复屏蔽优先失效bug；",
        "6.3":"长按事件：配合V7.26主页搜索增加精准搜索设置；解析拦截规则微调整；过宝塔验证，加强简单验证码识别；解析结果判断放行403；20230109",
        "6.4":"xpath类型json的搜索数据支持scVodId指定id；完善调试模式；直播支持m3u的#EXTINF格式；修复搜狗分类默认标记；去除搜狗电影选集颜色；20230130",
        "6.5":"解析逻辑微调(开启播放器超级嗅探时，不限制数量5，不较验大厂ts段有效性)；观影设置增加弹幕开关(调用cy大佬dm盒子)；搜索和展示同步增加XBPQ接口支持；一些小细节bug修复；20230206",
        "6.6":"兼容导入不同tvbox配置中的live地址；解析逻辑优化调整，防止误判；修复无法识别接口类型保存提示已存在问题；全新增加Alist模块；20230222",
        "6.7":"修复解析特定链接bug；alist模块完善；20230301",
        "6.8":"alist模块完善及周边联动搜索；部份图标本地化；20230309",
        "6.9":"alist模块增强（某盘1.自己盘文件支持原始文件画质，2.共享链接支持本地代理转码观看不中断，3.支持多线路画质切换）；20230312",
        "7.0":"搜索长按菜单下沉到搜索中；部份bug修复；增加2个模块功能；alist登录用户重新签到；20230321",
        "7.1":"主页导航菜单改为可自定义设置(管理-扩展中)，取消长按菜单；一级、搜索中的影片长按菜单支持快速搜索；增加我的云盘模块；优化多处代码逻辑；自动去除非凡量子插播广告；20230327",
        "7.2":"bug修复；逻辑优化；20230328",
        "7.3":"修复360；累积更新；20230513",
        "7.4":"二级选集支持ali地址；修复云盘代理转码；修复云盘个别字幕字符编码问题；20230527",
        "7.5":"儿童节快乐；修复bug，提升体验；20230601",
        "7.6":"修复图标；20230610",
        "7.7":"1.解析管理增加重置优先，优先和排除选择互斥；2.观影设置中屏蔽优先改动到具体解析上；3.新版支持js中获取web嗅探结果，线程逻辑调整；4.观影设置增加手动解析模式；5.云盘接口支持云口令导入；20230628",
        "7.8":"1.替换360分类js文件；2.解析逻辑优化；3.云盘优化；20230721",
        "7.9":"1.升级小程序；20230825",
        "8.0":"1.资源码增加云盘接口同步项；20230826"
    },
    "SrcJu":"2.4",
    "SrcJudesc":{
        "1.0":"聚阅发布",
        "1.1":"1.导入默认为覆盖；2.增加多选分享；3.空书架时加个提示；20230415",
        "1.2":"1.需要更新小程序版本为9；2.调整书架获取依赖方式，防止长时间后台被系统回收的报错；3.调整子页面获取代码逻辑；20230416",
        "1.3":"1.主页源异常报错处理，不能影响更换；2.增加搜索分组设置；3.管理增加搜索接口；4.换源支持更换收藏封面，需要新版软件；5.二级更换写入params时机；6.管理增加接口数显示；20230421",
        "1.4":"1.增加云剪贴板2超出字符的拦截；2.主页源数据获取控制接口类型，避免出错；3.二级写入params和获取调整逻辑；20230422",
        "1.5":"1.调整一级传二级参数；2.调整二级写缓存文件策略；3.搜索内置一个ocr方法；4.场景需要管理增加接口更新和清空；5.升级小程序，分享口令改为云口令；20230427",
        "1.6":"1.添加听书源类型；2.二级代码优化；3.视界再次搜索增加主动停止线程；4.修复切换线路后换源报错问题；5.增加模式快速切换；20230518",
        "1.7":"1.二级更换书源默认根据当前类型，不受主页源类型影响；20230601",
        "1.8":"1.修复图标；20230610",
        "1.9":"1.增加图集源类型；2.主页菜单处理，中间按钮增加长按菜单；3.增加聚搜模式；20230705",
        "2.0":"1.优化新搜索页面；2.二级选集增加强制rule方法；3.搜索页代码封装；4.<最新>代码调整，在收藏显示源名称；20230710",
        "2.1":"1.设置长按增加类型快速切换；2.增加影视分类；3.搜索页聚影搜索改为影视类型长按；20230713",
        "2.2":"1.界面类型按钮增加快速选择源接口；2.修复搜索分组一直存在的bug；3.二级选集公共传参改为子页面动态取；4.暂时停用程序代理聚合搜索；5.二级封面简介等取值优化；6.增加线路动态解析选集列表等方法；7.换源长按增加是否精准搜索；20230718",
        "2.3":"1.修复首次进软件收藏或书架，某些源的报错；20230803",
        "2.4":"1.修复首次使用聚阅报错及无法使用云口令问题；2.接口管理增加文件分享和导入；3.接口增加更新时间显示；4.全局变量梳理，换主页源时清除接口定义变量；5.修复二级oldextra和二级url取值错误；6.增加云口令文件分享支持打开文件直接导入（需海阔8.5版）；7.增加批量选择，批量测试功能；20230825"
    }
};
