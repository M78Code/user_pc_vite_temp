/**
 *  2号模板 足球-半/全场
 */
import * as TemplateCommon from "./template-common.js"




 

 // 2号模板 足球-半/全场
 export const template_2={
  main_handicap_list: [
    {
      ols: [
        {  _hpid: 104, ot: '11', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: '1X', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: '12', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: 'X1', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: 'XX', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: 'X2', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: '21', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: '2X', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 104, ot: '22', class: 'no-handicap' },
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
  ...TemplateCommon.match_style_template,
 
}

