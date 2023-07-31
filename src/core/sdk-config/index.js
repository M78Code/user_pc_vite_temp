/*
 * @Author: cooper
 * @Date: 2023-07-30 15:13:55
 * @Description: postmessage 接收配置sdk 配置
 */
import { set, merge } from "lodash";
import { onMounted, onUnmounted } from "vue";
//一般来说 项目的config是初始化就配置设定好的
// 如果要更改 也是通过方法来改 暂时静态的 一般来说SDK打包 配置就固定了
const config = {
  platform: {
    name: "PC", //平台名称
    isPc: true,
    isMobile: false,
  }, // 用UA来判断运行平台或者配置
  zhuge_config: {
    //诸葛埋点相关
    enable: false,
    js_url:
      "https://updata.yaohuakuo.com/zhuge.js?v=" +
      new Date().toJSONString().slice(0, 10),
    mid: [], //环境的商户id
    app_key: "c41f8b7cb97640838d90a73a0f077a43", //生产环境的key
    config:{} //SDK配置项
  },
  axios: {
    //通用请求axios配置
    timeout: 15000,
  },
};
/**
 * 更改CONFIG的方法
 * @param {*} key 键
 * @param {*} value  值
 */
function update_config(key, value) {
  console.log("update config:", key, value);
  set(config, key, value);
}
/**
 *合并新的 config
 */
function merge_config(newConfig) {
  merge(config, newConfig);
  return config;
}
function use_get_sdk_config() {
  onMounted(() => {
    listener_message();
  });

  //监听postMessage传过来的数据
  const listener_message = () => {
    window.addEventListener("message", event_listener_message);
  };

  /**
   * @description: postMessage事件监听，通过传过来的字段数据修改sdk数据并更新，
   */
  const event_listener_message = (e) => {
    console.log("post_message", e.data);
    const list = e.data || [];
    if (list.length > 0) {
      const modular_type = list[0].modular_type; //css_modular，css_modular  通过这个字段判断数据来源是css 还是js
      if (modular_type === "css_modular") {
        let theme_style_content = "";
        const themeKeys = {
          theme01: "day",
          theme02: "night",
          theme01_y0: "day",
          theme02_y0: "night",
        };
        let local_list = sessionStorage.getItem("pc_css_key")
          ? JSON.parse(sessionStorage.getItem("pc_css_key"))
          : [];
        if (local_list.length > 0) {
          // key 去重
          local_list = diffArr([...list, ...local_list]);
        } else {
          local_list = list;
        }
        // 保存在本地
        sessionStorage.setItem("pc_css_key", JSON.stringify(local_list));
        console.log(local_list);
        for (const item of local_list) {
          // status===-1 取设置的颜色，status===1 恢复原来的颜色
          let val =
            item.status === -1
              ? item.setting[themeKeys[this.theme]]
              : item.default[themeKeys[this.theme]];
          if (val) {
            theme_style_content += `\n  --qq--${item.key}: ${val};`;
          }
        }
        console.log("css_key", theme_style_content);
        // 添加变量
        setTheme.change_theme_variable(this.theme, theme_style_content);
      } else {
        // js_sdk 部分
        // console.log("post_message", e.data);
        const js_list = e.data || [];

        let config = sessionStorage.getItem("pc_js_key")
          ? JSON.parse(sessionStorage.getItem("pc_js_key"))
          : {};
        for (const item of js_list) {
          // const group = item.group.split('.')[1]
          // config[group] = !_.isEmpty(config[group])?config[group]:{}
          if (item.values_type === "boolean") {
            config[item.key.trim()] = item.value === "false" ? false : true;
          }
        }
        sessionStorage.setItem("pc_js_key", JSON.stringify(config));
        console.log(config);
        this.vx_set_js_sdk(config);
      }
    }
  };

  const diffArr = (arr) => {
    var obj = {};
    arr = arr.reduce(function (item, next) {
      obj[next.key] ? "" : (obj[next.key] = true && item.push(next));
      return item;
    }, []);
    return arr;
  };

  onUnmounted(() => {});
  return () => {
    window.removeEventListener("message", listener_message);
  };
}
export { config, update_config, merge_config, use_get_sdk_config };
