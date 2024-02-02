// author@LoyDgIk
const XPopup = com.lxj.xpopup.XPopup;
const DetailUIHelper = com.example.hikerview.ui.detail.DetailUIHelper;
const DisplayUtil = com.example.hikerview.utils.DisplayUtil;
const ActivityManager = com.example.hikerview.ui.ActivityManager;
const R = com.example.hikerview.R;
const Integer = java.lang.Integer;
const ArrayList = java.util.ArrayList;

const Bookmark = com.example.hikerview.model.Bookmark;

const InputPopup = com.example.hikerview.ui.view.popup.InputPopup
const BookmarkFolderPopup = com.example.hikerview.ui.home.view.BookmarkFolderPopup;
const ConfirmPopup = com.example.hikerview.ui.view.popup.ConfirmPopup;
const SettingMenuPopup = com.example.hikerview.ui.setting.SettingMenuPopup;
const CustomBottomRecyclerViewPopup = com.example.hikerview.ui.view.CustomBottomRecyclerViewPopup;
const CustomCenterRecyclerViewPopup = com.example.hikerview.ui.view.CustomCenterRecyclerViewPopup;
const CustomRecyclerViewPopup = com.example.hikerview.ui.view.CustomRecyclerViewPopup;
//const XiuTanResultPopup = com.example.hikerview.ui.view.XiuTanResultPopup;
//const DetectedMediaResult = com.example.hikerview.ui.browser.model.DetectedMediaResult;
const Class = java.lang.Class;
const AutoImportHelper = com.example.hikerview.utils.AutoImportHelper;
const PageParser = com.example.hikerview.service.parser.PageParser;

const UrlDetector = com.example.hikerview.ui.browser.model.UrlDetector;
const PlayerChooser = com.example.hikerview.ui.video.PlayerChooser;
const VideoChapter = com.example.hikerview.ui.video.VideoChapter;
const FJSON = com.alibaba.fastjson.JSON;
function getActivity() {
    let activityThreadClass = Class.forName("android.app.ActivityThread");
    let activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
    let activitiesField = activityThreadClass.getDeclaredField("mActivities");
    activitiesField.setAccessible(true);
    let activities = activitiesField.get(activityThread);
    for (let activityRecord of activities.values()) {
        let activityRecordClass = activityRecord.getClass();
        let pausedField = activityRecordClass.getDeclaredField("paused");
        pausedField.setAccessible(true);
        if (!pausedField.getBoolean(activityRecord)) {
            let activityField = activityRecordClass.getDeclaredField("activity");
            activityField.setAccessible(true);
            let activity = activityField.get(activityRecord);
            //log(activity.getComponentName().getClassName());
            return activity;
        }
    }
    return undefined;
}
//const activityContext = ActivityManager.getInstance().getCurrentActivity();
const activityContext=getActivity();
if (typeof MY_RULE === "undefined") {
    MY_RULE = null;
}

function getVideoChapter(playList) {
    let videoChapterClass = new VideoChapter().getClass();
    return FJSON.parseArray(JSON.stringify(playList), videoChapterClass);
}

function playVideos(playList, pos) {
    if (!Array.isArray(playList)) {
        if ($.type(playList) === "object") {
            playList = [playList];
        } else {
            return false;
        }
    }

    let videoChapter = getVideoChapter(playList);
    if (pos !== void 0 && pos >= 0 && pos < videoChapter.size()) {
        videoChapter.get(pos).setUse(true);
    }
    PlayerChooser.startPlayer(activityContext, videoChapter);
    return true;
}

function toNextPage(url) {
    try {
        let rule = getParam("rule", "", url);
        if (!rule && MY_RULE) {
            url = buildUrl(url, {
                rule: MY_RULE.title
            });
        }
        if (Object.keys(AutoImportHelper).includes("lambda$couldCloudImport$2")) {
            AutoImportHelper.lambda$couldCloudImport$2(url);
        } else {
            let autoImportHelperClass = new AutoImportHelper().getClass();
            let couldCloudImportMethod = autoImportHelperClass.getDeclaredMethod("lambda$couldCloudImport$2", Class.forName("java.lang.String"));
            couldCloudImportMethod.setAccessible(true);
            couldCloudImportMethod.invoke(null, url);
        }
    } catch (e) {
        toast(e.toString());
    }
}

function toPalyPage(url, title) {
    try {
        PlayerChooser.startPlayer(activityContext, title || url, url);
    } catch (e) {
        toast(e.toString());
    }
}

