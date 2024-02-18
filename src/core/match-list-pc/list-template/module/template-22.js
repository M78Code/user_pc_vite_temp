
/**
 * 22号模板 足球-独赢 让球胜平负
 */
import * as TemplateCommon from "./template-common.js"






  // 22号模板 足球-独赢 让球胜平负
  export const template_22 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 1, ot: '1', class: 'no-handicap' },
          {  _hpid: 3, ot: '1' },
          {  _hpid: 3, ot: '1',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 1, ot: 'X', class: 'no-handicap' },
          {  _hpid: 3, ot: 'X' },
          {  _hpid: 3, ot: 'X',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 1, ot: '2', class: 'no-handicap' },
          {  _hpid: 3, ot: '2' },
          {  _hpid: 3, ot: '2',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 17, ot: '1', class: 'no-handicap' },
          {  _hpid: 69, ot: '1' },
          {  _hpid: 69, ot: '1',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 17, ot: 'X', class: 'no-handicap' },
          {  _hpid: 69, ot: 'X' },
          {  _hpid: 69, ot: 'X',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 17, ot: '2', class: 'no-handicap' },
          {  _hpid: 69, ot: '2' },
          {  _hpid: 69, ot: '2',hn:2 },
        ],
      },
      {
        ols: [
          {  _hpid: 6, ot: '1X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 6, ot: '12', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 6, ot: 'X2', class: 'no-handicap' },
        ],
      },
    ],
  } 


  //   列表宽度计算模板
export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  9
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




