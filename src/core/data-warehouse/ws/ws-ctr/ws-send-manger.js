
/*
 * @Author: hanmar
 * @Description: ws消息发送管理
 */
import lodash from "lodash";
export default class WsSendManger {
  // 链接异常次数
  static err_count = 0;
  /**
   * @Description:构造函数
   * @param: cmd 命令码
   * @return:
   */
  constructor(cmd) {
    // 命令码
    this.cmd = cmd;
    // obj缓存对象
    this.obj = {};
    // 组装处理函数
    this.call_back  = null;
    // 代表哪个页面的标识
    this.module= ''
    // 初始化方法
    this.init();
  }

  /**
   * @description: 初始化方法
   */
  init(){
    switch (this.cmd) {
      case 'C8':
         // 重新组装处理函数
        this.call_back = this.get_all_obj_c8;
        break;
      default:
        break;
    }
  }


  /**
   * @description: 增加obj缓存对象数据
   * @param {Sting}  key 模块名称(all:重新发送, clear:清除缓存, 其他:增加缓存)
   * @param {Object}  data 数据
   * @return {Object} 组装后的数据
   */
  push_obj(key, data) {
    if(key == 'data_schedule'){
      this.obj = {};
    }
    if(key == 'data_schedule'){
      this.module = 'data_schedule1'
    }else{
      this.module = ''
    }
    if(key == 'all')
    {
      // 重新发送所有缓存信息.不进行任何操作
    }else if (key == 'clear') {
      // 清空缓存
      this.obj = {};
    } else {
      // 增加缓存信息
      this.obj[key] = data;
    }
    return this.call_back?this.call_back(key):null;
  }
  /**
   * @description: 清除订阅的key
   * @param {String} key
   */
  del_obj_key(key) {
    delete this.obj[key];
  }
  /**
   * @description: 获取组装后的数据信息进行ws发送(C8的方法)
   * @return {Object} 组装后的数据
   */
  get_all_obj_c8(key_module){
    let ret = null;
    if(!lodash.isEmpty(this.obj)) {
      // 克隆数据
      let ret_obj = lodash.cloneDeep(this.obj[key_module]);
      // 组装数据
      let { cmd, list, cufm, marketLevel } =  ret_obj || {};
      ret = { cmd, list, cufm, marketLevel};
    } else {
      // 组装数据
      ret = { cmd: this.cmd };
    }
    return ret;
  }
  /**
   * @description: 将1,2,3...的格式字符串组装成{1:1,2:1,3:1...}类似的对象
   * @param {String} obj_str 发送的赛事或者玩法id 格式如1,2,3...
   * @return {type}
   */
  get_str_to_obj(obj_str) {
    let data = {}, obj_arr = obj_str.split(',');
    let len = obj_arr.length;
    // 字符串转对象
    if(obj_arr && len > 1) {
      for(let i = 0; i < len; i++) {
        if(obj_arr[i]) {
          data[obj_arr[i]] = 1;
        }
      }
    }
    return data;
  }

  /**
   * @description: 销毁函数
   */
  destroy(){
    this.obj = null;
    this.module = null;
    this.call_back  = null;
  }
}

