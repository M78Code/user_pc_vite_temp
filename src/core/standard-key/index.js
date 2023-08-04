/**
 * @Author: jiffy
 * @Date: 2023-07-30 13:52:55
 * @Description: 标准建
 */
 
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
  KEY_ARR:[],
  get(key) {
    console.log('key--',key)
    if(!this.KEY_ARR.includes(key)){
      this.KEY_ARR.push(key)
    }
    return  (namespace+  key ).toUpperCase()
  },
};
console.log("STANDARD_KEY---------", STANDARD_KEY);
// 用法：
// import STANDARD_KEY from  "app/standard-key.js"
// STANDARD_KEY.get("domain_api_key") 
export default STANDARD_KEY;
