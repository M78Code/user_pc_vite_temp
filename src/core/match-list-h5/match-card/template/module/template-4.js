/**
 * 11号模板 (羽毛球 || 乒乓球 || 沙滩排球 || 排球 || 斯诺克)-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template

// 11号模板 (羽毛球 || 乒乓球 || 沙滩排球 || 排球 || 斯诺克)-让球与大小
export const template_11 = {
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
    ...TemplateCommon.set_default_tpl(2, ol_template, 2)
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
}

// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
  // 当前局玩法高度
  cur_handicap_height: 70,
  // 是否需要动态计算高度
  is_dynamic_compute_height: true,
}



