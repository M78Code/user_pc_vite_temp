
/**
 * 19号模板 拳击-让球与大小
 */
import * as TemplateCommon from "./template-common.js"





 
  // 19号模板 拳击-让球与大小

  export const template_19 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 153, ot: '1', class: 'no-handicap' },
          {  _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          {  _hpid: 2, ot: 'Over' },
          {  _hpid: 2, ot: 'Under' },
        ],
      },
    ],
  } 


  //   列表宽度计算模板
  export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  2
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



