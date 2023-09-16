import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import { isNull, isUndefined } from 'lodash'
// import
const compute_css = ({ key, position }) => {
  if (!isNull(position) && !isUndefined(position)) {
    if (sprite_compute[key]) {
      return sprite_compute[key]({ position, theme: UserCtr.theme })
    }
  } else {
    return other_compute({ key, theme: UserCtr.theme })
  }
};
export { compute_css };
//
// compute_css({key:"pc-left-menu-bg-image",position:"item_1"})
// compute_css({ key:"pc-img-bg-menu-live"})
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例：  compute_css({key:"pc-left-menu-bg-image",position:"item_1"})
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：  compute_css({ key:"pc-img-bg-menu-live"})
 */

