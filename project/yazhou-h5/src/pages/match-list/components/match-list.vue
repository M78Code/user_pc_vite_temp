<!--
 * @Description: 赛事列表组件，共用于搜索结果、旧版收藏页、赛事列表页展示赛事列表
-->

<template>
  <div class="refresh-container">
    <!--列表页 -->
    <scroll-wrapper ref="scroll_wrapper" 
      :data_source="matchCtr.list" 
      :main_source="source" 
      :is_goto_top_random="is_goto_top_random"
      :match_list_wrapper_height="match_list_wrapper_height"
      :class="{'data-get-empty':data_get_empty}">
      <template v-slot="{ match_item, index}">
        <!--虚拟体育(赛果)-->
        <v-match-container :match="match_item"
          :i_list="index"
          :match_list="matchCtr.list"
          :sport_id="match_item.sportId"
          v-if="match_item && [1001,1002,1004,1011,1010,1009].includes(+match_item?.sportId)">
        </v-match-container>
        <div class="data_mid" v-else> <!--此data-mid用于分频订阅赛事,请勿修改-->
          <!--真实体育赛果 -->
          <match-container-result
            v-if="match_item && menu_type ==28 && 100 == get_curr_sub_menu_type"
            :match_of_list="match_item"
            :matchCtr="matchCtr"
            :i="index"
            :menu_type="menu_type"
            :main_source="source"
            @unfold_changed="unfold_changed_handle"
            @toggle_collect_league="toggle_collect"
            @toggle_collect_match="toggle_collect"
          />
          <!--真实体育玩法 -->
          <match-container
            v-if="match_item && (lodash.get(MenuData.current_menu, 'main.menuType') == 28 ||
            !is_champion && match_item?.ms != 3 ) && !(menu_type ==28 && 100 == get_curr_sub_menu_type)"
            :match_of_list="match_item"
            :i="index"
            :menu_type="menu_type"
            :main_source="source"
            @unfold_changed="unfold_changed_handle"
            @toggle_collect_league="toggle_collect"
            @toggle_collect_match="toggle_collect">
          </match-container>
          <!--冠军玩法-->
          <match-container-champion
            :match_of_list="match_item"
            :matchCtr="matchCtr"
            :i="index"
            :menu_type="menu_type"
            @toggle_collect_league="toggle_collect"
            v-if="match_item && is_champion">
          </match-container-champion>
        </div>
      </template>
    </scroll-wrapper>

    <!-- 次要玩法描述 -->
    <div class="pg-wrapper" v-show="other_way_info_show" @click="close_other_w_info" ref="other_way_info">
      <div class="other-way-info-wrapper"  :class="arr_top_down" :style="{left:`${other_way_style.left}px`,top:`${other_way_style.top}px`}">
        <div class="row justify-between info-head">
          <div class="o-title">
            {{current_way_name}}
          </div>
          <img class='close-o-info-icon' @click="close_other_w_info"
            :src="(`/public/image/menu/set_close_${get_theme && get_theme.includes('day')?'theme01':'theme02'}.svg`)" />
        </div>

          <!-- 次要玩法如果是数组 例如15分钟展开 -->
          <div v-if="Array.isArray(play_way_info)">
            <template v-if="!(show_Xth_title && index === 5)">
              <div class="s-table"  v-for="(item,index) in play_way_info" :key="index" >
                <template v-if="item.title =='5min-icon'">
                  <div class="wrap-box yb-flex-center">
                    <div :class="['item-icon',`item-icon-${index}`]" v-for="index in 4" :key="`${index}_before`"></div>
                    <div class="item-content">{{item.content}}</div>
                    <div :class="['item-icon',`item-icon-${index}`]" v-for="index in [4,3,2,1]" :key="`${index}_after`"></div>
                  </div>
                </template>
                <template v-else>
                  <div v-if="show_15min_data">
                    <div>{{show_Xth_title && index === 4 ? item.Xth_title : item.title}}</div>
                    <div>{{item.content}}</div>
                  </div>
                  <div v-else>
                    <div :class="{'full-width': index > 3}">{{show_Xth_title && index === 4 ? item.Xth_title : item.title}}</div>
                    <div v-if="index < 4">{{item.content}}</div>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <div v-else v-html="play_way_info" />
      </div>
    </div>

    <no-data class="data-get-empty1" v-if='data_get_empty && !get_show_favorite_list' which='noMatch' height='400'></no-data>
    <no-data class="data-get-empty2" v-if='data_get_empty && get_show_favorite_list' :which='menu_type === 28 ? "noMatch" : "collect"' height='400'></no-data>

  </div>
</template>
 
