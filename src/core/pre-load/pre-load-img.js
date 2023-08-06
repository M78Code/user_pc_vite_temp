const img_key_map = {};
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
