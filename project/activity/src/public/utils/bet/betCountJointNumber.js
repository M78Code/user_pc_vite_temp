/*
 * @Author: success
 * @Date: 2020-09-07 12:45:07
 * @Description: 押注串关操作类
 */
export default class BetCountJointNumber {
  /**
   * @description: 构造函数
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  constructor(view, url) {

  }

  /**
   * @description: 获取串关数量
   * @param {Number} count 串关数量
   * @return {Array} 串关组合列表
   */
  static getBetCountJoint(count) {
    let ret = { "code": "0000000", "data": [], "msg": "成功", "ts": 1590320370929 };
    switch (count) {
      case 2:
        ret = { "code": "0000000", "data": [{ "count": 1, "id": "2001", "name": "2串1" }], "msg": "成功", "ts": 1590320370929 };
        break;
      case 3:
        ret = {"code":"0000000","data":[{"count":1,"id":"3001","name":"3串1"},{"count":3,"id":"2001","name":"2串1"},{"count":4,"id":"3004","name":"3串4"}],"msg":"成功","ts":1590320373449};
        break;
      case 4:
        ret = {"code":"0000000","data":[{"count":1,"id":"4001","name":"4串1"},{"count":6,"id":"2001","name":"2串1"},{"count":4,"id":"3001","name":"3串1"},{"count":11,"id":"40011","name":"4串11"}],"msg":"成功","ts":1590320378820};
        break;
      case 5:
        ret = {"code":"0000000","data":[{"count":1,"id":"5001","name":"5串1"},{"count":10,"id":"2001","name":"2串1"},{"count":10,"id":"3001","name":"3串1"},{"count":5,"id":"4001","name":"4串1"},{"count":26,"id":"50026","name":"5串26"}],"msg":"成功","ts":1590320381130};
        break;
      case 6:
        ret = {"code":"0000000","data":[{"count":1,"id":"6001","name":"6串1"},{"count":15,"id":"2001","name":"2串1"},{"count":20,"id":"3001","name":"3串1"},{"count":15,"id":"4001","name":"4串1"},{"count":6,"id":"5001","name":"5串1"},{"count":57,"id":"60057","name":"6串57"}],"msg":"成功","ts":1590320383962};
        break;
      case 7:
        ret = {"code":"0000000","data":[{"count":1,"id":"7001","name":"7串1"},{"count":21,"id":"2001","name":"2串1"},{"count":35,"id":"3001","name":"3串1"},{"count":35,"id":"4001","name":"4串1"},{"count":21,"id":"5001","name":"5串1"},{"count":7,"id":"6001","name":"6串1"},{"count":120,"id":"700120","name":"7串120"}],"msg":"成功","ts":1590320385143};
        break;
      case 8:
        ret = {"code":"0000000","data":[{"count":1,"id":"8001","name":"8串1"},{"count":28,"id":"2001","name":"2串1"},{"count":56,"id":"3001","name":"3串1"},{"count":70,"id":"4001","name":"4串1"},{"count":56,"id":"5001","name":"5串1"},{"count":28,"id":"6001","name":"6串1"},{"count":8,"id":"7001","name":"7串1"},{"count":247,"id":"800247","name":"8串247"}],"msg":"成功","ts":1590320390670};
        break;
      case 9:
        ret = {"code":"0000000","data":[{"count":1,"id":"9001","name":"9串1"},{"count":36,"id":"2001","name":"2串1"},{"count":84,"id":"3001","name":"3串1"},{"count":126,"id":"4001","name":"4串1"},{"count":126,"id":"5001","name":"5串1"},{"count":84,"id":"6001","name":"6串1"},{"count":36,"id":"7001","name":"7串1"},{"count":9,"id":"8001","name":"8串1"},{"count":502,"id":"900502","name":"9串502"}],"msg":"成功","ts":1590320393208};
        break;
      case 10:
        ret = {"code":"0000000","data":[{"count":1,"id":"10001","name":"10串1"},{"count":45,"id":"2001","name":"2串1"},{"count":120,"id":"3001","name":"3串1"},{"count":210,"id":"4001","name":"4串1"},{"count":252,"id":"5001","name":"5串1"},{"count":210,"id":"6001","name":"6串1"},{"count":120,"id":"7001","name":"7串1"},{"count":45,"id":"8001","name":"8串1"},{"count":10,"id":"9001","name":"9串1"},{"count":1013,"id":"10001013","name":"10串1013"}],"msg":"成功","ts":1590320395678};
        break;

      default:
        break;
    }
    return ret.data;
  }
  /**
   * 电竞串关数量
   * @param {*} count 串关数量
   * @returns 串关组合列表
   */
  static getEsportsBetCountJoint(count) {
    let ret = { "code": "0000000", "data": [], "msg": "成功", "ts": 1590320370929 };
    switch (count) {
      case 2:
        ret = { "code": "0000000", "data": [{ "count": 1, "id": "2001", "name": "2串1" }], "msg": "成功", "ts": 1590320370929 };
        break;
      case 3:
        ret = {"code":"0000000","data":[{"count":1,"id":"3001","name":"3串1"},{"count":3,"id":"2001","name":"2串1"},{"count":4,"id":"3004","name":"3串4"}],"msg":"成功","ts":1590320373449};
        break;
      case 4:
        ret = {"code":"0000000","data":[{"count":1,"id":"4001","name":"4串1"},{"count":6,"id":"2001","name":"2串1"},{"count":4,"id":"3001","name":"3串1"},{"count":11,"id":"40011","name":"4串11"}],"msg":"成功","ts":1590320378820};
        break;
      case 5:
        ret = {"code":"0000000","data":[{"count":1,"id":"5001","name":"5串1"},{"count":10,"id":"2001","name":"2串1"},{"count":10,"id":"3001","name":"3串1"},{"count":5,"id":"4001","name":"4串1"},{"count":26,"id":"50026","name":"5串26"}],"msg":"成功","ts":1590320381130};
        break;
      case 6:
        ret = {"code":"0000000","data":[{"count":1,"id":"6001","name":"6串1"},{"count":15,"id":"2001","name":"2串1"},{"count":20,"id":"3001","name":"3串1"},{"count":15,"id":"4001","name":"4串1"},{"count":6,"id":"5001","name":"5串1"}],"msg":"成功","ts":1590320383962};
        break;
      case 7:
        ret = {"code":"0000000","data":[{"count":1,"id":"7001","name":"7串1"},{"count":21,"id":"2001","name":"2串1"},{"count":35,"id":"3001","name":"3串1"},{"count":35,"id":"4001","name":"4串1"},{"count":21,"id":"5001","name":"5串1"},{"count":7,"id":"6001","name":"6串1"}],"msg":"成功","ts":1590320385143};
        break;
      case 8:
        ret = {"code":"0000000","data":[{"count":1,"id":"8001","name":"8串1"},{"count":28,"id":"2001","name":"2串1"},{"count":56,"id":"3001","name":"3串1"},{"count":70,"id":"4001","name":"4串1"},{"count":56,"id":"5001","name":"5串1"},{"count":28,"id":"6001","name":"6串1"},{"count":8,"id":"7001","name":"7串1"}],"msg":"成功","ts":1590320390670};
        break;
      case 9:
        ret = {"code":"0000000","data":[{"count":1,"id":"9001","name":"9串1"},{"count":36,"id":"2001","name":"2串1"},{"count":84,"id":"3001","name":"3串1"},{"count":126,"id":"4001","name":"4串1"},{"count":126,"id":"5001","name":"5串1"},{"count":84,"id":"6001","name":"6串1"},{"count":36,"id":"7001","name":"7串1"},{"count":9,"id":"8001","name":"8串1"}],"msg":"成功","ts":1590320393208};
        break;
      case 10:
        ret = {"code":"0000000","data":[{"count":1,"id":"10001","name":"10串1"},{"count":45,"id":"2001","name":"2串1"},{"count":120,"id":"3001","name":"3串1"},{"count":210,"id":"4001","name":"4串1"},{"count":252,"id":"5001","name":"5串1"},{"count":210,"id":"6001","name":"6串1"},{"count":120,"id":"7001","name":"7串1"},{"count":45,"id":"8001","name":"8串1"},{"count":10,"id":"9001","name":"9串1"}],"msg":"成功","ts":1590320395678};
        break;

      default:
        break;
    }
    return ret.data;
  }

  /**
   * @description: 通过串关ID获取几串几信息
   * @param {Number} id 数字字符串ID
   * @return {Object} 几串几字符串
   */    
  static get_x_n_y(id){
    let n_obj = {
      "2001":{x:2,y:1},        // E2串1,
      "3001":{x:3,y:1},        // E3串1,
      "3004":{x:3,y:4},        // E3串4,
      "4001":{x:4,y:1},        // E4串1,
      "40011":{x:4,y:11},      // E4串11,
      "5001":{x:5,y:1},        // E5串1,
      "50026":{x:5,y:26},      // E5串26,
      "6001":{x:6,y:1},        // E6串1,
      "60057":{x:6,y:57},      // E6串57,
      "7001":{x:7,y:1},        // E7串1,
      "700120":{x:7,y:120},    // E7串120,
      "8001":{x:8,y:1},        // E8串1,
      "800247":{x:8,y:247},    // E8串247,
      "9001":{x:9,y:1},        // E9串1,
      "900502":{x:9,y:502},    // E9串502,
      "10001":{x:10,y:1},      // E10串1,
      "10001013":{x:10,y:1013},// E10串1013,
    }
    return n_obj[id];
  }
}
