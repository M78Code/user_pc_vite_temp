/**
 *  欧洲版 足球 赔率模板 101号
 */
import * as TemplateCommon from "./template-common.js"

// , { empty: 1 } 空模板
 // 欧洲版 足球 赔率模板 全量赔率
 export const template_101={
  main_handicap_list: [
    {
      _hpid: 1,
      ols: [
        { _hpid: 1, ot: "1" },
        { _hpid: 1, ot: "X" },
        { _hpid: 1, ot: "2" },
      ],
    },
    {
      _hpid: 4, ols: [{ _hpid: 4, ot: "1" }, { _hpid: 4, ot: "2" }],
    },
    {
      _hpid: 2, ols: [{ _hpid: 2, ot: "Over" }, { _hpid: 2, ot: "Under" }],
    },
    {
      _hpid: 17,
      ols: [
        { _hpid: 17, ot: "1" },
        { _hpid: 17, ot: "2" },
        { _hpid: 17, ot: "X" },
      ],
    },
    {
      _hpid: 19, ols: [{ _hpid: 19, ot: "1" }, { _hpid: 19, ot: "2" }],
    },
    {
      _hpid: 18, ols: [{ _hpid: 18, ot: "Over" }, { _hpid: 18, ot: "Under" }],
    },
  ],
}

// 因为我们的欧洲版 
// 赔率模板是不固定的 
// 所以需要抛出一个方法  
// 用于 拿取当前 用户选择的赔率模板
// 这里传入的 是我们的玩法id
export const get_current_odds_list = ({ first_hpid, second_hpid }) => {
  let first_odds_list = null;
  let second_odds_list = null;
  template_101.main_handicap_list.forEach(item => {
    if (first_hpid == item._hpid) {
      first_odds_list = item
    }
    if (second_hpid == item._hpid) {
      second_odds_list = item
    }
  })
  return [ first_odds_list, second_odds_list ]
}


//   列表宽度计算模板
export const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count: 9,
  team_width: 338,
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
  };
  
