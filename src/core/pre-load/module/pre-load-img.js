import { compute_local_project_file_path } from "src/core";
const img_key_map = {
  xsxa :''
};

const arr=[ compute_local_project_file_path("/image/list/m_list_jiaoqiu_icon.svg")]
/**
 * 预加载图片
 * @param []
 */
const pre_load_img = (url) => {
  const ary = Array.isArray(url) ? url : [url];
  ary.forEach((url) => {
    if (!img_key_map[url]) {
      img_key_map[url] = 1;
    }
  });
};

export { pre_load_img };