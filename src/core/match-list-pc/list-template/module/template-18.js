/**
 * 18号模板  冠军玩法
 */
import * as TemplateCommon from "./template-common.js"

  // 18号模板  冠军玩法
  export const template_18 = {
  } 
  //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
}
  /**
   * @Description 设置模板table宽度
   * @param {number} total_width 列表总宽度
  */
  export  const set_template_width=(total_width)=>{
    let base_config=  TemplateCommon.set_template_width_base(total_width, width_config)
    // 加工 base_config 
    return base_config
  }
// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
      // 主盘口高度
      main_handicap_height:0,
      // 是否需要动态计算高度
      is_dynamic_compute_height:true,
}
