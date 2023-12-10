/**
 *  欧洲版 网球 赔率模板 103号
 */
import * as TemplateCommon from "./template-common.js"

// , { empty: 1 } 空模板
 // 欧洲版 网球 赔率模板 全量赔率
 export const template_109={
  main_handicap_list: [
    {
      _hpid: 153,
      ols: [
        {  _hpid: 153, ot: '1', otb: '主胜', class: 'no-handicap' },
        {  _hpid: 153, ot: '2', otb: '客胜', class: 'no-handicap' },
      ],
    },
    {
      _hpid: 154,
      ols: [
        {  _hpid: 154, ot: '1', otb: '主队让盘', },
        {  _hpid: 154, ot: '2', otb: '客队让盘', },
      ],
    },
    {
      _hpid: 155,
      ols: [
        {  _hpid: 155, ot: '1', otb: '主队让局', },
        {  _hpid: 155, ot: '2', otb: '客队让局', },
      ],
    },
  ],
  // 当前局盘口
  cur_handicap_list: [
    {
      ols: [
        {  _hpid: 162, ot: '1', class: 'no-handicap' },
        {  _hpid: 162, ot: '2', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        { empty:1},
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 163, ot: '1' },
        {  _hpid: 163, ot: '2' },
      ],
    },
    {
      ols: [
        {  _hpid: 164, ot: 'Over' },
        {  _hpid: 164, ot: 'Under' },
      ],
    },
  ],
}

// 因为我们的欧洲版 
// 赔率模板是不固定的 
// 所以需要抛出一个方法  
// 用于 拿取当前 用户选择的赔率模板
// 这里传入的 是我们的玩法id
export const get_current_odds_list = ({ first_hpid, second_hpid }) => {
  let odds_list =  TemplateCommon.get_current_odds_list(template_109.main_handicap_list, { first_hpid, second_hpid })
  return odds_list
}

// 获取hots赔率模板
export const get_hots_odds_list = () => {
  let hots_odds_list = TemplateCommon.get_hots_odds_list(template_109.main_handicap_list)
  return hots_odds_list;
}
//   列表宽度计算模板
export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 9,
  team_width: 338,
  play_icon_width: 0,
}


  
  /**
   * @Description 设置模板table宽度
   * @param {number} total_width 列表总宽度
  */
  export  const set_template_width=(total_width= 1180)=>{
    let base_config=  TemplateCommon.set_ouzhou_template_width_base(total_width, width_config)
    // 加工 base_config 
    return base_config
  }

// 赛事模板配置
export const match_template_config = {
    ...TemplateCommon.match_style_template_ouzhou,
    // 当前局玩法高度
    cur_handicap_height:28,
    // 是否需要动态计算高度
    is_dynamic_compute_height:true,
     // 当前局玩法高度
    cur_handicap_height:28,
  };
  
