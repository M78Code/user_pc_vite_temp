<!--
 * @Description: 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
-->
<template>
  <div class="match-main no-padding-bottom" ref="match_main">
    <!--赛事列表-->
    <div class="match-list-container"
      ref="match_list_container"
      :class="{
        'zaopan':[4,11,28,3000].includes(+menu_type) && invok_source != 'home_hot_page_schedule',
        'guanjun':[100].includes(+menu_type),
        'level_four_menu': menu_type == 28 && [1001,1002,1004,1011,1010,1009].includes(get_curr_sub_menu_type),
        'detail_match_list':['detail_match_list','home_hot_page_schedule'].includes(invok_source),
        'jingzu':menu_type == 30,
        'jinri':menu_type == 3,
        'esport':3000 == menu_type
      }"
      @scroll="wrapper_scroll_handler"
    >
      <!--缝隙 不通层级 遮罩 存在渲染偏差， 边界 双线 或者 侵蚀问题-->
      <div class="gap" v-if="on_match && menu_type!=3000" :class=" {'zaopan':[4,11,28,3000].includes(+menu_type)}"/>
      <!-- 跳转到其他场馆的banner图 和猜你喜欢-->
      <tiaozhuan-panel v-if="calc_show"></tiaozhuan-panel>
      <!-- 列表骨架屏 -->
      <SList v-if="show_skeleton_screen" :loading_body="true"/>
      <!-- 列表页主内容 -->
      <match-list
        ref="match_list"
        :matchCtr="matchCtr"
        :menu_type="menu_type"
        :data_get_empty="match_is_empty"
        :source="invok_source?invok_source:'match_main'"
        :window_scrolly="window_scrolly"
        :match_list_wrapper_height="match_list_wrapper_height"
        @unfold_changed="unfold_changed_handle"
        @change_favorite_state="change_favorite_state">
        <!--        @unfold_league="unfold_league_handle"-->
      </match-list>
      <!-- 到底了容器原加载更多容器-->
      <div class="loading-more-container" v-if="!match_is_empty && _.size(matchCtr.match_list_data_sources)>3" 
           :class="{home_hot:invok_source == 'home_hot_page_schedule'}">
        <div style="color:#AAAEB8;font-size:.12rem;">
          {{$root.$t("scroll_wrapper.is_footer")}}
        </div>
      </div>
      
      <!-- 回到顶部按钮组件 -->
      <scroll-top
        v-show="!get_is_show_menu && list_scroll_top > 0"
        ref="scroll_top"
        :list_scroll_top="list_scroll_top"
        @back-top="back_top"
      />
    </div>
  </div>
</template>
 
<script setup>
import { computed, onBeforeMount, onUnmounted, onMounted, watch, onDeactivated, onActivated, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useMittOn } from  "src/core/mitt"
import * as MITT_KEY from '../../core/mitt/mitt-keys'

const props = defineProps({
  invok_source: String,
  wrapper_scroll_top: Number
})

const route = useRoute()
const router = useRouter()
const enter_time = ref('')
const match_main = ref(null)
const match_list = ref(null)
const scroll_top = ref(null)
const match_list_container = ref(null)
const emitters = ref({})

const ws_invoke_key = ref('match_main')
// 获取赛事列表接口超时setTimeout 6000
const requesting_timeout = ref(null)
// 赛事列表无数据
const match_is_empty = ref(false)
// 赛事操作工具类
const matchCtr = ref(null)
// 赛事列表接口请求中提示
const is_data_requesting = ref(true)
//窗口向上滚动距离
const window_scrolly = ref(0)
//上次页脚菜单id
const prev_footer_sub_menu_id = ref(null)
//正在切换新版与标准版
const newer_standard_changing = ref(false)
//投注栏弹层显示非0否则0
const local_bet_status = ref(0)
//离开本页时的电竞id
const prev_export_csid = ref('')
//新手版1专业版2,本地组件存储
const standard_edition_type = ref(0)
// 赛事列表滑动高度
const list_scroll_top = ref(0)

const timer_super6 = ref(null)
const timer_super7 = ref(null)
const timer_super9 = ref(null)
const subscription_timer1 = ref(null)