<script setup>
import { ref, computed, onActivated, onDeactivated, onMounted, onUnmounted, watch, nextTick } from "vue";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { i18n_t} from 'src/core/index.js'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { utils } from 'src/core/index.js'
import {add_or_cancel_tournament, add_or_cancel_match} from 'src/api/module/common/index.js';
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import matchContainer from "./match-container.vue";  // 赛事组件，用于赛事列表展示赛事信息
import vMatchContainer from "./virtual-match-container.vue";  // 虚拟体育赛狗赛马赛果项
import matchContainerChampion from "./match-container-champion.vue";    // 冠军赛事组件，用于赛事列表展示赛事信息
import matchContainerResult from "./match-container-result.vue" // 赛果冠军
import scrollWrapper from 'project_path/src/components/scroll-wraper/scroll-wrapper.vue';    // 滚动操作处理
import noData from "project_path/src/components/common/no-data.vue"; // 无网络展示组件
import UserCtr from 'src/core/user-config/user-ctr.js'
import PageSourceData from "src/core/page-source/page-source.js";
import { MenuData } from "src/core/index.js"
import BaseData from 'src/core/base-data/base-data.js'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";

// import { change_favorite_state } from 'src/core/match-list-h5/composables/match-list-collect.js'
// import matchListCardFold from 'src/core/match-list-h5/match-card/match-list-card-fold.js'
 
const props = defineProps({
  // 赛事列表无数据
  data_get_empty: Boolean, 
  // 6 收藏页, 
  menu_type: Number | String, 
  //处理赛事列表数据的类型封装
  matchCtr:Object,                
  source:String,
  window_scrolly:Number | String,
  match_list_wrapper_height:Number,
})

const emitters = ref({})
const store_state = store.getState();
const timer_super12 = ref(null)
// 默认箭头向上
const arr_top_down = ref('arr-top') 
// 收藏|取消收藏是否请求中
const favorite_loading = ref(false)
// 罚牌 玩法信息展示
const other_way_info_show = ref(false)
const other_way_style = ref({
  left:0,
  top:0,
})
const pre_info_clicked_mid = ref('')
const play_way_info = ref('')
const current_way_name = ref('')
//回到顶部
const is_goto_top_random = ref(0)
// 次要玩法info tips----当前展开的次要玩法tab信息
const curr_play_info = ref({
  // 当前赛事状态，默认为滚球
  ms: 1,
  // 当前展开的次要玩法tab
  menu_id: '',
  show_15min_data:false // 15分钟玩法数据
})
//新手版标准版 1 2
const newer_standard_edition = ref(PageSourceData.newer_standard_edition);

// 投注成功的赛事id
const get_match_id_bet_success = ref(store_state.get_match_id_bet_success)
// 当前主题
const get_theme = ref(store_state.get_theme)
// 滚到顶部
const get_goto_list_top = ref(store_state.get_goto_list_top)
// 显示收藏列表
const get_show_favorite_list = ref(store_state.get_show_favorite_list)
//二级菜单type
const get_curr_sub_menu_type = ref(store_state.get_curr_sub_menu_type)

onMounted(() => {
  timer_super12.value = null;
})

watch(() => other_way_info_show.value, (curr) => {
  useMittEmit(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,curr);
})

watch(() => props.window_scrolly, () => {
  other_way_info_show.value = false;
})
// 投注成功收藏赛事
watch(() => get_match_id_bet_success.value, (curr) => {
  if(curr){
    let id_s = curr.split('-')[0];
    let favorite = curr.split('-')[1];
    let match_id_list = id_s.split(',');
    let found = null;
    match_id_list.forEach(id => {
      for(let i = 0; i < props.matchCtr.list.length;i++){
        let match = props.matchCtr.list[i];
        if(match.mid == id){
          if(favorite == 1 || favorite == 0){
            match.mf = favorite == 1;
          }
          else{
            match.mf = true;
          }
          //如果是冠军玩法,投注成功后收藏赛事同也收藏联赛
          if(is_champion){
            if(favorite == 1 || favorite == 0){
              match.tf = favorite == 1;
            }
            else{
              match.tf = true;
            }
          }
          found = match;
          break;
        }
      }
      if(props.matchCtr.mid_obj[id]){
        if(favorite == 1 || favorite == 0){
          props.matchCtr.mid_obj[id].mf = favorite == 1;
        }
        else{
          props.matchCtr.mid_obj[id].mf = true;
        }
      }

    });
  }
}, { deep: true })
// 回到顶部
watch(() => get_goto_list_top.value, () => {
  is_goto_top_random.value = Math.random();
})

watch(() => newer_standard_edition.value, (newValue) => {
  if (newValue == 1) {
    other_way_info_show.value = false
  }
})

// 当前为冠军或电竞冠军
const is_champion = computed(() => {
  let flag = 100 == props.menu_type || (3000 == props.menu_type && lodash.get(MenuData.current_menu, 'date_menu.menuType') == 100); //电竞冠军
  return flag;
})
// 是否显示无第 {X} 个进球 title----次要玩法tips(5分钟次要玩法)
const show_Xth_title = computed(() => {
  return [1,2,7,10].includes(+curr_play_info.value.ms) && curr_play_info.value.menu_id === 19
})

const tab_changing_handle = () => {
  close_other_w_info();
}
/**
 * 关闭玩法描述
 */
const close_other_w_info = () => {
  other_way_info_show.value = false;
}
/**
 * 玩法信息图标点击
 */
