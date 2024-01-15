<template>
  <div class="home-page">
    <!-- tab 切换 -->
    <div class="header_tabs">
      <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
        <q-tab name="featured" :label="`${i18n_t('ouzhou.match.featured')}`" />
        <q-tab name="top_events" :label="`${i18n_t('ouzhou.match.top_events')}`" />
      </q-tabs>
    </div>
    <!-- 主内容区 -->
    <div class="home_content" :visible="false">
      <q-tab-panels v-model="tabValue" animated>
        <!-- featured page -->
        <q-tab-panel name="featured">
          <section ref="container" class="section-content"  @scroll="handle_container_scroll">
            <!-- 时间赛事 -->
            <template v-if="time_events.length > 0">
              <HeaderTitle :title="i18n_t('ouzhou.match.15_mins')"></HeaderTitle>
              <TimeEvents :time_events="time_events" />
            </template>
            <!-- 特色赛事 -->
            <template v-if="featured_matches.length > 0">
              <HeaderTitle :title="i18n_t('ouzhou.match.featured_events')"></HeaderTitle>
              <FeaturedMatches :featured_matches="featured_matches" />
            </template>
            <!-- 赛事列表 -->
           <template v-if="play_matchs.length > 0">
              <HeaderTitle :title="i18n_t('ouzhou.match.inplay')"></HeaderTitle>
              <MatchPlay :play_matchs="play_matchs" />
           </template>
            <!-- 特色赛事 -->
            <!-- <template v-if="featured_matches.length > 0">
              <HeaderTitle title="ATP/WTA Rome"></HeaderTitle>
              <FeaturedMatches :featured_matches="featured_matches" />
            </template> -->
            <!-- 5大联赛 -->
            <template v-if="five_league_match.length > 0">
              <q-intersection @visibility="on_visibility">
                <HeaderTitle :title="i18n_t('ouzhou.match.top_leagues')"></HeaderTitle>
              </q-intersection>
              <MatchLeagues :five_league_match="five_league_match"/>
            </template>
          </section>
        </q-tab-panel>
        <!-- top Events page -->
        <q-tab-panel name="top_events">
          <scroll-list menu_type="5000" v-if="MenuData.top_events_list.length" :current_mi="state.current_mi" :menuList="MenuData.top_events_list" @changeMenu="changeMenu"/>
          <!-- 赛事列表 -->
          <section class="match-page-section">
            <MatchContainer />
          </section>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!-- 回到顶部按钮组件 -->
    <ScrollTop :list_scroll_top="scroll_top" @back-top="goto_top" />
  </div>
</template>
 
<script setup> 
import { onMounted, ref ,reactive, onUnmounted, nextTick, provide } from "vue";
import { watch } from "vue";
import lodash from 'lodash'
import TimeEvents from './components/time-events.vue'
import HeaderTitle from './components/header-title.vue'
import MatchLeagues from './components/match-leagues.vue'
import FeaturedMatches from './components/feature-matches.vue'
import MatchPlay from './components/match-play.vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import * as ws_message_listener from "src/core/utils/common/module/ws-message.js";;
import { api_match } from "src/api/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { i18n_t, into_home_event } from "src/output/index.js"
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import ScrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchDataBasel5minsH5, MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5,
  MatchDataWarehouse_ouzhou_PC_hots_List_Common as MatchDataBaseHotsH5, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, MatchDataWarehouse_ouzhou_PC_in_play_List_Common as MatchDataBaseInPlayH5 } from "src/output/index.js";

provide('get_hots_data', () => {
  get_ouzhou_home_data()
})

let message_fun = null
let message_fun_connect = null
let handler_func = null
const is_first = ref(false)
const container = ref(null)
const scroll_top = ref(0)
const play_matchs = ref([])
const time_events = ref([])
const five_league_mids = ref([])
const featured_matches = ref([])
const five_league_match = ref([])
const tabValue = ref(MenuData.home_menu || 'featured');
const state = reactive({
    current_mi:"",
})


/**
 * 球种点击
 */
