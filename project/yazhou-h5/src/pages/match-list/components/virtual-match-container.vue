<!--
 * @Description: 虚拟体育赛狗赛马赛果项
-->
<template>
  <div class="v-match-container">
    <div class="dog-horse">
      <div class="v-m-b-container row"
        :class="{
          show_title:get_is_show_title || get_is_show_league,
          last_of_league:get_is_next_show_league,
          collapsed:collapsed,
        }">
        <div class="league-row row items-center justify-between hairline-border"
          :class="{show_title:get_is_show_title || get_is_show_league}">
          <div class="row items-center">
            <div class="sport-icon row items-center justify-center">
              <div class="inner" :style="{backgroundImage:get_icon_path_by_type()}">
              </div>
            </div>
            <div class="v-league">
             {{match.tournamentName}}
            </div>
          </div>
        </div>
        <!--赛马 赛狗 摩托车 泥地摩托车-->
        <div v-if="[1011, 1002, 1010, 1009].includes(+sport_id)" v-show="!collapsed" class="data-item-w-wrapper">
          <!-- <div class="data-title-w row justify-between" :class="{show_title:get_is_show_title}">
            <div class="date-number">
            </div>
            <div class="title-i-w row items-center">
              <div>{{$root.$t('virtual_sports.champion')}}</div>
              <div>{{$root.$t('virtual_sports.runner_up')}}</div>
              <div>{{$root.$t('virtual_sports.third_place')}}</div>
            </div>
            <div class="date-number">
            </div>
          </div> -->
          <!--数据列表-->
          <div class="data-item-w row justify-between hairline-border" :class="{last:match_list.length - i_list == 1}">
            <div class="date-number">
              {{get_batch_no_by_language(match.batchNo)}}
            </div>
            <div class="title-i-w data row items-center">
              <div v-for="(rank_i,i) of get_match_rank(match)" :key="i"
                :class="get_rank_background(rank_i,match)">
              </div>
            </div>
            <div class="date-number">
              {{(new Date(+match.matchTime)).Format($root.$t('time4'))}}
            </div>
          </div>
        </div>
        <!--虚拟足球-->
        <div v-else-if="[1001,1004].includes(+sport_id)" v-show="!collapsed"
          class="v-football-data">
          <div class="row justify-between">
            <div class="row">
              <img class="team-icon-w" :src="get_team_icon(0)" @error="team_icon_error(0,$event)"  v-if="get_team_icon(0)"/>
              <!--雪碧图-->
              <div
                v-else
                class="team-icon-w" v-img="([lodash.get(match,'homeUrl'), lodash.get(match,'t1FirstWd'),lodash.get(match,'csid')])"
              />
              <div class="team-title">{{match.homeName}}</div>
            </div>
            <div class="row t-score"
              :class="[
              {
                winner:(match_score[0] - match_score[1]) > 0,
                't-penalty-score': is_cup_match
              },
              is_cup_match ? 'justify-between' : 'justify-center'
          ]">
              <span>{{match_score[0]}}</span>
              <span
                  v-if="is_cup_match"
                  class="penalty-border hairline-border">
                <i class="icon icon-penalty"></i>
                <span v-if="has_penalty_score">{{penalty_score[0]}}</span>
                <span v-else class="no-penalty-score">-</span>
              </span>
            </div>
          </div>
          <div class="row away justify-between">
            <div class="row">
              <img class="team-icon-w" :src="get_team_icon(1)" @error="team_icon_error(1,$event)" v-if="get_team_icon(1)"/>
              <!--雪碧图-->
              <div
                v-else
                class="team-icon-w" v-img="([lodash.get(match,'awayUrl'), lodash.get(match,'t2FirstWd'),lodash.get(match,'csid')])"
              />
              <div class="team-title">{{match.awayName}}</div>
            </div>
            <div class="row t-score"
              :class="[
              {
                winner:(match_score[1] - match_score[0]) > 0,
                't-penalty-score': is_cup_match
              },
              is_cup_match ? 'justify-between' : 'justify-center'
          ]">
              <span>{{match_score[1]}}</span>
              <span
                  v-if="is_cup_match"
                  class="penalty-border hairline-border">
                <i class="icon icon-penalty"></i>
                <span v-if="has_penalty_score">{{penalty_score[1]}}</span>
                <span v-else class="no-penalty-score">-</span>
              </span>
            </div>
          </div>
          <div class="row justify-between">
            <div class="match-time">
              {{(new Date(+match.matchTime)).Format($root.$t('time4'))}}
            </div>
            <div class="row match-type justify-center"
              v-html="stage_result">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { computed, onUnmounted, ref } from 'vue'
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import data_pager from "src/public/components/common/data_pager.vue"

