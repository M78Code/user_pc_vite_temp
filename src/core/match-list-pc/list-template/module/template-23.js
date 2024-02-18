
/**
 * 23号模板 足球-下一 最后进球
 */
import * as TemplateCommon from "./template-common.js"





  // 23号模板 足球-下一 最后进球
  export const template_23 = {
    main_handicap_list: [
      {
        ols: [
          {  _hpid: 28, ot: '1' },
          {  _hpid: 28, ot: '2' },
          {  _hpid: 28, ot: 'None' },
        ],
      },
      {
        ols: [
          {  _hpid: 12, ot: 'Yes' },
          {  _hpid: 12, ot: 'No' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 149, ot: '1' },
          {  _hpid: 149, ot: '2' },
          {  _hpid: 149, ot: 'None' },
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




