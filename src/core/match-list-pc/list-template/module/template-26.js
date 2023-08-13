
/**
 *    // 虚拟篮球
 *    源名字： template_1004  template1004
 */

import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template


 
  // 虚拟篮球

  export const template_26 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 20043, ot: '1' },
          { ...ol_template, _hpid: 20043, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20045, ot: '1' },
          { ...ol_template, _hpid: 20045, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20044, ot: 'Over' },
          { ...ol_template, _hpid: 20044, ot: 'Under' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20046, ot: 'Yes' },
          { ...ol_template, _hpid: 20046, ot: 'No' },
          { ...ol_template },
        ],
      },
    ],
  } 


    //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 4
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
 
}




