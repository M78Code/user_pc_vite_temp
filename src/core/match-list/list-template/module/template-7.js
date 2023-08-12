/**
 *  7号模板  篮球让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template


 
  // 7号模板  篮球让球与大小
  export const template_7 = {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 37, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 37, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 39, ot: '1' },
          { ...ol_template, _hpid: 39, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 38, ot: 'Over' },
          { ...ol_template, _hpid: 38, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 198, ot: 'Over' },
          { ...ol_template, _hpid: 199, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 198, ot: 'Under' },
          { ...ol_template, _hpid: 199, ot: 'Under' },
        ],
      },
    ],
    add_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 37, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 37, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 39, ot: '1' },
          { ...ol_template, _hpid: 39, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 38, ot: 'Over' },
          { ...ol_template, _hpid: 38, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 198, ot: 'Over' },
          { ...ol_template, _hpid: 199, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 198, ot: 'Under' },
          { ...ol_template, _hpid: 199, ot: 'Under' },
        ],
      },
    ],
    cur_handicap_list: TemplateCommon.set_default_tpl(5, ol_template,2),
    // 篮球第一节玩法
    cur_handicap_list_1: [
      {
        ols: [
          { ...ol_template, _hpid: 48, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 48, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 46, ot: '1' },
          { ...ol_template, _hpid: 46, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 45, ot: 'Over' },
          { ...ol_template, _hpid: 45, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Over' },
          { ...ol_template, _hpid: 146, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Under' },
          { ...ol_template, _hpid: 146, ot: 'Under' },
        ],
      },
    ],
    // 篮球第一节休息玩法
    cur_handicap_list_1_rest: [
      {
        ols: [
          { ...ol_template, _hpid: 54, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 54, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 52, ot: '1' },
          { ...ol_template, _hpid: 52, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 51, ot: 'Over' },
          { ...ol_template, _hpid: 51, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Over' },
          { ...ol_template, _hpid: 146, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Under' },
          { ...ol_template, _hpid: 146, ot: 'Under' },
        ],
      },
    ],
    // 篮球第二节玩法
    cur_handicap_list_2: [
      {
        ols: [
          { ...ol_template, _hpid: 43, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 43, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 19, ot: '1' },
          { ...ol_template, _hpid: 19, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 18, ot: 'Over' },
          { ...ol_template, _hpid: 18, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 87, ot: 'Over' },
          { ...ol_template, _hpid: 97, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 87, ot: 'Under' },
          { ...ol_template, _hpid: 97, ot: 'Under' },
        ],
      },
    ],
    // 篮球第三节玩法
    cur_handicap_list_3: [
      {
        ols: [
          { ...ol_template, _hpid: 60, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 60, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 58, ot: '1' },
          { ...ol_template, _hpid: 58, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 57, ot: 'Over' },
          { ...ol_template, _hpid: 57, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Over' },
          { ...ol_template, _hpid: 146, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Under' },
          { ...ol_template, _hpid: 146, ot: 'Under' },
        ],
      },
    ],
    // 篮球第四节玩法
    cur_handicap_list_4: [
      {
        ols: [
          { ...ol_template, _hpid: 66, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 66, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 64, ot: '1' },
          { ...ol_template, _hpid: 64, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 63, ot: 'Over' },
          { ...ol_template, _hpid: 63, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Over' },
          { ...ol_template, _hpid: 146, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 145, ot: 'Under' },
          { ...ol_template, _hpid: 146, ot: 'Under' },
        ],
      },
    ],
    // 篮球上半场玩法
    cur_handicap_list_up: [
      {
        ols: [
          { ...ol_template, _hpid: 43, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 43, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 19, ot: '1' },
          { ...ol_template, _hpid: 19, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 18, ot: 'Over' },
          { ...ol_template, _hpid: 18, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 87, ot: 'Over' },
          { ...ol_template, _hpid: 97, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 87, ot: 'Under' },
          { ...ol_template, _hpid: 97, ot: 'Under' },
        ],
      },
    ],
    // 篮球下半场玩法
    cur_handicap_list_down: [
      {
        ols: [
          { ...ol_template, _hpid: 142, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 142, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 143, ot: '1' },
          { ...ol_template, _hpid: 143, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 26, ot: 'Over' },
          { ...ol_template, _hpid: 26, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 88, ot: 'Over' },
          { ...ol_template, _hpid: 98, ot: 'Over' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 88, ot: 'Under' },
          { ...ol_template, _hpid: 98, ot: 'Under' },
        ],
      },
    ],
  }

  //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  5
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
      // 附加盘高度
      add_handicap_height:70,
      // 当前局玩法高度
      cur_handicap_height:70,
      // 是否需要动态计算高度
      is_dynamic_compute_height:true,
 
}

