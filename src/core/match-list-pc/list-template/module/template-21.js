
/**
 * 21号模板 足球-比分
 */
import * as TemplateCommon from "./template-common.js"



// 21 比分模板前3项 固定
const tpl_21_full = [
    {
      ols: [
        {  _hpid: 7, ot: '1:0' },
        {  _hpid: 7, ot: '2:0' },
        {  _hpid: 7, ot: '2:1' },
        {  _hpid: 7, ot: '3:0' },
        {  _hpid: 7, ot: '3:1' },
        {  _hpid: 7, ot: '3:2' },
        {  _hpid: 7, ot: '4:0' },
        {  _hpid: 7, ot: '4:1' },
        {  _hpid: 7, ot: '4:2' },
        {  _hpid: 7, ot: '4:3' },
        {  _hpid: 7, ot: 'Other', other_class: 'col3 absolute' },
      ],
    },
    {
      ols: [
        {  _hpid: 7, ot: '0:0' },
        {  _hpid: 7, ot: '1:1' },
        {  _hpid: 7, ot: '2:2' },
        {  _hpid: 7, ot: '3:3' },
        {  _hpid: 7, ot: '4:4' },
        ...TemplateCommon.set_default_tpl(0,5),
        { ...TemplateCommon.ol_template , other_class: 'visibility'},
      ],
    },
    {
      ols: [
        {  _hpid: 7, ot: '0:1' },
        {  _hpid: 7, ot: '0:2' },
        {  _hpid: 7, ot: '1:2' },
        {  _hpid: 7, ot: '0:3' },
        {  _hpid: 7, ot: '1:3' },
        {  _hpid: 7, ot: '2:3' },
        {  _hpid: 7, ot: '0:4' },
        {  _hpid: 7, ot: '1:4' },
        {  _hpid: 7, ot: '2:4' },
        {  _hpid: 7, ot: '3:4' },
        {  other_class: 'visibility' },
      ],
    },
  ]
  
  


  // 21号模板 足球-比分
  export const template_21 = {
    main_handicap_list_20: [
        ...TemplateCommon.clone_arr(tpl_21_full),
        ...TemplateCommon.update_tpl_hpid(20, tpl_21_full,'right-rimless')
      ],
    main_handicap_list_20_13: [
      ...TemplateCommon.clone_arr(tpl_21_full),
       ...TemplateCommon.update_tpl_hpid(20, tpl_21_full), 
      //  ...TemplateCommon.update_tpl_hpid(74, tpl_21_full),
       ...TemplateCommon.set_default_tpl(7,11)
      ],
    main_handicap_list_341: [
        ...TemplateCommon.clone_arr(tpl_21_full),
        ...TemplateCommon.update_tpl_hpid(341, tpl_21_full,'right-rimless'),
      ],
    main_handicap_list_341_13: [
      ...TemplateCommon.clone_arr(tpl_21_full), 
      ...TemplateCommon.update_tpl_hpid(341, tpl_21_full),
      //  ...TemplateCommon.update_tpl_hpid(342, tpl_21_full),
       ...TemplateCommon.set_default_tpl(7,11)
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
     // 主盘口高度
     main_handicap_height:385,
}

