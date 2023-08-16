
/**
 * 19号模板 拳击-让球与大小
 */
import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template

// 19号模板 拳击-让球与大小

export const template_19 = {
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
}

// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
  // 当前局玩法高度
  cur_handicap_height: 70,
  // 是否需要动态计算高度
  is_dynamic_compute_height: true,
}



