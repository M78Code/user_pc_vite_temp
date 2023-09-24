
/**
 *    
 *   虚拟泥地摩托
 *      main_handicap_list_1009
 */

import * as TemplateCommon from "./template-common.js"




 


  // 虚拟泥地摩托
 
  export const template_30 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 20033, ot: '1', class: 'no-handicap' },
          {  _hpid: 20033, ot: '2', class: 'no-handicap' },
          {  _hpid: 20033, ot: '3', class: 'no-handicap' },
          {  _hpid: 20033, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 20034, ot: '1', class: 'no-handicap' },
          {  _hpid: 20034, ot: '2', class: 'no-handicap' },
          {  _hpid: 20034, ot: '3', class: 'no-handicap' },
          {  _hpid: 20034, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 20040, ot: 'Over' },
          {  _hpid: 20040, ot: 'Under' },
          {  _hpid: 20039, ot: 'Odd' },
          {  _hpid: 20039, ot: 'Even' },
        ],
      }
    ],
    
  } 


  
    //   列表宽度计算模板
export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 3
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
