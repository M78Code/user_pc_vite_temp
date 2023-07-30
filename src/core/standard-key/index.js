/**
 * @Author: jiffy
 * @Date: 2023-07-30 13:52:55
 * @Description: 标准建
 */
import { constantCase } from "change-case";
const namespace = "TY_SDK";

let KEY_ARR = [
  // domain API 存储
  "domain_api_key",
  //最优API
  "best_api",
  // gr 用户分组
  "gr",
  //token
  "token",
  "pb",
];

let STANDARD_KEY = {
  get() {},
};

KEY_ARR.map((x) => {
  let key = `${namespace}_${constantCase(x)}`;

  STANDARD_KEY[x] = key;
});

console.log("STANDARD_KEY---------", STANDARD_KEY);

// import STANDARD_KEY from  "app/standard-key.js"
export default STANDARD_KEY;
