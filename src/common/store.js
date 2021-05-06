import { deepClone } from "@alrale/common-lib";
import { StoreType } from "./enum";

/**获取数据 */
function getStore(key) {
  return new Promise((resolve) => {
    if (browser.storage) {
      browser.storage.local.get(key, (result) => {
        if (result.hasOwnProperty(key))
          resolve({ ok: true, data: result[key] });
        else resolve({ ok: false });
      });
    } else resolve({ ok: false });
  });
}

/**保存数据 */
function setStore(k, v) {
  // 清除vue对象上的原型链
  const value = deepClone(v);
  browser.storage && browser.storage.local.set({ [k]: value });
}

/**获取所有 */
export function getStoreAll() {
  return new Promise((resolve) => {
    if (browser.storage) {
      const { LANG, SWITCH, ROUTES, TAGS, MODE, REDIRECT } = StoreType;
      browser.storage.local.get(
        [LANG, SWITCH, ROUTES, TAGS, MODE, REDIRECT],
        (result) => {
          resolve({ ok: true, data: result });
        }
      );
    } else resolve({ ok: false });
  });
}

/**获取国际化 */
export async function getLang() {
  const { ok, data } = await getStore(StoreType.LANG);
  if (ok) return data;
  return "en";
}

/**设置国际化 */
export function setLang(v) {
  setStore(StoreType.LANG, v);
}

/**同步全局开关 */
export function setGlobalSwitchOn(value) {
  setStore(StoreType.SWITCH, value);
}

/**获取全局开关状态 */
export async function getGlobalSwitchOn() {
  const { ok, data } = await getStore(StoreType.SWITCH);
  if (ok) return data;
  return false;
}

/**保存路由列表 */
export function setRoutes(value) {
  setStore(StoreType.ROUTES, value);
}

/**获取路由列表 */
export async function getRoutes() {
  const { ok, data } = await getStore(StoreType.ROUTES);
  if (ok) return data;
  return [];
}

/**保存Tag列表 */
export function setTags(value) {
  setStore(StoreType.TAGS, value);
}

/**获取Tag列表 */
export async function getTags() {
  const { ok, data } = await getStore(StoreType.TAGS);
  if (ok) return data;
  return [];
}

/**同步模式状态 */
export function setMode(value) {
  setStore(StoreType.MODE, value);
}

/**获取模式 */
export async function getMode() {
  const { ok, data } = await getStore(StoreType.MODE);
  if (ok) return data;
  return "interceptor";
}

/**同步 重定向列表 */
export function setRedirects(value) {
  setStore(StoreType.REDIRECT, value);
}

/**获取 重定向列表 */
export async function getRedirects() {
  const { ok, data } = await getStore(StoreType.REDIRECT);
  if (ok) return data;
  return [];
}
