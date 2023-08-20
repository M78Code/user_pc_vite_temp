<!--
 * @Description: 赛事组件，目前只用于赛果冠军
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
     <div class="sport-title match-indent football_text"
     v-if="get_sport_show(i)"
     @click="ball_folding_click(match_of_list.csid)"
     >
       <span class="score-inner-span">
         {{match_of_list.csna || get_current_menu.sub.menuName}}
       </span>
     </div>
    <div class="match-inner-container">
      <!--联赛 -->
      <div class="league match-indent" v-if='get_league_show(i)' @click="league_l_clicked()">
        <div class="league-t-wrap">
           <!--图标 -->
          <div
              class="league-icon-mini league-icon-mini2"
              :style="{'--num': get_num_to_csid(match.sportId)}">
          </div>
           <!--球种名字 -->
          <span class="league-title-text row justify-between">
            <span class="flex items-center league-t-wrapper">
              <span class="match-league">
                {{match.sportName}}
              </span>
            </span>
          </span>
          <!--箭头 -->
          <template v-if="!['detail_match_list','home_hot_page_schedule'].includes(main_source)">
            <img class="league-collapse-dir" :class="{'collapsed':collapsed}"
              v-if="get_theme.includes('theme01')"
              src='~public/image/wwwassets/bw3/list/league-collapse-icon.svg' />
            <img class="league-collapse-dir" :class="{'collapsed':collapsed}"
              v-if="get_theme.includes('theme02')"
              src='~public/image/wwwassets/bw3/list/league-collapse-icon-black.svg' />
          </template>
        </div>
      </div>

      <!--内容 -->
      <div :class="{'collapsed':collapsed}"
          class="match-odds-container study_height_s" v-show="!collapsed">
        <!-- 盘口 -->
        <div class="odd-list match-indent"
          :class="{'simple':show_newer_edition,result:is_show_result()}">
          <div class="odd-item-wrap-borer-top">
          </div>
          <div class="odd-list-inner odd" :class="{
              'n-s-edition':!show_newer_edition,
              result:is_show_result()
            }">
            <div class="team-wrapper"
                :class="{
                  simple:get_newer_standard_edition == 1,
                  team_title:is_show_result()}">
              <div class='team-title-container'
                :class="{
                  simple:show_newer_edition,
                  standard:!show_newer_edition && !is_show_result(),
                  result:is_show_result()
                  }">
                <div class="team-title-inner-con">
                  <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                  <div class="team-icon row no-wrap icon-style">
                     <image-cache-load
                      :csid="+match.sportId"
                      :path="match.picUrl"
                      type="home"
                    ></image-cache-load>
                  </div>
                  <div class='team-t-title-w ellipsis-2-lines name' :class="{
                      'is-handicap':match.handicap_index == 1,
                      'is-handicap-1':match.handicap_index == 2,
                      }">
                    {{ match.tournamentName }}
                  </div>
                </div>
              </div>
              <div class='team-title-container'
                :class="{
                  simple:show_newer_edition,
                  standard:!show_newer_edition && !is_show_result(),
                  result:is_show_result()
                }"
                >
                <div class="team-title-inner-con">
                  <div class='team-t-title-w result_style' :class="{
                      'is-handicap':match.handicap_index == 2,
                      'is-handicap-1':match.handicap_index == 1,
                      }">
                    {{ getMatchResult(match.scoreResult) }}
                  </div>
                </div>
              </div>
              <div class="row" v-if="is_show_result()">
                <!--赛果开赛时间-->
                <div class="m-result-time date-time">
                    {{ format_time_zone(+match.matchTime).Format($root.$t("time4")) }}
                </div>
              </div>
            </div>
            <div class="play_name">{{match.playName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onUnmounted, onMounted } from "vue"
import store from "src/store-redux/index.js"
import lodash from 'lodash'
import ImageCacheLoad from "./public-cache-image.vue";

const props = defineProps({
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
  // 值为6当前为收藏页
  menu_type: Number | String,
  // 赛事列表相关操作的类型封装对象
  matchCtr: Object,
  //
  main_source:String,
})

const store_state = store.getState()
const timer_super11 = ref(null)
const is_first_coming = ref(false)

const get_current_menu = ref(store_state.get_current_menu)
const get_collapse_map_match = ref(store_state.get_collapse_map_match)
const get_collapse_csid_map = ref(store_state.get_collapse_csid_map)
const get_collapse_all_ball = ref(store_state.get_collapse_all_ball)
const get_newer_standard_edition = ref(store_state.get_newer_standard_edition)
const get_theme = ref(store_state.get_theme)
const get_current_main_menu = ref(store_state.get_current_main_menu)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_current_menu.value = new_state.get_current_menu
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_collapse_csid_map.value = new_state.get_collapse_csid_map
  get_collapse_all_ball.value = new_state.get_collapse_all_ball
  get_newer_standard_edition.value = new_state.get_newer_standard_edition
  get_theme.value = new_state.get_theme
  get_current_main_menu.value = get_current_main_menu.get_theme
}

// TODO: 其他模块得 store  待添加
// mixins: [formartmixin, odd_convert, bettings, match_list_mixin,msc, common],

onMounted(() => {
  is_first_coming.value = true;
  //防止赛事列表初始显示时大面积红升绿降
  timer_super11.value = setTimeout(() => {
    is_first_coming.value = false;
  },1000);
})

// 当前显示的赛事数据
const match = computed(() => props.match_of_list)
const collapsed = computed(() => get_collapse_map_match[props.match_of_list.tid])
const show_newer_edition = computed(() => get_newer_standard_edition == 1 || props.main_source == 'detail_match_list')

const get_sport_show = (i) => {
  if (!get_current_main_menu.menuType) {
    if (i > 0) {
      let p = props.matchCtr.list[i - 1], c = props.matchCtr.list[i];
      if (p && c) {
        return p.csid !== c.csid;
      }
    } else {
      return true;
    }
  }
}
const get_num_to_csid = (csid) => {
// 从映射中获取球种id与精灵图中图片的位置
return $utils.play_mapping.SPORT_ID_TO_NUMBER_MAPPING[csid];
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
  if(get_current_menu && get_current_menu.main){
    r = get_current_menu.main.menuType == 28 && props.main_source != 'detail_match_list' && props.main_source != 'home_hot_page_schedule';
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
  if(![3,11].includes(+props.menu_type)){
    return result;
  }else if(props.menu_type == 11){
    let third_m_id = lodash.get(get_current_menu,'date_menu.field1');
    //串关今日id为0或'0'
    if(third_m_id !== 0 && third_m_id !== '0'){
      return result;
    }
  }
  let match = props.matchCtr.list[i];
  if(match){
    if(i > 0){
      let prev_match = props.matchCtr.list[i - 1];
      if([1,110].includes(+match.ms)){
        result = false;
      }
      else if([1,110].includes(+prev_match.ms)){
        result = true;
      }
    }else if(i == 0 && ![1,110].includes(+match.ms)){
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
  let c = null,p = null;
  if (i) {
    p = props.matchCtr.list[i - 1];
    c = props.matchCtr.list[i];
    if (p && c) {
      if(p.sportId != c.sportId){
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