onBeforeMount(() => {
  init_router_info()
  // 进入页面时记录时间戳
  enter_time.value = Date.now()
})
onMounted(() => {
  if(props.invok_source){
    ws_invoke_key.value = props.invok_source;
  }
  // 初始化赛事列表操作工具类
  matchCtr.value = new MatchCtr(this);
  standard_edition_type.value = get_newer_standard_edition;
  if(get_newer_standard_edition == 2){
    newer_standard_changing.value = true;
  }else{
    sliding_can_trigger_process_distance = 500
  }
  // 记录埋点，进入列表页
  $utils.gtag_view_send('H5_match', '/match')
  // 详情精选赛事页需清空map折叠状态
  set_collapse_map_match({})
  // 事件初始化
  event_init()
})

// 详情若无热门推荐赛事，则隐藏相应内容
watch(() => match_is_empty, () => {
  if (props.invok_source === 'detail_match_list' && is_empty) {
    $root.$emit(MITT_KEY.EMIT_HIDE_DETAIL_MATCH_LIST, true)
  }
})

// 早盘时，并且是 足球时，执行下边操作
watch(() => get_current_sub_menuid, () => {
  if(menu_type == 4 && val == '40303'){
    clearTimeout(subscription_timer1.value)
    subscription_timer1.value = setTimeout(()=>{
      // 订阅新赛事列表
      subscription();
    },3000)
  }
})

// 罚牌说明展开后会跟随列表滑动，且切换页面再次进入依旧显示在列表页
watch(() => props.wrapper_scroll_top, () => {
  window_scrolly.value = c;
})

// 其他页改变取消收藏, 如果当前为收藏模式则移除该赛事
watch(() => get_match_id_bet_success, () => {
  if (show_favorite_list) {
    return
  }
  if(value){
    let mid = value.split('-')[0];
    let is_collect = value.split('-')[1];
    let found_index = _.findIndex(matchCtr.value.list,{mid});

    if(found_index > -1){
      let param = {
        index: found_index,
        item: "mf",
        bool: is_collect == 1,
        number: is_collect == 1 ? 1 : -1
      };
      change_favorite_state(param);
    }
  }
})

// 菜单类型变化时，如果是收藏则以动画方式显示或隐藏页面
watch(() => menu_type, () => {
  // 切换一级菜单时记录最新时间戳
  enter_time = Date.now()
  // 切换一级菜单时 goto_detail_matchid置为空
  set_goto_detail_matchid('')
  // matchCtr.value.clearData();
})

// 筛选过滤弹层消失
watch(() => get_show_match_filter, () => {
  if(!flag){
    set_goto_detail_matchid('')
    subscription();
  }
})

// 页脚子菜单
watch(() => footer_sub_menu_id, () => {
  if((prev_footer_sub_menu_id.value != curr && curr == 114) ||
  (prev_footer_sub_menu_id.value != curr && prev_footer_sub_menu_id.value == 114)
  ){
    matchCtr.value.match_list_data_sources.forEach(item => {
      score_switch_handle(item);
    });
    matchCtr.value.list.forEach(item => {
      score_switch_handle(item);
    });
  }
  prev_footer_sub_menu_id.value = curr;
})

// 新手版标准版切换
watch(() => get_newer_standard_edition, () => {
  if(menu_type == 900){ //虚拟体育
    return;
  }
  // 如果是简版
  if(n == 1){
    sliding_can_trigger_process_distance = 500
  }
  standard_edition_type.value = get_newer_standard_edition;
  run_process_when_need_recompute_container_list_when_scroll(
    false,
    {update_type:'standard_simple_change'}
  );
})

// 投注栏弹层显示非0否则0
watch(() => get_bet_status, () => {
  if(c_status == 0){
    const has_pre = _.findKey(get_bet_obj, function(o) { return o.show_pre })
    if(has_pre){
      //当投注框收起时，清空预约相关信息
      let temp_bet_obj = _.cloneDeep(get_bet_obj)
      temp_bet_obj[has_pre].show_pre = false
      delete temp_bet_obj[has_pre].pre_odds
      delete temp_bet_obj[has_pre].pre_market_value
      delete temp_bet_obj[has_pre].min_odds
      set_pre_market_data([])
      set_bet_obj(temp_bet_obj)
    }
    clearTimeout(timer_super6.value);
    timer_super6.value = setTimeout(() => {
      local_bet_status.value = c_status;
    },400);
  }
  else{
    local_bet_status.value = c_status;
  }
})

// 筛选过滤弹层消失
watch(() => get_show_match_filter, () => {
  // 切换球种时，记录最新时间戳
  enter_time = Date.now()
  // 切换球种时 goto_detail_matchid置为空
  set_goto_detail_matchid('')
  // 切换球种时 清空赛种折叠状态
  set_collapse_csid_map({})
})

