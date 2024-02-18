import { sprite, local_config } from 'project_path/src/css/server-img/'
import { computed, ref } from "vue";
import all_assets from "app/job/output/assets/index.json";

import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { isObject, get } from 'lodash'
const theme = ref(UserCtr.theme);
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, function (v) {
  theme.value = UserCtr.theme;
})
// import
const compute_css_obj = (_key, _position) => {
  if (isObject(_key)) {
    _position = _key.position
    _key = _key.key;
  }

  return computed(() => {
    const server_resource = all_assets[theme.value];
    //先从商户配置拿 再从本地拿 
    let url = get(server_resource, _key)
    if (!url) {
      //从本地拿 key或者url
      const local_key_or_url = get(local_config, CURRENT_ENV);
      //本地如果是url是娶不到值的
      url = get(server_resource, local_key_or_url) || local_key_or_url
    }
    const _style = {
      backgroundImage: `url(${url})`,
      backgroundRepeat: "no-repeat",
      url: url
    };
    if (theme.value) {
      //用于触发computed不然好像不触发
    }
    //没有位置就是单图
    if (_position && sprite[_key]) {
      Object.assign(_style, sprite[_key](_position, theme.value))
    }
    return _style
  }).value
};

/**
 * 只要图片 有时候 使用img加载 错误时候才显示 所以只要图片地址
*/
function compute_img_url(_key, _position) {
  return compute_css_obj(_key, _position).url
}
export { compute_css_obj, compute_img_url };
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例： compute_css_obj(key,position) || compute_css_obj({key,position}) 
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：   compute_css_obj(key) || compute_css_obj({key})// 单图
 */


/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例： compute_css_obj(key,position) || compute_css_obj({key,position}) 
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：   compute_css_obj(key) || compute_css_obj({key})// 单图
 */


