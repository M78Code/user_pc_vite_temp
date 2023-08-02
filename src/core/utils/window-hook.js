/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:00:07
 * @LastEditTime: 2023-08-02 16:13:09
 * @LastEditors: jiffy
 * @Description: 劫持window统一事件 不允许直接使用window.removeEventListener 来直接绑定事件
 *
 */
import { onBeforeMount } from "vue";
import { isFunction } from "lodash";
/**
 * 劫持window统一事件 不允许使用window 来直接绑定事件
 */
function useWindowEvent(eventName, fun, bol = false) {
  window.addEventListener(eventName, fun, bol);
  return {
    remove: function () {
      window.removeEventListener(eventName, fun);
    },
  };
}
/**
 * 劫持tab页 visibilityChange显示事件
 * @param {*} visible
 * @param {*} hidden
 * @returns {remove}
 */
function usePageVisibilityChange(visible, hidden) {
  const { remove } = useWindowEvent("visibilityChange", () => {
    switch (document.visibilityState) {
      case "visible":
        isFunction(visible) && visible();
        break;
      case "hidden":
        isFunction(hidden) && hidden();
        break;
    }
  });
  return { remove };
}

/**
 * 打开一个open url页面
 * 默认在 onBeforeMount 会取消message方法
 * @param {*} {url,target,features}
 * @param {*} callback 打开的页面 发送消息 要处理的方法
 * @returns {postMessage,remove}
 */
function useOpenWithPostMessage(openConfig, callback) {
  // 如果弹出框没有被阻止且加载完成
  var instance = window.open(
    openConfig.url,
    openConfig.target,
    openConfig.features
  );
  const this_origin = window.location.origin;
  function receiveMessage(event) {
    // 我们能相信信息的发送者吗？(也许这个发送者和我们最初打开的不是同一个页面).
    //只有当前才可以通讯
    if (event.origin !== this_origin) return;
    // event.source 是我们通过 window.open 打开的弹出页面 popup
    // event.data 是 instance 发送给当前页面的消息
    isFunction(callback) && callback(event.data, event);
  }
  const { remove } = useWindowMessage(receiveMessage);
  return { postMessage: instance.postMessage, instance, remove };
}
/**
 * window beforeunload事件
 * @param {*} callback  事件
 */
function usePageBeforeunload(callback) {
  const { remove } = useWindowEvent("beforeunload", callback);
  onBeforeMount(callback);
  return { instance, remove };
}
/**
 * window beforeunload事件
 * @param {*} callback  事件
 */
function useWindowMessage(callback) {
  const { remove } = useWindowEvent("message", callback);
  onBeforeMount(remove);
  return { instance, remove };
}

export {
  useWindowEvent,
  usePageVisibilityChange,
  usePageBeforeunload,
  useOpenWithPostMessage,
  useWindowMessage,
};
