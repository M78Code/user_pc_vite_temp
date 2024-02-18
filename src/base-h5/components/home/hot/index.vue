<!--
 * @Description: 热门页入口主页面
-->
<template>
  <div class="popular-hot-pages">
    <!-- 第一个tab 精选 骨架屏 -->
    <!-- <hot-featured v-if="featured_loading && tab_Index === 0" :first="first_loading"></hot-featured> -->
    <!-- 热门赛程 骨架屏-->
    <!-- <hot-schedule v-if="featured_loading && tab_Index === 1"></hot-schedule> -->
    <!-- 热门下边的 tab球类 选项卡-->
    <div class="hot-pages-tabs">
      <div class="tabs-bar">
        <div class="tabs-bar-nav" ref="scrollBox" :class="[change_background]">
          <div class="tabs-tab" v-for="(tab, index) in tabList" :key="index"
            :class="[tab_Index == index ? 'tabs-active' : '']" @click="change_tab(tab, index, true)">
            <!-- 竞足 tab图标 -->
            <template v-if='tab.menuId == "30101"'>
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/home/chinaBet.png`" alt="">
            </template>
            <template v-else>
              <!-- 精选的tab图标 -->
              <img v-if='tab.index == 0'  :src="compute_img_url('hot-tab')">
              <!-- 电竞类的tab图标 -->
              <img v-else-if="[100, 101, 102, 103].includes(+tab.field1)" :src="(`${LOCAL_PROJECT_FILE_PREFIX}/image/home/hot_jx_esport_${tab.field1}.svg`)" alt="" />
              <!-- 体育类的图标 -->
              <img v-else :src=" tab.field3 && get_server_file_path(tab.field3)" alt="">
             
            </template>
            <span class="menu-name">{{ tab.menuName }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--tab模块  页面 -->
    <div :class="[tab_Index == 0 && 'quiz']">
      <div>
        <!--猜你喜欢  模块-->
        <may-also-like :from_where="101" v-if="tab_Index == 0 && GlobalAccessConfig.get_hotRecommend()" />
        <!-- 精选赛事  标题-->
        <div class="may_also_like">
          <div class="title" v-if="tab_Index == 0"> {{ i18n_t('home_popular.featured_events') }} </div>
        </div>
        <!-- 精选赛事  标题-->
        <sportsBallsTab ref="sports_balls_tab" :tab_Index="tab_Index"></sportsBallsTab>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api_home, api_analysis } from "src/api/index.js";
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
import hotFeatured from "src/base-h5/components/skeleton/home-hot/hot-featured.vue"    // 热门精选 骨架屏
import hotSchedule from "src/base-h5/components/skeleton/home-hot/hot-schedule.vue"     // 热门赛程 骨架屏
import mayAlsoLike from "src/base-h5/components/match-list/components/may-also-like.vue"   // 列表页猜你喜欢
import sportsBallsTab from "./components/sports-balls-tab.vue"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import UserCtr from "src/core/user-config/user-ctr.js";;
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { get_server_file_path } from "src/core/file-path/file-path.js";
import lodash from 'lodash'
import {  MenuData ,compute_css_obj, LOCAL_PROJECT_FILE_PREFIX} from 'src/output/index.js';
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import MatchListParams from 'src/core/match-list-h5/composables/match-list-params.js'
import {compute_img_url} from "src/output/index.js"
import { theme } from 'src/base-h5/mixin/userctr.js'

let tabList = ref([])  // tab选项卡内容
let tab_Index = ref(0) //  tab 选项卡的下标位置
let featured_loading = ref(true) // 精选骨架屏
let first_loading = ref(true) // 精选是否第一次加载骨架屏
let can_click_tab = ref(false) // 可以点击菜单tab 选项卡
let wrapper_scroll_top = ref(0) //当列表滚动时隐藏罚牌说明

let scrollBox = ref()  // scrollBox DOM

let timer2 = ref()

onMounted(() => {
  console.log(theme.value)
  timer2.value = null;
  get_list('first_loading')
  // emit 后补充
  useMittOn(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, show_hot_schedule_loading)
})

// 选项切换
watch(() => tab_Index.value, (newval) => {
  first_loading.value = false
})

// 改变背景颜色
const change_background = computed(() => {
  if (tab_Index.value != 0) {
    return 'change-background'
  }
})

// 监听div滚动 事件，传到列表页
const wrapper_scrolling = ($event) => {
  //当列表滚动时隐藏罚牌说明
  wrapper_scroll_top.value = $event.target.scrollTop;
  useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, {
    cb: (_child_this) => {
      // 回调函数 重写子类的方法值
      const scroll_top = _child_this.$refs["scroll_top"];
      if (scroll_top) {
        scroll_top.list_scroll_top = $event.srcElement.scrollTop;
        scroll_top.scroll_dom = $event.target;
      }
    }
  });
}
// 竞彩足球图片 处理
const host = (item) => {
  let url = ''
  let domain = window.BUILDIN_CONFIG.domain[window.BUILDIN_CONFIG.CURRENT_ENV][0]
  let prefix_job = window.BUILDIN_CONFIG.api.API_PREFIX_JOB
  let is_jing_cai = lodash.get(item, 'chinaBetting') == 1
  if (is_jing_cai && item.field3) {
    url = `${domain}/${prefix_job}/${item.field3}`
  }
  return url
}
// tab 初始化数据
const get_list = (first) => {
  const jing_xuan = { menuName:'精选', field3: "", index: 0 }
  first ? first_loading.value = true : first_loading.value = false
  let parameter = {
    menuType: 12, // 菜单类型  12热门赛事
    disabled: 1, // 是否移除三级菜单  默认：(null)空=展开 ,1=移除
    lang: 'JC'  // 名称简称传：JC  ，默认为空
  }
  MenuData.set_hot_tab_menu(jing_xuan)
  api_home.get_hot_list(parameter).then((res) => {
    const data = lodash.get(res, "data")
    const code = lodash.get(res, "code")
    if (code == 200 && data.length > 0) {
      // 获取精选赛事
      get_selected_match()
      // 过滤掉赛事场数为0的二级联赛菜单
      data[0].subList = data[0].subList.filter(item => item.count !== 0)

      // set_hot_list_item(data[0])

      // 加个jz_666 是用作首页 竞彩足球 背景墙用的
      data[0].subList.forEach(item => { if (item.chinaBetting) { item.jz_666 = 'jz_666' } })
      // 手动添加一个 精选tab 选项卡  i18n_t('home_popular.featured')
      tabList.value.unshift(jing_xuan)
      tabList.value = tabList.value.concat(data[0].subList)
      const get_hot_tab_item = {
        menuId: "30101",
        field2:''
      }
      tabList.value.forEach((item, index) => {
        item.index = index
        if (get_hot_tab_item && (get_hot_tab_item.menuId == item.menuId || get_hot_tab_item.field2 == item.field2)) {
          // tab_Index.value = index
          // 滑动tab动画操作
          clearTimeout(timer2.value)
          timer2.value = setTimeout(() => {
            scrollBox.value && tab_move2(index, scrollBox.value, true)
            // 初始选择竞足
            // change_tab(tabList.value[index], index)
          }, 80);
        }
      })
    } else {
      featured_loading.value = false
    }
  }).catch((err) => {
    console.error(err)
    featured_loading.value = false
  })
}

/**
 * @description 获取精选赛事
 */
const get_selected_match = () => {
  const parameter = MatchMeta.get_base_params()
  api_analysis.get_match_home_page_handpick(parameter).then((res) => {
    MatchMeta.get_match_mids(res.data)
    // MatchMeta.set_match_default_properties(res.data)
    // 设置联赛赛事
    let timer = setTimeout(() => {
      MatchMeta.set_tid_map_mids()
      clearTimeout(timer)
      timer = null
    }, 300)
  })
}

//判断是否要清空投注项
const check_clear_bet = (obj) => {
  let flag = false
  const dj_csid_list = [100, 101, 102, 103]
  lodash.forIn(BetData.bet_obj, function (item, key) {
    const csid = lodash.get(item, 'bs.csid')
    if (dj_csid_list.includes(obj.field1 * 1)) {//切换的菜单是电竞
      if (!dj_csid_list.includes(csid * 1)) {
        flag = true
      }
    } else {//切换的菜单是普通赛事
      if (dj_csid_list.includes(csid * 1)) {
        flag = true
      }
    }
  })
}
// 菜单切换 is_self 是否手动触发
// TODO: 竞足还没有
const change_tab = (item, index, is_self) => {
  // 当前index 赋值
  tab_Index.value = index;
  MenuData.set_hot_tab_menu(item)
  if (item.index === 0) return get_selected_match()
  // 筛选对应联赛赛事
  MatchMeta.filter_hot_match_by_tid(item.field2)
  // 如果是电竞赛事，需要设置菜单类型
  if ([100, 101, 102, 103].includes(+item.field1)) {
    MenuData.set_menu_type(3000)
  } else {
    MenuData.set_menu_type('')
  }
  // 是否可以点击tab 选项卡
  if (is_self) {
    if (tab_Index.value == index) return
  }
  check_clear_bet(item)
  // set_hot_tab_item(item)
  // 滑动tab动画操作
  tab_move2(index, scrollBox.value)

  //  调用列表页接口
  // useMittEmit(MITT_TYPES.EMIT_TAB_HOT_CHANGING);
  // 如果不是第一个选项卡，则调用 下边方法，初始化数据
  useMittEmit(MITT_TYPES.EMIT_SET_SPORTS_BALLS_TAB)
}
// 展示loading
const show_hot_schedule_loading = (is_true) => {
  if (is_true) {
    featured_loading.value = true
  } else {
    featured_loading.value = false
  }
}
// 刷新列表数据
const refresh_list = () => {
  useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    text: "footer-refresh"
  });
}


onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, show_hot_schedule_loading).off
  useMittOn(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, refresh_list).off
  if (timer2.value) {
    clearTimeout(timer2.value)
    timer2.value = null
  }
})

</script>

<style lang="scss" scoped>
.popular-hot-pages {
  .title {
    height: 0.35rem;
    line-height: 0.35rem;
    padding-left: 0.24rem;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: 700;
    position: relative;
    background-color: var(--q-gb-bg-c-17);
    &:before {
      content: "";
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.1rem;
      border-radius: 1.5px;
    }
  }

  .quiz {
    position: fixed;
    top: 1.12rem;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 3.78rem;

    >div {
      height: 100%;
      overflow-y: auto;
      width: 100%;
      overflow-x: hidden;
    }
  }

  .hot-pages-tabs {
    .tabs-bar {
      .tabs-bar-nav {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        margin-top: 0.1rem;
        height: 0.65rem;
        padding-top: 0.05rem;
        padding-left: 0.12rem;

        .tabs-tab {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: fit-content;
          padding-right: 0.38rem;
          height: 100%;
          position: relative;
          width: 0.5rem;

          .menu-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: .7rem;
          }

          &:nth-child(1) {
            padding-left: 0.15rem;

            // > img {
            //   padding: 0.03rem !important;
            // }

            &.tabs-active {
              >img {
                // padding: 0.05rem !important;
              }
            }
          }

          &:last-child {
            padding-right: 0.2rem;
          }

          >img {
            width: 0.22rem;
            height: 0.22rem;
            margin-bottom: 0.04rem;
            border-radius: 50%;
            padding: 0.02rem;

          }

          >span {
            font-family: PingFangSC-Medium;
            font-size: 0.1rem;
            text-align: center;
          }

          &.tabs-active {

            >img {
              width: 0.22rem;
              height: 0.22rem;
              z-index: 11;

              &.hot_tab_DJ {
                --per: -0.3903rem;
                background: var(--q-color-com-img-bg-139) no-repeat 0 0/0.33rem 23.06rem;
              }
            }
          }

        }
      }
    }
  }
}</style>
