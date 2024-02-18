/**
 *  9号模板 网球-让球与大小
 */
import * as TemplateCommon from "../template-common.js"

// 9号模板 网球-让球与大小
export const template_3 = {
  main_handicap_list: [
    {
      ols: [
        {  _hpid: 153, ot: '1', class: 'no-handicap' },
        {  _hpid: 153, ot: '2', class: 'no-handicap' },
      ],
    },
    {
      ols: [
        {  _hpid: 154, ot: '1' },
        {  _hpid: 154, ot: '2' },
      ],
    },
    {
      ols: [
        {  _hpid: 155, ot: '1' },
        {  _hpid: 155, ot: '2' },
      ],
    },
    {
      ols: [
        {  _hpid: 202, ot: 'Over' },
        {  _hpid: 202, ot: 'Under' },
      ],
    },
  ],
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

// 赛事模板配置
export const match_template_config = {
  ...TemplateCommon.match_style_template,
  // 是否需要动态计算高度
  is_dynamic_compute_height: true,
}


