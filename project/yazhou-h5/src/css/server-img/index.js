import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import { computed, ref } from "vue";
import { UserCtr, useMittOn, MITT_TYPES } from "src/core/";
import { isNull, isObject, isUndefined } from 'lodash'

const theme = ref(UserCtr.theme);
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, function (v) {
  theme.value = v;
})
// import
const compute_css = (_key, _position) => {
  if (isObject(_key)) {
    _position = _key.position
    _key = _key.key;
  }
  return computed(() => {
    if (theme.value) {
      //用于触发computed不然好像不触发
    }
    //没有位置就是单图
    if (isNull(_position) || isUndefined(_position)) {
      return other_compute({ key: _key, theme: theme.value })
    } else {
      //没有位置就是单图

      if (sprite_compute[_key]) {
        return sprite_compute[_key]({ position: _position, theme: theme.value })
      }
    }
  }).value
};

/**
 * 只要图片 有时候 使用img加载 错误时候才显示 所以只要图片地址
*/
function compute_img(_key, _position) {
  const background = compute_css(_key, _position);
  const img = background['background-image'] || ""
  return String(img).replace(')', '').split("(")[1]
}
export { compute_css, compute_img };
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例： compute_css(key,position) || compute_css({key,position}) 
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：   compute_css(key) || compute_css({key})// 单图
 */

