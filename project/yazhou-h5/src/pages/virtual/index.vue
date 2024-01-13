<!--
 * @Description: 虚拟体育 VR
-->
<template>
  <div>
    <div class="virtual-main router_scroll_layout" ref="scrollArea" @scroll="wrapper_scroll_handler">
      <!-- 头部 -->
      <div class="virtual-head">
        <div class="type-bg" :class="'bg'+lodash.get(sub_menu_list,`[${sub_menu_i}].field1`)">
          <!-- 返回按钮 及 刷新 注单  设置 按钮 -->
          <div class="back-wrap">
            <div class="detail-back" @click="go_where({back_to: 'go_back_from_virtual_detail',route_name:route.name,route,router})" :style="compute_css_obj({key: 'h5_back_img'})"></div>
            <!-- 虚拟体育 -->
            <div class="col">{{i18n_t('common.virtual_sports')}} {{lodash.get(sub_menu_list,`[${sub_menu_i}].name`)}}</div>
            <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
            <div class="no-single" @click="useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true)"></div>
            <div class="no-single" @click="useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);"></div>
            <!-- <set-menu /> -->
          </div>
          <!-- 虚拟体育菜单 -->
          <div class="virtual-menu-list" ref='virtual_menu_list_dom'>
            <div class="tabs-bar">
              <div class="tabs-bar-nav" ref="scroll_main">
                
                <div ref="scroll_box" @click="virtual_menu_changed(i)" v-for="(tab, i) in sub_menu_list" :key="i" 
                  :class="['tabs-tab', sub_menu_i == i ? 'tabs-active' : '']">
                  <div :class="['icon','icon'+tab.field1, theme.includes('y0')?'icon_y0':'']">
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
      <virtual-sports
        :params="virtual_sports_params"
        :current_sub_menu="current_sub_menu"
        :is_user_refresh='refreshing'
        :menu_list="current_sub_menu.subList ? current_sub_menu.subList : []"
        :v_match_router_ente="v_match_router_ente"
        :v_menu_changed="v_menu_changed">
      </virtual-sports>

    </div>

    <!-- 回到顶部按钮组件 -->
    <!-- <scroll-top v-show="!right_menu_show && list_scroll_top > 0" ref="scroll_top" :list_scroll_top="list_scroll_top" @back-top="back_top" /> -->

    <!-- 简版 底部菜单 -->
    <!-- <virtual-footer-menu v-show="!right_menu_show" /> -->

  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import lodash from "lodash";
