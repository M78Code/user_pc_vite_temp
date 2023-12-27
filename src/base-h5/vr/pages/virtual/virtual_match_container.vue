<!--
 * @Author: Cronus
 * @Date: 2021-04-30 10:00:33
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
        <!-- <setting :calc_show="false"  :list_type="'match'" v-if="i_list==0"/> -->
        <!--赛马 赛狗 摩托车 泥地摩托车-->
        <div v-if="[1011, 1002, 1010, 1009].includes(+sport_id)" v-show="!collapsed" class="data-item-w-wrapper">
          <div class="data-title-w row justify-between" :class="{show_title:get_is_show_title}">
            <div class="date-number">
            </div>
            <div class="title-i-w row items-center">
              <div>{{i18n_t('virtual_sports.champion')}}</div>
              <div>{{i18n_t('virtual_sports.runner_up')}}</div>
              <div>{{i18n_t('virtual_sports.third_place')}}</div>
            </div>
            <div class="date-number">
            </div>
          </div>

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
              {{(new Date(+match.matchTime)).Format(i18n_t('time4'))}}
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
              {{(new Date(+match.matchTime)).Format(i18n_t('time4'))}}
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

<script>
import data_pager from "src/base-h5/components/common/data-pager.vue"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { lang } from 'src/base-h5/mixin/userctr.js'