// 筛选过滤弹层消失
watch(() => matchCtr.list, () => {
  // 进入列表后，若preload_animation_url为未缓存状态，则执行动画资源预加载逻辑
  if (!get_preload_animation_url && match_list.length) {
    // 通过遍历列表，查找动画状态mvs > 0（可播放）的赛事mid，然后获取相应动画加载资源
    for (let i = 0, len = match_list.length; i < len; i++) {
      if (match_list[i].mvs > 0) {
        const params = {
          mid: match_list[i].mid,
          type: 'Animation'
        };
        send_gcuuid = uid();
        params.gcuuid = send_gcuuid;
        // 预加载动画所需资源文件
        api_common.videoAnimationUrl(params).then((res) => {
          const { data } = res
          if(send_gcuuid != res.gcuuid) return;
          if(!_.get(data,'animationUrl')){
            return
          }
          let animationUrl = ''
          //足篮棒网使用3.0动画  其他使用2.0
          if([1,2,3,5].includes(+match_list[i].csid)){
            let animation3Url = data.animation3Url || []
            animation3Url.forEach( item =>{
              if(item.styleName.indexOf('day') >= 0){
                animationUrl = item.path
              }
            })
          }
          animationUrl = animationUrl || data.animationUrl
          data.animation_src = animationUrl.replace(/https?:/, "") // 动画
          data.video_src = ''
          data.referUrl = data.referUrl && (data.referUrl.replace(/http:|https:/,'')) // 视频
          data.referUrl = `${location.protocol}${data.referUrl}`;

          $root.$emit(MITT_KEY.EMIT_SET_PRE_VIDEO_SRC, data)
          set_preload_animation_url(true)
        })
        // 获取相应动画加载资源后跳出循环
        break
      }
    }
  }
})

