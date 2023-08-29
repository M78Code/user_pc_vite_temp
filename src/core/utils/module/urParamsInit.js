import { ls } from "src/core/utils/web-storage.js";
export function initData() {
  try {
    //解析URL参数
    let qsInfo = new URLSearchParams(location.search);
    //计算token
    let token = qsInfo.get("token") || ls.get("TOKEN") || "";
    if (token) {
      ls.set("TOKEN", token);
    }
    // 是否解除pb压缩开关: pb=1时表示数据不进行加密接口请求
    let pb = ls.get("pb") || qsInfo.get("pb") || "";
    if (pb) {
      ls.set("pb", "1");
    }
    // 设置商户分组信息
    let gr = (
      ls.get("gr") ||
      qsInfo.get("gr") ||
      "COMMON"
    ).toLocaleUpperCase();
    if (gr) {
      ls.set("gr", gr);
    }
  } catch (error) {
    console.error(error);
  }
}
export function getInitData() {
  return {
    token: ls.get("TOKEN"),
    gr: ls.get("gr").toLocaleUpperCase(),
  };
}
