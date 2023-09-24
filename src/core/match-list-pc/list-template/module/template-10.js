/**
 *  10号模板 网球-准确盘数
 */
import * as TemplateCommon from "./template-common.js"





  // 10号模板 网球-准确盘数
  export const template_10 = {
    // 网球主盘口列表 3局赛制
    main_handicap_list_5_3: [
      {
        ols: [
          {  _hpid: 159, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 159, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { empty:1}
        ],
      },
    ],
    // 网球主盘口列表 5局赛制
    main_handicap_list_5_5: [
      {
        ols: [
          {  _hpid: 159, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 159, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 159, ot: '5', class: 'no-handicap' },
        ],
      },
    ],
    // 羽毛球主盘口列表 3局赛制
    main_handicap_list_10_3: [
      {
        ols: [
          {  _hpid: 174, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 174, _hpids:[],   _hpid_fn:(obj)=>{}, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { empty:1}
        ],
      },
    ],
    // 羽毛球主盘口列表 5局赛制
    main_handicap_list_10_5: [
      {
        ols: [
          {  _hpid: 174, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
    ],
  }


  //   列表宽度计算模板
  export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  3
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



