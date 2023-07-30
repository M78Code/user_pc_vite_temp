/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
/**
 * 获取url参数的方法 默认返回全部 {name:value}
 * @param {string} name 获取单个
 * @returns {name:value}|value
 */
export function GetUrlParams(name) {
  const search_ary = location.search.slice(1).split("&");
  const obj = {};
  search_ary.forEach((item) => {
    const [key, value] = item.split("&");
    obj[key] = decodeURIComponent(value);
  });
  if (name) return obj[name];
  return obj;
}