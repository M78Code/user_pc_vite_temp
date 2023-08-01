import { setLocalItem,getSessionItem } from 'src/public/utils/storage'
export function initData() {
  try {
    //解析URL参数
    let qsInfo = new URLSearchParams(location.search);
    //计算token
    let token =
      qsInfo.get("token") || getSessionItem("TOKEN") || "";
    if (token) {
      setLocalItem("TOKEN", token);
    }
    // 是否解除pb压缩开关: pb=1时表示数据不进行加密接口请求
    let pb = getSessionItem("pb") || qsInfo.get("pb") || "";
    if (pb) {
      setLocalItem("pb", "1");
    }
    // 设置商户分组信息
    let gr = (
      getSessionItem("gr") ||
      qsInfo.get("gr") ||
      "COMMON"
    ).toLocaleUpperCase();
    if (gr) {
      setLocalItem("gr", gr);
    }
  } catch (error) {
    console.error(error);
  }
}
