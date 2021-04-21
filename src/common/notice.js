// 通知

import { NoticeKey } from "./enum";

// 发送给background.js
function noticeMsg(key, value) {
    if (chrome.runtime) {
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type: "__ajax_proxy",
            to: "background",
            key,
            value,
        });
    }
}

/**全局开关 */
export function noticeSwitchOn(value) {
    noticeMsg(NoticeKey.SWITCH, value)
}

/**同步路由列表 */
export function noticeRoutes(routes) {
    noticeMsg(NoticeKey.ROUTES, routes)
}