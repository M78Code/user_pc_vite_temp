<!--
 * @Description: 废弃 改文件目前未使用   赛事组件，目前只用于赛果冠军
-->
<template>
   <div class="match-container"
    :style="{marginTop: main_source == 'home_hot_page_schedule'?'0':''}"
    :class='{
      first:i == 0,
      match_status_bar:get_m_status_show(i),
      is_favorite_list:menu_type == 6,
      is_league_tail:get_league_show(i + 1),
      is_division_league:get_league_show(i),
      started_un_started_next:get_m_status_show(i+1),
      started_and_un_started:get_m_status_show(i),
      }'
    >
     <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
     <div class="sport-title match-indent football_text" v-if="get_sport_show(i)" @click="ball_folding_click(match_of_list.csid)">
       <span class="score-inner-span">
         {{match_of_list.csna || menu_lv2.name}}
       </span>
     </div>
    <div class="match-inner-container">
      <!--联赛 -->
      <div class="league match-indent" v-if='get_league_show(i)' @click="league_l_clicked()">
        <div class="league-t-wrap">
           <!--图标 -->
          <div class="league-icon-mini league-icon-mini2" :style="{'--num': get_num_to_csid(match_of_list.sportId)}"></div>
           <!--球种名字 -->
          <span class="league-title-text row justify-between">
            <span class="flex items-center league-t-wrapper">
              <span class="match-league"> {{match_of_list.tn}} </span>
            </span>
          </span>
          <!--箭头 -->
          <template v-if="!['detail_match_list','home_hot_page_schedule'].includes(main_source)">
            <img class="league-collapse-dir" :class="{'collapsed':collapsed}"  :src="compute_img('icon-collapse')" />
          </template>
        </div>
      </div>

      <!--内容 -->
      <div :class="{'collapsed':collapsed}"
          class="match-odds-container study_height_s" v-show="!collapsed">
        <!-- 盘口 -->
        <div class="odd-list match-indent" :class="{'simple':show_newer_edition,result:is_show_result()}">
          <div class="odd-item-wrap-borer-top"> </div>
          <div class="odd-list-inner odd" :class="{ 'n-s-edition':!show_newer_edition, result:is_show_result() }">
            <div class="team-wrapper" :class="{ simple:standard_edition == 1, team_title:is_show_result()}">
              <div :class="['team-title-container', { simple:show_newer_edition, standard:!show_newer_edition && !is_show_result(), result:is_show_result() }]">
                <div class="team-title-inner-con">
                  <div class="team-icon row no-wrap icon-style">
                     <image-cache-load :csid="+match_of_list.csid" :path="match_of_list.mhlu" type="home" ></image-cache-load>
                  </div>
                  <div class='team-t-title-w ellipsis-2-lines name'> {{ match_of_list.mhn }} </div>
                </div>
              </div>
              <div :class="['team-title-container', { simple:show_newer_edition, standard:!show_newer_edition && !is_show_result(), result:is_show_result() }]">
                <div class="team-title-inner-con">
                  <div class="team-icon row no-wrap icon-style">
                     <image-cache-load :csid="+match_of_list.csid" :path="match_of_list.malu" type="home" ></image-cache-load>
                  </div>
                  <div class='team-t-title-w result_style'> {{ match_of_list.man }} </div>
                </div>
              </div>
              <div class="row" v-if="is_show_result()">
                <!--赛果开赛时间-->
                <div class="m-result-time date-time">
                  <!-- .Format(i18n_t("time4")) -->
                    {{ format_time_zone(+match_of_list.matchTime) }}
                </div>
              </div>
            </div>
            <div class="play_name">{{match_of_list.playName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onUnmounted, onMounted, ref } from "vue"
import store from "src/store-redux/index.js"
import lodash from 'lodash'
import { i18n_t,compute_img} from 'src/core/index.js'
import ImageCacheLoad from "./public-cache-image.vue";
import { league_collapse_icon, league_icon_back } from 'src/base-h5/core/utils/local-image.js'
// import { SPORT_ID_TO_NUMBER_MAPPING } from "src/core/constant/config/play-mapping.js";
import { format_time_zone, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js"
import { menu_type, menu_lv2 } from 'src/base-h5/mixin/menu.js'
import { theme, standard_edition } from 'src/base-h5/mixin/userctr.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

const props = defineProps({
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
  // 页面来源
  main_source:String,
})

const store_state = store.getState()
const timer_super11 = ref(null)
const is_first_coming = ref(false)

const get_collapse_map_match = ref(store_state.get_collapse_map_match)
const get_collapse_csid_map = ref(store_state.get_collapse_csid_map)
const get_collapse_all_ball = ref(store_state.get_collapse_all_ball)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_collapse_csid_map.value = new_state.get_collapse_csid_map
  get_collapse_all_ball.value = new_state.get_collapse_all_ball
}

onMounted(() => {
  console.log(props.match_of_list)
  is_first_coming.value = true;
  //防止赛事列表初始显示时大面积红升绿降
  timer_super11.value = setTimeout(() => {
    is_first_coming.value = false;
  },1000);
})

const prve_match = computed(() => {
  props.i > 0 ? MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[props.i - 1]) : undefined
})
const collapsed = computed(() => get_collapse_map_match[props.match_of_list.tid])
const show_newer_edition = computed(() => standard_edition.value == 1 || props.main_source == 'detail_match_list')

