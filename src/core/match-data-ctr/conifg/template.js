/*
 * @Author: 
 * @Date: 2022-12-20 13:47:46
 * @Description: 
 */
import { clone_arr, update_tpl_hpid, set_tpl_13_config, set_default_tpl, created_add_temp_config } from './method.js'
// 投注项模板
const ol_template = {
  // 投注项ID
  oid: 0,
  // 玩法ID
  _hpid: 0,
  // 投注项ot
  ot: 0,
  // 赔率
  ov: '',
  // 投注项状态
  os: 0,
  // 盘口值
  onb: '',
  // 盘口值
  onbl: '',
  // 盘口ID
  _hid: 0,
  // 盘口状态
  _hs: 0,
  // 赛事级别盘口状态
  _mhs: 0,
  // 投注项坑位 
  _hn: "",
  // 投注项自定义class类   'no-handicap' : 无盘口值
  class: '',
  // 附加盘合并到主盘标识  2 3
  // hn:""
}
  //0号模板  模板主盘
const template_0_main = [
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
]
//13号模板  模板主盘
const template_13_main =  [
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
const template_13 = {
  //主盘多列玩法的后7种
  main_handicap_list: [...template_13_main],
  //附加盘
  add_handicap_list: created_add_temp_config(template_13_main),
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
    ...set_default_tpl(3, ol_template)
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
    ...set_default_tpl(3, ol_template)
  ],
  // 晋级投注项模板
  hpsPromotion: set_default_tpl(7, ol_template),
  // 冠军投注项模板
  hpsOutright: set_default_tpl(7, ol_template),
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
    ...set_default_tpl(5, ol_template)
  ],
  // 点球大战
  hpsPenalty: set_default_tpl(7, ol_template),
   // 5分钟玩法 早盘
  hps5Minutes_361: set_default_tpl(7, ol_template,6),
   // 5分钟玩法 滚球
  hps5Minutes_362: set_default_tpl(7, ol_template,6),
}
//单节15分钟玩法 
const hps_15_minute = [
  {
    ols: [
      { ...ol_template, _hpid: 32, ot: '1' },
      { ...ol_template, _hpid: 32, ot: '2' },
      { ...ol_template, _hpid: 32, ot: 'X' },
    ],
  },
  {
    ols: [
      { ...ol_template, _hpid: 33, ot: '1' },
      { ...ol_template, _hpid: 33, ot: '2' },
      { ...ol_template },
    ],
  },
  {
    ols: [
      { ...ol_template, _hpid: 34, ot: 'Over' },
      { ...ol_template, _hpid: 34, ot: 'Under' },
      { ...ol_template },
    ],
  },
]
// 21 比分模板前3项 固定
const tpl_21_full = [
  {
    ols: [
      { ...ol_template, _hpid: 7, ot: '1:0' },
      { ...ol_template, _hpid: 7, ot: '2:0' },
      { ...ol_template, _hpid: 7, ot: '2:1' },
      { ...ol_template, _hpid: 7, ot: '3:0' },
      { ...ol_template, _hpid: 7, ot: '3:1' },
      { ...ol_template, _hpid: 7, ot: '3:2' },
      { ...ol_template, _hpid: 7, ot: '4:0' },
      { ...ol_template, _hpid: 7, ot: '4:1' },
      { ...ol_template, _hpid: 7, ot: '4:2' },
      { ...ol_template, _hpid: 7, ot: '4:3' },
      { ...ol_template, _hpid: 7, ot: 'Other', other_class: 'col3 absolute' },
    ],
  },
  {
    ols: [
      { ...ol_template, _hpid: 7, ot: '0:0' },
      { ...ol_template, _hpid: 7, ot: '1:1' },
      { ...ol_template, _hpid: 7, ot: '2:2' },
      { ...ol_template, _hpid: 7, ot: '3:3' },
      { ...ol_template, _hpid: 7, ot: '4:4' },
      { ...ol_template },
      { ...ol_template },
      { ...ol_template },
      { ...ol_template },
      { ...ol_template },
      { ...ol_template , other_class: 'visibility'},
    ],
  },
  {
    ols: [
      { ...ol_template, _hpid: 7, ot: '0:1' },
      { ...ol_template, _hpid: 7, ot: '0:2' },
      { ...ol_template, _hpid: 7, ot: '1:2' },
      { ...ol_template, _hpid: 7, ot: '0:3' },
      { ...ol_template, _hpid: 7, ot: '1:3' },
      { ...ol_template, _hpid: 7, ot: '2:3' },
      { ...ol_template, _hpid: 7, ot: '0:4' },
      { ...ol_template, _hpid: 7, ot: '1:4' },
      { ...ol_template, _hpid: 7, ot: '2:4' },
      { ...ol_template, _hpid: 7, ot: '3:4' },
      { ...ol_template, other_class: 'visibility' },
    ],
  },
]


