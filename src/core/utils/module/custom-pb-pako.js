/*
 * @Author: success
 * @Description: PB数据解密
 * 
 * PB加密数据
 * let data = "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",
 * 解密方法
 * pako_pb.unzip_data(data)
 * 
 */

import pako from "pako";
const pako_pb = {
  /**
   * @description: base64编码转换
   * @param {String} data  base64编码PB数据
   * @return {Object} 转换后的Json对象数据
   */
  unzip_data(data) {
    let res = null;
    try {
      if (data) {
        let binData = this.to_Uint8Array(data);
        if (binData) {
          data = pako.inflate(binData);
          //  var string = new TextDecoder("utf-8").decode(data)
          //  new TextDecoder().decode(uint8array);
          // let res= String.fromCharCode.apply(null, new Uint16Array(data));
          if (data) {
            res = new TextDecoder().decode(data);
            if (res) {
              // let res= String.fromCharCode.apply(null, new Uint16Array(binData));
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
  },
  /**
   * @description: base64编码PB数据转换
   * @param {String} b64Data  base64编码PB数据
   * @return {Array} 转换后的字节数组
   */
  to_Uint8Array(b64Data) {
    let ret = null;
    // Decode base64 (convert ascii to binary)
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
};
export default pako_pb;
