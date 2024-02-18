/*
 * @Description: h5 亚洲版 列表数据和对象结合操作类-实现快速检索,修改等功能
 *
 *  使用实例demo
 *  import ListMap from "./listMap";
 *
 *  this.listMap = new ListMap('id.index');
 *  var list = []
 *  for (let i = 1; i < 20; i++) {
 *    list.push({name:i,id:{index:i}})
 *  }
 *  this.listMap.setList(list);
 *  this.listMap.obj[19].name='xxx'
 *  this.listMap.push({name:88,id:{index1:88}});
 *  this.listMap.unshift({name:88,id:{index1:88}});
 *  this.listMap.shift();
 *  this.listMap.pop();
 *  this.listMap.splice(2,2);
 *  this.listMap.removeKeyObj(18);
 *  this.listMap.removeKeyObj(list[1]);
 *  this.listMap.clearData();
 *  this.listMap.destroy();
 *
 */
export default class ListMap {
  /**
   * @description: 构造函数
   * @param {String} key 主数组列表子元素对象唯一标识key值属性字符串
   * @return {undefined} undefined
   */
  constructor(key,list) {
    // 设置对象唯一标识key值
    this.key = key ? key : 'id';
    // 初始化数据
    this.init();
    if(list){ 
      //因为导出的是一个class 而不是一个实例可以在初始化做东西
      this.setList(list)
    }
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init() {
    this.list = [];
    // 所有对象
    this.obj = {};
  }


  /**
   * @description: 设置list
   * @param {Array} list 需要设置的集合列表
   * @return {undefined} undefined
   */
  setList(list) {
    if (list && (list instanceof Array)) {
      let list_ = this.list;
      let obj_ = this.obj;
      this.obj = this.listToObj(list);
      this.list = list;
      this.clear(list_);
      this.clear(obj_);
    }
  }

  /**
   * @description: 向数组的末尾添加一个或更多元素，并返回新的长度
   * @param {Object} obj 增加的对象
   * @return {Boolean} 是否成功
   */
  push(obj) {
    let ret = false;
    let key = lodash.get(obj, this.key);
    if (obj && key) {
      this.list.push(obj);
      this.obj[key] = obj;
      ret = true;
    }
    return ret;
  }

  /**
   * @description: 向数组的开头添加一个或更多元素，并返回新的长度
   * @param {Object} obj 增加的对象
   * @return {Boolean} 是否成功
   */
  unshift(obj) {
    let ret = false;
    let key = lodash.get(obj, this.key);
    if (obj && key) {
      this.list.unshift(obj);
      this.obj[key] = obj;
      ret = true;
    }
    return ret;
  }

  /**
   * @description: 删除元素，并向数组添加新元素
   * @param {Number} i 索引位置
   * @param {Number} count 删除数量
   * @return {Boolean} 是否成功
   */
  splice(i, count) {
    let ret = false;
    if (this.list) {
      let del_ = this.list.splice(i, count);
      del_.forEach(item => {
        let key = lodash.get(item, this.key);
        delete this.obj[key];
      });
      ret = true;
    }
    return ret;
  }

  /**
   * @description: 删除并返回数组的第一个元素
   * @param {undefined} undefined
   * @return {Boolean} 是否成功
   */
  shift() {
    let ret = false;
    if (this.list && this.list.length && this.list[0]) {
      let del_ = this.list.shift();
      let key = lodash.get(del_, this.key);
      delete this.obj[key];
      ret = true;
    }
    return ret;
  }

  /**
   * @description: 删除并返回数组的最后一个元素
   * @param {undefined} undefined
   * @return {Boolean} 是否成功
   */
  pop() {
    let ret = false;
    if (this.list && this.list.length) {
      let del_ = this.list.pop();
      let key = lodash.get(del_, this.key);
      delete this.obj[key];
      ret = true;
    }
    return ret;
  }
  /**
   * @Description:通过key删除list中的元素和obj对象的数据
   * @Author success
   * @param: obj--可以是list中的元素,获list中的元素所对应的key值
   * @return: 是否成功
   * @Date 2020/04/04 15:41:03
   */
  /**
   * @description: 通过key删除list中的元素和obj对象的数据
   * @param {Object,String} obj 可以是list中的元素,获list中的元素所对应的key值
   * @return {Boolean} 是否成功
   */
  removeKeyObj(obj) {
    let ret = false;
    if (obj) {
      if ((typeof obj) == 'object') {
        let key_ = lodash.get(obj, this.key);
        if (key_) {
          for (let i = 0; i < this.list.length; i++) {
            let key = lodash.get(this.list, `[${i}].${this.key}`);
            if (key && key == key_) {
              this.splice(i, 1);
              break;
            }
          }
          delete this.obj[key_];
          ret = true;
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          let key = lodash.get(this.list, `[${i}].${this.key}`);
          if (key && key == obj) {
            this.splice(i, 1);
            break;
          }
        }
        delete this.obj[obj];
        ret = true;
      }
    }
    return ret;
  }

  /**
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Array} list 列表数据
   * @return {Array} 转换后新对象
   */
  listToObj(list) {
    let obj_ = {};
    if (list && (list instanceof Array)) {
      let key = '';
      list.forEach(item => {
        key = lodash.get(item, this.key);
        if (item && key) {
          obj_[key] = item;
        }
      });
    }
    return obj_;
  }

  /**
     * @description: 清空对象或数组
     * @param {Object,Array} any 需要清空的对象,数组
     * @return {undefined} undefined
   */
  clear(any) {
    if (any && (typeof any) == 'object') {
      if (any instanceof Array) {
        any.splice(0, any.length);
      } else {
        for (const key in any) {
          delete any[key]
        }
      }
    }
  }


  /**
   * @description: 清空所有数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  clearData() {
    this.clear(this.obj);
    this.clear(this.list);
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy() {
    this.clear(this.obj);
    this.clear(this.list);
    this.obj = null;
    this.list = null;
  }
}
