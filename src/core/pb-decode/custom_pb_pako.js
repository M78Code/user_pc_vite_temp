/*
 * @Author: PB数据解密
 * @Description: PB数据解密
 * 
 * PB加密数据
 * let data = "H4sIAAAAAAAAAIuuVkrOzytJrShRslJ6trX7xfqpPv4+L7bOfrKr29PlaeuapxO7lHSUMlOA0iaG\nFhYgdnFwRmmakpUBiBmSX6BkZaijlJdfkpmcGlJZkKpkZYzC90vMBYopveje+HJ2y4vGKc9nz4cY\nDzSqODUvJSQTLG9goW9opm9kBBQtySzJScXjnNpYADEwoTS2AAAA",
 * 解密方法
 * pako_pb.unzip_data(data)
 * 
 */

import pako from "pako"; //pako插件

/**
 * @description: base64编码PB数据转换
 * @param {String} b64Data  经过base64编码后的PB数据
 * @return {Array} 转换后的字节数组
*/
const to_Uint8Array = (b64Data) =>{
  let ret = null;
  // base64解码
  var strData = atob(b64Data);
  if (strData) {
    // Convert binary string to character-number array
    var charData = strData.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    if (charData) {
      // Turn number array into byte-array
      var binData = new Uint8Array(charData);
      ret = binData;
    }
  }
  return ret;
}


export const pako_pb = {
  /**
   * @description: base64编码转换
   * @param {String} data  base64编码PB数据
   * @return {Object} 转换后的Json对象数据
   */
  unzip_data(data) {
    let res = null;
    try {
      if (data) {
        let binData = to_Uint8Array(data);
        if (binData) {
          data = pako.inflate(binData);
          if (data) {
            res = new TextDecoder().decode(data);
            if (res) {
              res = JSON.parse(decodeURIComponent(res));
            }
          }
        }
      } else {
        res = data;
      }
    } catch (error) {
      console.log('unzip_data error!');
    }
    return res;
  }
};
 
