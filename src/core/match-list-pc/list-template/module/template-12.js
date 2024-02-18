
/**
 *  12号模板 足球 竟足
 */
import * as TemplateCommon from "./template-common.js"




  // 12号模板 足球 竟足
  export const template_12 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 1, ot: '1', class: 'no-handicap' },
          {  _hpid: 3, ot: '1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 1, ot: 'X', class: 'no-handicap' },
          {  _hpid: 3, ot: 'X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 1, ot: '2', class: 'no-handicap' },
          {  _hpid: 3, ot: '2', class: 'no-handicap' },
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

    let middle_fn =(config)=>{

 
      let process_team_width_12 = parseInt(total_width * 0.45)
      if (config.is_iframe) {
        process_team_width_12 = 365
      }
      // 设置投注项宽度
     config.bet_width = parseInt((total_width - process_team_width_12 - config.media_width - 60) /config.bet_col_count)
      // 设置视频区域宽度
     config.media_width = total_width - process_team_width_12 - 60 -config.bet_width *config.bet_col_count
      // 设置赛事阶段加主客队宽度
     config.process_team_width = process_team_width_12
      // 设置主客队信息宽度
      if (config.is_iframe) {
       config.team_width = process_team_width_12 - 56
      } else {
       config.team_width = process_team_width_12 - 77
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
}


