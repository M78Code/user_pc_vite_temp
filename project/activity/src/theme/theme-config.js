import * as all_theme_config from "./all-theme.js";
import {
  set_theme_style_sheet_by_css_obj
} from "project_path/src/core/index.js";

/**
 * 计算单个项目单种 主题的 变量值
 * @param {*} project_config  单个项目的主题色配置对象
 * @param {*} theme  主题色键
 * @returns
 */
const compute_theme_map = (project_config, theme) => {
  let final_obj = {};
  let final_content = "";
  for (let key in project_config) {
    let final_key=`--qq--${key}`
    let val = project_config[key];
    if (val) {
      if (typeof val == "string") {
        final_obj[final_key] = val;
        final_content  += `\n   ${final_key}: ${val};`
      } else {
        final_obj[final_key] = val[theme];
        final_content  += `\n   ${final_key}: ${val[theme]};`
      }
    } else {
      final_obj[final_key] = "";
      final_content  += `\n   ${final_key}:  ''};`
    }
  }
  return {
    final_obj,
    final_content
  };
};


 

// 主题橙色----日间版   theme01
// 主题橙色----夜间版  theme02
// 主题蓝色----日间版   theme01_y0
// 主题蓝色----夜间版  theme02_y0

/**
 *  根据当前展示的 项目   , 以及主题色  动态计算  css var  返回对象  ，用于写入 html 节点
 * @param {*} project  项目键  yazhou_h5 yazhou_pc 等
 * @param {*} theme  主题色键    theme01  theme02  theme01_y0  theme02_y0  等
 */
export const change_theme_variable = (project, theme) => {

 
  // 例如： theme_config_yazhou_h5
  let project_config = all_theme_config[`theme_config_${project}`];
  let {final_content } = compute_theme_map(project_config, theme);
 
  set_theme_style_sheet_by_css_obj(final_content)
 
};
