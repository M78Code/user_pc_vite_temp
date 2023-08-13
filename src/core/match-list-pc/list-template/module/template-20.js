


/**
 * 20号模板 水球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template




  // 20号模板 水球-让球与大小
  export const template_20 = {
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
          { ...ol_template, _hpid: 17, ot: '1' },
          { ...ol_template, _hpid: 17, ot: '2' },
          { ...ol_template, _hpid: 17, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 19, ot: '1' },
          { ...ol_template, _hpid: 19, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 18, ot: 'Over' },
          { ...ol_template, _hpid: 18, ot: 'Under' },
          { ...ol_template },
        ],
      },
    ],
  }

  
  //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  6
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




