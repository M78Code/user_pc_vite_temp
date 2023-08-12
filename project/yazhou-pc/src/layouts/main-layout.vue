<!--
 * @Description: 主体页面展示
-->
<template>
  <div class="c-main-scroll window-width window-height">
    <div class="main overflow-hidden relative-position" :class="{ 'iframe-top-collapse': menu_collapse_status }"
      :style="`width:${layout_size.main_width}px;`">
      <!-- 搜索 -->
      <!-- <search v-if="get_search_status" v-show="route_params.video_size!=1" /> -->
      <!-- 页面头部容器-->
      <!-- <site-header v-show="route_params.video_size!=1" class="yb-layout-margin-header" :nav_list="nav_list" :class="{'activity_bonus': hasBonusType3}" :imgUrl="special_img_url"  :hostUrl="special_host_url" :urlType="special_url_type" :hasActivity="hasActivity" /> -->


      <div class="c-main-content c-content-bg"
        :style="`width:${layout_size.main_width}px  !important; height:${layout_size.content_height + 4}px  !important;`">
        <!-- 左侧 菜单区域 -->
        <div ref="page-left" v-show="route_params.video_size != 1"
          class="page-left row yb-layout-margin-menu relative-position"
          :style="`width:${layout_size.left_width}px  !important; height:${layout_size.content_height}px  !important;`"
          :class="main_menu_toggle">
          <div class="cathectic-shade" v-show="bet_loadding && left_menu_toggle">
            <div class="shade-fixed">
              <!--确认中转圈圈-->
              <div class="loading-wrap">
                <div class="img-loading"></div>
                <div class="text-center loading-text flex items-end justify-center">
                  <!-- {{ $root.$t('bet.bet_loading') + '...' }} -->
                  <!-- 内容加载中... -->
                </div>
              </div>
            </div>
          </div>
          <!--左侧菜单mini-->
          <!-- <main-menu-mini v-show="main_menu_toggle =='mini'" /> -->
          <!--左侧菜单-->
          <main-menu v-show="['normal', 'mini-normal'].includes(main_menu_toggle)" />
        </div>

        <!-- 中间区域 -->
        <keep-alive include="matchListRouter" max="1">
          <router-view class="page-center" :class="screen_width"
            :style="route_params.video_size == 1 ? 'position: fixed; top: 0;  bottom: 0;right: 0;  left: 0; width: 100%;height: 100%;' : `width:${layout_size.center_width}px  !important; height:${layout_size.content_height}px  !important;`" />
        </keep-alive>

        <!-- 右侧区域 -->
        <div class="page-right" :class="screen_width"
          :style="route_params.video_size == 1 ? '' : `width:${layout_size.right_width}px  !important; height:${layout_size.content_height}px  !important;`"
          v-if="layout_size.right_width > 0">

          <!-- 虚拟体育 -->
          <!-- <virtual-right v-if="NewMenu.is_virtual_sport() && $route.name != 'search' && $route.name != 'details'" /> -->
          <!-- 常规竞猜 -->
          <!-- <match-details v-else class="page-match-detail fit" /> -->
        </div>
      </div>

      <!-- 小于 1440 时显示折叠按钮  -->
      <div v-if="route_params.video_size != 1" v-show="main_menu_toggle != 'normal'" @click="on_main_menu_toggle"
        class="menu_toggle-btn yb-flex-center" :class="[main_menu_toggle, bet_loadding ? 'disable-toggle' : '']">
        <!-- <img src="~public/image/yabo/svg/left_menu_toggle.svg" alt=""> -->
      </div>

      <!-- 视频js预加载 -->
      <!-- <iframe v-if="video_src" style="display:none;" :src="video_src"></iframe>
      <iframe v-if="animation_src" style="display:none;" :src="animation_src"></iframe> -->

      <!-- toast 消息提示 -->
      <!-- <toast />
      <confirm />
      <alert /> -->
      <!-- 押注操作相关组件 -->
      <!-- 活动弹框 -->
      <!-- <activityModel v-if="showActivity" :imgUrl="imgUrl" :imgShowTimer="userBannerTimer" :hostUrl="hostUrl" :urlType="urlType" :allowClick="allowClick"/> -->
      <!-- 页面底部容器 整个内嵌可拖拽组件 -->
      <template v-if="(show_bet_zone && !left_menu_toggle) && $route.name != 'video'">
        <vue-draggable-resizable ref="resizable" :axis="axis" :x="x" :y="y" :w="300" :h='h' :z="2000" :resizable="false"
          :parent="true" :prevent-deactivation="true" @dragging="move_handle" @dragstop="stop_handle"
          :style="draggable_style" class-name="bet-zone">

          <div class="cathectic-shade" :class="{ 'zero-opacity': (!bet_loadding && dragging) }"
            v-show="bet_loadding || dragging">
            <!--确认中转圈圈-->
            <template v-if="bet_loadding">
              <div class="shade-fixed">
                <div class="loading-wrap">
                  <div class="img-loading"></div>
                  <div class="text-center loading-text flex items-end justify-center">
                    <!-- {{ $root.$t('bet.bet_loading') + '...' }} -->
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!--滚动条头部-->
          <template v-if="is_virtual_bet">
            <!-- <virtual-bet-scroll-header ref="resizeable-header" :is_free='false' :is_expand="is_expand"  /> -->
          </template>
          <!-- <bet-scroll-header v-else ref="resizeable-header" :is_expand="is_expand" :bet_flag="bet_flag" :is_free='false'/> -->
          <div class="cathectic-zone" :class="{ 'bet-zone-height': !is_expand }" v-show="is_expand2"
            @click.stop="check_drag">
            <!--中间内容部分-->
            <q-scroll-area ref="bet-scroll-area" class="bet-scroll-area" :thumb-style="thumb_style"
              :style="{ 'height': `${content_height}px`, 'width': '300px', 'max-height': `${layout_size.content_height - 190}px` }">
              <!--虚拟体育部分-->
              <template v-if="is_virtual_bet">
                <!-- 虚拟单关 -->
                <!-- <virtual-bet-single ref="embedded-single" @set_scroll_this="set_scroll_this" v-if="virtual_bet_list.length==1" /> -->
                <!-- 虚拟串关 -->
                <!-- <virtual-bet-mix ref="embedded-mix" @set_scroll_this="set_scroll_this" v-if="virtual_bet_list.length>1"/> -->
              </template>
              <!--非虚拟体育部分-->
              <template v-else>
                <div ref="bet-mode-zone" class="bet-mode-zone" v-if="is_bet_single">
                  <div class="left">
                    <!-- <span>{{ $root.$t("bet.bet_one_") }}</span> -->
                    <span class="bet-single-count">
                      {{ bet_single_list.length }}
                    </span>
                  </div>
                  <div class="right">
                    <span class="check-box" :class="{ 'checked': is_bet_merge }" @click.stop="toggle_merge">
                      <!-- <check-box :checked="is_bet_merge" /><span>{{$root.$t('bet.merge')}}</span> -->
                    </span>
                    <span @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
                      <icon id="merge-info" name="icon-tips" class="bet-info" size="14px" />
                    </span>
                  </div>
                </div>
                <!--内嵌的单关-->
                <!-- <bet-single ref="embedded-single" @set_scroll_this="set_scroll_this" v-if="is_bet_single"/> -->
                <!--内嵌的串关-->
                <!-- <bet-mix ref="embedded-mix" @set_scroll_this="set_scroll_this" v-if="!is_bet_single"/> -->
              </template>
            </q-scroll-area>
            <!-- 滚动：尾部 --------------------------------->
            <!--滚动条底部-->
            <template v-if="is_virtual_bet">
              虚拟
              <!-- <virtual-bet-scroll-footer ref="resizeable-footer" :bet_this="bet_this"/> -->
            </template>
            <template v-else>
              普通
              <!-- <bet-scroll-footer ref="resizeable-footer" :bet_this="bet_this"/> -->
            </template>
          </div>
        </vue-draggable-resizable>
      </template>
      <!-- 视频画中画组件 -->
      <!-- <moveVideo></moveVideo> -->
    </div>
    <loading v-if="dataLoading" />
    <!--提示区域-->
    <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[262, 10]"
      target="#merge-info" v-if="show_merge_info">
      <div style="width:252px;min-height:60px;padding-top:5px;padding-bottom:10px;padding-left:5px;word-break:break-all;">
        <!-- {{ $root.$t('bet.merge_info') }} -->
      </div>
    </q-tooltip>
    <!-- 引导页 -->
    <introduce />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { get, isEmpty } from 'lodash'
