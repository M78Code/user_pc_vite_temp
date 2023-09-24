


/**
 * 20号模板 水球-让球与大小
 */
import * as TemplateCommon from "./template-common.js"






  // 20号模板 水球-让球与大小
  export const template_20 = {
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
          {  _hpid: 17, ot: '1' },
          {  _hpid: 17, ot: '2' },
          {  _hpid: 17, ot: 'X' },
        ],
      },
      {
        ols: [
          {  _hpid: 19, ot: '1' },
          {  _hpid: 19, ot: '2' },
          { empty:1}
        ],
      },
      {
        ols: [
          {  _hpid: 18, ot: 'Over' },
          {  _hpid: 18, ot: 'Under' },
          { empty:1}
        ],
      },
    ],
  }

  
  //   列表宽度计算模板
  export const  width_config ={
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