// import setting from "src/project/components/common/setting";
const static_serve = window.env.config.static_serve[0];
export default {
  name:'virtual_match_container',
  props:{
    match_list:Array,
    match:Object,
    i_list:Number,
    sport_id:Number|String,
    o_r_v_collapse:String,
  },
  data(){
    return {
      // 图标文件链接前缀
      avatar_prefix:'/client/h5/v1/bw3/svg/team-logo-20210202/',
      collapsed:false,
      home_erroed:false,
      away_erroed:false,
    };
  },
  methods:{
    get_batch_no_by_language(batch_no){
      let lang = `${i18n_t('virtual_sports.date_number_title')}`;
      let r = `${batch_no} ${lang}`;
      if(lang.value == 'vi'){
        r = lang.replace('%s',batch_no);
      }
      return r;
    },
    get_team_icon(is_away){
      let result = '';
      //主队
      if(!is_away){
        if(this.match.homeUrl){
          result = this.get_file_path(this.match.homeUrl);
        }
        else{
          this.home_erroed = true;
          // 获取赛事字母logo
          let match_letter = this.match.t1FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = false;
          }
        }
      }
      //客队
      else{
        if(this.match.awayUrl){
          result = this.get_file_path(this.match.awayUrl);
        }
        else{
          this.away_erroed = true;
          // 获取赛事字母logo
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = false;
          }
        }
      }
      return result;
    },
    team_icon_error(is_away,ev){
      let result = '';
      //主队
      if(!is_away){
        if(!this.home_erroed){
          // 获取赛事字母logo
          this.home_erroed = true;
          let match_letter = this.match.t1FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = `${static_serve}${this.avatar_prefix}${match_letter}.svg`;
          }
        }
      }
      //客队
      else{
        if(!this.away_erroed){
          // 获取赛事字母logo
          this.away_erroed = true;
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = `${static_serve}${this.avatar_prefix}${match_letter}.svg`;
          }
        }
      }
      if(result){
        ev.currentTarget.src = result;
      }

      ev.target.onerror = null
    },
    get_rank_background(rank_i,match){
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
    },
    //获取赛事排行榜
    get_match_rank(match){
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
    },
    get_icon_path_by_type(){
      if([1001].includes(+this.match.sportId)){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-football-icon.svg"})`
      }
      else if(this.match.sportId == 1004){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-basketball-v-icon.svg"})`
      }
      else if(this.match.sportId == 1002){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-greyhound-icon.svg"})`
      }
      else if(this.match.sportId == 1011){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-horserace-icon.svg"})`
      }
      else if(this.match.sportId == 1010){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-moto-icon.svg"})`
      }
      else if(this.match.sportId == 1009){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-moto2-icon.svg"})`
      }
    },
    /**
     * 数据页变化
     */
    data_page_changed($event){
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_RESULT_PAGE_CHANGE, $event);
    }
  },
  computed:{
    // ...mapGetters(['get_lang', 'get_theme']),
    // get_lang(){return 'zh'},
    get_theme(){return 'theme01'},
    stage_result(){
      let result = "";
      // teamGroup 阶段 GROUPS 小组赛  Q16 32强 Q8 16强 Q4 8强 SEMIFINAL 半决赛  FINAL 决赛
      let color_1 = '#FFB001'

      if(this.get_theme.includes('theme01_y0')){
        color_1 = '#569FFD'
      }else if(this.get_theme.includes('theme02_y0')){
        color_1 ='#569FFD'
      }
      if(this.match.teamGroup && !this.match.sportId == '1004'){
        if(this.match.matchDay){
          let m_str = i18n_t('virtual_sports.matchDay');
          let append_space = "&nbsp;&nbsp;"
          if(['zh','tw'].includes(lang.value)){
            append_space = "";
          }
          result = m_str.replace('%s',`<span style="{color:${color_1}">${append_space}${this.match.matchDay}</span>`);
        }
        else{
          let lang_key = `virtual_sports.${this.match.teamGroup}`
          result = `${i18n_t(lang_key)}`;

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
        if(this.match.legOrder){
          let lang_leg_order = i18n_t('virtual_sports.legOrder');
          let append_space = "&nbsp;&nbsp;"
          if(['zh','tw', 'hk'].includes(lang.value)){
            append_space = "";
          }
          let result2 = lang_leg_order.replace('%',`<span style="color:${color_1}">${this.match.legOrder}${append_space}</span>`);
          result += `&nbsp;&nbsp;${result2}`;
        }
      }
      // matchDay 轮次
      else if(this.match.matchDay && !this.match.sportId == '1004'){
        let m_str = i18n_t('virtual_sports.matchDay');
        let append_space = "&nbsp;&nbsp;"
        if(['zh','tw', 'hk'].includes(lang.value)){
          append_space = "";
        }
        result = m_str.replace('%s',`<span style="color: ${color_1}">${append_space}${this.match.matchDay}</span>`);
      }
      // 虚拟篮球显示期数matchesGroupId
      else if(this.match.sportId == '1004'){
        if(lang.value == 'vi'){
          let w = i18n_t('virtual_sports.date_number_title');
          result = w.replace('%s',`&nbsp;<span style="color: ${color_1}">${this.match.batchNo}</span>`);
        }
        else{
          result = `<span style="color: ${color_1};font-family:dinRegular;">
            ${this.match.batchNo}
          </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
        }
      }
      else{
        let language_des = i18n_t('virtual_sports.date_number_title');
        if(language_des.indexOf('%s') > -1){
          result = language_des.replace('%s',`&nbsp;<span style="color: ${color_1}">${this.match.batchNo}</span>`);
        }
        else{
          result = `<span style="color:${color_1};font-family:dinRegular;">
            ${this.match.batchNo}
          </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
        }
      }
      return result;
    },
    // 常规赛时比分
    match_score(){
      return this.match.scoreResult.split(':')
    },
    // 点球比分
    penalty_score() {
      if (this.has_penalty_score) {
        return this.has_penalty_score.split(':')
      }
    },
    // 当前赛事是否存在点球比分
    has_penalty_score() {
      return this.match.penaltyScore
    },
    // 是否是杯赛 0 常规 1 杯赛
    is_cup_match() {
      return +this.match.cupMatch === 1
    },
    get_is_show_title(){
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        let i = this.i_list - 1;
        let prev_match = this.match_list[i];
        flag = prev_match.sportId != this.match.sportId;
      }
      return flag;
    },
    get_is_next_show_league(){
      let flag = false;

      let i = this.i_list + 1;
      let next_match = this.match_list[i];
      if(!next_match){
        flag = true
      }
      else{
        flag = next_match.tournamentNameCode != this.match.tournamentNameCode;
      }
      return flag;
    },
    get_is_show_league(){
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        let i = this.i_list - 1;
        let prev_match = this.match_list[i];
        flag = prev_match.tournamentNameCode != this.match.tournamentNameCode;
      }
      return flag;
    }
  },
  components:{
    'data-pager':data_pager,
    // setting
  },
}
</script>

<style lang="scss" scoped>
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