function tryCallBack(callBack, args) {
    try {
        if (callBack == null) {
            return;
        }
        args = args || [];
        dealUrlSimply(callBack.apply(null, args), args[0]);
    } catch (e) {
        let message = "",
            lineNumber = -1;
        if (e instanceof Error) {
            message = e.message;
            lineNumber = e.lineNumber;
        } else {
            message = String(e);
        }
        setError(" 行数：" + lineNumber + " 详情：" + message);
    }
}

function dealUrlSimply(url, title) {
    if (typeof url !== "string" || !url) return;
    if (PageParser.isPageUrl(url)) {
        return toNextPage(url);
    } else if (!DetailUIHelper.dealUrlSimply(activityContext, MY_RULE, null, url || "", null, null) && UrlDetector.isVideoOrMusic(url)) {
        return toPalyPage(url, typeof title === "string" ? title : url);
    }
}

function getDefaultValue(v, type, defaultValue) {
    if ($.type(v) !== type) return defaultValue;
    return v || defaultValue;
}

function getNumberValue(v, func, defaultValue) {
    if (!($.type(v) === "number" || func(v))) return defaultValue;
    return v || defaultValue;
}

function getStringArray(arr, defaultValue) {
    if ($.type(arr) !== "array") return defaultValue;
    return arr.map(v => String(v));
}

function checkStringArray(arr) {
    arr.forEach((v, i) => arr[i] = String(v));
}

function getNumberArray(arr, defaultValue) {
    if ($.type(arr) !== "array") return defaultValue;
    return arr.map(v => Number(v) || 0);
}


function getBookList(arr) {
    let list = new ArrayList();
    for (let it of arr) {
        let bookmark = new Bookmark();
        bookmark.setTitle(it.title || "");
        bookmark.setDir(false);
        bookmark.setUrl(it.url || it.title || "");
        bookmark.setIcon(it.icon || "");
        list.add(bookmark);
    }
    return list;
}
/*
function getDetectedMediaResults(arr) {
    let list = new ArrayList();
    for (let it of arr) {
        let bookmark = new DetectedMediaResult(it, it);
        list.add(bookmark);
    }
    return list;
}
*/
function builderXPopup() {
    return new XPopup.Builder(activityContext)
        .borderRadius(DisplayUtil.dpToPx(activityContext, 16));
}

/*
function loading() {
    return builderXPopup()
        .asLoading("正在加载中")
        .show();
}
*/


function selectCenterMark({
    click,
    title,
    options,
    icons,
    noAutoDismiss,
    position
}) {
    options = getStringArray(options, []);
    icons = getNumberArray(icons, null);
    return builderXPopup()
        .autoDismiss(!noAutoDismiss)
        .asCenterList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= 0, 0), (index, value) => {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        })
        .show();
}

function selectBottomMark({
    click,
    title,
    options,
    icons,
    noAutoDismiss,
    position
}) {
    options = getStringArray(options, []);
    icons = getNumberArray(icons, null);
    return builderXPopup()
        .autoDismiss(!noAutoDismiss)
        .asBottomList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= 0, 0), (index, value) => {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        })
        .show();
}

function selectCenter({
    click,
    longClick,
    title,
    options,
    columns,
}) {

    let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    let custom = new CustomCenterRecyclerViewPopup(activityContext)
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .with(getStringArray(options, []), getDefaultValue(columns, "number", 3), clickListener);
    return builderXPopup()
        .asCustom(custom)
        .show();
}

