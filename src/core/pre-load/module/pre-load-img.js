const img_key_map = {
  xsxa :''
};

const arr=[
  "yazhou-h5/image/list/m_list_jiaoqiu_icon.svg"
]
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