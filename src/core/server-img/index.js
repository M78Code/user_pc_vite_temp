import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import { isNull, isObject, isUndefined } from 'lodash'

// import
const compute_css = (_key, _position) => {
  if (isObject(_key)) {
    _position = _key.position
    _key = _key.key;
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
// export { compute_css };
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例： compute_css(key,position) || compute_css({key,position}) 
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：   compute_css(key) || compute_css({key})// 单图
 */


export * from 'project_path/src/css/server-img/'