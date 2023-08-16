
/**
 *    虚拟篮球
 *    源名字： template_1004  template1004
 */

import * as TemplateCommon from "./template-common.js"

let ol_template = TemplateCommon.ol_template

// 虚拟篮球

export const template_7 = {
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
}



