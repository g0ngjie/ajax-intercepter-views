import { StoreType } from "./enum";

/**获取数据 */
function getStore(key) {
    return new Promise(resole => {
        if (chrome.storage) {
            chrome.storage.local.get(key, (result) => {
                if (result.hasOwnProperty(key)) resole({ ok: true, data: result[key] })
                else resole({ ok: false })
            });
        } else resole({ ok: false })
    })
}

/**保存数据 */
function setStore(k, v) {
    chrome.storage && chrome.storage.local.set({ [k]: v });
}

/**获取国际化 */
export async function getLang() {
    const { ok, data } = await getStore(StoreType.LANG)
    if (ok) return data
    return 'en'
}

/**设置国际化 */
export function setLang(v) {
    setStore(StoreType.LANG, v)
}

/**同步全局开关 */
export function setGlobalSwitchOn(value) {
    setStore(StoreType.SWITCH, value)
}

/**获取全局开关状态 */
export async function getGlobalSwitchOn() {
    const { ok, data } = await getStore(StoreType.SWITCH)
    if (ok) return data
    return false
}

/**保存路由列表 */
export function setRoutes(value) {
    setStore(StoreType.ROUTES, value)
}

/**获取路由列表 */
export async function getRoutes() {
    const { ok, data } = await getStore(StoreType.ROUTES)
    if (ok) return data
    return []
}