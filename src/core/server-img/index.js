import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import { isNull, isObject, isString, isUndefined } from 'lodash'

// import
const compute_css = (_key, _position) => {
  if (isObject(_key)) {
    _key = _key.key;
    _position = _key.position
  }
  //没有位置就是单图
  if (isNull(_position) || isUndefined(_position)) {
    return other_compute({ key: _key, theme: UserCtr.theme })
  } else {
    //没有位置就是单图
    if (sprite_compute[_key]) {
      return sprite_compute[_key]({ position: _position, theme: UserCtr.theme })
    }
  }
};
export { compute_css };
//
// compute_css('pc-left-menu-bg-image',1) //雪碧图是由位置的
// compute_css('pc-img-bg-menu-live)// 单图
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例：  compute_css({key:"pc-left-menu-bg-image",position:"item_1"})
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：  compute_css({ key:"pc-img-bg-menu-live"})
 */