import store from "../store/index.js";

import MainMenu from '../pages/left-menu/index.vue'

let state = store.getState()

// 内嵌版 菜单收起状态
const menu_collapse_status = ref(state.menuReducer.menu_collapse_status)
// 左侧列表显示形式 normal：展开 mini：收起
const main_menu_toggle = ref(state.menuReducer.main_menu_toggle)

// 左侧菜单的切换状态 true: 展开 false: 收缩
const left_menu_toggle = ref(state.betInfoReducer.left_menu_toggle)
// 当前是否为虚拟投注
const is_virtual_bet = ref(state.betInfoReducer.is_virtual_bet)
// true: 单关投注 false: 串关投注
const is_bet_single = ref(state.betInfoReducer.is_bet_single)
// 虚拟投注对象
const virtual_bet_obj = ref(state.betInfoReducer.virtual_bet_obj)
// 单关投注对象
const bet_single_obj = ref(state.betInfoReducer.bet_single_obj)
// 押注扁平化对象扁平
const bet_obj = ref(state.betInfoReducer.bet_obj)
// 
const bet_single_list = ref(state.betInfoReducer.bet_single_list)
// 押注信息列表
const bet_list = ref(state.betInfoReducer.bet_list)
// 合并模式
const is_bet_merge = ref(state.betInfoReducer.is_bet_merge)
// 虚拟投注列表
const virtual_bet_list = ref(state.betInfoReducer.virtual_bet_list)



