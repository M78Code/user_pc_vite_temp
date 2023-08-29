import { LocalStorage  } from "src/core/utils/web-storage.js";
export function initData() {
  try {
    //解析URL参数
    let qsInfo = new URLSearchParams(location.search);
    //计算token
    let token = qsInfo.get("token") || LocalStorage .get("TOKEN") || "";
    if (token) {
      LocalStorage .set("TOKEN", token);
    }
    // 是否解除pb压缩开关: pb=1时表示数据不进行加密接口请求
    let pb = LocalStorage .get("pb") || qsInfo.get("pb") || "";
    if (pb) {
      LocalStorage .set("pb", "1");
    }
    // 设置商户分组信息
    let gr = (
      LocalStorage .get("gr") ||
      qsInfo.get("gr") ||
      "COMMON"
    ).toLocaleUpperCase();
    if (gr) {
      LocalStorage .set("gr", gr);
    }
  } catch (error) {
    console.error(error);
  }
}
export function getInitData() {
  return {
    token: LocalStorage .get("TOKEN"),
    gr: LocalStorage .get("gr").toLocaleUpperCase(),
  };
}
