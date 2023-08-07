import { ls } from "../utils/web-storage";

/**
 * 获取设备的IMEI
 * 有些时候可能需要一个设备ID H5没有 就从UA按特定规则抓一个
 * @returns imei
 */
export function GetDeviceIMEI() {
  let _IMEI = ls.get("IMEI");
  if (!_IMEI) {
    _IMEI = UUID(); //UA里按特定规则抓 暂时用ＵＵＩＤ
    ls.set("IMEI", _IMEI);
  }
  return _IMEI;
}

/**
 * 获取 uuid 生成一个不重复的字符串 区分大小写
 * @returns string
 */
const StrAry =
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export function UUID(num = 18) {
  const len = StrAry.length;
  let uuid = "";
  for (let index = 0; index < num; index++) {
    uuid += StrAry[Math.floor(Math.random() * len)];
  }
  return uuid;
}
