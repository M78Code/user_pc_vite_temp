/**
 * 赛事折叠相关
 */

import MatchListCardClass from './match-list-card-class'
import MatchListCardScroll from './match-list-card-scroll'

// TODO: set_standard_odd_status vuex 待处理
// set_collapse_map_match vuex topmenu 待处理
// match_is_empty 页面参数

class matchListFoldClass {
  gen_collapse_key(match) {
    return match.tid;
  }
  /**
   * 赛事折叠状态变化
   */
  unfold_changed_handle() {
    // 走虚拟滚，
    // 第一步：数据去重
    // 第二步：重新计算 容器整体高度 ，此 理论高度  在前或者在后调用 理论上都行
    // 第三步：重新计算 每个容器 的 top 定位 数值
    this.run_process_when_need_recompute_container_list_when_coolspace_tournament(true);
    MatchListCardScroll.set_list_scroll_top_by_target();
  }
  /** 场景 2： 联赛 折叠
   * 触发更新 赛事列表进程 的 场景
   *  参数说明：      need_pre_process : 需要执行前置进程
   */
  run_process_when_need_recompute_container_list_when_coolspace_tournament( need_pre_process = true, invoke_type ) {
    //  更新 赛事列表 进程 综合 控制方法
    MatchListCardClass.run_process_when_need_recompute_container_list(need_pre_process, { update_type: invoke_type, });
  }
}