// 0号模板
const template_0 = {
  //主盘
  main_handicap_list:[...template_0_main],
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
  add_handicap_list: created_add_temp_config(template_0_main),
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
    ...set_default_tpl(5, ol_template)
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
    ...set_default_tpl(5, ol_template)
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
    ...set_default_tpl(1, ol_template)
  ],
  // 15分钟玩法
  hps15Minutes: [
    ...clone_arr(hps_15_minute),
    ...clone_arr(hps_15_minute),
  ],
  // 5分钟玩法 早盘
  hps5Minutes_361: [
    {
      ols:[
        { ...ol_template, _hpid: 361, ot: '1-5', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '11-15', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '21-25', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '31-35', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '41-45', other_class:"col1.5" },
        
        { ...ol_template, _hpid: 361, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 361, ot: '6-10', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '16-20', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '26-30', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '36-40', other_class:"col1.5"},
        { ...ol_template, _hpid: 361, ot: '', other_class:"col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 361, ot: '46-50', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '56-60', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '66-70', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '76-80', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '86-90', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: 'ClutchGoal' ,other_class: 'absolute col3'},
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 361, ot: '51-55', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '61-65', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '71-75', other_class:"col1.5" },
        { ...ol_template, _hpid: 361, ot: '81-85', other_class:"col1.5"},
        { ...ol_template, _hpid: 361, ot: '', other_class:"col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
    
  ],
  // 5分钟玩法 滚球
  hps5Minutes_362: [
    {
      ols:[
        { ...ol_template, _hpid: 362, ot: '1-5', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '21-25', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '41-45', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '61-65', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '81-85', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: 'NoGoal', other_class: 'absolute col3' },
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 362, ot: '6-10', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '26-30', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '46-50', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '66-70', other_class:"col1.5"},
        { ...ol_template, _hpid: 362, ot: '86-90', other_class:"col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 362, ot: '11-15', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '31-35', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '51-55', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '71-75', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: 'ClutchGoal' ,other_class: 'absolute col3'},
      ]
    },
    {
      ols:[
        { ...ol_template, _hpid: 362, ot: '16-20', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '36-40', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '56-60', other_class:"col1.5" },
        { ...ol_template, _hpid: 362, ot: '76-80', other_class:"col1.5"},
        { ...ol_template, _hpid: 362, ot: '', other_class:"col1.5" },
        { ...ol_template, other_class: 'visibility col1.5' },
      ]
    },
  ],
}


/**
 * 赛事模板玩法配置
 * main_handicap_list   主盘口 盘口列表
 * add_handicap_list    附加盘 盘口列表
 * cur_handicap_list    当前局 盘口列表
 * hid    盘口ID
 * _hpid  玩法ID
 * ol     投注项列表
 */
const match_list_play_config = {
  // 0号模板 足球让球与大小
  template_0,
  // 2号模板 足球-半/全场
  template_2: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '11', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '1X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '12', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: 'X1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: 'XX', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: 'X2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '21', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '2X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 104, ot: '22', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 3号模板 足球-进球单双
  template_3: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 15, ot: 'Odd', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 15, ot: 'Even', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 42, ot: 'Odd', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 42, ot: 'Even', class: 'no-handicap' },
        ],
      },
    ],
    main_handicap_list_6: [
      {
        ols: [
          { ...ol_template, _hpid: 40, ot: 'Odd', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 40, ot: 'Even', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 42, ot: 'Odd', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 42, ot: 'Even', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 5号模板 足球-进球区间
  template_5: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 68, ot: '0-1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 68, ot: '2-3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 68, ot: '4-6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 68, ot: '7+', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 6号模板 足球-净胜分
  template_6: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: '1And1', class: 'no-handicap' },
          { ...ol_template, _hpid: 340, ot: '2And1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: '1And2', class: 'no-handicap' },
          { ...ol_template, _hpid: 340, ot: '2And2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: '1And3', class: 'no-handicap' },
          { ...ol_template, _hpid: 340, ot: '2And3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: '1And4+', class: 'no-handicap' },
          { ...ol_template, _hpid: 340, ot: '2And4+', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: 'X1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 340, ot: 'X0', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 7号模板  篮球让球与大小
  template_7: {
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
    cur_handicap_list: set_default_tpl(5, ol_template,2),
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
  },
  // 8号模板 篮球-净胜分
  template_8: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 200, ot: '1And6+', class: 'no-handicap' },
          { ...ol_template, _hpid: 200, ot: '2And6+', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 200, ot: 'Other', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 9号模板 网球-让球与大小
  template_9: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 153, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 154, ot: '1' },
          { ...ol_template, _hpid: 154, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 155, ot: '1' },
          { ...ol_template, _hpid: 155, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 202, ot: 'Over' },
          { ...ol_template, _hpid: 202, ot: 'Under' },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 162, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 162, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 163, ot: '1' },
          { ...ol_template, _hpid: 163, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 164, ot: 'Over' },
          { ...ol_template, _hpid: 164, ot: 'Under' },
        ],
      },
    ],
  },
  // 10号模板 网球-准确盘数
  template_10: {
    // 网球主盘口列表 3局赛制
    main_handicap_list_5_3: [
      {
        ols: [
          { ...ol_template, _hpid: 159, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 159, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
        ],
      },
    ],
    // 网球主盘口列表 5局赛制
    main_handicap_list_5_5: [
      {
        ols: [
          { ...ol_template, _hpid: 159, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 159, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 159, ot: '5', class: 'no-handicap' },
        ],
      },
    ],
    // 羽毛球主盘口列表 3局赛制
    main_handicap_list_10_3: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
        ],
      },
    ],
    // 羽毛球主盘口列表 5局赛制
    main_handicap_list_10_5: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 11号模板 (羽毛球 || 乒乓球 || 沙滩排球 || 排球 || 斯诺克)-让球与大小
  template_11: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 153, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 172, ot: '1' },
          { ...ol_template, _hpid: 172, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 173, ot: 'Over' },
          { ...ol_template, _hpid: 173, ot: 'Under' },
        ],
      },
    ],
    // 斯诺克 主盘口列表
    main_handicap_list_7: [
      {
        ols: [
          { ...ol_template, _hpid: 153, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 181, ot: '1' },
          { ...ol_template, _hpid: 181, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 182, ot: 'Over' },
          { ...ol_template, _hpid: 182, ot: 'Under' },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 175, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 175, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 176, ot: '1' },
          { ...ol_template, _hpid: 176, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 177, ot: 'Over' },
          { ...ol_template, _hpid: 177, ot: 'Under' },
        ],
      },
    ],
    // 斯诺克当前局盘口列表
    cur_handicap_list_7: [
      {
        ols: [
          { ...ol_template, _hpid: 184, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 184, ot: '2', class: 'no-handicap' },
        ],
      },
      ...set_default_tpl(2, ol_template,2)
    ],
    // 排球当前局盘口列表
    cur_handicap_list_9: [
      {
        ols: [
          { ...ol_template, _hpid: 162, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 162, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 253, ot: '1' },
          { ...ol_template, _hpid: 253, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 254, ot: 'Over' },
          { ...ol_template, _hpid: 254, ot: 'Under' },
        ],
      },
    ],
  },
  // 12号模板 足球 竟足
  template_12: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: '1', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: 'X', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: 'X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: '2', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 13号模板 足球 13列玩法 
  template_13: {
    ...set_tpl_13_config(template_0,template_13),
    // 15分钟玩法
    hps15Minutes: [
      ...clone_arr(hps_15_minute),
      ...clone_arr(hps_15_minute),
      ...clone_arr(hps_15_minute),
      ...clone_arr(hps_15_minute),
      ...set_default_tpl(1, ol_template)
    ],
  },
  // 15号模板 兵乓球-准确局数
  template_15: {
    // 兵乓球 准确局数 5局赛制
    main_handicap_list_5: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '3', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template },
        ],
      },
    ],
    // 兵乓球 准确局数 7局赛制
    main_handicap_list_7: [
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '5', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 174, ot: '7', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 16号模板 冰球-让球与大小
  template_16: {
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
          { ...ol_template, _hpid: 15, ot: 'Odd' },
          { ...ol_template, _hpid: 15, ot: 'Even' },
          { ...ol_template },
        ],
      },
    ],
    cur_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 261, ot: '1' },
          { ...ol_template, _hpid: 261, ot: '2' },
          { ...ol_template, _hpid: 261, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 268, ot: '1' },
          { ...ol_template, _hpid: 268, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 262, ot: 'Over' },
          { ...ol_template, _hpid: 262, ot: 'Under' },
          { ...ol_template },
        ],
      },
      ...set_default_tpl(1, ol_template)
    ],
  },
  // 17号模板 棒球-让球与大小
  template_17: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 242, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 242, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 243, ot: '1' },
          { ...ol_template, _hpid: 243, ot: '2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 244, ot: 'Over' },
          { ...ol_template, _hpid: 244, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 247, ot: 'Odd' },
          { ...ol_template, _hpid: 247, ot: 'Even' },
        ],
      },
    ],
  },
  // 19号模板 拳击-让球与大小
  template_19: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 153, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 153, ot: '2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 2, ot: 'Over' },
          { ...ol_template, _hpid: 2, ot: 'Under' },
        ],
      },
    ],
  },
  // 20号模板 水球-让球与大小
  template_20: {
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
  },
  // 21号模板 足球-比分
  template_21: {
    main_handicap_list_20: [
        ...clone_arr(tpl_21_full),
        ...update_tpl_hpid(20, tpl_21_full,'right-rimless')
      ],
    main_handicap_list_20_13: [
      ...clone_arr(tpl_21_full),
       ...update_tpl_hpid(20, tpl_21_full), 
      //  ...update_tpl_hpid(74, tpl_21_full),
       ...set_default_tpl(7, ol_template,11)
      ],
    main_handicap_list_341: [
        ...clone_arr(tpl_21_full),
        ...update_tpl_hpid(341, tpl_21_full,'right-rimless'),
      ],
    main_handicap_list_341_13: [
      ...clone_arr(tpl_21_full), 
      ...update_tpl_hpid(341, tpl_21_full),
      //  ...update_tpl_hpid(342, tpl_21_full),
       ...set_default_tpl(7, ol_template,11)
      ],
  },
  // 22号模板 足球-独赢 让球胜平负
  template_22: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: '1' },
          { ...ol_template, _hpid: 3, ot: '1',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: 'X', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: 'X' },
          { ...ol_template, _hpid: 3, ot: 'X',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 1, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 3, ot: '2' },
          { ...ol_template, _hpid: 3, ot: '2',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 17, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 69, ot: '1' },
          { ...ol_template, _hpid: 69, ot: '1',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 17, ot: 'X', class: 'no-handicap' },
          { ...ol_template, _hpid: 69, ot: 'X' },
          { ...ol_template, _hpid: 69, ot: 'X',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 17, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 69, ot: '2' },
          { ...ol_template, _hpid: 69, ot: '2',hn:2 },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 6, ot: '1X', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 6, ot: '12', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 6, ot: 'X2', class: 'no-handicap' },
        ],
      },
    ],
  },
  // 23号模板 足球-下一 最后进球
  template_23: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 28, ot: '1' },
          { ...ol_template, _hpid: 28, ot: '2' },
          { ...ol_template, _hpid: 28, ot: 'None' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 12, ot: 'Yes' },
          { ...ol_template, _hpid: 12, ot: 'No' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 149, ot: '1' },
          { ...ol_template, _hpid: 149, ot: '2' },
          { ...ol_template, _hpid: 149, ot: 'None' },
        ],
      },
    ],
  },

  // 电竞模板
  template_esports: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 30001, ot: 'T1', class: 'no-handicap' },
          { ...ol_template, _hpid: 30001, ot: 'T2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 30002, ot: 'T1' },
          { ...ol_template, _hpid: 30002, ot: 'T2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 30003, ot: 'Over' },
          { ...ol_template, _hpid: 30003, ot: 'Under' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 30006, ot: 'T1', class: 'no-handicap' },
          { ...ol_template, _hpid: 30006, ot: 'T2', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 30007, ot: 'T1' },
          { ...ol_template, _hpid: 30007, ot: 'T2' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 30008, ot: 'Over' },
          { ...ol_template, _hpid: 30008, ot: 'Under' },
        ],
      },

    ],
  },

  // 虚拟足球
  template_1001: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 20001, ot: '1' },
          { ...ol_template, _hpid: 20001, ot: '2' },
          { ...ol_template, _hpid: 20001, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20004, ot: '1' },
          { ...ol_template, _hpid: 20004, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20002, ot: 'Over' },
          { ...ol_template, _hpid: 20002, ot: 'Under' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20013, ot: '1' },
          { ...ol_template, _hpid: 20013, ot: '2' },
          { ...ol_template, _hpid: 20013, ot: 'X' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20015, ot: '1' },
          { ...ol_template, _hpid: 20015, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20014, ot: 'Over' },
          { ...ol_template, _hpid: 20014, ot: 'Under' },
          { ...ol_template },
        ],
      },
    ],
  },

  // 虚拟篮球
  template_1004: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 20043, ot: '1' },
          { ...ol_template, _hpid: 20043, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20045, ot: '1' },
          { ...ol_template, _hpid: 20045, ot: '2' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20044, ot: 'Over' },
          { ...ol_template, _hpid: 20044, ot: 'Under' },
          { ...ol_template },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20046, ot: 'Yes' },
          { ...ol_template, _hpid: 20046, ot: 'No' },
          { ...ol_template },
        ],
      },
    ],
  },

  // 虚拟赛狗、虚拟赛马、虚拟摩托
  template_1002: {
    main_handicap_list: [
      {
        ols: [
          { ...ol_template, _hpid: 20033, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '3', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '4', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '5', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20034, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '3', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '4', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '5', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '6', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20035, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 20035, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 20035, ot: '3', class: 'no-handicap' },
          { ...ol_template, _hpid: 20035, ot: '4', class: 'no-handicap' },
          { ...ol_template, _hpid: 20035, ot: '5', class: 'no-handicap' },
          { ...ol_template, _hpid: 20035, ot: '6', class: 'no-handicap' },
        ],
      },
    ],
    // 虚拟泥地摩托
    main_handicap_list_1009: [
      {
        ols: [
          { ...ol_template, _hpid: 20033, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '3', class: 'no-handicap' },
          { ...ol_template, _hpid: 20033, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20034, ot: '1', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '2', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '3', class: 'no-handicap' },
          { ...ol_template, _hpid: 20034, ot: '4', class: 'no-handicap' },
        ],
      },
      {
        ols: [
          { ...ol_template, _hpid: 20040, ot: 'Over' },
          { ...ol_template, _hpid: 20040, ot: 'Under' },
          { ...ol_template, _hpid: 20039, ot: 'Odd' },
          { ...ol_template, _hpid: 20039, ot: 'Even' },
        ],
      }
    ],
  },
}
export { match_list_play_config }
