
/**
 *    // 虚拟足球
 *    源名字： template_1001   template1001
 */

import * as TemplateCommon from "./template-common.js"




 
  // 虚拟足球
  export const template_29  = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 20001, ot: '1' },
          {  _hpid: 20001, ot: '2' },
          {  _hpid: 20001, ot: 'X' },
        ],
      },
      {
        ols: [
          {  _hpid: 20004, ot: '1' },
          {  _hpid: 20004, ot: '2' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 20002, ot: 'Over' },
          {  _hpid: 20002, ot: 'Under' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 20013, ot: '1' },
          {  _hpid: 20013, ot: '2' },
          {  _hpid: 20013, ot: 'X' },
        ],
      },
      {
        ols: [
          {  _hpid: 20015, ot: '1' },
          {  _hpid: 20015, ot: '2' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 20014, ot: 'Over' },
          {  _hpid: 20014, ot: 'Under' },
          { empty:1}
        ],
      },
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
 
}




