/**
 *  5号模板 足球-进球区间
 */
import * as TemplateCommon from "./template-common.js"






  // 5号模板 足球-进球区间
  export const template_5=  {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 68, ot: '0-1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 68, ot: '2-3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 68, ot: '4-6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 68, ot: '7+', class: 'no-handicap' },
        ],
      },
    ],
  }


  //   列表宽度计算模板
  export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  4
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

