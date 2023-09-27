//获取URL参数 
const getQueryString = function () {
  const result = {};
  const param = window.location.href.split("?")[1];
  const search = decodeURIComponent("?" + param);
  const arr = search !== "" ? search.substr(1).split("&") : [];
  arr.forEach((item) => {
    if (item) {
      const itemArr = item.split("=");
      result[String(itemArr[0]).toLowerCase()] = itemArr[1];
    }
  });
  return result;
};

const Qs = getQueryString();
export { Qs };
