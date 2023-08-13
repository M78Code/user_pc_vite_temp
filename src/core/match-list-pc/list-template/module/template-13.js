
/**
 *  13号模板 足球 13列玩法 
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template
let hps_15_minute = TemplateCommon.hps_15_minute
import lodash from  "lodash"


//13号模板  模板主盘
export const template_left =  [
  {
    ols: [
      { ...ol_template, _hpid: 28, ot: '1' },
      { ...ol_template, _hpid: 28, ot: '2' },
      { ...ol_template, _hpid: 28, ot: 'None' },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 10, ot: 'Over' },
      { ...ol_template, _hpid: 10, ot: 'Under' },
      { ...ol_template },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 11, ot: 'Over' },
      { ...ol_template, _hpid: 11, ot: 'Under' },
      { ...ol_template },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 12, ot: 'Yes' },
      { ...ol_template, _hpid: 12, ot: 'No' },
      { ...ol_template },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 27, ot: '1' },
      { ...ol_template, _hpid: 27, ot: '2' },
      { ...ol_template, _hpid: 27, ot: 'X' },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 15, ot: 'Odd' },
      { ...ol_template, _hpid: 15, ot: 'Even' },
      { ...ol_template },
    ]
  },
  {
    ols: [
      { ...ol_template, _hpid: 5, ot: '1', },
      { ...ol_template, _hpid: 5, ot: '2', },
      { ...ol_template },
    ]
  },
]
//足球13列玩法 后7项
export const template_right = {
  //主盘多列玩法的后7种
  main_handicap_list: [...template_left],
  //附加盘
  add_handicap_list: TemplateCommon.created_add_temp_config(template_left),
  // 角球投注项模板
  hpsCorner: [
    {
      ols: [
        { ...ol_template, _hpid: 225, ot: '1' },
        { ...ol_template, _hpid: 225, ot: '2' },
        { ...ol_template, _hpid: 225, ot: 'None' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 115, ot: 'Over' },
        { ...ol_template, _hpid: 115, ot: 'Under' },
        { ...ol_template },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 116, ot: 'Over' },
        { ...ol_template, _hpid: 116, ot: 'Under' },
        { ...ol_template },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 118, ot: 'Odd' },
        { ...ol_template, _hpid: 118, ot: 'Even' },
        { ...ol_template },
      ]
    },
    ...TemplateCommon.set_default_tpl(3, ol_template)
  ],
  //罚牌投注项模板
  hpsPunish: [
    {
      ols: [
        { ...ol_template, _hpid: 224, ot: '1' },
        { ...ol_template, _hpid: 224, ot: '2' },
        { ...ol_template, _hpid: 224, ot: 'None' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 314, ot: 'Over' },
        { ...ol_template, _hpid: 314, ot: 'Under' },
        { ...ol_template },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 315, ot: 'Over' },
        { ...ol_template, _hpid: 315, ot: 'Under' },
        { ...ol_template },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 312, ot: 'Odd' },
        { ...ol_template, _hpid: 312, ot: 'Even' },
        { ...ol_template },
      ]
    },
    ...TemplateCommon.set_default_tpl(3, ol_template)
  ],
  // 晋级投注项模板
  hpsPromotion: TemplateCommon.set_default_tpl(7, ol_template),
  // 冠军投注项模板
  hpsOutright: TemplateCommon.set_default_tpl(7, ol_template),
  // 加时赛投注项模板
  hpsOvertime: [
    {
      ols: [
        { ...ol_template, _hpid: 235, ot: '1' },
        { ...ol_template, _hpid: 235, ot: '2' },
        { ...ol_template, _hpid: 235, ot: 'None' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 330, ot: 'Odd' },
        { ...ol_template, _hpid: 330, ot: 'Even' },
        { ...ol_template },
      ]
    },
    ...TemplateCommon.set_default_tpl(5, ol_template)
  ],
  // 点球大战
  hpsPenalty: TemplateCommon.set_default_tpl(7, ol_template),
   // 5分钟玩法 早盘
  hps5Minutes_361: TemplateCommon.set_default_tpl(7, ol_template,6),
   // 5分钟玩法 滚球
  hps5Minutes_362: TemplateCommon.set_default_tpl(7, ol_template,6),
}

/**
 * @Description 构建13玩法模板
 * @param {Object} template_left  左侧数据模板 
 * @param {Object} template_right   右侧数据模板
*/

const set_tpl_13_config = (template_left, template_right) => {
    let template_confg = {}
    let tem_name = Object.keys(template_right)
    lodash.each(tem_name, cur_tem_name => {
        template_confg[cur_tem_name] = [
            ...TemplateCommon.clone_arr(template_left[cur_tem_name]),
            ...TemplateCommon.clone_arr(template_right[cur_tem_name]),
        ]
    })
    return template_confg
}







  // 13号模板 足球 13列玩法 
  export const template_13 = {
    ...set_tpl_13_config(template_0,template_right),
    // 15分钟玩法
    hps15Minutes: [
      ...TemplateCommon.clone_arr(hps_15_minute),
      ...TemplateCommon.clone_arr(hps_15_minute),
      ...TemplateCommon.clone_arr(hps_15_minute),
      ...TemplateCommon.clone_arr(hps_15_minute),
      ...TemplateCommon.set_default_tpl(1, ol_template)
    ],
  } 


  //   列表宽度计算模板
const  width_config ={
  ...TemplateCommon.width_config_template,
  bet_col_count:  13
}


  
  /**
   * @Description 设置模板table宽度
   * @param {number} total_width 列表总宽度
  */
  export  const set_template_width=(total_width)=>{
    let base_config=  TemplateCommon.set_template_width_base(total_width, width_config)

    // 加工 base_config 
   
    base_config.process_team_width = parseInt(total_width * 0.18)
    base_config.media_width = parseInt(total_width * 0.03)

    return base_config
  }

   

  
// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
 
}


