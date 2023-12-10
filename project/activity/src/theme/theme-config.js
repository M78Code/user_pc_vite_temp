import * as all_theme_config from "./all-theme.js";

/**
 *  根据当前展示的是 H5 还是PC , 以及主题色  动态计算  css var  返回对象  ，用于写入 html 节点
 * @param {*} project
 * @param {*} theme
 */
export const compute_theme_css_var = (project, theme) => {
  // 例如： theme_config_h5_theme02
  let key = `theme_config_${project}_${theme}`;

  return all_theme_config[key];
};
