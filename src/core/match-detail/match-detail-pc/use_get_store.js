import { reactive, toRefs, onUnmounted } from "vue";
import store from "src/store-redux/index.js";

export const useGetStore = () => {
  const store_state = store.getState();
  const { menuReducer, betInfoReducer, globalReducer } = store_state;

  const state = reactive({
    vx_cur_menu_type: menuReducer.cur_menu_type, // 当前菜单类型
    vx_is_bet_single: betInfoReducer.is_bet_single, // true: 单关投注 false: 串关投注
    vx_get_is_virtual_bet: betInfoReducer.is_virtual_bet,
    vx_get_virtual_bet_list: betInfoReducer.virtual_bet_list, // 虚拟投注列表
    vx_get_bet_single_list: betInfoReducer.bet_single_list, // 单关投注列表
    vx_get_bet_list: betInfoReducer.bet_list, // 串关投注列表
    vx_get_bet_category: betInfoReducer.bet_category,
    vx_get_bet_mode: betInfoReducer.bet_mode, //  投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    vx_get_bet_item_lock: betInfoReducer.bet_item_lock, // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
  });

  // 监听状态变化
  let un_subscribe = store.subscribe(() => {
    const { menuReducer, betInfoReducer, globalReducer } = store.getState();
    state.vx_cur_menu_type = menuReducer.cur_menu_type;
    state.vx_get_is_virtual_bet = betInfoReducer.is_virtual_bet;
    state.vx_get_virtual_bet_list = betInfoReducer.virtual_bet_list;
    state.vx_is_bet_single = betInfoReducer.is_bet_single;
    state.vx_get_bet_single_list = betInfoReducer.bet_single_list;
    state.vx_get_bet_list = betInfoReducer.bet_list;
    state.vx_get_bet_category = betInfoReducer.bet_category;
  });

  onUnmounted(() => {
    un_subscribe();
  });

  return {
    ...toRefs(state),
  };
};
