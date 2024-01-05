/**
 *
 * 1号玩法模板
 *
 */
import DetailPlayTemplateBaseClass from "../base/detail-play-template-base-class.js";

// 默认布局配置
const default_layout_config = {
  column_number: 1,
};
// 默认样式配置
const default_style_config = {};

class DetailPlayTemplate1Class extends DetailPlayTemplateBaseClass {
  constructor() {
    super();
  }
  /**
   *  初始化玩法数据
   * @param {*} params
   */
  init_hp_data(hp_obj = {}, params = {}) {
    super.init_hp_data(hp_obj, params);
  }
  //  项目
  //组件标识，PC 可能出现多种详情组件
  /**
   * 初始化 布局数据
   */
  init_layout_data(params = {}) {
    let obj = Object.assign({}, default_layout_config, params);
    super.init_layout_data(obj);
  }
  /**
   * 初始化 样式数据
   */
  init_style_data(params = {}) {
    let obj = Object.assign({}, default_style_config, params);
    super.init_style_data(obj);
  }


}
export default DetailPlayTemplate1Class;