// 所有布局宽高信息
const layout_size = ref(state.layoutReducer.layout_size)

const route_params = ref({ video_size: 0 })
// 投注loading
const bet_loadding = ref(false)
// 屏幕宽度
const screen_width = ref('')
const content_height = ref(0)

// 拖拽中
const dragging = ref(false)
// 距离左侧最大距离
const max_left = ref(document.body.clientWidth - 315)
const max_top = ref(document.body.clientHeight - 568)
// x投注框轴坐标
const x = (null)
// y投注框轴坐标
const y = (null)
const h = (null)

const thumb_style = ref({
  right: '3px',
  borderRadius: '3px',
  backgroundColor: '#000000',
  width: '6px',
  opacity: 0.3
})

// 是否展开
const is_expand = ref(true)
const is_expand2 = ref(true)

// 是否显示合并信息
const show_merge_info = ref(false)


const show_bet_zone = computed(() => {
  //是不是可以显示内嵌框
  if (!is_virtual_bet &&
    ((is_bet_single && bet_single_list.length > 0) ||
      (!is_bet_single && bet_list.length > 0))) {
    return true;
  } else if (is_virtual_bet && virtual_bet_list.length > 0) {
    return true;
  }
  return false;
})

/**
* 菜单状态切换
*/
const on_main_menu_toggle = () => {
  if (bet_loadding) {
    return;
  }
  let cur = main_menu_toggle == 'mini' ? 'mini-normal' : 'mini'
  // 设置 左侧列表显示形式 normal：展开 mini：收起
  store.dispatch({
    type: "SET_MAIN_MENU_TOGGLE",
    data: cur,
  })

  //  左侧菜单状态 展开或收起
  store.dispatch({
    type: "set_left_menu_toggle",
    data: main_menu_toggle != 'mini',
  })

  update_bet_data();
}

const update_bet_data = () => {
  /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
  type:0表示普通赛事(默认值)，1虚拟赛事 */
  let type = is_virtual_bet ? 1 : 0;
  let ids = [], bet_type;
  if (is_virtual_bet) {
    bet_type = virtual_bet_obj;
  } else if (is_bet_single) {
    bet_type = bet_single_obj;
  } else {
    bet_type = bet_obj;
  }
  for (let obj of Object.values(bet_type)) {
    let match_id = get(obj, 'cs.match_id', '');
    let handicap_id = get(obj, 'cs.handicap_id', '');
    let play_id = get(obj, 'cs.play_id', '');
    let oid = get(obj, 'cs.oid', '');
    if (!isEmpty(match_id) &&
      !isEmpty(handicap_id) &&
      !isEmpty(play_id) &&
      !isEmpty(oid)) {
      ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
    }
  }
  if (!isEmpty(ids)) {
    if ($NewMenu.is_esports()) {
      type = 2;
    }
    let params = {
      ids: ids.join(','),
      type
    }
    return;
    // api_details.get_bet_olds(params).then(res =>{
    //   let data = get(res, 'data.data');
    //   if(isArray(data) && data.length>0) {
    //     if(is_virtual_bet) {
    //       virtual_common.update_bet_item_info(this, data);
    //     } else {
    //       yabo_common.update_bet_item_info(this, data);
    //     }
    //     if(is_bet_single) {
    //       $root.$emit(emit_cmd.EMIT_INIT_BET_LIST_ITEM_CMD);
    //     } else {
    //       $root.$emit(emit_cmd.EMIT_UPDATE_HOME_AWAY_CMD);
    //     }
    //   }
    // }).catch(error=>{
    //   console.log(error);
    // });
  }
}

