/**
 * 11号模板 (羽毛球 || 乒乓球 || 沙滩排球 || 排球 || 斯诺克)-让球与大小
 */
import * as TemplateCommon from "./template-common.js"




 
  // 11号模板 (羽毛球 || 乒乓球 || 沙滩排球 || 排球 || 斯诺克)-让球与大小
  export const template_11 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 153, ot: '1', class: 'no-handicap' },
          {  _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 172, ot: '1' },
          {  _hpid: 172, ot: '2' },
        ],
      },
      {
        ols: [
          {  _hpid: 173, ot: 'Over' },
          {  _hpid: 173, ot: 'Under' },
        ],
      },
    ],
    // 斯诺克 主盘口列表
    main_handicap_list_7: [
      {
        ols: [
          {  _hpid: 153, ot: '1', class: 'no-handicap' },
          {  _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 181, ot: '1' },
          {  _hpid: 181, ot: '2' },
        ],
      },
      {
        ols: [
          {  _hpid: 182, ot: 'Over' },
          {  _hpid: 182, ot: 'Under' },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          {  _hpid: 175, ot: '1', class: 'no-handicap' },
          {  _hpid: 175, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 176, ot: '1' },
          {  _hpid: 176, ot: '2' },
        ],
      },
      {
        ols: [
          {  _hpid: 177, ot: 'Over' },
          {  _hpid: 177, ot: 'Under' },
        ],
      },
    ],
    // 斯诺克当前局盘口列表
    cur_handicap_list_7: [
      {
        ols: [
          {  _hpid: 184, ot: '1', class: 'no-handicap' },
          {  _hpid: 184, ot: '2', class: 'no-handicap' },
        ],
      },
      ...TemplateCommon.set_default_tpl(2,2)
    ],
    // 排球当前局盘口列表
    cur_handicap_list_9: [
      {
        ols: [
          {  _hpid: 162, ot: '1', class: 'no-handicap' },
          {  _hpid: 162, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 253, ot: '1' },
          {  _hpid: 253, ot: '2' },
        ],
      },
      {
        ols: [
          {  _hpid: 254, ot: 'Over' },
          {  _hpid: 254, ot: 'Under' },
        ],
      },
    ],
  }


  //   列表宽度计算模板
const  width_config ={
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
  // 当前局玩法高度
  cur_handicap_height:70,
  // 是否需要动态计算高度
  is_dynamic_compute_height:true,
}



