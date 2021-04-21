import { MessageBox } from "element-ui";

/**
 * 确认弹窗
 * @returns
 */
export async function confirmFunc({
  message = "",
  title = "",
  confirmText,
  cancelText,
  type,
}) {
  const res = await MessageBox.confirm(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type,
  }).catch(() => {
    return {
      ok: false,
    };
  });
  return {
    ok: res === "confirm",
  };
}

/**
 * a标签文件下载
 * @param {String} target 字符串
 * @param {String} fileName 文件名
 * @example
 * ```
 * simpleDownload(JSON.stringify({ alrale: 'simpleDownload' }, null, '\t'), 'alrale.json')
 * ```
 */
export function simpleDownload(target, fileName) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + target);
  element.setAttribute("download", fileName);
  element.style.display = "none";
  element.click();
}
