
/**
 *    
 *  足球 十五分钟 玩法
 *   
 */

import * as TemplateCommon from "./template-common.js"


let hps_15_minute = TemplateCommon.hps_15_minute


 


  //  足球 十五分钟 玩法
 
  export const template_24 = {
    main_handicap_list: [
      ...TemplateCommon.clone_arr(hps_15_minute),
      ...TemplateCommon.clone_arr(hps_15_minute),
      
    ],
  
  } 


  
    //   列表宽度计算模板
    export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 6
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
  main_handicap_height:130,
 
}

