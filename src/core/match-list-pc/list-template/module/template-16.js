
/**
 * 16号模板 冰球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"




  // 16号模板 冰球-让球与大小
  export const template_16 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 1, ot: '1' },
          {  _hpid: 1, ot: '2' },
          {  _hpid: 1, ot: 'X' },
        ],
      },
      {
        ols: [
          {  _hpid: 4, ot: '1' },
          {  _hpid: 4, ot: '2' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 2, ot: 'Over' },
          {  _hpid: 2, ot: 'Under' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 15, ot: 'Odd' },
          {  _hpid: 15, ot: 'Even' },
          { empty:1}
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          {  _hpid: 261, ot: '1' },
          {  _hpid: 261, ot: '2' },
          {  _hpid: 261, ot: 'X' },
        ],
      },
      {
        ols: [
          {  _hpid: 268, ot: '1' },
          {  _hpid: 268, ot: '2' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 262, ot: 'Over' },
          {  _hpid: 262, ot: 'Under' },
          { empty:1}
        ],
      },
      ...TemplateCommon.set_default_tpl(1)
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
    let base_config=  TemplateCommon.set_template_width_base(total_width, width_config)

    // 加工 base_config 


    return base_config
  }

   

  
// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
     // 当前局玩法高度
     cur_handicap_height:140,
     // 是否需要动态计算高度
     is_dynamic_compute_height:true,
}


