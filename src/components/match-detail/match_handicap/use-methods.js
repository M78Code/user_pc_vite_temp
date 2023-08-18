import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  nextTick,
  toRefs,
  onBeforeMount,
  onUnmounted,
  getCurrentInstance
} from "vue";
import { api_details } from "src/api/index";
import store from "src/store-redux/index.js";
import details from "src/core/match-detail-pc/match-detail.js";
import utils from "src/core/utils/utils";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/";
import { useRoute, useRouter } from "vue-router";
import lodash from "lodash";

export const useMethods = ({ props,emit }) => {
  //  ============================数据===================
  const state = reactive({
    sportId: null,
    details_data: [], //拼接数据
    reset_toggle: 0,
    // 当前 loading 状态
    load_detail_statu: "loading",
    layout_statu: true, // 单双列样式
    waterfall: [], // 单双列数据
    // 是否开了滚球盘
    had_play_handicap: true,
    // 玩法展开状态
    panel_status: "default",
    has_thumb: false, //是否有滚动条
    handle_: [], // 用户操作过的数据
  });

  const route = useRoute();
  const showDetails = ref(false);

  //  ============================store===================
  const store_state = store.getState();
  // 获取页面宽高信息 --可以废弃，废弃改动较大
  const get_layout_list_size = ref(store_state.layoutReducer.layout_list_size);
  // 详情页玩法列表单双列 0单列， 1双列
  const get_layout_statu = ref(store_state.matchesReducer.layout_statu);
  // 获取用户uid
  const get_uid = store_state.userReducer.uuid;
  // 当前所选的玩法集子项id
  const get_tabs_active_id = ref(store_state.matchesReducer.tabs_active_index);
  // 获取当前页路由信息
  const vx_layout_cur_page = ref(store_state.layoutReducer.layout_cur_page);
  // 获取指定的玩法id
  const get_top_id = ref(store_state.matchesReducer.topId);
  // 获取指定的玩法id
  const get_right_zoom = ref(store_state.matchesReducer.zoom);
    //  ============================computed===================
    const current_list = computed(() => {
      let list = [];
      props.plays_list.forEach((element) => {
        list.push(element + "-" + props.currentRound);
      });
      return list;
    });
    const mmp = computed(() => {
      return props.match_info.mmp;
    });

  //  ============================watch===================

  watch(
    () => props.load_detail_statu,
    (val) => {
      // 盘口关闭时隐藏详情列表
      if (["all_empty", "new_empty", "refresh", "404"].includes(n)) {
        showDetails.value = false;
        document.querySelector(".wrap-handicap").style.height = "auto";
      } else {
        showDetails.value = true;
      }
      // 右侧详情加载进行优化
      let s = n == "loading" ? "right_details_loading" : n;
      // 发送当前 loading 状态
      this.$root.$emit("change_loading_status_details", s);
      if (this.pageType == "right_details") {
        this.$root.$emit("change_loading_status_right_details", s);
      }
    }
  );
  // 页面宽高变化
  watch(get_layout_list_size, (val) => {
    if (get_layout_statu.value) {
      state.waterfall = details.set_waterfall(state.details_data);
    } else {
      state.waterfall = [state.details_data];
    }
    int_is_show();
    set_go_top_show();
  });
  // 监听关闭全部玩法
  watch(
    () => props.close_all_handicap,
    (res) => {
      if (res) {
        if (props.load_type == "details") {
          emit("set_handicap_state", "empty");
        } else {
          state.load_detail_statu = "empty";
        }
      }
    },
    { immediate: true }
  );
  // 加载状态
  watch(
    () => props.handicap_state,
    (res) => {
      state.load_detail_statu = res;
    }
  );
  /**
   * @Description:监听玩法是否展开
   * @return {undefined} undefined
   */
  watch(
    () => state.panel_status,
    (res) => {
      switch (res) {
        case "open":
          set_is_show_all(true);
          break;
        case "hide":
          set_is_show_all(false);
          break;
      }
    }
  );
  watch(
    () => mmp.value,
    (cur) => {
      if (cur == "999") {
        if (props.load_type == "details") {
          emit("set_handicap_state", "empty");
        } else {
          state.load_detail_statu = "empty";
        }
      }
    }
  );
  // match_detail变化
  watch(
    () => props.match_details,
    (res) => {
      state.load_detail_statu = props.handicap_state;
      if (props.handicap_state != "data") {
        state.details_data = [];
        state.waterfall = [[]];
        return false;
      }
      change_detail(res);
    },
    { immediate: true, deep: true }
  );
  // watch(get_right_zoom, (val) => {
  //   this.wrap_tabs_width = this.$refs.warp.offsetWidth;
  // });

  //  ============================methods===================

  const change_detail = () => {
    const obj = {
      1: 2,
      2: 3,
      11: 4,
    };
    if (props.match_info.mhs) {
      let status = 1;
      status = obj[props.match_info.mhs];

      res.forEach((item) => {
        item.hl.forEach((list) => {
          list.ol.forEach((j) => {
            if (j._hs == 11) {
              j.os == 1 ? (j.os = status) : "";
            } else {
              j.os = status;
            }
          });
        });
      });
    } else {
      res.forEach((item) => {
        item.hl.forEach((list) => {
          if (list.hs) {
            let status = 1;
            status = obj[list.hs];
            list.ol.forEach((j) => {
              if (j._hs == 11) {
                j.os == 1 ? (j.os = status) : "";
              } else {
                j.os = status;
              }
            });
          }
        });
      });
    }
    // 详情和虚拟详情页计算单双列
    if (["details", "virtual_details"].includes(route.name)) {
      if (get_layout_statu.value) {
        state.waterfall = details.set_waterfall(state.details_data);
      } else {
        this.waterfall = [res];
      }
    } else {
      this.waterfall = [res];
    }
    state.details_data = res;
    set_go_top_show();
    int_is_show();
  };

  /**
   * @Description:初始化玩法是否展开
   * @return {undefined} undefined
   */
  const int_is_show = () => {
    // let show_title = "hide"
    state.waterfall.forEach((list) => {
      list.forEach((item) => {
        //是否有附加盘
        if (item.hmm == 1 && lodash.get(item, "hl.length") > 1) {
          item.has_plus = true;
        } else {
          item.has_plus = false;
        }
        item.is_show = state.panel_status == "hide" ? false : true;
        item.is_show_plus = state.panel_status == "hide" ? false : true;
      });
    });
  };
  /**
   * @Description:设置是否显示返回按钮
   * @return {Undefined} Undefined
   */
  const set_go_top_show = () => {
    nextTick(() => {
      let obj =
        document.querySelector(".details .v-scrollarea .scroll") ||
        document.querySelector(".virtual_details .v-scrollarea .scroll");
      if (obj) {
        state.has_thumb = obj.scrollHeight > obj.clientHeight;
      }
    });
  };

  /**
   * @Description:设置所有玩法集是否展开
   * @param {boolean} status 设置的状态
   * @return {undefined} undefined
   */
  const set_is_show_all = (status) => {
    state.waterfall.forEach((list) => {
      list.forEach((item) => {
        item.is_show = status;
        item.is_show_plus = status;
      });
    });
  };

  /**
   * @Description:设置玩法是否展开
   * @return {undefined} undefined
   */
  const set_panel_status = (isHandle = null) => {
    let status = false;
    state.waterfall &&
      state.waterfall.forEach((list) => {
        list.forEach((item) => {
          if (item.is_show) {
            status = true;
          }
          //是否有附加盘
          if (item.has_plus && item.is_show_plus) {
            status = true;
          }
        });
      });
    // 接收用户点击的玩法的状态
    if (isHandle) {
      userHandleStatus({
        id: isHandle.handle.topKey,
        hshow: isHandle.handle.hshow,
      });
    }
    //所有玩法都已收起
    if (!status) {
      state.panel_status = "hide";
    } else {
      state.panel_status = "default";
    }
    // 储存用户操作后的玩法状态，静态刷新后需要保持该状态
    window.sessionStorage.setItem(
      "handle_state",
      JSON.stringify(state.handle_)
    );
  };
  /**
   * 接收用户点击的玩法的状态保存或移除
   * 移除或存储用户点击的玩法
   * @param {Object} item 用户点击的玩法
   */
  const userHandleStatus = (handle) => {
    if (state.handle_) {
      // 如果缓存里已有该 id 就移除，否则就保存
      let flag = state.handle_.findIndex((i) => i.id == handle.id);
      if (flag != -1) {
        state.handle_.splice(flag, 1);
      } else {
        state.handle_.push({ id: handle.id, hshow: handle.hshow });
      }
    }
  };
  /**
   * 展开|收起投注列表
   * @return {undefined} undefined
   */
  const toggle_panel = () => {
    state.panel_status == "open" || state.panel_status == "default"
      ? (state.panel_status = "hide")
      : (state.panel_status = "open");
    set_go_top_show();
  };
  /**
   * 详情页玩法展示单双列切换
   * @return {undefined} undefined
   */
  const toggele_layout = (statu) => {
    if (statu == get_layout_statu.value) {
      return false;
    }
    //设置玩法列表单双列 0单列， 1双列
    store.dispatch({
      type: "SET_LAYOUT_STATU",
      data: statu,
    });
    state.layout_statu = statu ? true : false;
    if (statu) {
      state.waterfall = set_waterfall(state.details_data);
    } else {
      state.waterfall = [this.details_data];
    }
    // 判断是否显示【返回顶部】按钮
    set_go_top_show();
    // 设置玩法展开和折叠状态
    int_is_show();
  };

  /**
   * 设置渲染模板单个玩法的index，用于置顶
   * @return {undefined} undefined
   */
  const set_current_index = (handicap) => {
    handicap.forEach((item, index) => {
      item.index = index;
    });
    state.details_data = handicap;
  };
  /**
   * 玩法置顶排序
   * @return {undefined} undefined
   */
  const sort_index = (titleData) => {
    let type = titleData[0]; // true取消置顶, false置顶
    let index = titleData[1];
    let handicap = state.details_data;
    let params = {
      cuid: get_uid.value,
      playId: handicap[index].hpid,
      matchId: handicap[index].mid,
      topKey: handicap[index].topKey,
      status: type ? 1 : 0,
    };
    api_details.set_playTop(params).then((res) => {
      const code = lodash.get(res, "data.code");
      if (code == 200) {
        if (!params.status) {
          //置顶
          if (handicap[index].hton == "0") {
            handicap[index].hton = new Date().getTime() + "";
          }
          handicap.unshift(handicap.splice(index, 1)[0]);
        } else {
          //取消置顶
          handicap[index].hton = "0";
          let arr = []; //暂存置顶的数据
          for (var i = 0; i < handicap.length; i++) {
            if (handicap[i].hton != "0") {
              arr.unshift(handicap.splice(i, 1)[0]);
              i--;
            }
          }
          //根据hpon排序
          handicap.sort(function (a, b) {
            return a.hpon - b.hpon;
          });
          //插入置顶的数据
          for (var i in arr) {
            handicap.unshift(arr[i]);
          }
        }
        // 保存置顶玩法的 id
        store.dispatch({
          type: "SET_TOP_ID",
          data: {
            id: params.topKey,
            type: !params.status,
          },
        });
        set_current_index(handicap);
        // 计算单双列玩法
        state.waterfall = set_waterfall(handicap);
      }
    });
  };

  /**
   * 一栏/两栏布局按钮在页面宽度 < 1680 不显示
   * @return {undefined} undefined
   */
  const check_half = () => {
    if (
      (route.name == "details" &&
        get_layout_list_size.value.width >= 1680) ||
      (route.name == "virtual_details" && state.match_info.csid == "1001")
    ) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @Description:返回顶部
   * @return {Undefined} Undefined
   */
  const on_go_top = () => {
    emit("on_go_top");
  };

  /**
   * @Description 获取当前选中详情玩法集
   * @param {undefined} undefined
   */
  const get_active_details_play_tab = (callback) => {
    let item = props.category_list.filter(
      (item) => get_tabs_active_id.value == item.id
    )[0];
    callback(item);
  };

  /**
   * @Description 设置数据加载状态
   * @param {undefined} undefined
   */
  const set_load_state = (data) => {
    let statu;
    if (typeof data == "object") {
      if (data.mid == props.match_info.mid) {
        statu = data.status;
      }
    } else {
      statu = data;
    }
    if (!statu) {
      return;
    }

    if (state.load_type == "details") {
      emit("set_handicap_state", statu);
    } else {
      state.load_detail_statu = statu;
    }
  };

  /**
   * 接收用户点击的玩法的状态保存或移除
   * 移除或存储用户点击的玩法
   * @param {Object} item 用户点击的玩法
   */

  const is_component_show = (item) => {
    // 电竞赛事第几局
    if (utils.is_eports_csid(state.sportId) && !!props.currentRound) {
      return current_list.value.includes(String(item.chpid));
    } else {
      // 常规赛事或电竞非局数
      return props.plays_list.includes(item.hpid / 1);
    }
  };

  onBeforeMount(() => {
    let { csid: sportId } = route.params;
    state.sportId = sportId;
    // 设置玩法集 tab_hover 防抖
    // this.tabs_hover = this.debounce(this.tabs_hover, 100);
    state.reset_toggle = Math.random();
    // this.toggle_play = this.throttle(this.toggle_play, 500);
    // 监听数据加载状态
    useMittOn(MITT_TYPES.EMIT_SET_MATCH_DETAIL_LOAD_STATE, set_load_state);
    // 监听用户点击玩法   折叠或收起
    useMittOn(MITT_TYPES.EMIT_SET_PANEL_STATUS, set_panel_status);
    useMittOn(
      MITT_TYPES.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB,
      get_active_details_play_tab
    );
  });
const rang = ref([])
  onMounted(() => {
    emit("set_handicap_this", getCurrentInstance);
    rang.value = [
      3, 4, 19, 33, 46, 52, 58, 64, 69, 71, 113, 121, 128, 130, 143, 154, 155,
      163, 172, 176, 181, 185, 232, 243, 249, 253, 268, 269, 270, 278, 280, 294,
      306, 308, 324, 327, 334, 20003, 20004, 20015,
    ];
  });
  onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_SET_MATCH_DETAIL_LOAD_STATE, set_load_state).off;
    useMittOn(
      MITT_TYPES.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB,
      get_active_details_play_tab
    ).off;
    useMittOn(MITT_TYPES.EMIT_SET_PANEL_STATUS, set_panel_status).off;
    state.handle_ = null;
    // this.offsetTop = null;
    state.waterfall = null;
    state.details_data = null;
  });

  return {
    ...toRefs(state),
    showDetails,
    rang,
    get_layout_statu,
    is_component_show,
    sort_index,
    route,
    lodash,
    on_go_top
  };
};
