
/**
 * 15号模板 兵乓球-准确局数
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template




  // 15号模板 兵乓球-准确局数
    export const template_15= {
    // 兵乓球 准确局数 5局赛制
    main_handicap_list_5: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
        ],
      },
    ],
    // 兵乓球 准确局数 7局赛制
    main_handicap_list_7: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '7', class: 'no-handicap' },
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


