<!--
 * @Author: Cronus
 * @Date: 2021-03-13 15:52:42
 * @Description:
-->
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
            <div class="col">{{i18n_t('common.virtual_sports')}} {{lodash.get(sub_menu_list,`[${sub_menu_i}].name`)}}</div>
            <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
            <div class="no-single" @click="click_event()"></div>
            <!-- 复刻版暂时用不到先注释了 -->
            <!-- <set-menu /> -->
          </div>
          <!-- 虚拟体育菜单 -->
          <div class="virtual-menu-list" ref='virtual_menu_list'>
            <div class="tabs-bar">
              <div class="tabs-bar-nav" ref="scroll_main">
                <div class="tabs-tab"
                     ref="scroll_box"
                     v-for="(tab, i) in sub_menu_list" :key="i"
                     :class="[sub_menu_i == i ? 'tabs-active' : '']"
                     @click="virtual_menu_changed(i)"
                >
                  <div class="icon" :class="['icon'+tab.field1, get_theme.includes('y0')?'icon_y0':'']">
                    <img v-if="false" class="menu-new-icon" src="image/bw3/svg/virtual-sports/new.svg" />
                  </div>
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

    <!-- 简版 底部菜单 -->
    <virtual-footer-menu v-show="!right_menu_show" />

  </div>
</template>

<script>
import virtualSports from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports.vue";    // 虚拟体育
// import setMenu from "src/project/components/common/set_menu.vue"    // 设置菜单
import { api_v_sports } from "src/base-h5/vr/api";
import { debounce } from "lodash";
import { utils } from "src/core/utils/common/module/utils.js";
import virtualFooterMenu from 'src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_footer_menu.vue'
import axios_api_loop from "src/core/http/axios-loop.js"
import { debounce_throttle_cancel } from "src/core/utils/common/module/other.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import lodash from "lodash"
import tab_move from "src/core/tab-move/tab-move.js";

