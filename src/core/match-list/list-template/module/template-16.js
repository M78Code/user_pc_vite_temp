
/**
 * 16号模板 冰球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template


  // 16号模板 冰球-让球与大小
  export const template_16 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: '1' },
          { ...ol_template, _hpid: 1, ot: '2' },
          { ...ol_template, _hpid: 1, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 4, ot: '1' },
          { ...ol_template, _hpid: 4, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 2, ot: 'Over' },
          { ...ol_template, _hpid: 2, ot: 'Under' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 15, ot: 'Odd' },
          { ...ol_template, _hpid: 15, ot: 'Even' },
          { ...ol_template },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 261, ot: '1' },
          { ...ol_template, _hpid: 261, ot: '2' },
          { ...ol_template, _hpid: 261, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 268, ot: '1' },
          { ...ol_template, _hpid: 268, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 262, ot: 'Over' },
          { ...ol_template, _hpid: 262, ot: 'Under' },
          { ...ol_template },
        ],
      },
      ...TemplateCommon.set_default_tpl(1, ol_template)
    ],
  } 

  //   列表宽度计算模板
const  width_config ={
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


