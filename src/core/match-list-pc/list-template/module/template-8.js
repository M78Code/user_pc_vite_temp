/**
 * 8号模板 篮球-净胜分
 */
import * as TemplateCommon from "./template-common.js"





 
  // 8号模板 篮球-净胜分
  export const template_8 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 200, ot: '1And6+', class: 'no-handicap' },
          {  _hpid: 200, ot: '2And6+', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 200, ot: 'Other', class: 'no-handicap' },
        ],
      },
    ],
  }

  //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  2
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


