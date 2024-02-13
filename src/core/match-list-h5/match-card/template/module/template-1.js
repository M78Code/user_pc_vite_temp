/**
 *   1号模板 足球让球与大小
 * 
 */
import * as TemplateCommon from "../template-common.js"

const hps_15_minute = TemplateCommon.hps_15_minute
// 1号模板  模板主盘 -- 玩法模板
export const template_1_main = [
  // 全场独赢
  {
    hpid: 1,
    ols: [
      {  _hpid: 1, ot: '1' },
      {  _hpid: 1, ot: '2' },
      {  _hpid: 1, ot: 'X' },
    ],
  },
  // 全场让球
  {
    hpid: 4,
    ols: [
      {  _hpid: 4, ot: '1' },
      {  _hpid: 4, ot: '2' },
      { empty:1}
    ],
  },
  // 全场大小
  {
    hpid: 2,
    ols: [
      {  _hpid: 2, ot: 'Over' },
      {  _hpid: 2, ot: 'Under' },
      { empty:1}
    ],
  },
  // 半场独赢
  {
    hpid: 17,
    ols: [
      {  _hpid: 17, ot: '1' },
      {  _hpid: 17, ot: '2' },
      {  _hpid: 17, ot: 'X' },
    ],
  },
  // 半场让球
  {
    hpid: 19,
    ols: [
      {  _hpid: 19, ot: '1' },
      {  _hpid: 19, ot: '2' },
      { empty:1}
    ],
  },
  // 半场大小
  {
    hpid: 18,
    ols: [
      {  _hpid: 18, ot: 'Over' },
      {  _hpid: 18, ot: 'Under' },
      { empty:1}
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
        {  _hpid: 37, ot: '1', class: 'no-handicap' },
        {  _hpid: 37, ot: '2', class: 'no-handicap' },
        {  _hpid: 37, ot: 'X', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 39, ot: '1' },
        {  _hpid: 39, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 38, ot: 'Over' },
        {  _hpid: 38, ot: 'Under' },
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
  // 角球投注项模板
  hpsCorner: [
    {
      ols: [
        {  _hpid: 111, ot: '1' },
        {  _hpid: 111, ot: '2' },
        {  _hpid: 111, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 113, ot: '1' },
        {  _hpid: 113, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 114, ot: 'Over' },
        {  _hpid: 114, ot: 'Under' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 119, ot: '1' },
        {  _hpid: 119, ot: '2' },
        {  _hpid: 119, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 121, ot: '1' },
        {  _hpid: 121, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 122, ot: 'Over' },
        {  _hpid: 122, ot: 'Under' },
        { empty:1}
      ],
    },
  ],
  // 罚牌投注项模板
  hpsPunish: [
    {
      ols: [
        {  _hpid: 310, ot: '1' },
        {  _hpid: 310, ot: '2' },
        {  _hpid: 310, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 306, ot: '1' },
        {  _hpid: 306, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 307, ot: 'Over' },
        {  _hpid: 307, ot: 'Under' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 311, ot: '1' },
        {  _hpid: 311, ot: '2' },
        {  _hpid: 311, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 308, ot: '1' },
        {  _hpid: 308, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 309, ot: 'Over' },
        {  _hpid: 309, ot: 'Under' },
        { empty:1}
      ],
    },
  ],
  // 晋级投注项模板
  hpsPromotion: [
    {
      ols: [
        {  _hpid: 135, ot: '1', class: 'no-handicap' },
        {  _hpid: 135, ot: '2', class: 'no-handicap' },
        { empty:1}
      ],
    },
    ...TemplateCommon.set_default_tpl(5)
  ],
  // 冠军投注项模板
  hpsOutright: [
    {
      ols: [
        {  _hpid: 136, ot: '1', class: 'no-handicap' },
        {  _hpid: 136, ot: '2', class: 'no-handicap' },
        { empty:1}
      ],
    },
    ...TemplateCommon.set_default_tpl(5)
  ],
  // 加时赛投注项模板
  hpsOvertime: [
    {
      ols: [
        {  _hpid: 126, ot: '1' },
        {  _hpid: 126, ot: '2' },
        {  _hpid: 126, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 128, ot: '1' },
        {  _hpid: 128, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 127, ot: 'Over' },
        {  _hpid: 127, ot: 'Under' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 129, ot: '1' },
        {  _hpid: 129, ot: '2' },
        {  _hpid: 129, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 130, ot: '1' },
        {  _hpid: 130, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 332, ot: 'Over' },
        {  _hpid: 332, ot: 'Under' },
        { empty:1}
      ],
    },
  ],
  // 点球大战
  hpsPenalty: [
    {
      ols: [
        {  _hpid: 333, ot: '1' },
        {  _hpid: 333, ot: '2' },
        {  _hpid: 333, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 334, ot: '1' },
        {  _hpid: 334, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 335, ot: 'Over' },
        {  _hpid: 335, ot: 'Under' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 133, ot: 'Yes' },
        {  _hpid: 133, ot: 'No' },
        {  },
      ],
    },
    {
      ols: [
        {  _hpid: 240, ot: 'Odd' },
        {  _hpid: 240, ot: 'Even' },
        { empty:1}
      ],
    },
    ...TemplateCommon.set_default_tpl(1)
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
        {  _hpid: 361, ot: '1-5', other_class: "col1.5" },
        {  _hpid: 361, ot: '11-15', other_class: "col1.5" },
        {  _hpid: 361, ot: '21-25', other_class: "col1.5" },
        {  _hpid: 361, ot: '31-35', other_class: "col1.5" },
        {  _hpid: 361, ot: '41-45', other_class: "col1.5" },
        {  _hpid: 361, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        {  _hpid: 361, ot: '6-10', other_class: "col1.5" },
        {  _hpid: 361, ot: '16-20', other_class: "col1.5" },
        {  _hpid: 361, ot: '26-30', other_class: "col1.5" },
        {  _hpid: 361, ot: '36-40', other_class: "col1.5" },
        {  _hpid: 361, ot: '', other_class: "col1.5" },
        {  other_class: 'visibility col1.5' },
      ]
    },
    {
      ols: [
        {  _hpid: 361, ot: '46-50', other_class: "col1.5" },
        {  _hpid: 361, ot: '56-60', other_class: "col1.5" },
        {  _hpid: 361, ot: '66-70', other_class: "col1.5" },
        {  _hpid: 361, ot: '76-80', other_class: "col1.5" },
        {  _hpid: 361, ot: '86-90', other_class: "col1.5" },
        {  _hpid: 361, ot: 'ClutchGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        {  _hpid: 361, ot: '51-55', other_class: "col1.5" },
        {  _hpid: 361, ot: '61-65', other_class: "col1.5" },
        {  _hpid: 361, ot: '71-75', other_class: "col1.5" },
        {  _hpid: 361, ot: '81-85', other_class: "col1.5" },
        {  _hpid: 361, ot: '', other_class: "col1.5" },
        {  other_class: 'visibility col1.5' },
      ]
    },
  ],
  // 5分钟玩法 滚球
  hps5Minutes_362: [
    {
      ols: [
        {  _hpid: 362, ot: '1-5', other_class: "col1.5" },
        {  _hpid: 362, ot: '21-25', other_class: "col1.5" },
        {  _hpid: 362, ot: '41-45', other_class: "col1.5" },
        {  _hpid: 362, ot: '61-65', other_class: "col1.5" },
        {  _hpid: 362, ot: '81-85', other_class: "col1.5" },
        {  _hpid: 362, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        {  _hpid: 362, ot: '6-10', other_class: "col1.5" },
        {  _hpid: 362, ot: '26-30', other_class: "col1.5" },
        {  _hpid: 362, ot: '46-50', other_class: "col1.5" },
        {  _hpid: 362, ot: '66-70', other_class: "col1.5" },
        {  _hpid: 362, ot: '86-90', other_class: "col1.5" },
        {  other_class: 'visibility col1.5' },
      ]
    },
    {
      ols: [
        {  _hpid: 362, ot: '11-15', other_class: "col1.5" },
        {  _hpid: 362, ot: '31-35', other_class: "col1.5" },
        {  _hpid: 362, ot: '51-55', other_class: "col1.5" },
        {  _hpid: 362, ot: '71-75', other_class: "col1.5" },
        {  _hpid: 362, ot: '', other_class: "col1.5" },
        {  _hpid: 362, ot: 'ClutchGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols: [
        {  _hpid: 362, ot: '16-20', other_class: "col1.5" },
        {  _hpid: 362, ot: '36-40', other_class: "col1.5" },
        {  _hpid: 362, ot: '56-60', other_class: "col1.5" },
        {  _hpid: 362, ot: '76-80', other_class: "col1.5" },
        {  _hpid: 362, ot: '', other_class: "col1.5" },
        {  other_class: 'visibility col1.5' },
      ]
    },
  ],
  // 特色组合玩法
  hpsCompose: [
    {
      ols: [
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
        {  _hpid: 13, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球大小' },
      ]
    },
    {
      ols: [
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
        {  _hpid: 101, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 两队都进球' },
      ]
    },
    {
      ols: [
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
        {  _hpid: 345, ot: '1-5', other_class: "col1.5", hpnb: '独赢 & 进球 大/小 - 上半场' },
      ]
    },
    {
      ols: [
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
        {  _hpid: 105, ot: '1-5', other_class: "col1.5", hpnb: '上半场独赢 & 上半场两队都进球' },
      ]
    }
  ]
}


// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
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