const info_icon_click_h = (e,mid,menu,match) => {
  if(!e){
    other_way_info_show.value = false;
    return;
  }

  // 获取当前赛事状态
  curr_play_info.value = {
    ms: lodash.get(match, 'ms', 1),
    menu_id: menu.id
  }

  current_way_name.value = menu.title;
  let menu_id = menu.id;
  other_way_style.value.left = rem(0.1);
  other_way_style.value.top = e.clientY + rem(.16);
  if(mid != pre_info_clicked_mid.value){
    other_way_info_show.value = true;
  }
  else{
    other_way_info_show.value = !other_way_info_show.value;
  }

  let arr_top_off_set=0; //偏移量  滑动到快底部时 显示不下,向上显示
  let arr_to_down=false; // 默认向上显示
  if([19,17,5].includes(menu_id)){ // 如果是17 15分钟玩法 // 后续可能会加新玩法 所以大判断在前
    // 5分钟
    if (19 == menu_id) {
      arr_top_off_set = 2 // 单位rem
      show_15min_data = false
    }
    // 15分钟
    else if(17==menu_id){
      arr_top_off_set=1.8 // 单位rem
      show_15min_data = true
    }
    // 罚牌
    else if(5==menu_id){
      arr_top_off_set=1.1 // 单位rem
    }

    if(document.body.offsetHeight-e.clientY <rem(arr_top_off_set)+ rem(0.1)){
        // 如果当前点击的位置超过 弹框本身的大小 则变成向上显示
        other_way_style.value.top = e.clientY -rem(.16) -rem(arr_top_off_set);
        arr_to_down=true;
    }
  }
  arr_top_down.value=arr_to_down?'arr-down':'arr-top'; // 箭头向上向下显示 // 赋值给this

  play_way_info.value = i18n_t(`play_way_info.${menu_id}`);
  pre_info_clicked_mid.value = mid;
}
/**
 * 收藏与取消收藏（联赛与赛事）
 * @param {Object} $event {match index type type2}
 * @return {Undefined} Undefined
 */
const toggle_collect = ($event) => {
  if( !utils.judge_collectSwitch(GlobalAccessConfig.get_collectSwitch(),this ) ) return
  if(favorite_loading.value) {
    clearTimeout(timer_super12.value);
    timer_super12.value = setTimeout(() => {
      favorite_loading.value = false;
    },3000);
    return;
  }

  let match = $event.match, index = $event.index,item = $event.type,type2= $event.type2;

  let api, txt, number = 0;
  let params = {
    cuid: UserCtr.user.userId,
  };
  if (item == 'tf') {
    //联赛收藏或取消收藏
    api = add_or_cancel_tournament;
    if (match.tf) {
      txt = i18n_t('common.cancel');//'取消';
    } else {
      txt = i18n_t('collect.betted_title');//'收藏';
    }
    if(type2){  //冠军联赛收藏
      //电竞冠军收藏dota2传非空
      if(props.menu_type == 3000){
        params.dota2 = 1;
        params.tid = match.tid;
      }
      else{
        let mids = []
        lodash.each(props.matchCtr.match_list_data_sources,cur_match=>{
          if(cur_match.tid == match.tid){
            mids.push(cur_match.mid)
          }
        })
        params.mid = mids.join(',');
      }
      params.cf = Number(!match.tf);
    }else{    //其他联赛收藏
      Object.assign(params, {cf: Number(!match.tf), tid: match.tid})
    }
  }
  else
  {
    //赛事收藏或取消收藏
    api = add_or_cancel_match;
    number = 1;
    if (match.mf) {
      txt = i18n_t('common.cancel');//'取消';
    } else {
      txt = i18n_t('collect.betted_title');//'收藏';
    }
    Object.assign(params, {cf: Number(!match.mf), mid: match.mid})
  }

  let changedParam = {
    index: index,
    item: item,
    bool: !match[item],
    number: number,
    sportId: match.csid,
  };
  change_favorite_state(changedParam)

  favorite_loading.value = true;
  api(params).then(res => {
    favorite_loading.value = false;
    if(res.code == 200){
    }
    else if(res.msg){
      store.dispatch({ type: 'matchReducer/set_toast',  payload: { 'txt': res.msg } })
    }
  });
}
/**
 * 折叠状态变化
 */
const unfold_changed_handle = ($event) => {
  // matchListCardFold.unfold_changed_handle($event)
}

onDeactivated(() => {
  utils.del(msc_map);
  clearTimeout(timer_super12.value)
  timer_super12.value = null

  Object.values(emitters.value).map((x) => x())
})

onActivated(() => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INFO_ICON_CLICK, info_icon_click_h).off,
    // emitter_2: useMittOn(MITT_TYPES.EMIT_TAB_HOT_CHANGING, tab_changing_handle).off,
  }
})

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_match_id_bet_success.value = new_state.get_match_id_bet_success
  get_theme.value = new_state.get_theme
  get_goto_list_top.value = new_state.get_goto_list_top
  get_curr_sub_menu_type.value = new_state.get_curr_sub_menu_type
  get_show_favorite_list.value = new_state.get_show_favorite_list
})

onUnmounted(() => {
  unsubscribe()
})

</script>
 
<style scoped lang="scss">
  @import "../styles//match-list";
</style>