const store_state = store.getState()
const avatar_prefix = ref('/client/h5/v1/bw3/svg/team-logo-20210202/')
const collapsed = ref(false)
const home_erroed = ref(false)
const away_erroed = ref(false)

const get_lang = ref(store_state.get_lang)
const get_theme = ref(store_state.get_theme)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_theme.value = new_state.get_theme
  get_lang.value = new_state.get_lang
})

const stage_result = computed(() => {
  let result = "";
  // teamGroup 阶段 GROUPS 小组赛  Q16 32强 Q8 16强 Q4 8强 SEMIFINAL 半决赛  FINAL 决赛
  let color_1 = '#FFB001'

  if(get_theme.value.includes('theme01_y0')){
    color_1 = '#569FFD'
  }else if(get_theme.includes('theme02_y0')){
    color_1 ='#569FFD'
  }
  if(match.teamGroup && !match.sportId == '1004'){
    if(match.matchDay){
      let m_str = $root.$t('virtual_sports.matchDay');
      let append_space = "&nbsp;&nbsp;"
      if(['zh','tw'].includes(get_lang.value)){
        append_space = "";
      }
      result = m_str.replace('%s',`<span style="{color:${color_1}">${append_space}${match.matchDay}</span>`);
    }
    else{
      let lang_key = `virtual_sports.${match.teamGroup}`
      result = `${$root.$t(lang_key)}`;

      let found_str_list = [];
      let found = result.match(/[0-9]/ig);
      if(found && found.length){
        found.forEach((s,i) => {
          let h_space = '';
          if(i == found.length - 1){
            h_space = '&nbsp;';
          }
          found_str_list.push(`<span style="color:${color_1}">${s}${h_space}</span>`);
        });
        let part2 = result.substring(found.length);
        result = found_str_list.join('') + part2;
      }
    }

    // legOrder 回合
    if(match.legOrder){
      let lang_leg_order = $root.$t('virtual_sports.legOrder');
      let append_space = "&nbsp;&nbsp;"
      if(['zh','tw'].includes(get_lang.value)){
        append_space = "";
      }
      let result2 = lang_leg_order.replace('%',`<span style="color:${color_1}">${match.legOrder}${append_space}</span>`);
      result += `&nbsp;&nbsp;${result2}`;
    }
  }
  // matchDay 轮次
  else if(match.matchDay && !match.sportId == '1004'){
    let m_str = $root.$t('virtual_sports.matchDay');
    let append_space = "&nbsp;&nbsp;"
    if(['zh','tw'].includes(get_lang.value)){
      append_space = "";
    }
    result = m_str.replace('%s',`<span style="color: ${color_1}">${append_space}${match.matchDay}</span>`);
  }
  // 虚拟篮球显示期数matchesGroupId
  else if(match.sportId == '1004'){
    if(get_lang.value == 'vi'){
      let w = $root.$t('virtual_sports.date_number_title');
      result = w.replace('%s',`&nbsp;<span style="color: ${color_1}">${match.batchNo}</span>`);
    }
    else{
      result = `<span style="color: ${color_1};font-family:dinRegular;">
        ${match.batchNo}
      </span>&nbsp;<span>${$root.$t('virtual_sports.date_number_title')}</span>`;
    }
  }
  else{
    let language_des = $root.$t('virtual_sports.date_number_title');
    if(language_des.indexOf('%s') > -1){
      result = language_des.replace('%s',`&nbsp;<span style="color: ${color_1}">${match.batchNo}</span>`);
    }
    else{
      result = `<span style="color:${color_1};font-family:dinRegular;">
        ${match.batchNo}
      </span>&nbsp;<span>${$root.$t('virtual_sports.date_number_title')}</span>`;
    }
  }
  return result;
})

// 常规赛时比分
const match_score = computed(() => match.scoreResult.split(':'))

// 当前赛事是否存在点球比分
const has_penalty_score = computed(() => match.penaltyScore)

// 是否是杯赛 0 常规 1 杯赛
const is_cup_match = computed(() => +match.cupMatch === 1)

