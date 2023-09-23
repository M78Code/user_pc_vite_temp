/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:00:07
 * @LastEditTime: 2023-08-02 23:33:52
 * @LastEditors: jiffy
 * @Description: 劫持事件统一绑定 不允许直接使用addEventListener来直接绑定事件
 *
 */
import { onBeforeUnmount, ref, watch, unref } from "vue";
import lodash from "lodash";

/**
 * 劫持tab页 visibilityChange显示事件
 * @param {function} visible
 * @param {functon} hidden
 * @returns {remove}
 */
function usePageVisibilityChange(visible, hidden) {
  const remove = useEventListener({
    name: "visibilityChange",
    listener: () => {
      switch (document.visibilityState) {
        case "visible":
          lodash.isFunction(visible) && visible();
          break;
        case "hidden":
          lodash.isFunction(hidden) && hidden();
          break;
      }
    },
  });
  return remove;
}

/**
 * 打开一个open url页面
 * 默认在 onBeforeMount 会取消message方法
 * @param {Object} param0
 * @param {*} param0.url
 * @param {string} [param0.target=""]
 * @param {*} param0.features
 * @param {function} param0.load 加载完成执行
 * @param {function} param0.unload 关闭执行
 * @param {function} param0.error 报错执行
 * @param {function} param0.message //传递message方法
 * @param {number} [param0.wait=0] 默认不防抖
 * @returns {postMessage,remove,instance} instance window.open返回的对象

 */
/**
 * 打开一个open url页面
 * 默认在 onBeforeMount 会取消message方法
 * @param
 * @param {*} callback 打开的页面 发送消息 要处理的方法
 */
function useOpenWithPostMessage({
  url,
  target = "",
  features,
  load,
  unload,
  error,
  message,
  wait = 0,
}) {
  // 如果弹出框没有被阻止且加载完成
  const instance = window.open(url, target, features);
  const this_origin = window.location.origin;
  function receiveMessage(event) {
    // 我们能相信信息的发送者吗？(也许这个发送者和我们最初打开的不是同一个页面).
    //只有当前才可以通讯
    if (event.origin !== this_origin) return;
    lodash.isFunction(message) && message(event);
  }
  const remove = useEventListener({
    name: "message",
    listener: receiveMessage,
    wait,
  });
  instance.onload = function () {
    console.log("window.open loaded");
    lodash.isFunction(load) && load();
  };
  instance.onunload = function () {
    lodash.isFunction(unload) && unload();
    remove();
  };
  instance.onerror = function () {
    lodash.isFunction(error) && error();
    remove();
  };
  return { postMessage: instance.postMessage, instance, remove };
}
/**
 * 劫持事件绑定 默认防抖 50
 * @param {Object} param0
 * @param {Window & typeof globalThis} [param0.el=window]  //dom
 * @param {string} [param0.name="click"]  //事件名称
 * @param {function} param0.listener  //函数
 * @param {boolean} [param0.options=false]  //removeEventListener 第三个参数
 * @param {boolean} [param0.autoRemove=true]  //默认移除事件
 * @param {boolean} [param0.isDebounce=true]  //防抖/节流  wait=0时无效
 * @param {number} [param0.wait=50] //默认防抖节流时间  =0 时 没有防抖/节流
 */
function useEventListener({
  el = window,
  name = "click",
  listener,
  options = false,
  autoRemove = true,
  config = {},
  isDebounce = true,
  wait = 50,
}) {
  /* eslint-disable-next-line */
  let remove = () => { };
  const isAddRef = ref(false);
  if (el) {
    const element = ref(el);
    const handler =
      wait == 0
        ? listener
        : (isDebounce
          ? lodash.debounce(listener, wait, config)
          : lodash.throttle(listener, wait, config)
        );




    const realHandler = wait ? handler : listener;
    const removeEventListener = (e) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    const addEventListener = (e) =>
      e.addEventListener(name, realHandler, options);
    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true }
    );
    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
    // autoRemove && onBeforeUnmount(() => remove(element.value));
  }

  return remove;
}
export { useEventListener, usePageVisibilityChange, useOpenWithPostMessage };
