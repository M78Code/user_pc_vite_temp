import { ref } from 'vue'
import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
// import { onBeforeRouterLeave } from 'vue-router'

export default use_router_scroll = () => {
  const store_state = store.getState()
  // 滚动条的y轴坐标
  prev_remember_scrolly = ref(0)
  // 菜单滚动条的x轴坐标
  menuScrollX = ref(0)
  //延迟到赛事列表有数再去滚动 , 否者就会失效
  set_scroll_top_timer = ref(0)
  //列表容器dom ref
  list_container_dom = ref(null)

  // TODO: 待处理 this.$refs.match_list_container
  onMounted(() => {
    list_container_dom.value = this.$refs.match_list_container
  })

  //离开当前路由时 记录离开时的位置
  // onBeforeRouterLeave((to, from, next) => {
  //   //容器滚动位置
  //   if(store_state.get_list_scroll_top){
  //     //保存滚动条元素div 的scrollTop值
  //     const scroll_top = store_state.get_list_scroll_top.split('-')[0];
  //     prev_remember_scrolly.value = scroll_top;
  //   }
  //   next()
  // })

  /**
    * @description: 获取滚动条位置
    * @return {number} 滚动条y轴值
    */
  const getScrollTop = () => {
    return window.scrollY;
  }
  /**
   * @description: 设置滚动条位置
   * @param {number} top 滚动条y值
   */
  const setScrollTop = () => {
    if (!isNaN(prev_remember_scrolly.value)) {
      scroll_list_wrapper_by(prev_remember_scrolly.value);
    }
  }
  /**
   * 容器dom滚动到指定的位置
   */
  const scroll_list_wrapper_by = (y) => {
    if (list_container_dom.value) {
      list_container_dom.value.scrollTo(0, y);
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