// 点球比分
const penalty_score = computed(() => has_penalty_score && has_penalty_score.split(':'))

const get_is_show_title = computed(() => {
  let flag = false;
  if(i_list == 0){
    flag = true;
  }
  else{
    let i = i_list - 1;
    let prev_match = match_list[i];
    flag = prev_match.sportId != match.sportId;
  }
  return flag;
})

const get_is_next_show_league = computed(() => {
  let flag = false;

  let i = i_list + 1;
  let next_match = match_list[i];
  if(!next_match){
    flag = true
  }
  else{
    flag = next_match.tournamentNameCode != match.tournamentNameCode;
  }
  return flag;
})

const get_is_show_league = computed(() => {
  let flag = false;
  if(i_list == 0){
    flag = true;
  }
  else{
    let i = i_list - 1;
    let prev_match = match_list[i];
    flag = prev_match.tournamentNameCode != match.tournamentNameCode;
  }
  return flag;
})

const get_batch_no_by_language = (batch_no) => {
      let lang = `${$root.$t('virtual_sports.date_number_title')}`;
      let r = `${batch_no} ${lang}`;
      if(get_lang.value == 'vi'){
        r = lang.replace('%s',batch_no);
      }
      return r;
}
const get_team_icon = (is_away) => {
  let result = '';
  //主队
  if(!is_away){
    if(match.homeUrl){
      result = get_file_path(match.homeUrl);
    }
    else{
      home_erroed.value = true;
      // 获取赛事字母logo
      let match_letter = match.t1FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = false;
      }
    }
  }
  //客队
  else{
    if(match.awayUrl){
      result = get_file_path(match.awayUrl);
    }
    else{
      away_erroed.value = true;
      // 获取赛事字母logo
      let match_letter = match.t2FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = false;
      }
    }
  }
  return result;
}
const team_icon_error = (is_away,ev) => {
  let result = '';
  //主队
  if(!is_away){
    if(!home_erroed.value){
      // 获取赛事字母logo
      home_erroed.value = true;
      let match_letter = match.t1FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = `${static_serve}${avatar_prefix.value}${match_letter}.svg`;
      }
    }
  }
  //客队
  else{
    if(!away_erroed.value){
      // 获取赛事字母logo
      away_erroed.value = true;
      let match_letter = match.t2FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = `${static_serve}${avatar_prefix.value}${match_letter}.svg`;
      }
    }
  }
  if(result){
    ev.currentTarget.src = result;
  }

  ev.target.onerror = null
}
const get_rank_background = (rank_i,match) => {
  let s_type = 'dog';//赛马horse或赛狗dog
  let virtual_sports= ''
  if(match.sportId == 1011){  // 赛马
    s_type = 'horse'
  }
  else if([1002, 1010, 1009].includes(+match.sportId)){ // 赛狗 摩托车 泥地摩托车
    s_type = 'dog'
  } else {
    return null
  }
  if([1010, 1009].includes(+match.sportId)){
    virtual_sports = `motorcycle${rank_i.no}`
  }
  if ([1009].includes(+match.sportId)) {
    virtual_sports = `dirt_motorcycle${rank_i.no}`;
  }
  return `match-${s_type}${rank_i.no} ${virtual_sports}`;
}
//获取赛事排行榜
const get_match_rank = (match) => {
  let result = [];
  if(match.teamsTop){
    result = match.teamsTop.map(team => {
      let m = {
        no:team.split('_')[0],
      };
      return m;
    });
  }
  return result;
}
const get_icon_path_by_type = () => {
  if([1001].includes(+match.sportId)){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-football-icon.svg"})`
  }
  else if(match.sportId == 1004){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-basketball-v-icon.svg"})`
  }
  else if(match.sportId == 1002){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-greyhound-icon.svg"})`
  }
  else if(match.sportId == 1011){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-horserace-icon.svg"})`
  }
  else if(match.sportId == 1010){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-moto-icon.svg"})`
  }
  else if(match.sportId == 1009){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-moto2-icon.svg"})`
  }
}
/**
 * 数据页变化
 */
const data_page_changed = ($event) => {
  $root.$emit(emit_cmd.EMIT_VIRTUAL_RESULT_PAGE_CHANGE,$event);
}

onUnmounted(() => {
  unsubscribe()
})

</script>
 