const changeMenu = (item) =>{
  state.current_mi = item.mi;
  MenuData.set_menu_mi(item.mi);
  // MatchMeta.get_top_events_match(item.csid)
  get_top_events_match(item.csid)
}
const set_init_sport = (val) =>{
  if(val=="featured"){
    MenuData.set_menu_mi('101');
  }else{
    MenuData.set_menu_mi(MenuData.menu_mi.value || '101');
    state.current_mi = MenuData.menu_mi.value ||MenuData.top_events_list[0]?.mi;
  }
}
let timer = 0;
onMounted(async () => {
  // 发送进入首页埋点消息
  clearTimeout(timer)
  timer = setTimeout(() => {
    lodash.get(UserCtr,'user_info.userId') && into_home_event();
  }, 2000);
  if (tabValue.value === 'top_events') {
    // 设置 元数据计算 流程
    state.current_mi = MenuData.top_events_list?.[0]?.mi;
    get_top_events_match(MenuData.top_events_list?.[0]?.csid)
  } else { 
    MenuData.set_current_lv1_menu(1);
    set_init_sport(tabValue.value)
    set_default_home_data()
    get_ouzhou_home_data()
    set_default_home_hots()
    get_ouzhou_home_hots()
    get_five_league_matchs()
  }

  // 接口请求防抖
  handler_func = lodash.debounce(({ cmd, data }) => {
    handle_webscoket_cmd(cmd, data)
  }, 1000)
  // 删除赛事防抖
  const handler_remove = lodash.debounce(() => {
    MatchMeta.set_is_ws_trigger(true)
    if (tabValue.value === 'featured') {
      get_ouzhou_home_data()
    } else {
      get_top_events_match(MenuData.menu_csid)
    }
  }, 1500)

  // 增加监听接受返回的监听函数
  message_fun = ws_message_listener.ws_add_message_listener((cmd, data) => {
    // 赛事删除
    if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
      const { cd: { mid = '', mhs = 0, mmp = 1, ms = 110 } } = data
      if (mhs == 2 || mmp == '999' || !MatchMeta.is_valid_match(ms)) {
        handler_remove()
      }
    } else {
      handler_func({ cmd, data })
    }
  })

  // 监听ws断连
  message_fun_connect = useMittOn(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT,(ws_status, ws_status_old)=>{
    // ws_status 链接状态变化 (0-断开,1-连接,2-断网续连状态)
    if(ws_status != 1) MatchDataBaseH5.scmd_c8_ws_reconnect()
  }).off
})

/**
 * @description 处理 ws
 */
 const handle_webscoket_cmd = (cmd, data) => {
  // console.log('wswswswswswsws-cmd:', cmd, data)
  if (['C109', 'C104'].includes(cmd)) {
    const { cd = [] } = data
    if (cd.length < 1) return
    // 欧洲版 二期  只展示 足球、篮球、网球， 球种菜单放开的同时这里也需要增加
    const item = cd.find(t => [1,2,5].includes(+t.csid) )
    if (item) {
      MatchMeta.set_is_ws_trigger(true)
      if (tabValue.value === 'featured') {
        get_ouzhou_home_data()
      } else {
        get_top_events_match(MenuData.menu_csid)
      }
    }
  }

  // 调用 mids  接口
  if (['C303', 'C114'].includes(cmd)) {
    if (five_league_mids.value.length > 0) {
      // MatchMeta.get_match_base_hps_by_mids({ mids: five_league_mids.value.toString(), warehouse: MatchDataBaseFiveLeagueH5 })
    }
  }
}

// 设置默认数据
const set_default_home_data = () => {
  const res = MatchMeta.get_default_ouzhou_home_data()
  handle_ouzhou_home_data(res)
}

// 获取首页数据
const get_ouzhou_home_data = async () => {
  const res = await MatchMeta.get_ouzhou_home_data()
  handle_ouzhou_home_data(res)
}

const handle_ouzhou_home_data = (res) => {
  const { p15_list, dataList } = res
  // 15 分
  if (p15_list.length > 0) {
    const arr_p15 = p15_list.map(t => {
      const match = MatchDataBasel5minsH5.get_quick_mid_obj(t?.mid)
      return match
    })
    time_events.value = arr_p15.filter(t => t?.mid)
  }
  // 滚球赛事
  if (dataList.length > 0) {
    const arr_play_matchs = dataList.map(t => {
      const match = MatchDataBaseInPlayH5.get_quick_mid_obj(t?.mid)
      return match
    })
    play_matchs.value = arr_play_matchs.filter(t => t?.mid)
  }
  set_ws_active_mids()
}

// 设置默认数据
const set_default_home_hots = () => {
  const res = MatchMeta.get_default_ouzhou_home_hots()
  handle_ouzhou_home_hots(res)
}

// 获取首页数据
const get_ouzhou_home_hots = async () => {
  const res = await MatchMeta.get_ouzhou_home_hots()
  handle_ouzhou_home_hots(res)
}

// 获取首页热门赛事
const handle_ouzhou_home_hots = async (data) => {
  // 热门赛事
  if (data && data.length > 0) {
    const arr_data = data.map(t => {
      const match = MatchDataBaseHotsH5.get_quick_mid_obj(t?.mid)
      const { home_score, away_score } = MatchUtils.get_match_score(match)
      return {
        ...match,
        home_score, 
        away_score
      }
    })
    featured_matches.value = arr_data.filter(t => t?.mid)
    set_ws_active_mids()
  }
}

