import ChromePlatform from './impl/ChromePlatform';
import FirefoxPlatform from './impl/FirefoxPlatform';
import EdgePlatform from './impl/EdgePlatform';
import NodePlatform from './impl/NodePlatform';
import UnknownPlatform from './impl/UnknownPlatform';

// 这个环境检测的代码复制于 https://stackoverflow.com/questions/7507638/any-standard-mechanism-for-detecting-if-a-javascript-is-executing-as-a-webworker
const isNode = ("undefined" !== typeof global) && ('[object global]' === Object.prototype.toString.call(global));
const isNodeProcess = isNode && !!process.env.NODE_UNIQUE_ID;
const isWebWorker = !isNode && ('undefined' !== typeof WorkerGlobalScope) && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator);
const isBrowser = !isNode && !isWebWorker && ("undefined" !== typeof navigator) && ("undefined" !== typeof document);
const isBrowserWindow = isBrowser && !!window.opener;

// TODO 还有一些以注释形式存在于其它文件中的chrome调用，之后记得处理
/**
 * @type AbstractPlatform
 */
let currentPlatform;
if (isBrowser) {
    let head = navigator.userAgent;
    if (head.indexOf("Edg") > 1) {
        // Edge的userAgent即有Chrome又有Edg，因此先判断Edg
        currentPlatform = new EdgePlatform();
    } else if (head.indexOf("Chrome") > 1) {
        currentPlatform = new ChromePlatform();
    } else if (head.indexOf("Firefox") > 1) {
        currentPlatform = new FirefoxPlatform();
    }
} else if (isNode) {
    currentPlatform = new NodePlatform();
}
if (currentPlatform === undefined) {
    currentPlatform = new UnknownPlatform();
}

/**
 * 帮助类，本文件相关方法的所有注释可参考AbstractPlatform。
 * <p>
 * 为了在门面模式和易用性方面做权衡，Helper方法有部分是为实际方法做了包装的，但是做包装的时候务必注意不能增加任何新行为，最好只有帮助提供"默认参数"的用途
 */
export default class PlatformHelper {

    static get isBackground() {
        return currentPlatform.isBackground;
    };

    static get isMobile() {
        return currentPlatform.isMobile;
    }

    static get PlatformType() {
        return currentPlatform.PlatformType;
    }

    static get PlatformInstance() {
        return currentPlatform;
    }

    static get Message() {
        return messageHelper;
    }

    static get Storage() {
        return storageHelper;
    }

    static get BrowserAction() {
        return browserActionHelper;
    }

    static get Extension() {
        return extensionHelper;
    }

    static get Tabs() {
        return tabsHelper;
    }

    static get Notification() {
        return notificationHelper;
    }

    /**
     * (这个不是指Windows系统，而是指浏览器的窗口
     */
    static get Windows() {
        return windowsHelper;
    }

    static get Downloads() {
        return downloadsHelper;
    }

    static get Lifecycle() {
        return lifecycleHelper;
    }

    static get Http() {
        return httpHelper;
    }
}

// 以下为分类API Helper

class MessageHelper {
    send(type, data) {
        return currentPlatform.sendMessage(type, data);
    }

    registerListener(id, type, listener) {
        return currentPlatform.addMessageListener(id, type, listener);
    }
}

class StorageHelper {
    getLocalStorage(name) {
        return currentPlatform.getLocalStorage(name);
    }

    saveLocalStorage(name, data) {
        return currentPlatform.saveLocalStorage(name, data);
    }
}

class BrowserActionHelper {
    removePopup() {
        return this.setPopupURL('');
    }

    setPopupURL(url) {
        if (!url || typeof url !== 'string') {
            url = ''
        }
        return currentPlatform.setPopup(url);
    }

    addIconClickListener(listener) {
        return currentPlatform.addIconClickListener(listener);
    }
}

class ExtensionHelper {
    getURL(file) {
        return currentPlatform.getURLForExtensionFile(file);
    }
}

class TabsHelper {
    create(url) {
        return currentPlatform.createTab(url);
    }

    createWithExtensionFile(file) {
        return this.create(PlatformHelper.Extension.getURL(file));
    }
}

class NotificationHelper {
    create(id, title, message, imageUrl) {
        return this.createWithSpecialIcon(id, PlatformHelper.Extension.getURL('/assets/image/icon.png'), title, message, imageUrl);
    }

    /**
     * 一般使用create即可，只有需要显示特殊图标的时候才用这个方法
     */
    createWithSpecialIcon(id, iconUrl, title, message, imageUrl) {
        return currentPlatform.createNotifications(id, iconUrl, title, message, imageUrl);
    }

    addClickListener(listener) {
        return currentPlatform.addNotificationClickListener(listener);
    }
}

/**
 * (这个不是指Windows系统，而是指浏览器的窗口。
 * <p>
 * 虽然这个命名有歧义，但是为了尊重浏览器的扩展api命名所以还是选择这个名字
 * <p>
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows
 */
class WindowsHelper {
    create(url, type, width, height) {
        return currentPlatform.createWindow(url, type, width, height);
    }

    // TODO Chrome已经将panel标记为弃用，Edge也不支持panel，需要尝试是否可以删除该方法，改用createPopupWindow完成需求
    createPanelWindow(url, width, height) {
        return this.create(url, 'panel', width, height);
    }

    createPopupWindow(url, width, height) {
        return this.create(url, 'popup', width, height);
    }

    remove(windowId) {
        return currentPlatform.removeWindow(windowId);
    }

    getAllWindow() {
        return currentPlatform.getAllWindow();
    }
}

class DownloadsHelper {
    downloadURL(url, filename, saveAs) {
        return currentPlatform.download(url, filename, saveAs);
    }
}

class LifecycleHelper {
    addInstalledListener(listener) {
        return currentPlatform.addInstallListener(listener);
    }
}

class HttpHelper {
    sendGet(url) {
        return currentPlatform.sendHttpRequest(url, 'GET');
    }
}

const messageHelper = new MessageHelper();
const storageHelper = new StorageHelper();
const browserActionHelper = new BrowserActionHelper();
const extensionHelper = new ExtensionHelper();
const tabsHelper = new TabsHelper();
const notificationHelper = new NotificationHelper();
const windowsHelper = new WindowsHelper();
const downloadsHelper = new DownloadsHelper();
const lifecycleHelper = new LifecycleHelper();
const httpHelper = new HttpHelper();