<style scoped lang="scss">
 .v-match-container {
  width: 100%;
  height: auto;

  .dog-horse {
    width: 100%;
    height: auto;
  }

  .sport-type {
    line-height: 1;
    padding-left: 0.2rem;
    color: var(--q-color-com-fs-color-42);
    width: 100%;
    height: 0.08rem;
    font-size: 0.11rem;
    display: none;

    &.show_title {
      display: flex;
    }
  }

  .v-m-b-container {
    width: 3.61rem;
    margin: 0 auto;

    &.show_title {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
      margin-top: 0.08rem;
    }

    &.collapsed {
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
    }

    &.last_of_league {
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
    }

    .league-row {
      width: 100%;
      height: 0.41rem;
      border-radius: 0.08rem;
      display: none;
      margin: 0 auto;

      &.show_title {
        display: flex;
        margin-bottom: 0.05rem;
      }

      .league-collapse-dir {
        margin-right: 0.04rem;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }

      .sport-icon {
        width: 0.22rem;
        height: 0.22rem;
        margin: 0.01rem 0.07rem 0 0.09rem;

        .inner {
          width: 0.14rem;
          height: 0.14rem;
          background-size: contain;
        }
      }

      .v-league {
        margin-left: 0.08rem;
        font-size: 0.12rem;
        font-weight: 600;
        padding-top: 0.02rem;
      }
    }

    .v-football-data {
      width: 3.61rem;
      height: 0.91rem;
      margin: 0 auto 0.05rem;
      padding: 0.1rem;
      border-width: 1px;
      border-radius: 0.08rem;
      border-style: solid;

      b,
      .row {
        height: 0.18rem;

        .match-time {
          min-width: 0.8rem;
        }

        &.away {
          margin: 0.07rem 0 0.1rem 0;
        }

        .t-score {
          width: 0.59rem;
          font-size: 0.16rem;
          align-items: center;
          &.t-penalty-score {
            width: .75rem;
          }
          span {
            height: .18rem;
            line-height: .2rem;
            &.no-penalty-score {
              color: var(--q-color-com-fs-color-43);
              line-height: .16rem;
            }
          }
        }

        .team-icon-w {
          width: 0.18rem;
          height: 0.18rem;
          margin-right: 0.07rem;
          background-size: cover;
        }

        .team-title {
          font-size: 0.14rem;
        }

        .match-type {
          min-width: 0.59rem;
        }
      }
    }

    .penalty-border {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 .43rem;
      height: .18rem;
      &::after {
        border-radius: .5rem;
      }
      .icon-penalty {
        width: .12rem;
        height: .12rem;
        background:  var(--q-color-com-img-bg-22) no-repeat center / cover;
        margin-right: .04rem;
        span {
          height: .18rem;
          line-height: .2rem;
        }
      }
    }

    .data-title-w {
      flex-wrap: nowrap;
      display: none;

      &.show_title {
        display: flex;
      }
    }

    .data-title-w, .data-item-w {
      width: 100%;
      height: 0.23rem;
      font-size: 0.1rem;

      .title-i-w {
        flex: 1;

        & > div {
          width: 0.52rem;
          line-height: 1;
          text-align: center;
        }
      }

      .date-number {
        &:first-child {
          width: 1.1rem;
          padding-left: 0.13rem;
        }

        &:last-child {
          width: 0.9rem;
          padding-left: 0.14rem;
        }
      }
    }

    .data-item-w-wrapper {
      width: 100%;
    }

    .data-item-w {
      width: 100%;
      height: 0.4rem;
      position: relative;

      .test-line {
        position: absolute;
        top: 0;
        right: 0;
      }

      .date-number {
        line-height: 0.4rem;
        font-size: 0.12rem;
      }

      .title-i-w {
        & > div {
          width: 0.2rem;
          height: 0.2rem;
          margin: 0 0.16rem;
          border-radius: 0.02rem;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }

    .pager-wrap {
      width: 100%;
      height: 0.31rem;

      .p-w-inner {
        width: auto;
        height: 100%;
        margin: 0 auto;
      }
    }

    .show-more {
      width: 100%;
      height: auto;
      padding-top: 0.08rem;
      background-color: var(--q-color-com-bg-color-40);

      .pager-wrap {
        background-color: var(--q-color-com-bg-color-12);
        border-radius: 0.08rem;
      }
    }
  }

  .v-football {
    width: 100%;
    height: auto;
  }
}
</style>