/**
 * @description 监听可视区
 */
const on_visibility = (val) => {
  if (val && !is_first.value) {
    is_first.value = true
    MatchMeta.get_match_base_hps_by_mids({mids: five_league_mids.value.toString(), warehouse: MatchDataBaseFiveLeagueH5})
    set_ws_active_mids()
  }
}

/**
 * @description 获取五大联赛赛事
 */
 const get_five_league_matchs = async () => {
  const list = await MatchMeta.get_five_leagues_list()
  if (list && list.length > 0) five_league_match.value = list.map(t => {
    five_league_mids.value.push(t?.mid)
    const match = MatchDataBaseFiveLeagueH5.get_quick_mid_obj(t?.mid) || t
    return match
  })
}

// tabs 切换
const on_update = (val) => {
  MenuData.set_home_menu(val);
  MatchDataBaseH5.set_active_mids([])
  set_init_sport(val)
  if (val === 'featured') {
    get_ouzhou_home_data()
    get_five_league_matchs()
  } else {
    // 设置 元数据计算 流程
    state.current_mi = MenuData.top_events_list?.[0]?.mi;
    get_top_events_match(MenuData.top_events_list?.[0]?.csid)
  }
}

/**
 * @description 获取热门赛事
 */
const get_top_events_match = (csid = '1') => {
  // 设置 元数据计算 流程
  // MatchMeta.set_origin_match_data({ is_match: false })
  MatchResponsive.set_is_compute_origin(true)
  state.current_mi = MenuData.top_events_list?.[0]?.mi;
  MatchMeta.get_top_events_match(csid)
  let timer = setTimeout(() => {
    MatchMeta.get_match_base_hps_by_mids({})
    clearTimeout(timer)
    timer = null
  }, 500)
}

/**
 * @description 设置 ws 激活的 mids 
 */
const set_ws_active_mids = () => {
  const total_matchs = [].concat(five_league_match.value, time_events.value, featured_matches.value, play_matchs.value)
  const total_mids = lodash.uniq(total_matchs.filter(t => t.mid).map(t => t.mid))
  const length = lodash.get(total_mids, 'length', 0)
  length > 0 && MatchDataBaseH5.set_active_mids(total_mids)
}

const handle_container_scroll = lodash.debounce(($ev) => {
  scroll_top.value = $ev.target.scrollTop
}, 100)

/**
 * @description: 列表回到顶部
 */
const goto_top = () => {
  container.value && container.value.scrollTo({ top: 0, behavior: 'smooth' });
}

onUnmounted(() => {
  // 组件销毁时销毁监听函数
  MatchDataBaseH5.set_active_mids([])
  ws_message_listener.ws_remove_message_listener(message_fun)
  message_fun = null
  message_fun_connect()
  clearTimeout(timer)
})

</script>
 
<style scoped lang="scss">
.home-page{
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .league-title{
    position: relative;
    height: 30px;
  }
  // padding-bottom: 56px;
  .header_tabs{
    // border-bottom: 2px solid var(--q-gb-bd-c-1);
    border-bottom: 2px solid #FF7000;

    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background-color: var(--q-gb-bg-c-2);
        padding: 0 10px;
        background-repeat: no-repeat;
        background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
        background-size: contain;
        background-position: right;
        .q-tab{
          flex: none;
        }
        .q-ripple{
          display: none;
        }
      }
      .q-tab__label{
       color: var(--q-gb-t-c-3); 
        text-transform: capitalize;
        font-weight: 600;
      }
      .q-tab--active .q-tab__label{
        //color: #FF7000;
        color: var(--q-gb-t-c-1);
      }
      .q-tab__indicator{
        height: 3px;
        //background: #FF7000;
        background-color: var(--q-gb-bg-c-1);
      }
    }
  }
  .home_content{
    flex: 1;
    height: 0;
    .q-tab-panels{
      height: 100%;
      .q-tab-panel{
        padding: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .section-content{
          height: 100%;
          overflow-y: auto;
          position: relative;
        }
        .match-page-section{
          height: 0;
          flex: 1;
          overflow-y: hidden;
          position: relative;
          .match-list-container{
            height: 100%;
            background-color: var(--q-gb-bg-c-2) !important;
            :deep(.scroll-wrapper){
              // background-color: var(--q-gb-bg-c-2) !important;
              .s-w-item{
                background-color: var(--q-gb-bg-c-2) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
