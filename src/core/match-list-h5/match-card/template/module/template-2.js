/**
 *  2号模板  篮球让球与大小
 */
import * as TemplateCommon from "../template-common.js"

export const template_2_main = [
  // 全场独赢
  {
    chpid: '37',
    hl: [{ 
      ol: [{ ot: '1' }, { ot: '2' }]
    }]
  },
  // 全场让分
  {
    chpid: '39',
    hl: [{
      ol: [{ ot: '1' }, { ot: '2' }]
    }]
  },
  // 全场大小
  {
    chpid: '38',
    hl: [{
      ol: [{ ot: 'Over' }, { ot: 'Under' }]
    }]
  },
]

export const template_2 = {
  cur_handicap_list: TemplateCommon.set_default_tpl(5, 2),
  // 篮球第一节玩法
  cur_handicap_list_13: [
    // 第一节独赢
    {
      chpid: '48',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第一节让分
    {
      chpid: '46',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第一节大小
    {
      chpid: '45',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    },
  ],
  // 篮球第二节玩法
  cur_handicap_list_14: [
    // 第二节独赢
    {
      chpid: '43',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第二节让分
    {
      chpid: '19',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第二节大小
    {
      chpid: '18',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    }
  ],
  // 篮球第三节玩法
  cur_handicap_list_15: [
    // 下半场独赢
    {
      chpid: '60',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 下半场让分
    {
      chpid: '58',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 下半场大小
    {
      chpid: '57',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    },
  ],
  // 篮球第四节玩法
  cur_handicap_list_16: [
     // 第四节独赢
     {
      chpid: '66',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第四节让分
    {
      chpid: '64',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 第四节大小
    {
      chpid: '63',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    }
  ],
  // 篮球上半场玩法
  cur_handicap_list_1: [
    // 上半场独赢
    {
      chpid: '43',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 上半场让分
    {
      chpid: '19',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 上半场大小
    {
      chpid: '18',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    },
  ],
  // 篮球下半场玩法
  cur_handicap_list_2: [
    // 下半场独赢
    {
      chpid: '43',
      hl: [{ 
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 下半场让分
    {
      chpid: '19',
      hl: [{
        ol: [{ ot: '1' }, { ot: '2' }]
      }]
    },
    // 下半场大小
    {
      chpid: '18',
      hl: [{
        ol: [{ ot: 'Over' }, { ot: 'Under' }]
      }]
    },
  ],
}

// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
  // 是否需要动态计算高度
  is_dynamic_compute_height: true,

}

