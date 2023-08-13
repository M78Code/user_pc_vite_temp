
/**
 * 23号模板 足球-下一 最后进球
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template



  // 23号模板 足球-下一 最后进球
  export const template_23 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 28, ot: '1' },
          { ...ol_template, _hpid: 28, ot: '2' },
          { ...ol_template, _hpid: 28, ot: 'None' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 12, ot: 'Yes' },
          { ...ol_template, _hpid: 12, ot: 'No' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 149, ot: '1' },
          { ...ol_template, _hpid: 149, ot: '2' },
          { ...ol_template, _hpid: 149, ot: 'None' },
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
 
}