const get_sport_show = (i) => {
  if (!menu_type.value) {
    if (i > 0) {
      if (props.match_of_list && prve_match.value) {
        return props.match_of_list.csid !== prve_match.value.csid;
      }
    } else {
      return true;
    }
  }
}

const get_num_to_csid = (csid) => {
// 从映射中获取球种id与精灵图中图片的位置
  // return SPORT_ID_TO_NUMBER_MAPPING[csid];
}

/**
 * 获取赛果
 */
const getMatchResult = (value) => {
  if(!value) return '';
  value = value.split(',');
  let str = ''
  if(value.length > 1){
    value.forEach((element, index) => {
      str += `[${index+1}] ${element} `
    });
  }else{
  str = value[0];
  }
  return str;
}
const is_show_result = () => {
  let r = false;
  if(menu_type.value){
    r = menu_type.value == 28 && props.main_source != 'detail_match_list' && props.main_source != 'home_hot_page_schedule';
  }
  return r;
}
/**
 * @description: 联赛点击事件，折叠或展开联赛赛事
 * @param {Object} match 点击的赛事
 */
const league_l_clicked = () => {
  if(['detail_match_list','home_hot_page_schedule'].includes(props.main_source)) return;
  let map_collapse = lodash.cloneDeep(get_collapse_map_match) || {};
  // 展开联赛
  let tid = props.match_of_list.tid;
  // 如果是折叠, 则展开赛事
  if(map_collapse[tid] == 1){
    if(!props.match_of_list) return;
    //展开联赛
    map_collapse[props.match_of_list.tid] = 0;
  } else{ //  折叠赛事
    map_collapse[props.match_of_list.tid] = 1
  }
  store.dispatch({ type: 'matchReducer/set_collapse_map_match',  payload: map_collapse })
  $emit('unfold_changed',props.match_of_list);
}

/**
 * 包装获取图片路径的方法
 */
 const get_file_path_local = (path,csid) => {
  return get_file_path(path,csid);
}


/**
 * 判断是否显示进行中|未开赛
 * @param {Object} match 赛事对象
 * @returns {Boolean}
 */
 const get_m_status_show = (i) => {
  let result = false;
  if(props.main_source == 'detail_match_list'){
    return false
  }
  //非今日串关不显示
  if(![3,11].includes(+menu_type.value)){
    return result;
  }else if(+menu_type.value === 11){
    let third_m_id = lodash.get(MenuData.current_menu,'date_menu.field1');
    //串关今日id为0或'0'
    if(third_m_id !== 0 && third_m_id !== '0'){
      return result;
    }
  }
  const match = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
  if(match){
    if(i > 0){
      if([1,110].includes(+props.match_of_list?.ms)){
        result = false;
      }
      else if([1,110].includes(+prve_match.value?.ms)){
        result = true;
      }
    }else if(i == 0 && ![1,110].includes(+props.match_of_list?.ms)){
      result = true;
    }
  }
  return result;
}
/**
 * @description: 判断是否显示联赛
 * @param {Number} i 赛事下标
 * @return {Boolean}
 */
 const get_league_show = (i) => {
  let flag = true;
  if (i) {
    if (props.match_of_list && prve_match.value) {
      if(props.match_of_list.sportId != prve_match.value.sportId){
        flag = true;
      }else{
        flag = false;
      }
    }
  }
  else{
    flag = true;
  }
  if(get_m_status_show(i)){
    flag = true;
  }
  return flag;
}
const gen_collapse_key = (match) =>{
  return match.tid
}

onUnmounted(() => {
  unsubscribe()
  clearTimeout(timer_super11.value);
  timer_super11.value = null;
})

</script>

<style scoped lang="scss">
 @import "../styles/match-container-result";
</style>