// TODO: 其他模块得 store  待添加
// mixins: [ main_menu_mixin,websocket_data, constant, msc_bw3, match_list_wrap_mixin,match_main_mixin, betting,router_scroll_y_mixin],
// ...mapMutations([
//   "set_pre_market_data", //设置所有盘口信息
//   "set_hide_skeleton_screen", //设置所有盘口信息
//   "set_list_scroll_top_iconshow", // 设置滚动图标显示
//   "set_current_menu", // 设置当前选中的主菜单
//   "set_sort_type",
//   "set_last_time_sub_menu_type", // 设置上次子菜单
//   "set_filter_list",  // 设置联赛过滤
//   "set_prev_menu_type",  // 上一次筛选位置
//   "set_menu_type",    // 设置当前主菜单menu_type值
//   "set_md",           // 设置
//   "set_goto_list_top", // 设置赛事列表返回顶部
//   "set_goto_detail_matchid",  //设置去详情页的赛事id
//   "set_details_item",  //设置玩法集tab 的选中项
//   "set_req_match_list_params", //设置请求赛事列表接口的请求参数
//   "set_collapse_map_match",    //折叠的赛事
//   "set_newer_standard_edition",    //新手版1 标准版2
//   "set_n_s_changed_loaded",         //新手版标准版切换时加载赛事列表完成
//   'set_date_menu_curr_i',     // 当前选中日期菜单索引
//   'set_current_esport_csid',    // 电竞游戏csid
//   'set_curr_third_menu_id',   // 三级菜单id
//   'set_details_changing_favorite',  // 改变了收藏状态
//   'set_global_is_back_match_list',  // 详情， 赛果，虚拟体育返回到列表也的时候不更新数据，保持上次的菜单数据
//   'set_match_top_map_dict',   // 赛事对象对应的dom top映射
//   'set_secondary_unfold_map',   // 次要玩法展开映射
//   'set_img_error_map_mid',    // 图标出错与mid映射
//   'set_user',    // 用户信息,用户金额,userId 需要监听变化
//   'set_last_route_info',  // 记录上一次路由信息
//   'set_collapse_csid_map',  // 赛种一键折叠状态map
//   'set_allow_short_scroll',  // 短距离滚动标识
//   'set_preload_animation_url',  // 更新预加载动画所需资源文件状态
// ]),
// ...mapGetters({
//   get_is_champion:'get_is_champion',
//   get_sport_all_selected:'get_sport_all_selected',
//   get_goto_detail_matchid:'get_goto_detail_matchid',
//   sort_type: 'get_sort_type',
//   get_current_menu: "get_current_menu",     // 当前选中的主菜单
//   get_uid: "get_uid",                       // 用户id
//   get_user:"get_user",
//   get_user_token:'get_user_token',
//   get_current_sub_menuid: 'get_current_sub_menuid', // 当前选中的二级菜单id
//   get_search_txt: "get_search_txt",
//   get_filter_list: "get_filter_list",       // 联赛筛选条件
//   get_last_time_sub_menu_type: "get_last_time_sub_menu_type", // 上一次选中的二级菜单id
//   menu_type: "get_menu_type",                       // 当前主菜单menu_type
//   get_changed_favorite: "get_changed_favorite",     // 是否切换到收藏
//   get_bet_status:'get_bet_status',  //投注框状态
//   show_favorite_list:'get_show_favorite_list', // 显示收藏弹窗
//   get_collapse_map_match:"get_collapse_map_match",  // 赛事列表联赛折叠映射对象
//   get_collapse_csid_map:"get_collapse_csid_map",  // 赛事列表赛种折叠映射对象
//   get_show_match_filter:"get_show_match_filter",  // 显示筛选頁面
//   footer_sub_menu_id:"get_footer_sub_menu_id",    // 页脚子菜单id
//   get_newer_standard_edition:"get_newer_standard_edition",//新手版标准版 1 2
//   get_lang:"get_lang",
//   get_detail_data:"get_detail_data",  // 详情页的数据
//   get_details_changing_favorite:"get_details_changing_favorite",  // 改变了收藏状态
//   get_md:"get_md",    // 早盘日期的参数    早盘  和   串关 都有加
//   get_hot_tab_item:"get_hot_tab_item",    // 首页 热门当前选中的菜单
//   get_hot_list_item:"get_hot_list_item",  // 首页 热门菜单集合
//   get_is_show_menu:"get_is_show_menu",    // 右侧设置菜单显示时 , 不显示骨架屏
//   get_v_pre_menu_type:'get_v_pre_menu_type',    // 跳转虚拟体育之前选中的主菜单menu_type 用于虚拟体育返回列表页恢复主菜单选择项
//   get_curr_third_menu_id:'get_curr_third_menu_id',  // 当前选中的三级菜单id
//   get_level_four_menu:'get_level_four_menu',  // 当前选中的三级菜单id
//   get_prev_menu_type:"get_prev_menu_type",    // 赛事列表筛选逻辑使用的menu_type
//   get_secondary_unfold_map:"get_secondary_unfold_map",  // 次要玩法展开映射
//   get_match_id_bet_success:"get_match_id_bet_success",  // 投注成功的赛事id
//   get_list_scroll_top:"get_list_scroll_top",
//   get_theme:"get_theme",
//   get_last_route_info: 'get_last_route_info',
//   get_sub_menu_list: 'get_sub_menu_list',
//   get_curr_sub_menu_type: 'get_curr_sub_menu_type',
//   get_allow_short_scroll: 'get_allow_short_scroll',
//   get_preload_animation_url: 'get_preload_animation_url',
// }),

const calc_show = computed(() => {
  return menu_type == 1 && !show_favorite_list && !match_is_empty.value && route.name != 'home' && props.invok_source != 'detail_match_list'
})

const on_match = computed(() => {
  return window.location.hash.includes('match')
})

// 显示骨架屏
const show_skeleton_screen = computed(() => {
  let r = true;
  // 详情页，首页
  let special_source = ['detail_match_list','home_hot_page_schedule'].includes(props.invok_source);
  r = (is_data_requesting.value ) && !special_source;
  return r
})

const init_router_info = () => {
   // 由首页进入，就不在此处初始化
   if (from.name !== 'home') {
    _event_init();
  }
  let match_total = _matchCtr.value && _matchCtr.value.list.length;

  if(!_get_details_changing_favorite && //不是详情页更改过赛事收藏到了列表也就不用重新拉数据r
    match_total && ['match_result','virtual_sports'].includes(from.name)){ // 详情， 赛果，虚拟体育返回到列表也的时候不更新数据，保持上次的数据r
    if(['virtual_sports'].includes(from.name)){
      _set_current_esport_csid(_prev_export_csid.value);

      //新手版或专业版在其他页面被改变,需要重新计算列表赛事dom 赛事列表是专业版，跳到虚拟体育被手动改新手版rn 重新计算dom r
      if(_standard_edition_type.value != _get_newer_standard_edition){
        _run_process_when_need_recompute_container_list_when_first_load_list();
        _standard_edition_type.value = _get_newer_standard_edition;
      }
    }
    //赛果精选赛事列表与赛事列表是同一个组件,所以滚动逻辑有影响
    if(['category','match_result'].includes(from.name)){
      _run_process_when_need_recompute_container_list_when_first_load_list();
    }
    _set_global_is_back_match_list(Math.random())
    return;
  }
  _set_details_changing_favorite(0);    //详情页更改过赛事收藏 列表需重置到0 r
  _set_collapse_map_match({});         //当前列表也重置到联赛折叠状态r

  _set_secondary_unfold_map({}); //次要玩法折叠状态置空r
  clearTimeout(_timer_super7.value);
  _timer_super7.value = setTimeout(() => {
    router.push({ query: {} });   // 去掉其他传过来的当前路由参数 还在当前页刷新一下r
  },200);
}

