/**
 *  9号模板 网球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template


 
  // 9号模板 网球-让球与大小
  export const template_9 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 153, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 154, ot: '1' },
          { ...ol_template, _hpid: 154, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 155, ot: '1' },
          { ...ol_template, _hpid: 155, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 202, ot: 'Over' },
          { ...ol_template, _hpid: 202, ot: 'Under' },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 162, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 162, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 163, ot: '1' },
          { ...ol_template, _hpid: 163, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 164, ot: 'Over' },
          { ...ol_template, _hpid: 164, ot: 'Under' },
        ],
      },
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
   cur_handicap_height:70,
   // 是否需要动态计算高度
   is_dynamic_compute_height:true,
}


