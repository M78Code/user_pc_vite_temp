/**
 * 赛事滚动相关
 */
import store from "src/store-redux/index.js";
import MatchListCardClass from './match-list-card-class'

// TODO: set_list_scroll_top vuex

const state = store.getState()

class MatchListCardScroll {
  //滚动位置
  scrolling_wrapper_top = -1
  // 延时器
  requesting_timeout = 0
  set_scroll_top_timer1 = null
  //防止滚动触发红升绿降时钟
  screen_changing_timer = 0
  constructor() {

  }
  // 详情返回时计算滚动距离
  calac_scrolltop() {
    for (
      let i = 0, list_lenght = this.match_height_map_list.length;
      i < list_lenght;
      i++
    ) {
      if (this.get_goto_detail_matchid == this.match_height_map_list[i].mid) {
        //容器总高度
        let back_scroll_top = this.match_height_map_list
          .slice(0, i)
          .reduce((total, map_obj) => {
            let p_total = 0;
            if (typeof total == "number") {
              p_total = total;
            }
            return p_total + MatchListCardClass.get_match_dom_height_by_matchdata(map_obj);
          }, 0);
        this.prev_remember_scrolly =
          back_scroll_top * (window.innerWidth / 3.75) - 50;
        break;
      }
    }
  }
  /**
  * 设置赛事列表容器滚动数据
  */
  set_list_scroll_top_by_target(scroll_obj) {
    //获取滚动对象
    let target = this.$refs.match_list_container;
    if (target) {
      let r_str = "";
      let scroll_y = (this.list_scroll_top = target.scrollTop); // 距离顶部距离 （滑动的距离）
      let client_height = target.clientHeight; // 内容距离   content area + padding
      let scroll_height = target.scrollHeight; // 内容展开时的高度（容器的总高度）
      let aftered = "";
      if (scroll_obj && scroll_obj.update_type == "standard_simple_change") {
        aftered = "" + Math.random();
      }

      r_str = `${scroll_y}-${client_height}${aftered}-${scroll_height}${aftered}`;
      this.set_list_scroll_top(r_str);
    }
  }
  /**
   * 赛事列表滚动事件
   */
  match_list_scroll_handle(e) {
    let scroll_top = e.scrollTop ? +e.scrollTop : window.scrollY;
    this.window_scrolly = scroll_top;
    if (e.cb) {
      e.cb(); // 回调，并将子对象的this传入
    }
    this.run_process_when_need_recompute_container_list_when_scroll(null, e);
  }
  // 容器滚动事件
  wrapper_scroll_handler() {
    // 详情返回后，goto_detail_matchid还未及时清除时，则不响应用户滚动
    if (this.get_goto_detail_matchid) {
      this.scroll_touch_count = 0;
    }
    // bug33167兼容iPhone滚动兜底处理
    else if (
      this.get_allow_short_scroll &&
      typeof this.scroll_touch_count !== "undefined"
    ) {
      this.scroll_touch_count++;
      if (this.scroll_touch_count <= 2) {
        clearTimeout(this.match_scroll_timer);
        this.match_scroll_timer = setTimeout(() => {
          this.$refs.match_list_container.scrollTop += 1;
        }, 30);
      } else if (this.scroll_touch_count > 10) {
        this.scroll_touch_count = undefined;
      }
    }
    // 只要滑动触发，就显示骨架屏
    // clearTimeout(this.hide_screen_timer)
    // this.set_hide_skeleton_screen(false)
    // this.hide_screen_timer = setTimeout(()=>{
    //   this.set_hide_skeleton_screen(true)
    // } 1000)
    // 设置赛事列表容器滚动数据,触发 赛事列表进程 的 场景
    this.set_list_scroll_top_by_target();
  }
  /**
 * 获取容器滚动距离
 */
  get_scroll_wrapper_top(params) {
    let scroll_top = window.scrollY;
    if (params) {
      if (params.scroll_top) {
        scroll_top = params.scroll_top;
      }
      if (params.position) {
        scroll_top = params.position;
      }
    }
    // 容器滚动距离
    let scroll_splited = state.matchReducer.list_scroll_top.split("-");
    if (scroll_splited[0]) {
      scroll_top = +scroll_splited[0];
    }
    return scroll_top;
  }
  /**
 * 场景 4： 列表 滚动
 * 触发更新 赛事列表进程 的 场景
 * 重点： 理论上来讲 滚动的时候 不需要走 前置进程  直接调用主进程
 * @param {Boolean} need_pre_process
 */
  run_process_when_need_recompute_container_list_when_scroll(need_pre_process = false, params) {
    //#start region 当窗口滚过一屏后才更新数据         get_list_scroll_top
    let scroll_top = this.get_scroll_wrapper_top(params);
    let delta = Math.abs(scroll_top - this.scrolling_wrapper_top);
    let limit = this.sliding_can_trigger_process_distance;
    if (this.menu_type == 28) {
      limit = 400;
    }
    // 阻止用户滚动时频繁切换赛事,scroll_top为0时,需要更新dom高度对象
    if (
      delta < limit &&
      scroll_top != 0 &&
      params &&
      !params.force &&
      params.update_type != "standard_simple_change"
    ) {
      return;
    }
    this.scrolling_wrapper_top = scroll_top;
    //#end region

    //  更新 赛事列表 进程 综合 控制方法
    MatchListCardClass.run_process_when_need_recompute_container_list(need_pre_process, params);
  }
}

export default new MatchListCardScroll()