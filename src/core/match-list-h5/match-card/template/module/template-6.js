
/**
 *    // 虚拟足球
 *    源名字： template_1001   template1001
 */

import * as TemplateCommon from "../template-common.js"



// 虚拟足球
export const template_6 = {
  main_handicap_list: [
    {
      ols: [
        {  _hpid: 20001, ot: '1' },
        {  _hpid: 20001, ot: '2' },
        {  _hpid: 20001, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 20004, ot: '1' },
        {  _hpid: 20004, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 20002, ot: 'Over' },
        {  _hpid: 20002, ot: 'Under' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 20013, ot: '1' },
        {  _hpid: 20013, ot: '2' },
        {  _hpid: 20013, ot: 'X' },
      ],
    },
    {
      ols: [
        {  _hpid: 20015, ot: '1' },
        {  _hpid: 20015, ot: '2' },
        { empty:1}
      ],
    },
    {
      ols: [
        {  _hpid: 20014, ot: 'Over' },
        {  _hpid: 20014, ot: 'Under' },
        { empty:1}
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