export default {
  name:'match_main',
  data() {
    return {
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
    };
  },
  created(){
    //虚拟体育刷新赛事
    this.timer_super27=0;
    this.timer_super28=0;
    //获取虚拟体育菜单数据
    this.get_virtual_menus();
    //首页跳转虚拟体育设置menu_type为900
    this.set_menu_type(900);
    clearTimeout(this.timer_super28)
    this.timer_super28 = setTimeout(()=>{
      this.set_menu_type(900);
    }, 500)
    this.cancel_ref = debounce(this.cancel_ref,200)
  },
  mounted() {
    // 浏览器窗口变化事件监听
    // this.$root.$on(this.emit_cmd.EMIT_WINDOW_RESIZE, this.window_resize_on);
    // 不让浏览器记住上次的滚动位置
    if ('scrollRestoration' in History){
      history.scrollRestoration = 'manual'
    }
    //虚拟体育页更改语言
    if (!location.search.includes('keep_url')) {
      history.replaceState(null,'',`${location.pathname}${location.hash}`)    //地址栏优化
    }
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
      _this.set_current_esport_csid('');
      _this.v_match_router_ente = Math.random();
      if(from.name == "virtual_sports_details"){
        if(_this.get_virtual_current_sub_menuid){
          _this.sub_menu_id_f_detail = _this.get_virtual_current_sub_menuid;
        }
      }
    });
  },
  /**
   * @description: 触发本组件销毁之前回调
   * @param {Undefined} Undefined
   * @return {Undefined} Undefined
   */
  destroyed() {
    // 设置上次的菜单类型
    this.set_menu_type(this.get_prev_menu_type)
    debounce_throttle_cancel(this.cancel_ref);
    // this.$root.$off(this.emit_cmd.EMIT_WINDOW_RESIZE, this.window_resize_on);
    // this.$root.$off(this.emit_cmd.EMIT_COUNTING_DOWN_START_ENDED,this.counting_down_start_ended_on);
    this.emitters && this.emitters.map((x) => x());

    this.clear_timer();

    // 删除虚拟体育赛狗和赛马玩法缓存
    for (const key in sessionStorage) {
      if (key.match(/^\d.+-cache$/)) {
        sessionStorage.removeItem(key);
      }
    }
    clearTimeout(this.timer_super27);
    clearTimeout(this.timer_super28);
  },
  methods: {
    // ...mapMutations([
    //   "set_list_scroll_top_iconshow", // 设置滚动图标显示
    //   "set_menu_type",    // 设置当前主菜单menu_type值
    //   'set_virtual_current_sub_menuid',   // 设置当前选中的二级菜单id
    //   'set_curr_sub_menu_type',   // 设置当前选中的二级菜单type
    //   'set_virtual_data_loading',  // 设置虚拟体育数据loading状态
    //   'set_current_esport_csid',   // 设置电竞游戏csid
    //   'set_is_user_refreshing',    // 设置用户刷新状态
    // ]),
    set_list_scroll_top_iconshow(){},
    set_menu_type(){},
    set_virtual_current_sub_menuid(data){VR_CTR.set_virtual_current_sub_menuid(data)},
    set_curr_sub_menu_type(data){VR_CTR.set_curr_sub_menu_type(data)},
    set_virtual_data_loading(data){VR_CTR.set_virtual_data_loading(data)},
    set_current_esport_csid(){},
    set_is_user_refreshing(){},
    /**
     * @description: 赛事列表回到顶部
     */
    back_top() {
      this.$refs.scrollArea && this.$refs.scrollArea.scrollTo(0,0)
    },
    click_event(){
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
     * @description: 更新赛事列表滚动高度
     */
    wrapper_scroll_handler(e) {
      if (e) {
        this.list_scroll_top = e.target.scrollTop
      }
    },
    /**
     * 虚拟体育刷新
     */
    vir_refresh(){
      if(this.refreshing) return;
      this.refreshing = true;
      this.set_is_user_refreshing(true)
      this.timer_super27 = setTimeout(() => {
        // 取消刷新 已做节流
        this.cancel_ref();
      },700);
    },
    cancel_ref(){
      this.refreshing = false;
    },
    /**
     * 虚拟体育菜单切换
     */
    virtual_menu_changed(i){
      tab_move.tab_move(i, this.$refs.scroll_main, this.$refs.scroll_box)
      this.sub_menu_i = i;
      this.current_sub_menu = this.sub_menu_list[i];
      this.virtual_sports_params.csid = this.current_sub_menu.menuId;

      // 足蓝跳转到其他虚拟赛种前， 给状态一个标识
      this.v_menu_changed = ([1001, 1004].includes(this.get_curr_sub_menu_type) ? 'zu_lan_' : '') + Math.random();
      console.log(this.get_curr_sub_menu_type, 'this.get_curr_sub_menu_type')
      this.set_virtual_current_sub_menuid(this.current_sub_menu.menuId);
      this.set_curr_sub_menu_type(this.current_sub_menu.menuType || this.current_sub_menu.menuId)
    },
    get_sub_menu_c_index(){
      let r = 0;
      let sub_menu_id = this.get_virtual_current_sub_menuid;
      r = lodash.findIndex(this.sub_menu_list,{
        field1: sub_menu_id
      })
      if(r < 0) r = 0;
      return r;
    },
    /**
     * 获取虚拟体育菜单
     */
    get_virtual_menus(){
      this.set_virtual_data_loading(1)
      let obj_ = {
        // axios api对象
        axios_api: api_v_sports.get_virtual_menus,
        // axios api对象参数
        params:{},
        // axios中then回调方法
        fun_then: res => {
          if(res.code == 200){
            res.data.forEach(sub_menu => {
              sub_menu.menuName = sub_menu.name;
            });
            this.sub_menu_list = lodash.cloneDeep(res.data);

            this.sub_menu_i = this.get_sub_menu_c_index();
            if(this.sub_menu_list.length){
              if(this.sub_menu_id_f_detail){
                let index = lodash.findIndex(this.sub_menu_list, item => item.menuId == this.sub_menu_id_f_detail);
                this.sub_menu_i = index;
                this.sub_menu_id_f_detail = '';
              }

              if(!this.get_virtual_current_sub_menuid){
                this.set_virtual_current_sub_menuid(this.sub_menu_list[this.sub_menu_i].menuId);
              }
              this.set_curr_sub_menu_type(this.sub_menu_list[this.sub_menu_i].menuId);

              this.virtual_menus_loaded(this.sub_menu_list);
            }else{
              this.virtual_menus_loaded(this.sub_menu_list);
            }
          }
        },
        // axios中catch回调方法
        fun_catch: err => {
          useMittEmit(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA);
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1100
      }
      // axios_api轮询调用方法
      axios_api_loop(obj_);
    },
    /**
     * 虚拟体育菜单加载完成
     */
    virtual_menus_loaded(menues){
      if(!menues || !menues.length){
        this.current_sub_menu = {};
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        return;
      }
      this.virtual_sports_params.csid = menues[this.sub_menu_i].menuId;
      if(menues.length){
        this.set_virtual_current_sub_menuid(menues[this.sub_menu_i].menuId);
        this.set_curr_sub_menu_type(menues[this.sub_menu_i].menuId);
      }
      this.current_sub_menu = menues[this.sub_menu_i];
    },
    // 批量清除定时器
    clear_timer() {
      const timer_arr = [
          'timer1_',
          'scrollItemTimer',
          'scrollItemTimer2',
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    }
  },
  computed: {
    // ...mapGetters({
    //   get_virtual_current_sub_menuid: "get_virtual_current_sub_menuid", // 当前选中的二级菜单id
    //   get_curr_sub_menu_type: "get_curr_sub_menu_type", // 当前选中的二级菜单type
    //   get_prev_menu_type:"get_prev_menu_type",//赛事列表筛选逻辑使用的menu_type
    //   get_is_close_video:"get_is_close_video",
    //   get_is_banner_jump:"get_is_banner_jump",
    //   get_golistpage:"get_golistpage",
    //   get_theme:'get_theme',
    //   right_menu_show:'get_is_show_menu',
    // }),
    get_virtual_current_sub_menuid(){return VR_CTR.get_virtual_current_sub_menuid()},
    get_curr_sub_menu_type(){return VR_CTR.get_curr_sub_menu_type()},
    get_prev_menu_type(){return 1},
    get_is_close_video(){return 1},
    get_is_banner_jump(){return 1},
    get_golistpage(){return 1},
    get_theme(){return 'theme01'},
    right_menu_show(){return VR_CTR.get_is_show_menu()},
  },
  components: {
    virtualSports,
    // setMenu,
    virtualFooterMenu,
  }
};
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
      @keyframes loading-ring-animate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

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
        :deep(.filter-icon-wrapper) {
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
          &:last-child {
            padding-right: 0.2rem;
          }

          .icon {
            position: relative;
            width: 0.22rem;
            height: 0.22rem;
            margin-bottom: 0.1rem;
            background: url($SCSSPROJECTPATH+"/image/png/sport_menu.png") no-repeat 0 0 / 0.22rem 19.52rem;
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
            color: #C9CDDB;
          }
          &.tabs-active > span {
            color: #303442;
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


<style lang="scss" scoped>
@import 'src/base-h5/vr/css/virtual_sports/virtual_sports.scss';
@import 'src/base-h5/vr/css/virtual_sports/virtual_sports_match_item.scss';
@import 'src/base-h5/vr/css/virtual_sports/match_tab.scss';
@import 'src/base-h5/vr/css/virtual_sports/virtual_footer_menu.scss';
</style>