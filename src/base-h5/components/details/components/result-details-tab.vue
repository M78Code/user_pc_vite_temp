<!--
 * @Author: Supermark
 * @Date: 2021-02-9 11:35:53
 * @Description: 详情赛果tab区域
-->
<template>
  <div ref='result_details_tab' v-show="tab_item_list.length" class="result-details-tab row items-center" v-cloak>
    <!-- 收起icon -->
    <div class="tab-fat">
      <div class="tab-btn" :class="{ collapsed: get_fewer != 2 }" @click="change_btn()"></div>
    </div>
    <!-- 赛果tab区域 -->
    <div class="menu-s row" ref="reset_scroll_dom">
      <div v-for="(tab_item, i) of tab_item_list" :key="i" class="common-style" @click="result_tab(i, tab_item)"
        :class="{ 't_color': item_index == i || i == tab_item_list.length - 1 && item_index == 3 }">
        {{ tab_item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
// import { mapGetters,mapMutations } from "vuex"
import {api_betting, api_analysis} from 'src/api/index.js'
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js"
import { useRouter, useRoute } from "vue-router"
import lodash from "lodash"
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { onMounted, onUnmounted, ref, watch } from "vue"
import { MenuData,SessionStorage,MatchDetailCalss } from "src/output/index.js";
//国际化
import  matchDetail from "src/core/match-detail/match-detail-class.js"
const router = useRouter()
const route = useRoute()

const props = defineProps({
    // 详情Details接口的数据
    result_detail_data: Object,
    tab_index: [Number, String],
  }) 
  // 默认高亮显示第一个
const item_index = ref(0)
const tab_item_list = ref([
    // 所有赛果
    {id:1, text: i18n_t('match_info.all_result')},
    // 精选赛事
    // {id:2, text: i18n_t('match_info.select_event')}
  ])
const list_data = ref([])
const get_fewer = ref(1)
const no_data = ref(false)
  // 监听csid的变化
 watch(() => props.result_detail_data.csid, (n,o) =>{
      // 切换顶部菜单，csid变化，触发tab事件
      result_tab(0, tab_item_list.value[0])
      get_list()
    },
    {deep: true})
watch(() => props.tab_index, (n,o) => {
  if(n!=2){
      result_tab(n, tab_item_list.value[n])
    }
})
let off_ = () => {}
  onMounted(() => {
    // 监听 刷新 注单记录----请求
   let { off: off_ } = useMittOn(MITT_TYPES.EMIT_UPDATE_ORDER_LIST, update_order_list)
  })
  // computed:{
  //   ...mapGetters(["get_fewer","get_menu_type", "get_current_menu", ]),
  //   ...mapGetters({ matchid: "get_goto_detail_matchid" }),
  // },
    // ...mapMutations(['set_fewer','set_note_sheet_records_data']),
  /**
   * 标签数据初始化
   */
const tab_data_init = () => {
    if(MenuData.current_lv_1_menu_i == 28 && [100,101,102,103,104].includes(+props.result_detail_data.csid))  {
      tab_item_list.value =[
        // 所有赛果
        {id:1, text: i18n_t('match_info.all_result')}
      ];
    }else{
      tab_item_list.value =[
      // 所有赛果
      {id:1, text: i18n_t('match_info.all_result')},
      // 精选赛事
      {id:2, text: i18n_t('match_info.select_event')}
    ];

    }
  }
  // 点击高亮显示tab
const result_tab = (index,tab_item) => {
  // TODO: 【待确认】 53185 【UAT】【H5新版复刻】【H5】赛果详情-精选赛事，页面数据不会自动更新
  console.trace('tab_item')
    let search_term =route.query.search_term
    // useMittEmit(MITT_TYPES.EMIT_CHANGE_TAB, true)
    if(item_index.value != index){
      item_index.value = tab_item?.id === 4 ? 3 : index
    }
    if(tab_item && tab_item.id == 3 && [100,101,102,103,104].includes(+props.result_detail_data.csid)){
      index = 2
      item_index.value = 1
    }
    console.log("点击切换tab===");
    if(props.result_detail_data && props.result_detail_data.mid){
      let mid = MatchDetailCalss.get_goto_detail_matchid ||  props.result_detail_data.mid;
      // todo 考虑优化此处代码
 
      // setTimeout(() => {
        router.replace({
        name:'match_result',
        params:{mid, index: item_index.value},
        query: {search_term: search_term}
      });
      // }, 500);
    }
  }
  // 获取订单记录页面接口，判断赛果有没有 订单记录，有则显示在页面
 const get_list = async() => {
    try {
      let params = {
        matchId: route.params.mid,
        timeType: 3,
        orderStatus: '1',
        orderBy: 2,
        }
      let {code , data} = await api_betting.post_getH5OrderList(params)
      useMittEmit(MITT_TYPES.EMIT_RESULT_LIST_LOADING, true)
      
      if(code == 200) {
        tab_data_init()
        if (data && !lodash.isEmpty(data.record)){
          list_data.value = data.record
          matchDetail.set_my_sheet(list_data.value)
          // set_note_sheet_records_data(list_data.value)
          if(Object.keys(list_data.value).length>0) {
            tab_item_list.value.push({
              id:3,
              // 我的注单
              text: i18n_t('match_info.my_bets')
            });
          }

          // 刷新 注单记录----重载页面
          useMittEmit(MITT_TYPES.EMIT_RELOAD_NOTE_SHEET)
        }
      }
    } catch (error) {
      no_data.value = false;
      console.error(error)
      useMittEmit(MITT_TYPES.EMIT_RESULT_LIST_LOADING, false)
      tab_data_init()
    } 
    finally {
      const { configValue, eventSwitch } = lodash.get(UserCtr, 'user_info.merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && lodash.get(props.result_detail_data, 'csid') == 1) {
        get_football_replay(0)
      }
    }
  }
  /**
   * 获取精彩回放事件
   * @param {String} event_code 事件code
   */
const get_football_replay = (event_code) => {
    const params = {
      mid: lodash.get(props.result_detail_data, 'mid'),
      device: 'H5',
      eventCode: event_code
    }
    api_analysis.post_playback_video_url(params)
        .then(res => {
          
          if (res.code == 200 && lodash.get(res.data, 'eventList.length')) {
            // 足球类型赛果需添加精彩回放菜单
            tab_item_list.value.push({
              id: 4,
              // 精彩回放
              text: i18n_t('highlights.title')
            });
          }
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {

        })
  }
  // 展开收起按钮
const change_btn = () => {
    // 设置vuex变量值,当选中"所有赛果"时才可以点击
    if (item_index.value != 0) return;
    if(get_fewer.value == 1 || get_fewer.value == 3){
        get_fewer.value = 2
        useMittEmit(MITT_TYPES.EMIT_DETAILS_TOGGLE_HANDICAP, 2);
        SessionStorage.set("SET_FEWER", 2)
      }else{
        get_fewer.value = 1
        useMittEmit(MITT_TYPES.EMIT_DETAILS_TOGGLE_HANDICAP, 1);
        SessionStorage.set("SET_FEWER", 1)
      }
  }
  // 刷新 注单记录----请求
const update_order_list = () => {
    if (props.tab_index === 2) {
      get_list()
    }
  }
  
onUnmounted(() => {
  get_fewer.value = 1;
    off_()
  }) 
</script>

<style lang="scss" scoped>
.result-details-tab {
  height: 0.4rem;
  width: 100vw;
  border-bottom: 1px solid var(--q-gb-bd-c-15); //var(--q-gb-bg-c-13);
  background-color: var(--q-gb-bg-c-23);
}

.menu-s {
  width: 3rem;
  line-height: 0.4rem;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  color: var(--q-gb-t-c-18);
}

/*************** 选中的玩法集 *************** -S*/

/*************** 选中的玩法集 *************** -E*/
.tab-fat {
  margin-right: 0.23rem;
  position: relative;

  &:after {
    position: absolute;
    content: ' ';
    display: block;
    width: 1px;
    height: 0.14rem;
    right: 0;
    top: 50%;
    transform: translateY(-0.07rem);
  }
}

.tab-btn {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
  background-image: url($SCSSPROJECTPATH + "/image/svg/tab_up_btn_off.svg");
  &.collapsed{
    background-image: url($SCSSPROJECTPATH + "/image/svg/tab_up_btn.svg");
  }
  background-position: center;
  background-repeat: no-repeat;
  background-size: 0.12rem 0.12rem;
  // transform: rotateZ(180deg);
  // @include webkit(transition, transform 0.3s);

  // &.collapsed {
  //   transform: rotateZ(0);
  //   @include webkit(transition, transform 0.3s);
  // }
}

.menu-third {
  height: 0.4rem;
  line-height: 0.4rem;
  position: relative;
  float: left;
  text-align: center;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.14rem;
    position: absolute;
    top: 0.16rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}

.common-style {
  margin-right: 0.23rem;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  &:last-child {
    margin-right: 0;
  }
}

.common-fat {
  margin-left: 0.23rem;
}

.t_color {
  position: relative;
  font-size: 0.16rem;
  letter-spacing: 0;
  text-align: center;
  font-weight: bold;
  color: var(--q-gb-t-c-18);
  &:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 0.03rem;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0.1rem;
    border-radius: 1.5px;
    background: var(--q-gb-t-c-1);
  }
}
</style>