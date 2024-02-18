
/**
 *   电竞模板 
 *   源名字 ： template_esports    templateesports
 */

import * as TemplateCommon from "./template-common.js"




 

  // 电竞模板
  export const template_28= {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 30001, ot: 'T1', class: 'no-handicap' },
          {  _hpid: 30001, ot: 'T2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 30002, ot: 'T1' },
          {  _hpid: 30002, ot: 'T2' },
        ],
      },
      {
        ols: [
          {  _hpid: 30003, ot: 'Over' },
          {  _hpid: 30003, ot: 'Under' },
        ],
      },
      {
        ols: [
          {  _hpid: 30006, ot: 'T1', class: 'no-handicap' },
          {  _hpid: 30006, ot: 'T2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 30007, ot: 'T1' },
          {  _hpid: 30007, ot: 'T2' },
        ],
      },
      {
        ols: [
          {  _hpid: 30008, ot: 'Over' },
          {  _hpid: 30008, ot: 'Under' },
        ],
      },

    ],
  } 


  //   列表宽度计算模板
  export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  6
}

  
  /**
   * @Description 设置模板table宽度
   * @param {number} total_width 列表总宽度
  */
  export  const set_template_width=(total_width)=>{

    let middle_fn =(config)=>{


      config.media_width = 48
      if (config.is_iframe) {
        config.process_team_width = 56 + 142
      }
    }
    let base_config=  TemplateCommon.set_template_width_base(total_width, width_config,middle_fn)

    // 加工 base_config 






    return base_config
  }


  
  
// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
    // 主盘口高度
    main_handicap_height:70,
    // 底部玩法栏及赛制 高度
    main_play_competition_height: 28,
}



 