import { api_common } from "src/api/index";
import axios_api_loop from "src/core/http/axios-loop.js"
import { go_where } from "src/core/utils/common/index.js"
import { i18n_t, MenuData,compute_css_obj } from "src/output/index.js"
import base_data from "src/core/menu-h5/menu-data-class.js";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { theme } from 'src/base-h5/mixin/userctr.js'
import { useRoute,useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()
// 回到顶部
// import scrollTop from "src/project/components/record_scroll/scroll_top";
// 设置菜单
// import setMenu from "src/project/components/common/set_menu.vue"    
// 虚拟体育
// import virtualSports from "src/base-h5/components/virtual/virtual-sports.vue";
// 底部菜单
// import virtualFooterMenu from 'src/base-h5/components/virtual/virtual-sports-part/virtual-footer-menu.vue'


// 当前选中的虚拟体育菜单(虚拟足球 赛马 赛狗 等)
const current_sub_menu = ref({})
//虚拟体育赛事列表接口请求参数
const virtual_sports_params = ref({
  csid:''
})
//虚拟体育菜单选中项下标
const sub_menu_i = ref(0)
//虚拟体育菜单
const menu_list = ref([])
const sub_menu_list = ref([])
//详情页返回的菜单id
const prev_sub_menu_id = ref('')
// 当前选中的二级菜单type
const get_curr_sub_menu_type = ref('')
// 当前选中的二级菜单id
const get_virtual_current_sub_menuid = ref('')
// 默认不刷新
const refreshing = ref(false)
// 虚拟体育菜单切换标志
const v_menu_changed = ref(0)
//进入虚拟体育赛事列表标志
const v_match_router_ente = ref(0)
// 赛事列表滑动高度
const list_scroll_top = ref(0)
const scrollArea = ref(null)
const scroll_box = ref(null)
const scroll_main = ref(null)
let timer_super1 = null
let timer_super2 = null
onMounted(() => {
  // 获取虚拟体育菜单数据
  // get_virtual_menus()
  get_virtual_menus_data()
  // 首页跳转虚拟体育设置menu_type为900
  // 不让浏览器记住上次的滚动位置
  if ('scrollRestoration' in History){
    history.scrollRestoration = 'manual'
  }
  // 虚拟体育页更改语言
  if (!location.search.includes('keep_url')) {
    history.replaceState(null,'',`${location.pathname}${location.hash}`)
  }
})

//  ...mapMutations([
//       "set_list_scroll_top_iconshow", // 设置滚动图标显示
//       'set_virtual_current_sub_menuid',   // 设置当前选中的二级菜单id
//       'set_curr_sub_menu_type',   // 设置当前选中的二级菜单type
//       'set_virtual_data_loading',  // 设置虚拟体育数据loading状态
//       'set_current_esport_csid',   // 设置电竞游戏csid
//       'set_is_user_refreshing',    // 设置用户刷新状态
//     ]),

// ...mapGetters({
//       get_prev_menu_type:"get_prev_menu_type",//赛事列表筛选逻辑使用的menu_type
//       get_is_close_video:"get_is_close_video",
//       get_is_banner_jump:"get_is_banner_jump",
//       get_golistpage:"get_golistpage",
//       right_menu_show:'get_is_show_menu',
//     }),

/**
 * @description: 赛事列表回到顶部
 */
const back_top = () => {
  scrollArea.value.scrollTo(0,0)
}
/**
 * @description: 更新赛事列表滚动高度
 */
const wrapper_scroll_handler = (e) => {
  if (e) {
    list_scroll_top.value = e.target.scrollTop
  }
}
/**
 * 虚拟体育刷新
 */
const vir_refresh = () => {
  if(refreshing.value) return;
  refreshing.value = true;
  set_is_user_refreshing(true)
  timer_super1 = setTimeout(() => {
    // 取消刷新 已做节流
    refreshing.value = false;
  },700);
}
/**
 * 虚拟体育菜单切换
 */
const virtual_menu_changed = (i) => {
  tab_move(i,scroll_main.vlaue, scroll_box.vlaue)
  sub_menu_i.value = i;
  current_sub_menu.value = sub_menu_list.value[i];
  virtual_sports_params.csid = current_sub_menu.value.menuId;

  // 足蓝跳转到其他虚拟赛种前， 给状态一个标识
  v_menu_changed.value = ([1001, 1004].includes(get_curr_sub_menu_type) ? 'zu_lan_' : '') + Math.random();

  // set_virtual_current_sub_menuid(current_sub_menu.value.menuId);
  // set_curr_sub_menu_type(current_sub_menu.value.menuType || current_sub_menu.value.menuId)
}
const get_sub_menu_c_index = () => {
  let r = 0;
  let sub_menu_id = get_virtual_current_sub_menuid;
  r = lodash.findIndex(sub_menu_list.value,{
    field1: sub_menu_id
  })
  if(r < 0) r = 0;
  return r;
}
// 获取虚拟菜单
const get_virtual_menus_data = async () => {
  const res = await api_common.get_virtual_menu()
  const { code, data } = res
  if (+code !== 200) return useMittEmit(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA);
  const length = lodash.get(data, 'length', 0)
  if (length < 1) return virtual_menus_loaded(sub_menu_list.value);
  data.forEach(t => {
    t.menuName = t.name;
  })
  sub_menu_list.value = lodash.cloneDeep(data);
  sub_menu_i.value = get_sub_menu_c_index();
  // 是否详情返回
  if(prev_sub_menu_id.value){
    const index = lodash.findIndex(sub_menu_list.value, item => item.menuId == prev_sub_menu_id.value);
    sub_menu_i.value = index;
    prev_sub_menu_id.value = '';
  }
  // 设置当前选中的二级菜单id
  if(!get_virtual_current_sub_menuid){
    // set_virtual_current_sub_menuid(sub_menu_list.value[sub_menu_i.value].menuId);
  }
  // 设置当前选中的二级菜单type
  // set_curr_sub_menu_type(sub_menu_list.value[sub_menu_i].menuId);
  // 虚拟体育菜单加载完成
  virtual_menus_loaded(sub_menu_list.value);
}
/**
 * 虚拟体育菜单加载完成
 */
const virtual_menus_loaded = (menues) => {
  if(!menues || !menues.length){
    current_sub_menu.value = {};
    useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, false);
    return;
  }
  virtual_sports_params.csid = menues[sub_menu_i.value].menuId;
  if(menues.length){
    // set_virtual_current_sub_menuid(menues[sub_menu_i].menuId);
    // set_curr_sub_menu_type(menues[sub_menu_i].menuId);
  }
  current_sub_menu.value = menues[sub_menu_i.value];
}

const clear_timer = () => {
  clearTimeout(timer_super1);
  clearTimeout(timer_super2);
  timer_super1 = null
  timer_super2 = null
  
}

onUnmounted(() => {
  clear_timer()
  // 删除虚拟体育赛狗和赛马玩法缓存
  for (const key in sessionStorage) {
    if (key.match(/^\d.+-cache$/)) {
      sessionStorage.removeItem(key);
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