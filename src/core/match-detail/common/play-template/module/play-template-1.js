/**
 *
 * 1号玩法模板
 *
 */
import DetailPlayTemplateBaseClass from "../base/detail-play-template-base-class.js";

// 默认布局配置
const default_layout_config = {
   default :{column_number: 1,} ,
   "app-h5" :{column_number: 1,} 
};
// 默认样式配置
const default_style_config = {
 
};



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
   

   let p_obj =  default_layout_config[ this.PROJECT_NAME ] ||{}
   let d_obj =  default_layout_config['default'] ||{}


  let  p_config =  Object.assign({} , d_obj ,p_obj)
    let obj = Object.assign({}, p_config, params);
    super.init_layout_data(obj);
  }
  /**
   * 初始化 样式数据
   */
  init_style_data(params = {}) {

    
   let p_obj =  default_style_config[ this.PROJECT_NAME ] ||{}
   let d_obj = default_style_config['default'] ||{}


  let  p_config =  Object.assign({} , d_obj ,p_obj)

    let obj = Object.assign({}, p_config, params);
    super.init_style_data(obj);
  }




}
export default DetailPlayTemplate1Class;
