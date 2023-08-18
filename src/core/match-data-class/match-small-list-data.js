/**
 * 1. 详情 页面内 的 热门/精选赛事列表
 * 2. 近期关注
 * 3. 主列表内的 接口数据异常 ，显示本地存储的 热门/精选赛事的 列表 ，
 * 4. 虚拟体育足蓝  和这个 类似 但是不一样
 * 特点是： 小列表
 *
 */

class MatchSmallListDataClass {
  constructor() {}
  /**
   * @Description 初始化
   * @param {undefined} undefined
   */
  init() {
    // 所有赛事对象 用来存放页面上的赛事数据
    this.mid_obj = {
      // 'mid_123':{}
    };
    // 所有盘口对象
    this.hl_obj = {
      // 'hid_123':{}
    };
    // 所有投注项对象
    this.ol_obj = {
      // 'oid_123':{}
    };
    // 所有赛事的坑位对象
    this.hn_obj = {
      // 'mid_hpid_ot':{}
    };
    // 赛事列表
    this.match_list = [];
    // 联赛列表对象
    this.league_list_obj = {};
    // 足球其他玩法（角球、罚牌等）  当前选中的玩法
    this.other_play_current_play = {
      // 'mid_123':'hpsCorner'
    };
  }
}