function selectBottom({
    click,
    longClick,
    title,
    options,
    columns,
    height,
    noAutoDismiss
}) {
    let clickListener = new CustomRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    let custom = new CustomRecyclerViewPopup(activityContext)
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .height(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
        .dismissAfterClick(!noAutoDismiss)
        .with(getStringArray(options, []), getDefaultValue(columns, "number", 3), clickListener);
    return builderXPopup()
        .asCustom(custom)
        .show();
}

function selectCenterIcon({
    click,
    title,
    iconList,
    columns,
}) {
    let clickListener = new BookmarkFolderPopup.ClickListener({
        onLongClick(value, index) {},
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    iconList = getDefaultValue(iconList, "array", []);
    iconList = getBookList(iconList);

    let custom = new BookmarkFolderPopup(activityContext)
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .with(iconList, getDefaultValue(columns, "number", 2), clickListener);
    XPopup.setAnimationDuration(200);
    return builderXPopup()
        .asCustom(custom)
        .show();
}


function inputTwoRow({
    title,
    desc1,
    desc2,
    confirm,
    cancel
}) {
    let okListener = new InputPopup.OkListener({
        ok(text1, text2) {
            tryCallBack(getDefaultValue(confirm, "function", null), [text1, text2]);
        }
    });
    let cancelListener = new InputPopup.CancelListener({
        cancel() {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }
    });
    let custom = new InputPopup(activityContext).bind(getDefaultValue(title, "string", "输入框"), getDefaultValue(desc1, "string", "请输入"), getDefaultValue(desc2, "string", "请输入"), okListener)
        .setCancelListener(cancelListener);
    return builderXPopup()
        .asCustom(custom)
        .show();
}

function inputAutoRow({
    title,
    content,
    confirm,
    cancel,
    okTitle,
    cancelTitle
}) {
    let okListener = new ConfirmPopup.OkListener({
        ok(text) {
            tryCallBack(getDefaultValue(confirm, "function", null), [text]);
        },
        cancel() {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }
    });

    let custom = new ConfirmPopup(activityContext).bind(getDefaultValue(title, "string", "输入框"), getDefaultValue(content, "string", ""), okListener)
        .setBtn(getDefaultValue(okTitle, "string", "确认"), getDefaultValue(okTitle, "string", "取消"));
    return builderXPopup()
        .asCustom(custom)
        .show();
}

function confirm({
    title,
    content,
    confirm,
    cancel,
    okTitle,
    cancelTitle
}) {
    return builderXPopup()
        .asConfirm(getDefaultValue(title, "string", "提示"), getDefaultValue(content, "string", ""), getDefaultValue(cancelTitle, "string", "取消"), getDefaultValue(okTitle, "string", "确认"), () => {
            tryCallBack(getDefaultValue(confirm, "function", null));
        }, () => {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }, false)
        .show();
}

function selectBottomSettingMenu({
    click,
    //title,
    options,
}) {
    let onItemClickListener = new SettingMenuPopup.OnItemClickListener({
        onClick(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    options = getStringArray(options, []);
    let arrayList = new ArrayList();
    options.forEach(v => arrayList.add(v));

    let custom = new SettingMenuPopup(activityContext, "设置", arrayList, onItemClickListener);
    return builderXPopup()
        .moveUpToKeyboard(false)
        .asCustom(custom)
        .show();
}

function selectBottomRes({
    click,
    longClick,
    menuClick,
    title,
    options,
    columns,
    height,
    noAutoDismiss
}) {
    let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index, resOptionsManage]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index, resOptionsManage]);
        }
    });
    const list = getStringArray(options, []);
    let custom = new CustomBottomRecyclerViewPopup(activityContext)
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .withHeight(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
        .dismissWhenClick(!noAutoDismiss)
        .with(list, getDefaultValue(columns, "number", 2), clickListener);
    let resOptionsManage = {
        list: list,
        change() {
            checkStringArray(list);
            custom.notifyDataChange();
        },
        removed(pos) {
            checkStringArray(list);
            if (pos >= list.length) {
                throw new Error("pos大于列表长度");
            }
            custom.notifyDataRemoved(pos);
        },
        changeColumns: custom.changeSpanCount.bind(custom)
    }
    if (typeof menuClick === "function") {
        custom.withMenu(new android.view.View.OnClickListener({
            onClick() {
                tryCallBack(getDefaultValue(menuClick, "function", null), [resOptionsManage]);
            }
        }));
    }
    return builderXPopup()
        .autoDismiss(false)
        .asCustom(custom)
        .show();
}
/*
function selectBottomCard({
    click,
    longClick,
    menuClick,
    title,
    options,
    noAutoDismiss
}) {
    let updataOptions = (newoptions) => {
        custom.updateData(getDetectedMediaResults(getStringArray(newoptions, [])));
    };
    let clickListener = new XiuTanResultPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index, updataOptions]);
        },
        longClick() {

        },
        click(value, index) {
            custom.longClick("");
            tryCallBack(getDefaultValue(click, "function", null), [value, index, updataOptions]);
        }
    });
    const list = getDetectedMediaResults(getStringArray(options, []));
    let custom = new XiuTanResultPopup(activityContext)
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .withDismissOnClick(!noAutoDismiss)
        .with(list, clickListener);
    if (typeof menuClick === "function") {
        custom.withIcon(new android.view.View.OnClickListener({
            onClick() {
                tryCallBack(getDefaultValue(menuClick, "function", null), [updataOptions]);
            }
        }));
    }
    return builderXPopup()
        .autoDismiss(false)
        .asCustom(custom)
        .show();
}*/

$.exports = {
    confirm,
    inputAutoRow,
    selectCenter,
    selectCenterMark,
    //loading,
    selectBottom,
    selectBottomMark,
    selectCenterIcon,
    inputTwoRow,
    selectBottomSettingMenu,
    selectBottomRes,
    icon: R.drawable,
    playVideos
};