/**
   * 检查是否正在拖拽
   */
const check_drag = () => {
  return !dragging;
}

/**
   * 拖拽完成时间 停止拖拽
   */
const stop_handle = () => {
  dragging.value = false;
}
/**
 * 拖拽中调用
 */
const move_handle = (x, y) => {
  // 如果x轴为发生变化触发此事件说明是点击操作
  if (x == x || y == y) return;
  // 拖拽在左侧最大距离后停止拖拽
  if (x > max_left) {
    x.value = max_left;
  } else if (x < 0) { // 拖拽到右侧最小距离停止拖拽
    x.value = 0;
  } else {
    x.value = Math.round(x);
  }

  if (y > max_top) {
    y.value = max_top
  } else if (y < 0) {
    y.value = 0
  } else {
    y.value = Math.round(y)
  }

  // 记录拖拽的位置
  localStorage.setItem('bet_position', JSON.stringify({ x: x, y: y }));
  dragging.value = true; // 允许拖拽
}


</script>

<style lang="scss" scoped>
.c-main-scroll {
  overflow-x: auto;

  ::v-deep .q-page-sticky>div {
    width: 100%;
  }

  ::v-deep .page-right {
    z-index: 52;
  }
}

.main {
  height: 100%;

  .c-site-header {
    width: 100%;
  }

  .zero-opacity {
    opacity: 0;
  }

  .c-main-content {
    background-position: center;
    background-size: cover;
    display: flex;

    ::v-deep .page-right {
      z-index: 52;

      .football-after,
      .more-info {
        width: 90% !important;
      }
    }
  }
}

.iframe-top-collapse {
  ::v-deep {
    .c-site-header.is-iframe {
      height: 36px;
    }

    .serach-wrap.iframe {
      top: 0 !important;
    }
  }
}

.football-after,
.basketball-after,
.more-info {
  width: 90% !important;
}

.bet-mode-zone {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    padding-left: 15px;
  }

  .bet-single-count {
    font-size: 16px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    margin-left: 5px;
    text-align: center;
    transform: scale(0.8);
  }

  .right {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    .check-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      padding-left: 5px;
      padding-right: 5px;

      .check-wrap {
        padding: 0;
        margin-right: 5px;
      }

      &.checked {
        .check-wrap {
          border: 0;
        }
      }
    }
  }
}

.tip-content {
  width: calc(100% - 20px);
  height: 100px;
  position: absolute;
  bottom: 0;
  z-index: 2003;
  top: -50px;
  left: 10px;

  &.top-content {
    top: 5px;
  }

  .content-wrap {
    position: absolute;
    top: 6px;
    width: 100%;
    background: #fff;
    border: 2px solid #ff781d;
    border-radius: 5px;

    .content {
      padding: 10px;
      font-size: 12px;

      .row-1,
      .row-2,
      .row-3 {
        color: #2d2d2d;
        text-align: center;
      }

      .row-1 {
        margin-bottom: 10px;
        font-size: 14px;
        color: #ff781d;
        font-weight: bold;
      }
    }

    .triangle,
    .triangle1 {
      position: absolute;
      background: #fff;
      border: 2px solid #ff781d;
      border-top: 0;
      border-left: 0;
      width: 15px;
      height: 15px;
      transform: rotate(45deg);
      top: 81px;
      right: 22px;
    }

    .triangle1 {
      top: 116px;
    }

    .icon-del {
      position: absolute;
      top: 16px;
      right: 10px;
      cursor: pointer;
    }
  }
}

.bet-bg-tooltip {
  background: #A3AFBF;
  color: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>

