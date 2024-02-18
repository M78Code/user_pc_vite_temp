import { ref } from 'vue'
import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
// import { onBeforeRouterLeave } from 'vue-router'

class RouterScroll {
  constructor() {
    // 滚动条的y轴坐标
    this.prev_remember_scrolly = 0
    // 菜单滚动条的x轴坐标
    this.menuScrollX = 0
    //延迟到赛事列表有数再去滚动 , 否者就会失效
    this.set_scroll_top_timer = 0
    //列表容器dom ref
    this.list_container_dom = null
  }
  set_dom (dom) {
    this.list_container_dom = dom
  }

  /**
   * @description: 设置滚动条位置
   * @param {number} top 滚动条y值
   */
  setScrollTop () {
    if (!isNaN(this.prev_remember_scrolly)) {
      scroll_list_wrapper_by(this.prev_remember_scrolly);
    }
  }

  /**
  * @description: 获取滚动条位置
  * @return {number} 滚动条y轴值
  */
  get_scroll_top () {
    return 0
  }

  /**
   * 容器dom滚动到指定的位置
   */
  scroll_list_wrapper_by () {
    if (this.list_container_dom) {
      this.list_container_dom.value.scrollTo(0, y);
      if (!y || y == '0' || y < 0) {
        store.dispatch({ type: 'matchReducer/set_list_scroll_top', payload: '' })
      }
      // 上次滚动记录值存在 则触发滚动计算
      else {
        useMittEmit(MITT_TYPES.EMIT_SET_SCROLL_TOP, y)
      }
    }
  }
}

export default new RouterScroll()