/**
 *   1号模板 足球让球与大小
 * 
 */
import * as TemplateCommon from "./template-common.js"
const ol_template = TemplateCommon.ol_template
const hps_15_minute = TemplateCommon.hps_15_minute
// 1号模板  模板主盘 -- 玩法模板
export const template_1_main = [
  // 全场独赢
  {
    ols: [
      { ...ol_template, _hpid: 1, ot: '1' },
      { ...ol_template, _hpid: 1, ot: '2' },
      { ...ol_template, _hpid: 1, ot: 'X' },
    ],
  },
  // 全场让球
  {
    ols: [
      { ...ol_template, _hpid: 4, ot: '1' },
      { ...ol_template, _hpid: 4, ot: '2' },
      { ...ol_template },
    ],
  },
  // 全场大小
  {
    ols: [
      { ...ol_template, _hpid: 2, ot: 'Over' },
      { ...ol_template, _hpid: 2, ot: 'Under' },
      { ...ol_template },
    ],
  },
  // 半场独赢
  {
    ols: [
      { ...ol_template, _hpid: 17, ot: '1' },
      { ...ol_template, _hpid: 17, ot: '2' },
      { ...ol_template, _hpid: 17, ot: 'X' },
    ],
  },
  // 半场让球
  {
    ols: [
      { ...ol_template, _hpid: 19, ot: '1' },
      { ...ol_template, _hpid: 19, ot: '2' },
      { ...ol_template },
    ],
  },
  // 半场大小
  {
    ols: [
      { ...ol_template, _hpid: 18, ot: 'Over' },
      { ...ol_template, _hpid: 18, ot: 'Under' },
      { ...ol_template },
    ],
  },
]
// 1号模板
export const template_1 = {
  //主盘
  main_handicap_list: [...template_1_main],
  // 美足 主盘口列表
  main_handicap_list_6: [
    {
      ols: [
        { ...ol_template, _hpid: 37, ot: '1', class: 'no-handicap' },
        { ...ol_template, _hpid: 37, ot: '2', class: 'no-handicap' },
        { ...ol_template, _hpid: 37, ot: 'X', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 39, ot: '1' },
        { ...ol_template, _hpid: 39, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 38, ot: 'Over' },
        { ...ol_template, _hpid: 38, ot: 'Under' },
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
  // 角球投注项模板
  hpsCorner: [
    {
      ols: [
        { ...ol_template, _hpid: 111, ot: '1' },
        { ...ol_template, _hpid: 111, ot: '2' },
        { ...ol_template, _hpid: 111, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 113, ot: '1' },
        { ...ol_template, _hpid: 113, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 114, ot: 'Over' },
        { ...ol_template, _hpid: 114, ot: 'Under' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 119, ot: '1' },
        { ...ol_template, _hpid: 119, ot: '2' },
        { ...ol_template, _hpid: 119, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 121, ot: '1' },
        { ...ol_template, _hpid: 121, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 122, ot: 'Over' },
        { ...ol_template, _hpid: 122, ot: 'Under' },
        { ...ol_template },
      ],
    },
  ],
  // 罚牌投注项模板
  hpsPunish: [
    {
      ols: [
        { ...ol_template, _hpid: 310, ot: '1' },
        { ...ol_template, _hpid: 310, ot: '2' },
        { ...ol_template, _hpid: 310, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 306, ot: '1' },
        { ...ol_template, _hpid: 306, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 307, ot: 'Over' },
        { ...ol_template, _hpid: 307, ot: 'Under' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 311, ot: '1' },
        { ...ol_template, _hpid: 311, ot: '2' },
        { ...ol_template, _hpid: 311, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 308, ot: '1' },
        { ...ol_template, _hpid: 308, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 309, ot: 'Over' },
        { ...ol_template, _hpid: 309, ot: 'Under' },
        { ...ol_template },
      ],
    },
  ],
  // 晋级投注项模板
  hpsPromotion: [
    {
      ols: [
        { ...ol_template, _hpid: 135, ot: '1', class: 'no-handicap' },
        { ...ol_template, _hpid: 135, ot: '2', class: 'no-handicap' },
        { ...ol_template },
      ],
    },
    ...TemplateCommon.set_default_tpl(5, ol_template)
  ],
  // 冠军投注项模板
  hpsOutright: [
    {
      ols: [
        { ...ol_template, _hpid: 136, ot: '1', class: 'no-handicap' },
        { ...ol_template, _hpid: 136, ot: '2', class: 'no-handicap' },
        { ...ol_template },
      ],
    },
    ...TemplateCommon.set_default_tpl(5, ol_template)
  ],
  // 加时赛投注项模板
  hpsOvertime: [
    {
      ols: [
        { ...ol_template, _hpid: 126, ot: '1' },
        { ...ol_template, _hpid: 126, ot: '2' },
        { ...ol_template, _hpid: 126, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 128, ot: '1' },
        { ...ol_template, _hpid: 128, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 127, ot: 'Over' },
        { ...ol_template, _hpid: 127, ot: 'Under' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 129, ot: '1' },
        { ...ol_template, _hpid: 129, ot: '2' },
        { ...ol_template, _hpid: 129, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 130, ot: '1' },
        { ...ol_template, _hpid: 130, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 332, ot: 'Over' },
        { ...ol_template, _hpid: 332, ot: 'Under' },
        { ...ol_template },
      ],
    },
  ],
  // 点球大战
  hpsPenalty: [
    {
      ols: [
        { ...ol_template, _hpid: 333, ot: '1' },
        { ...ol_template, _hpid: 333, ot: '2' },
        { ...ol_template, _hpid: 333, ot: 'X' },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 334, ot: '1' },
        { ...ol_template, _hpid: 334, ot: '2' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 335, ot: 'Over' },
        { ...ol_template, _hpid: 335, ot: 'Under' },
        { ...ol_template },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 133, ot: 'Yes' },
        { ...ol_template, _hpid: 133, ot: 'No' },
        { ...ol_template, },
      ],
    },
    {
      ols: [
        { ...ol_template, _hpid: 240, ot: 'Odd' },
        { ...ol_template, _hpid: 240, ot: 'Even' },
        { ...ol_template },
      ],
    },
    ...TemplateCommon.set_default_tpl(1, ol_template)
  ],
  // 15分钟玩法
  hps15Minutes: [
    ...TemplateCommon.clone_arr(hps_15_minute),
    ...TemplateCommon.clone_arr(hps_15_minute),
  ],
  // 5分钟玩法 早盘
  hps5Minutes_361: [
    {
      ols: [
        { ...ol_template, _hpid: 361, ot: '1-5', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '11-15', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '21-25', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '31-35', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '41-45', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 361, ot: '6-10', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '16-20', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '26-30', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '36-40', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '', other_class: "col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 361, ot: '46-50', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '56-60', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '66-70', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '76-80', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '86-90', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: 'ClutchGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 361, ot: '51-55', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '61-65', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '71-75', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '81-85', other_class: "col1.5" },
        { ...ol_template, _hpid: 361, ot: '', other_class: "col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
  ],
  // 5分钟玩法 滚球
  hps5Minutes_362: [
    {
      ols: [
        { ...ol_template, _hpid: 362, ot: '1-5', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '21-25', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '41-45', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '61-65', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '81-85', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 362, ot: '6-10', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '26-30', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '46-50', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '66-70', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '86-90', other_class: "col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 362, ot: '11-15', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '31-35', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '51-55', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '71-75', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: 'ClutchGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        { ...ol_template, _hpid: 362, ot: '16-20', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '36-40', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '56-60', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '76-80', other_class: "col1.5" },
        { ...ol_template, _hpid: 362, ot: '', other_class: "col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
  ],
}


// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
  // 玩法标题高度
  play_title_height: 36,
  // 角球盘口高度
  tab_play_handicap_height: 111,
  // 是否需要动态计算高度
  is_dynamic_compute_height: true,
}


/**
 * 重置 赛事模板配置 
 * 设置0号模板次要玩法盘口+玩法标题高度
 */
export const reset_match_template_config = () => {

  let obj = {
    ...match_template_config,
    tab_play_handicap_height: 145 - (!['en', 'ad', 'ms'].includes(localStorage.getItem('get_lang')) ? 16 : 0)

  }

  return obj
}
