//获取URL参数 
function getQueryString() {
  const result = {};
  // 设置之前缓存的url参数
  for (var key of SEARCH_PARAMS.init_param.keys()) {
    result[key] = SEARCH_PARAMS.init_param.get(key);
  }
  const param = window.location.href.split("?")[1];
  const search = decodeURIComponent("?" + param);
  const arr = search !== "" ? search.substr(1).split("&") : [];
  arr.forEach((item) => {
    if (item) {
      const itemArr = item.split("=");
      result[String(itemArr[0]).toLowerCase()] = itemArr[1];
    }
  });
  // url参数获取逻辑修复优化
  let url_search = new URLSearchParams(location.search);
  for (var key of url_search.keys()) {
    result[key] = url_search.get(key);
  }
  return result;
};

export const get_query_string = getQueryString()

