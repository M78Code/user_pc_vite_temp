/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws消息发送管理
 */
export default class WsSendManger {
  // 链接异常次数
  static err_count = 0;
  /**
   * @Description:构造函数
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:02:53
   */
  constructor(view, cmd) {
    // 创建消息队列
    this.view = view;
    // 命令码
    this.cmd = cmd;
    // obj缓存对象
    this.obj = {};
    // 代表哪个页面的标识
    this.module = ''
    // 组装处理函数
    this.call_back = null;
    // 初始化方法
    this.init();
  }

  /**
   * @description: 初始化方法
   */
  init() {
    switch (this.cmd) {
      case 'C8':
        // 重新组装处理函数
        this.call_back = this.get_all_obj_c8;
        break;
      case 'clear':
        this.call_back = this.get_skt_clear;
        break;
      default:
        break;
    }
  }


  /**
   * @description: 增加obj缓存对象数据
   *     猜你喜欢是单独另外订阅的，不用管
         首页轮播页，只有轮播赛事需要订阅，先清空缓存，再订阅 home_1
         首页视频直播页，只有直播赛事需要订阅，先清空缓存，再订阅 home_2
         首页热门页，只需要订阅 list
         列表页（包含关注），只需订阅 list
         详情页，需要订阅 match_info , 如果全部盘口关盘有推荐赛事的话，还需要订阅 list
   * @param {Sting}  key 模块名称(all:重新发送, clear:清除缓存, 其他:增加缓存)
   * @param {Object}  data 数据
   * @return {Object} 组装后的数据
   */
  push_obj(key, data) {
    if (key == 'home_1' || key == 'home_2' || key == 'data_schedule') {
      this.obj = {};
    }
    if (key == 'data_schedule') {
      this.module = 'data_schedule1'
    } else {
      this.module = ''
    }
    if (key == 'all') {
      // 重新发送所有缓存信息.不进行任何操作
    } else if (key == 'match_info') {
      if (this.obj.list) {
        delete this.obj.list;
      }
      // 增加缓存信息
      this.obj[key] = data;
    }
    else if (key == 'clear') {
      // 清空缓存
      this.obj = {};
    } else {
      // 增加缓存信息
      this.obj[key] = data;
    }
    // console.error(this.obj);
    return this.call_back ? this.call_back() : null;
  }
  /**
   * @description: 清除订阅的key
   * @param {String} key
   */
  del_obj_key(key) {
    delete this.obj[key];
  }
  get_skt_clear() {
    if (this.obj.list) {
      this.obj.list = {};
    }
  }
  /**
   * @description: 获取组装后的数据信息进行ws发送(C8的方法)
   * @return {Object} 组装后的数据
   */
  get_all_obj_c8() {
    let ret = null;
    // console.error(this.obj, JSON.stringify(this.obj)!=='{}');
    if (JSON.stringify(this.obj) !== '{}') {
      let mid = [], hpid = [];
      let mid_obj_ = null;
      for (const key in this.obj) {
        mid_obj_ = this.obj[key].mid;
        for (const key_ in mid_obj_) {
          if (key_ && mid_obj_[key_]) {
            mid.push(key_);
            if (mid_obj_[key_].hpids && Array.isArray(mid_obj_[key_].hpids)) {
              hpid = hpid.concat(mid_obj_[key_].hpids);
            }
          }
        }
      }
      mid = _.uniq(mid);
      hpid = _.uniq(hpid);
      // 重新组装赛事id
      mid = mid.join(',');
      // 重新组装玩法id
      if (hpid.includes('*')) {
        hpid = '*';
      } else {
        hpid = hpid.join(',');
      }
      let mkLevel = _.get(window, 'vue.$store.getters.get_user.marketLevel');
      ret = {
        cmd: this.cmd,
        mid,
        hpid,
        marketLevel: mkLevel ? mkLevel : 0,  //行情等级有值的时候传值其他时候传0
        cufm: "m"
      };
      // 如果 this.obj 对象中含有 'data_schedule'字段， 代表的是 世界杯赛程的页面
      if (this.module == 'data_schedule1') {
        // console.error(this.obj.hasOwnProperty("data_schedule"));
        // 修改参数
        ret.hpid = 1
        ret.cufm = 'L'
      }
      // 详情页只有一个赛事，订阅所有玩法
      try {
        let _mid = _.get(window, 'vue.$store.getters.get_goto_detail_matchid');
        let _page = _.get(this.view, '$route.name')
        if (_page == 'category' && _mid) {
          ret.mid = _mid
          ret.hpid = "*"
        }
      } catch (err) {
        console.err(err);
      }
    } else {
      ret = { cmd: this.cmd };
    }
    if (!ret.mid) return null;
    ret.hpid = ret.hpid || '*'; // hpid 不能是 "","*" 代表订阅所有玩法
    return ret;
  }
  /**
   * @description: 将1,2,3...的格式字符串组装成{1:1,2:1,3:1...}类似的对象
   * @param {String} obj_str 发送的赛事或者玩法id 格式如1,2,3...
   * @return {type} 
   */
  // get_str_to_obj(obj_str) {
  //   let data = {}, obj_arr = obj_str.split(',');
  //   if(obj_arr && obj_arr.length>1) {
  //     for(let i=0;i<obj_arr.length;i++) {
  //       if(obj_arr[i]) {
  //         data[obj_arr[i]] = 1;
  //       }
  //     }
  //   }
  //   return data;
  // }

  /**
   * @description: 销毁函数
   */
  destroy() {
    this.obj = null;
    this.module = null;
    this.view = null;
    this.call_back = null;
  }
}

