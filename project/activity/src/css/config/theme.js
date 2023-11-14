/**
 * module/border.js 仅配置border-color
 * module/background.js 仅配置background-color、background-image
 * module/color.js 仅配置color
 * theme.js 可以配置其他杂项，但不允许配置上述样式变量
 * 本文件可配置with、size、opacity、整体border等其他变量
 * 禁止配置color、border-color、background-color、background-image * 
 * 请在相应文件里配置(color.js、border.js、background.js)
 */
//背景图片前缀
let preffix = '' 
if(process.env.NODE_ENV && process.env.NODE_ENV !== 'development') preffix = '/' + require('app/version.js').BUILD_VERSION

import common_color from "./module/color.js"
import common_border from "./module/border"
import common_background from "./module/background"

export default {
  ...common_color,
  ...common_border,
  ...common_background,

  /****************其他 start****************/
  'width-line': {
    t1: '3px',
    y1: '2px',
    t2: '3px',
    y2: '2px',
  },
  'bet-win-weight': {
    t1: '600',
    y1: '600',
    t2: '600',
    y2: '600',
  },
  'bet-row-1-weight': {
    t1: '400',
    y1: '500',
    t2: '400',
    y2: '500',
  },
  'bet-row-2-weight': {
    t1: '500',
    y1: '700',
    t2: '500',
    y2: '700',
  }, 
  /****************其他 end****************/

  
  /****************提前结算 start****************/
  'theme-bd-radius-pre-btn': {
    t1: '4px',
    y1: '20px',
    t2: '4px',
    y2: '20px',
  },
  // 单双关切换按钮
  'theme-bd-radius-bet-series': {
    t1: '4px',
    y1: '14px',
    t2: '4px',
    y2: '14px',
  },
  // 投注按钮  
  'theme-bd-radius-bet-submit': {
    t1: '24px',
    y1: '24px',
    t2: '24px',
    y2: '24px',
  }, 
  /****************提前结算 end****************/

  "settings-label-text-opacity": {
    t1: "1",
    y1: "1",
    t2: "0.6",
    y2: "0.6",
  },

};
