<template>
  <div>
    <div class="virtual-main router_scroll_layout" ref="scrollArea" @scroll="wrapper_scroll_handler">
      <!-- 头部 -->
      <div class="virtual-head">
        <div class="type-bg" :class="'bg'+lodash.get(sub_menu_list,`[${sub_menu_i}].field1`)">
          <!-- 返回按钮 及 刷新 注单  设置 按钮 -->
          <div class="back-wrap">
            <div class="detail-back" @click="$common.go_where({back_to: 'go_back_from_virtual'})"></div>
            <!-- 虚拟体育 -->
            <div class="col">{{t('common.virtual_sports')}} {{lodash.get(sub_menu_list,`[${sub_menu_i}].name`)}}</div>
            <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
            <!-- <div class="no-single" @click="useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true)"></div> -->
            <div class="no-single" @click="useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);"></div>
            <!-- <set-menu /> -->
          </div>
          <!-- 虚拟体育菜单 -->
          <div class="virtual-menu-list" ref='virtual_menu_list_dom' v-if="virtual_menu_list.length">
            <div class="tabs-bar">
              <div class="tabs-bar-nav" ref="scroll_main">
                <div class="tabs-tab"
                     ref="scroll_box"
                     v-for="(tab, i) in sub_menu_list" :key="i"
                     :class="[sub_menu_i == i ? 'tabs-active' : '']"
                     @click="virtual_menu_changed(i)"
                >
                  <!-- <div class="icon" :class="['icon'+tab.field1, get_theme.includes('y0')?'icon_y0':'']">
                    <img v-if="false" class="menu-new-icon" src="image/bw3/svg/virtual-sports/new.svg" />
                  </div> -->
                  <span>{{ tab.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--虚拟体育-->
      <virtualSports
          :params="virtual_sports_params"
          :current_sub_menu="current_sub_menu"
          :is_user_refresh='refreshing'
          :menu_list="current_sub_menu.subList ? current_sub_menu.subList : []"
          :v_match_router_ente="v_match_router_ente"
          :v_menu_changed="v_menu_changed">
      </virtualSports>

    </div>

    <!-- 回到顶部按钮组件 -->
    <!-- <scroll-top
        v-show="!right_menu_show && list_scroll_top > 0"
        ref="scroll_top"
        :list_scroll_top="list_scroll_top"
        @back-top="back_top"
    /> -->

    <!-- 简版 底部菜单 -->
    <virtual-footer-menu v-show="!right_menu_show" />

  </div>
</template>

<script>
/*
1.组件引入更改
2.vuex更改
3.data变量和methods更改格式
4.mixins更改
*/

// 引入国际化
import { t } from "src/boot/i18n.js";;
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs } from "vue";

// #TODO vuex更改
// import { mapGetters, mapMutations } from "vuex";

// #TODO 路径需修改
import virtualSports from "project_path/src/pages/virtual/virtual-sports-part/virtual-sports.vue";    // 虚拟体育
// import setMenu from "src/project/components/common/set_menu.vue"    // 设置菜单
import { api_virtual } from "src/api/index";
// 公共方法
import {utils } from 'src/core/index.js';
// import { axios_api_loop } from "src/core/http"
import axios_api_loop from "src/core/http/axios-loop.js"
// import scroll_top from "src/project/components/record_scroll/scroll_top";
import virtualFooterMenu from 'project_path/src/pages/virtual/virtual-sports-part/virtual-footer-menu.vue'
import base_data from "src/core/menu-h5/menu-data-class.js";

import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
export default defineComponent({
  name: "virtual",
  components: {
    virtualSports,
    // setMenu,
    // "scroll-top": scroll_top,
    virtualFooterMenu,
  },
  /**
   * @description: 触发路由进入之前事件 详情页返回记住上次选中的体育类型
   * @param {Object} to 到达路由对象
   * @param {Object} from 来自路由对象
   * @param {Function} next 路由到达本组件后的回调函数
   * @return {Undefined} Undefined
   */
  beforeRouteEnter(to, from, next) {
    next(_this => {
      // _this.set_current_esport_csid('');
      _this.v_match_router_ente = Math.random();
      if(from.name == "virtual_sports_details"){
        if(_this.get_virtual_current_sub_menuid){
          _this.sub_menu_id_f_detail = _this.get_virtual_current_sub_menuid;
        }
      }
    });
  },
  setup() {
    ;
    // 路由
    const component_data = reactive({
      // dom
      virtual_menu_list_dom: null,
      // 事件集合
      emitters: [],
      ws_invoke_key:'virtual-sports',
      // 当前选中的虚拟体育菜单(虚拟足球 赛马 赛狗 等)
      current_sub_menu: {},
      //虚拟体育赛事列表接口请求参数
      virtual_sports_params:{
        csid:'',
      },
      //虚拟体育菜单选中项下标
      sub_menu_i:0,
      //虚拟体育菜单
      sub_menu_list:[],
      //详情页返回的菜单id
      sub_menu_id_f_detail:'',
      // 默认不刷新
      refreshing:false,
      // 虚拟体育菜单切换标志
      v_menu_changed:0,
      //进入虚拟体育赛事列表标志
      v_match_router_ente:0,
      // 赛事列表滑动高度
      list_scroll_top: 0,
      virtual_menu_list: [], // 虚拟赛事的数据
    })

    onMounted(() => {
      // 原 created
      //虚拟体育刷新赛事
      let timer_super27 = null;
      let timer_super28 = null;
      //获取虚拟体育菜单数据
      get_virtual_menus();
      //首页跳转虚拟体育设置menu_type为900
      // set_menu_type(900);
      // clearTimeout(timer_super28)
      // timer_super28 = setTimeout(()=>{
      //   set_menu_type(900);
      // }, 500)
      // cancel_ref = debounce(cancel_ref,200)

      // 原mounted
      // console.error(get_home_data,"get_home_data====")
      // 浏览器窗口变化事件监听
      component_data.emitters = [
        // useMittOn.on(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on).off,
        // useMittOn.on(MITT_TYPES.EMIT_COUNTING_DOWN_START_ENDED, counting_down_start_ended_on).off,
      ]
      // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
      // 不让浏览器记住上次的滚动位置
      if ('scrollRestoration' in History){
        history.scrollRestoration = 'manual'
      }
      //虚拟体育页更改语言
      // if (!location.search.includes('keep_url')) {
      //   history.replaceState(null,'',`${location.pathname}${location.hash}`)    //地址栏优化
      // }
    });

  /**
   * @description: 触发本组件销毁之前回调
   * @param {Undefined} Undefined
   * @return {Undefined} Undefined
   */
  onUnmounted(() => {
    // 设置上次的菜单类型
    // set_menu_type(get_prev_menu_type)
    debounce_throttle_cancel(cancel_ref);
    // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
    // useMittOn(MITT_TYPES.EMIT_COUNTING_DOWN_START_ENDED,counting_down_start_ended_on);
    component_data.emitters.map((x) => x())
    utils.clear_timer();

    // 删除虚拟体育赛狗和赛马玩法缓存
    for (const key in sessionStorage) {
      if (key.match(/^\d.+-cache$/)) {
        sessionStorage.removeItem(key);
      }
    }
    clearTimeout(timer_super27);
    clearTimeout(timer_super28);
  });

  // #TODO vuex computed计算属性
  //   computed: {
  //     ...mapGetters({
  //       get_virtual_current_sub_menuid: "get_virtual_current_sub_menuid", // 当前选中的二级菜单id
  //       get_curr_sub_menu_type: "get_curr_sub_menu_type", // 当前选中的二级菜单type
  //       get_prev_menu_type:"get_prev_menu_type",//赛事列表筛选逻辑使用的menu_type
  //       get_is_close_video:"get_is_close_video",
  //       get_is_banner_jump:"get_is_banner_jump",
  //       get_golistpage:"get_golistpage",
  //       get_theme:'get_theme',
  //       right_menu_show:'get_is_show_menu',
  //       get_curr_sub_menu_type:"get_curr_sub_menu_type"
  //     }),
  //   },

    const get_virtual_current_sub_menuid = computed(() => {
      return ""
    });
    const get_curr_sub_menu_type = computed(() => {
      return ""
    });
    const get_prev_menu_type = computed(() => {
      return ""
    });
    const get_is_close_video = computed(() => {
      return ""
    });
    const get_is_banner_jump = computed(() => {
      return ""
    });
    const get_golistpage = computed(() => {
      return ""
    });
    const get_theme = computed(() => {
      return ""
    });
    const right_menu_show = computed(() => {
      return ""
    });
    // #TODO vuex actions
    // ...mapMutations([
    //       "set_list_scroll_top_iconshow", // 设置滚动图标显示
    //       "set_menu_type",    // 设置当前主菜单menu_type值
    //       'set_virtual_current_sub_menuid',   // 设置当前选中的二级菜单id
    //       'set_curr_sub_menu_type',   // 设置当前选中的二级菜单type
    //       'set_virtual_data_loading',  // 设置虚拟体育数据loading状态
    //       'set_current_esport_csid',   // 设置电竞游戏csid
    //       'set_is_user_refreshing',    // 设置用户刷新状态
    //     ]),


    /**
     * @description: 赛事列表回到顶部
     */
    const back_top = () => {
      // #TODO
      // $refs.scrollArea && $refs.scrollArea.scrollTo(0,0)
    };
    /**
     * @description: 更新赛事列表滚动高度
     */
    const wrapper_scroll_handler = (e) => {
      if (e) {
        list_scroll_top = e.target.scrollTop
      }
    };
    /**
     * 虚拟体育刷新
     */
    const vir_refresh = () => {
      if(refreshing) return;
      refreshing = true;
      set_is_user_refreshing(true)
      timer_super27 = setTimeout(() => {
        // 取消刷新 已做节流
        cancel_ref();
      },700);
    };
    let cancel_ref = () => {
      refreshing = false;
    };
    /**
     * 虚拟体育菜单切换
     */
    const virtual_menu_changed = (i) => {
      // #TODO
      utils.tab_move(i, $refs.scroll_main, $refs.scroll_box)
      component_data.sub_menu_i = i;
      component_data.current_sub_menu = component_data.sub_menu_list[i];
      component_data.virtual_sports_params.csid = component_data.current_sub_menu.menuId;

      // 足蓝跳转到其他虚拟赛种前， 给状态一个标识
      component_data.v_menu_changed = ([1001, 1004].includes(get_curr_sub_menu_type.value) ? 'zu_lan_' : '') + Math.random();

      // set_virtual_current_sub_menuid(component_data.current_sub_menu.menuId);
      // 虚拟二级菜单type储存
      // set_curr_sub_menu_type(component_data.current_sub_menu.menuType || component_data.current_sub_menu.menuId)
    };
    const get_sub_menu_c_index = () => {
      let r = 0;
      // let sub_menu_id = get_virtual_current_sub_menuid;
      // r = lodash.findIndex(component_data.sub_menu_list,{
      //   field1: sub_menu_id
      // })
      if(r < 0) r = 0;
      return r;
    };
    /**
     * 获取虚拟体育菜单
     */
    const get_virtual_menus = () => {
      // set_virtual_data_loading(1)
      component_data.sub_menu_list =lodash.cloneDeep(base_data.vr_menu())
      let obj_ = {
        // axios api对象
        axios_api:api_common. get_virtual_menu,
        // axios api对象参数
        params:{},
        // axios中then回调方法
        fun_then: result => {
          let { data: res } = result;
          console.log("res", res);
          if(res.code == 200){
            component_data.virtual_menu_list = res.data || []
            res.data.forEach(sub_menu => {
              sub_menu.menuName = sub_menu.name;
            });
            console.log("base_data.vr_menu()", base_data.vr_menu());
            component_data.sub_menu_list = !lodash.isEmpty(res.data)?lodash.cloneDeep(res.data):lodash.cloneDeep(base_data.vr_menu());
            component_data.sub_menu_i = get_sub_menu_c_index();
            if(component_data.sub_menu_list.length){
              if(component_data.sub_menu_id_f_detail){
                let index = lodash.findIndex(component_data.sub_menu_list, item => item.menuId == component_data.sub_menu_id_f_detail);
                component_data.sub_menu_i = index;
                component_data.sub_menu_id_f_detail = '';
              }

              // if(!get_virtual_current_sub_menuid){
              //   set_virtual_current_sub_menuid(component_data.sub_menu_list[component_data.sub_menu_i].menuId);
              // }
              // set_curr_sub_menu_type(component_data.sub_menu_list[component_data.sub_menu_i].menuId);

              virtual_menus_loaded(component_data.sub_menu_list);
            }else{
              virtual_menus_loaded(component_data.sub_menu_list);
            }
          }else{
            component_data.virtual_menu_list = []
          }
        },
        // axios中catch回调方法
        fun_catch: err => {
          useMittEmit(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA);
          // useMittEmit(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA);
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1100
      }
      // #TODO
      // axios_api轮询调用方法
      axios_api_loop(obj_);
    };
    /**
     * 虚拟体育菜单加载完成
     */
    const virtual_menus_loaded = (menues) => {
      if(!menues || !menues.length){
        component_data.current_sub_menu = {};
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, false);
        // useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        return;
      }
      component_data.virtual_sports_params.csid = menues[component_data.sub_menu_i].menuId;
      if(menues.length){
        // set_virtual_current_sub_menuid(menues[component_data.sub_menu_i].menuId);
        // set_curr_sub_menu_type(menues[component_data.sub_menu_i].menuId);
      }
      component_data.current_sub_menu = menues[component_data.sub_menu_i];
    };
    return {
      ...toRefs(component_data),
      t,
      lodash,
      virtual_menus_loaded,
      get_virtual_menus,
      virtual_menu_changed,
      cancel_ref,
      vir_refresh,
      wrapper_scroll_handler,
      back_top,
      get_virtual_current_sub_menuid, // 当前选中的二级菜单id
      get_curr_sub_menu_type, // 当前选中的二级菜单type
      get_prev_menu_type,//赛事列表筛选逻辑使用的menu_type
      get_is_close_video,
      get_is_banner_jump,
      get_golistpage,
      get_theme,
      right_menu_show,
    }
  }
})
</script>

<style lang="scss" scoped>
.virtual-main {
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;

  /* ************** 列表上滑箭头图标 **************** -S */
  .list-scroll-to-top {
    z-index: 86;
    position: fixed;
    width: 0.3rem;
    //height: 0.3rem;
    bottom: 0.6rem;
    right: .2rem;
  }

	 /*  头部 */
  .virtual-head {
    position: sticky;
    top: 0;
    z-index: 540;
    width: 100%;

    .type-bg {
      background-size: 100% auto;
    }

    .back-wrap {
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      height: 0.44rem;

      .detail-back {
        width: 0.3rem;
        height: 100%;
        background-size: 0.1rem auto;
        margin-left: 0.05rem;
      }

      /*  刷新按钮 */
      // #TODO
      // @include keyframes(loading-ring-animate) {
      //   0% {
      //     transform: rotate(0deg);
      //   }
      //   100% {
      //     transform: rotate(360deg);
      //   }
      // }

      .virtual-ref {
        width: 0.4rem;
        height: 100%;
        background: var(--q-color-com-img-bg-70) center no-repeat;
        background-size: 0.2rem auto;

        &.refreshing {
          animation: 0.7s loading-ring-animate linear;
        }
      }

      .no-single {
        width: 0.4rem;
        height: 100%;
        background-size: 0.2rem auto;
      }

      .set-menu {
        ::v-deep.filter-icon-wrapper {
          width: 0.4rem;
          height: 0.44rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
	/*  虚拟体育菜单 */
  .virtual-menu-list {
    display: flex;
    padding: 0 0.05rem;
    flex-wrap: nowrap;
    overflow: auto;
    font-size: 0.12rem;

    .tabs-bar {
      width: 100%;

      .tabs-bar-nav {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        height: 0.65rem;
        padding-left: 0.12rem;

        .tabs-tab {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: fit-content;
          padding-right: 0.38rem;
          position: relative;

          &:last-child {
            padding-right: 0.2rem;
          }

          .icon {
            position: relative;
            width: 0.22rem;
            height: 0.22rem;
            margin-bottom: 0.1rem;
            background: var(--q-color-com-img-bg-140) no-repeat 0 0 / 0.22rem 18.88rem;
            --per: -0.32rem;

            .menu-new-icon {
              position: absolute;
              right: -0.3rem;
              top: -0.05rem;
            }
          }

          @each $virtual-id, $y in (1001, 29),
                                   (1004, 30),
                                   (1011, 23),
                                   (1002, 11),
                                   (1009, 24),
                                   (1010, 57) {
            .icon#{$virtual-id} {
              background-position-y: calc(var(--per) * #{$y});
            }
          }

          > span {
            font-family: PingFangSC-Medium;
            font-size: 0.1rem;
            text-align: center;
          }

        }
      }
    }

    .item-inner {
      position: relative;
      z-index: 2;
      height: 100%;
      min-width: 0.8rem;
      border-radius: 0.05rem 0.05rem 0 0;
      overflow: hidden;

      .text-wrap {
        display: flex;
        justify-content: center;
        padding: 0 0.1rem;
        padding-top: 0.1rem;

        img {
          position: absolute;
          top: 0;
          left: -0.03rem;
          width: 0.24rem;
        }
      }

      .icon {
        width: 0.14rem;
        height: 0.14rem;

        margin-right: 0.04rem;
        display: none;
        background: var(--q-color-com-img-bg-20) no-repeat 0 0 / 100%;
        --per: -0.3rem;
      }

      @each $virtual-id, $y in (1001, 12),
                               (1002, 14),
                               (1004, 13),
                               (1010, 14),
                               (1009, 24),
                               (1011, 15) {
        .icon#{$virtual-id} {
          background-position-y: calc(var(--per) * #{$y});
        }
      }
    }
  }
}
</style>
