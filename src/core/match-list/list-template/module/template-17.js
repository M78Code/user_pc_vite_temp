
/**
 * 17号模板 棒球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template



  // 17号模板 棒球-让球与大小
 
  export const template_17 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 242, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 242, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 243, ot: '1' },
          { ...ol_template, _hpid: 243, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 244, ot: 'Over' },
          { ...ol_template, _hpid: 244, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 247, ot: 'Odd' },
          { ...ol_template, _hpid: 247, ot: 'Even' },
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
 
}



