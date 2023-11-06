/**
 *  欧洲版 足球 赔率模板 101号
 */
import * as TemplateCommon from "./template-common.js"


 // 欧洲版 足球 赔率模板 全量赔率
 export const template_2={
  main_handicap_list: [
    {
      ols: [
        {  _hpid: 1, ot: '1', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 4, ot: 'X', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 2, ot: '2', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 17, ot: 'Over', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 19, ot: 'Under', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 18, ot: 'X2', class: 'no-handicap' },
      ],
    },
  ],
}



//   列表宽度计算模板
export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 9
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
    ...TemplateCommon.match_style_template_ouzhou,
  };
  