const back_top = () => {
  match_list_container.value && match_list_container.value.scrollTo(0,0)
}
/**
 * @description:  事件初始化
 */
  const event_init = () => {
  // 详情页的视频预加载
  utils.load_video_resources(get_uid, 'is_details_page')
  // 不让浏览器记住上次的滚动位置
  if ('scrollRestoration' in History){
    history.scrollRestoration = 'manual'
  }
  // 移除相关事件监听
  off_listeners()
  // 绑定相关事件监听
  on_listeners()
  //获取列表页赛事数据
  match_detail_m_list_init();
  // 图标出错与mid映射，初始化为空
  set_img_error_map_mid({});
  window.vue.scroll_list_wrapper_by = scroll_list_wrapper_by;
  // 去除参数
  if (!location.search.includes('keep_url')) {
    history.replaceState(null, '', `${location.pathname}${location.hash}`)
  }
  // set_hide_skeleton_screen(true)
}
/**
 * @Description 次要玩法展开加载数据
 * @param {Object} match 赛事
 * @param {String} key 指定的hps
*/
const special_hps_load_handle = (match,key) => {
  if(['category'].includes(route.name)){
    return;
  }
  if(matchCtr.value.mid_obj[match.mid] && match[key] && match[key].length){
    matchCtr.value.mid_obj[match.mid][key] = match[key];
    matchCtr.value.addMatchInfo(match);
    SCMD_SPECIAL_C8(1,'list',key,match);
  }
}
const match_detail_m_list_init = () => {
  // 赛果详情页的列表，数据请求
  if(['detail_match_list'].includes(props.invok_source)){
    // 列表页全局获取 请求参数
    get_match_data_list();
  }
}
const destroy_handle = () => {
  sendSocketCloseCmd();
  del();
  matchCtr.value.init()
  set_last_time_sub_menu_type('')

  clear_timer()
  off_listeners()
}
// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [
      'timer_super6',
      'subscription_timer1',
      'timer_super7',
      'timer_super9',
  ]

  for (const timer of timer_arr) {
    clearTimeout(this[timer])
    this[timer] = null
  }
}
// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn.on(MITT_KEY.EMIT_MENU_CHANGE_FOOTER_CMD, footer_event).off,
    emitter_2: useMittOn.on(MITT_KEY.EMIT_MAIN_MENU_CHANGE,main_menu_change).off,
    emitter_3: useMittOn.on(MITT_KEY.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE,before_load_third_menu_handle).off,
    emitter_4: useMittOn.on(MITT_KEY.EMIT_SPECIAL_HPS_LOADED,special_hps_load_handle).off,
    emitter_5: useMittOn.on(MITT_KEY.EMIT_COUNTING_DOWN_START_ENDED,counting_down_start_ended_on).off,
    emitter_6: useMittOn.on(MITT_KEY.EMIT_BET_ODD_SYNCHRONIZE,bet_odd_synchronize_handle).off,
    emitter_7: useMittOn.on(MITT_KEY.EMIT_MATCH_LIST_SCROLLING,match_list_scroll_handle).off,
    emitter_8: useMittOn.on(MITT_KEY.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE,secondary_play_unfold_change_handle).off,
    emitter_9: useMittOn.on(MITT_KEY.EMIT_TAB_HOT_CHANGING,tab_changing_handle).off,
  }
}
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x())
}

onActivated(() => {
  enter_time.value = Date.now()
})

onDeactivated(() => {
  destroy_handle();
  matchCtr.value.destroy();
})

onUnmounted(() => {
  destroy_handle();
  matchCtr.value.destroy();
})

</script>
 
<style scoped lang="scss">
  @import "./styles//index.scss";
</style>