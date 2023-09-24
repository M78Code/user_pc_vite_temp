/**
 *  6号模板 足球-净胜分
 */
import * as TemplateCommon from "./template-common.js"





  // 6号模板 足球-净胜分
  export const template_6 ={
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 340, ot: '1And1', class: 'no-handicap' },
          {  _hpid: 340, ot: '2And1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 340, ot: '1And2', class: 'no-handicap' },
          {  _hpid: 340, ot: '2And2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 340, ot: '1And3', class: 'no-handicap' },
          {  _hpid: 340, ot: '2And3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 340, ot: '1And4+', class: 'no-handicap' },
          {  _hpid: 340, ot: '2And4+', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 340, ot: 'X1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 340, ot: 'X0', class: 'no-handicap' },
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
    let base_config=  TemplateCommon.set_template_width_base(total_width, width_config)

    // 加工 base_config 


    return base_config
  }


    // 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
 
}

