import { uid as quid } from "quasar";

/**
 * 获取 uid 生成一个不重复的字符串 区分大小写
 * @returns string
 */

export const  uid=(num = 18)=> {
  let StrAry =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const len = StrAry.length;
  let uuid = quid();
  for (let index = 0; index < num; index++) {
    uuid += StrAry[Math.floor(Math.random() * len)];
  }
  return uuid;
}





  uid;
export { quid };
