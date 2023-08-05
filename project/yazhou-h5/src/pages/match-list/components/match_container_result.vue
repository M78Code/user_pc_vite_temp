<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
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

<script>
  import {mapGetters, mapMutations} from "vuex";
  import formartmixin from 'src/project/mixins/module/formartmixin.js';
  import match_list_mixin from "src/project/mixins/match_list/match_list_mixin";
  import ImageCacheLoad from "src/project/pages/match-list/components/public_cache_image.vue";

  export default {
    name: "match_container_result",
    mixins: [formartmixin, match_list_mixin],
    props: {
      // 当前组件的赛事数据对应列表的赛事
      match_of_list: Object,
      // 赛事处于列表中的下标
      i: Number,
      // 值为6当前为收藏页
      menu_type: Number | String,
      // 赛事列表相关操作的类型封装对象
      matchCtr: Object,
      //
      main_source:String,

    },
    data() {
      return {
        // 当前组件是否第一次创建
        is_first_coming:false,
      }
    },
    created(){

      this.is_first_coming = true;
      //防止赛事列表初始显示时大面积红升绿降
      this.timer_super11 = setTimeout(() => {
        this.is_first_coming = false;
      },1000);
    },
    methods: {
      ...mapMutations([
        'set_collapse_map_match',
        'set_collapse_csid_map',
        'set_collapse_all_ball',
      ]),
      /**
       * 判断是否显示体育类型
       * @param {Object} match 赛事对象
       * @returns {Boolean}
       */
      get_sport_show(i) {
        if (!this.get_current_main_menu.menuType) {
          if (i > 0) {
            let p = this.matchCtr.list[i - 1], c = this.matchCtr.list[i];
            if (p && c) {
              return p.csid !== c.csid;
            }
          } else {
            return true;
          }
        }
      },
      get_num_to_csid(csid) {
      // 从映射中获取球种id与精灵图中图片的位置
      return this.$utils.play_mapping.SPORT_ID_TO_NUMBER_MAPPING[csid];
      },

      /**
       * 获取赛果
       */
      getMatchResult(value) {
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
      },
      is_show_result(){
        let r = false;
        if(this.get_current_menu && this.get_current_menu.main){
          r = this.get_current_menu.main.menuType == 28 && this.main_source != 'detail_match_list' && this.main_source != 'home_hot_page_schedule';
        }
        return r;
      },
      /**
       * @description: 联赛点击事件，折叠或展开联赛赛事
       * @param {Object} match 点击的赛事
       */
      league_l_clicked(){
        if(['detail_match_list','home_hot_page_schedule'].includes(this.main_source)) return;
        let map_collapse = _.cloneDeep(this.get_collapse_map_match) || {};
        // 展开联赛
        let tid = this.match_of_list.tid;
        // 如果是折叠, 则展开赛事
        if(map_collapse[tid] == 1){
          if(!this.match_of_list) return;
          //展开联赛
          map_collapse[this.match_of_list.tid] = 0;
        } else{ //  折叠赛事
          map_collapse[this.match_of_list.tid] = 1
        }
        this.set_collapse_map_match(map_collapse);
        this.$emit('unfold_changed',this.match_of_list);
      },

      /**
       * 包装获取图片路径的方法
       */
      get_file_path_local(path,csid){
        return this.get_file_path(path,csid);
      },



      /**
       * 判断是否显示进行中|未开赛
       * @param {Object} match 赛事对象
       * @returns {Boolean}
       */
      get_m_status_show(i) {
        let result = false;
        if(this.main_source == 'detail_match_list'){
          return false
        }
        //非今日串关不显示
        if(![3,11].includes(+this.menu_type)){
          return result;
        }else if(this.menu_type == 11){
          let third_m_id = _.get(this.get_current_menu,'date_menu.field1');
          //串关今日id为0或'0'
          if(third_m_id !== 0 && third_m_id !== '0'){
            return result;
          }
        }
        let match = this.matchCtr.list[i];
        if(match){
          if(i > 0){
            let prev_match = this.matchCtr.list[i - 1];
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
      },
      /**
       * @description: 判断是否显示联赛
       * @param {Number} i 赛事下标
       * @return {Boolean}
       */
      get_league_show(i) {
        let flag = true;
        let c = null,p = null;
        if (i) {
          p = this.matchCtr.list[i - 1];
          c = this.matchCtr.list[i];
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
        if(this.get_m_status_show(i)){
          flag = true;
        }
        return flag;
      },
      gen_collapse_key(match){
        return match.tid
      },
    },
    computed:{
      ...mapGetters([
        'get_current_menu',
        'get_collapse_map_match',
        'get_collapse_csid_map',
        'get_collapse_all_ball',
        'get_newer_standard_edition',
        'get_theme',
        'get_current_main_menu',
      ]),

      show_newer_edition(){
        return this.get_newer_standard_edition == 1 || this.main_source == 'detail_match_list';
      },
      collapsed(){
        return this.get_collapse_map_match[this.match_of_list.tid];
      },
      /**
       * @description: 当前显示的赛事数据
       * @param {Undefined} Undefined
       * @return {Undefined} Undefined
       */
      match(){
        let result = this.match_of_list
        return result;
      }
    },
    components: {
       ImageCacheLoad
    },
    beforeDestroy(){
      clearTimeout(this.timer_super11);
      this.timer_super11 = null;
    }
  }
</script>

<style lang="scss" scoped>
/* ********赛事容器相关********** -S*/
.match-container {
  width: 100%;
  height: auto;
  position: relative;
  padding: 0 0.07rem;

  .match-inner-container {


    width: 100%;
    background: var(--q-color-com-bg-color-40);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.show-sport {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
  }

  &.started_and_un_started {
    display: block;

    &.match_status_bar {
      margin-top: 0.07rem;
    }
  }

  &.show_un_started {
    display: block;

    .match-indent {
      display: flex;
    }
  }

  .match-odds-container {
    width: 100%;
    display: block;
    position: relative;
    transition: max-height 0.3s;
    overflow: hidden;

    &.collapsed {
      max-height: 0;
    }

    .result-top-border {
      width: 100%;
    }
  }

  &.is_league_tail {
    .match-inner-container {
      box-shadow: var(--q-color-box-shadow-color-4);
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
      overflow: hidden;
    }
  }

  &.is_division_league {
    padding-top: 0.08rem;

    &.started_un_started_next {
      .match-odds-container {
        &:after {
          display: inline;
        }
      }
    }

    .league {
      border-radius: 0.08rem;
      border: 0.5px solid;
    }

    .no-radius {
      border-radius: unset;
    }

    .odd-list-inner.odd {
      border-bottom: none !important;
    }
  }

  &.is_division_sport {
    margin-bottom: 0;

    .match-odds-container {
      &:after {
        display: none;
      }
    }
  }
  &.match_status_bar {
    .league {
      border-radius: 0.09rem 0.09rem 0 0;
      overflow: hidden;
      margin-top: 0.08rem;
    }

    &.is_favorite_list {
      margin-top: 0.05rem;

      .league {
        margin-top: 0.05rem;
      }
    }
  }

  .match-indent {
    width: 100%;
    margin: 0 auto;
  }

  /* **************体育展示********************** -S*/
  .hot_time_change {
    font-weight: bold;
    font-size: 0.14rem;

    padding: 0.1rem 0 0.1rem 0.05rem;
    display: flex;
    justify-content: space-between;

    > span {
      &:nth-child(2) {
        font-weight: normal;
        padding: 0.02rem 0.09rem;
        height: 0.24rem;


        border-radius: 0.115rem;
        box-sizing: border-box;
        font-size: 0.12rem;

        z-index: 110;
      }
    }
  }

  .sport-title {
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 0.1rem;
    height: 0.15rem;
    font-size: 0.11rem;
    .score-inner-span {
      transform: translateY(-3px);
    }
    &.football_text {
      display: flex;
      justify-content: space-between;

    }

    &.hidden_sport {
      display: none !important;
    }

    .icon_match_cup, .icon_notstarted {
      margin-right: 0.1rem;
      font-size: 0.12rem;

      &:before {
        color: var(--q-color-com-fs-color-35);
      }
    }

    .icon_notstarted {
      &:before {
        color: var(--q-color-com-fs-color-36);
      }
    }

    &.menu-type-3 {
      height: 0.25rem;
      border-top: 1px solid var(--q-color-com-border-color-19);
      background-color: var(--q-color-com-bg-color-12);
      font-weight: bold;
      box-shadow: var(--q-color-box-shadow-color-3);
      position: relative;
      z-index: 2;
      padding-left: 0;

      &.not-playing {
        &:before {
          background: var(--q-color-com-bg-color-38);;
        }
      }

      &:before {
        margin-right: 0.1rem;
        display: block;
        content: ' ';
        width: 0.04rem;
        height: 100%;
        background: var(--q-color-com-bg-color-39);
      }
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    border-radius: 0.05rem 0.05rem 0 0;
    color: var(--q-color-com-fs-color-28) !important;
    background-color: var(--q-color-com-bg-color-12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.4rem;

    &.show-sport {
      border-radius: 0.12rem 0.12rem 0 0;
    }

    .league-t-wrap {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .dir {
      margin-right: 0.09rem;

      i {
        display: block;
        font-size: 0.1rem;
        transition: transform 0.3s;

        &.collapse {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .is-hot-icon {
    width: 0.22rem;
    height: 0.22rem;
    background-image: uvar(--q-color-com-img-bg-12);
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .odd-title-wraper {
    width: 100%;
    height: 0.23rem;
    position: relative;
    flex-wrap: nowrap;

    &:before {
      top: 0;
      left: 0;
      position: absolute;
      content: ' ';
      display: block;
      width: 100%;
      height: 0.01rem;
      background-color: var(--q-color-com-bg-color-41);
      transform: scaleY(0.5);
    }

    .odd-title-i-w {
      width: 1.84rem;
      margin-right: 2%;
      overflow: hidden;

      .odd-t-i-wrapper {
        padding-top: 0.01rem;

        flex-shrink: 0;
        transition: transform 0.2s;

        &.status2 {
          transform: translate3d(-1.84rem, 0, 0);
        }
      }
    }

    .row {
      height: 100%;
    }

    .hpl-title {
      width: 0.6rem;
      height: auto;
      line-height: 1;
      margin-left: 0.01rem;
      font-size: 0.1rem;
      color: var(--q-color-com-fs-color-1);
      flex-shrink: 0;

      &.boxing {
        width: 0.95rem;
      }

      .hpl-t-inner {
        width: auto;
        max-height: 0.23rem;
        text-align: center;
      }

      &:first-child {
        margin-left: 0;
      }
    }

    &:after {
      content: ' ';
      width: 100%;
      height: 1px;
      display: block;
      position: absolute;
      left: 0;
      bottom: -1px;
      background-color: var(--q-color-com-bg-color-42);
    }
  }

  /* **************联赛展示********************** -E*/

  /* **************收藏********************** -S*/
  .fav-icon-wrap {
    width: 0.26rem;
    margin-right: 0.04rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .league-icon-mini {
    width: 0.22rem;
    height: 0.22rem;
    margin: 0.01rem 0.07rem 0 0.09rem;
    position: relative;
    transform: scale(0.85);

    &.league-icon-mini2 {
      --per: -0.32rem;
      background: var(--q-color-com-img-bg-11) no-repeat center / 0.2rem 18.88rem;
      background-position-y: calc(var(--per) * var(--num));
    }

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .league-title-text {
    font-size: 0.12rem;
    height: 0.22rem;
    transform: translateY(0.01rem);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    // width: 2.95rem;
    flex-wrap: nowrap;

    .league-t-wrapper {
      line-height: 1;
      flex-wrap: nowrap;
    }

    .match-league {
      padding-top: 0.02rem;
      max-width: 1.8rem;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .match-type {
      padding-top: 0.02rem;
      margin-right: 0.04rem;
      transition: opacity 0.3s;
      opacity: 1;

      &.collapsed {
        opacity: 0;
      }
    }
  }

  .league-collapse-dir {
    width: 0.12rem;
    height: 0.06rem;
    position: relative;
    left: 0.06rem;

    &.collapsed {
      transform: rotateZ(180deg);
    }
  }

  .odd-list {
    line-height: 1;
    background-color: var(--q-color-com-bg-color-12);
    height: auto;
    position: relative;
    min-height: 1.11rem;

    &.simple {
      min-height: auto;

      .odd-item-wrap-borer-top {
        width: 3.43rem;
        height: 0.01rem;
        transform: scaleY(0.5);
        position: absolute;
        top: 0;
        left: 0.09rem;
      }
    }

    &.result {
      border: 0.5px solid;
      border-radius: 0.08rem;
      margin: 3px 0;
      min-height: auto;

      .odd-item-wrap-borer-top {
        width: 3.43rem;
        height: 0.01rem;
        transform: scaleY(0.5);
        position: absolute;
        top: 0;
        left: 0.09rem;
      }
    }

    .w-score-result {
      position: absolute;
      right: 0.11rem;
      bottom: 0.13rem;

      &.is_result {
        bottom: 0.1rem;
      }
    }

    .odd-list-inner {
      height: 0.2rem;
      width: 100%;
      padding: 0.1rem 2% 0 2%;
      display: flex;
      justify-content: space-between;
      position: relative;
      overflow: hidden;

      .triangle-wrapper {
        width: 0.24rem;
        height: 0.18rem;
        border-radius: 0.1rem 0 0 0.1rem;
        position: absolute;
        right: 0;
        top: 0;

        .t-w-inner {
          font-size: 0.11rem;
        }
      }

      &.n-s-edition {
        padding-top: 0;
        padding-bottom: 0.05rem;

        &:before {
          display: none;
        }
      }

      &.odd {
        &:after {
          width: 100%;
          left: 0;
        }

        &.result {
          padding-top: 0.1rem;
          padding-bottom: 0.1rem;
        }

        .team-wrapper {
          min-height: 100%;
          height: auto;
        }
      }

      .w-score-result {
        padding-top: 0.17rem;
      }

      .team-wrapper2 {
        margin-left: -2%;
        padding-left: 0.3rem;
        display: flex;
        align-items: center;
        font-size: 0.1rem;
      }

      .team-wrapper {
        width: 1.61rem;
        height: auto;
        position: relative;
        z-index: 1;

        &.simple {
          transform: translateY(-1px);
        }

        &.team_title {
          .team-title-inner-con {

          }
        }

        .score-wrapper {
          margin-top: 0.04rem;
          height: 0.3rem;

          .score-section {
            padding-left: 0;
            transform: translateX(-0.02rem);
          }

          .go-container-w {
            .goto-detail {
              display: flex;
              height: auto;
              align-items: center;
              transform: translateY(0.01rem);

              .count_span {
                height: 0.11rem;
                display: flex;
                align-items: flex-end;
                margin-right: 0.04rem;
                line-height: 1;

                &.esports {
                  color: var(--q-color-com-fs-color-26);
                }
              }

              .icon_arrow_down {
                width: 0.04rem;
                height: 0.07rem;
                display: block;
              }
            }

            &.new-standard {
              .live-i-b-wrap {
                width: 0.14rem;
                margin-right: 0.1rem;

                .live-icon-btn {
                  width: 100%;
                  display: none;
                }
              }
            }

            .fav-i-wrap-match {
              width: 0.34rem;
              height: 0.34rem;
              margin-left: -0.07rem;
              flex-shrink: 0;
              transform: translateY(0.01rem);

              .favorite-icon {
                width: 0.14rem;
                height: 0.14rem;
                transform: translateY(-0.01rem);

                img {
                  width: 100%;
                  height: 100%;
                }

                .f-icon {
                  display: none;
                }
              }
            }
          }

          .week-mcid {
            margin: 0 0 0 0.09rem;

            span {
              height: 0.12rem;
              line-height: 1;
            }
          }
        }

        .team-title-container {
          height: 0.31rem;
          display: flex;
          justify-content: space-between;
          position: relative;

          &.simple {
            width: 1.72rem;

            &:first-child {
              margin-bottom: -0.04rem !important;
            }
          }

          .visibility-hidden {
            visibility: hidden;
          }

          &:first-child {
            &.standard {
              margin-bottom: 0.02rem;
            }
          }

          .team-title-inner-con {
            width: 3.51rem;
            position: absolute;
            line-height: 0.14rem;
            display: flex;
            align-items: center;

            .name {
              width: 1.4rem;
              font-size: 0.12rem;
            }

            /*图标*/
            .icon-style {
              margin-left: 0.05rem;
            }

            .team-icon {
              margin-top: -0.02rem;
              width: 0.18rem;
              height: 0.18rem;
              margin-right: 0.06rem;
              flex-shrink: 0;
              justify-content: center;

              margin,
              &.logo-is-double {
                width: 0.28rem;
              }

              img, .sprite-div {
                display: block;
                width: 0.18rem;
                flex-shrink: 0;
                height: 0.18rem;

                &.is-double-first {
                  width: 0.18rem;
                  transform: translateX(0.04rem);
                }

                &.is-double-second {
                  width: 0.18rem;
                  transform: translateX(-0.04rem);
                }
              }
            }

            .gif-text {
              white-space: nowrap;
              margin-left: 3px;
              color: var(--q-color-com-fs-color-31);
              animation: 1s text-flash linear infinite normal;
            }

            .team-t-title-w {

              font-size: 0.12rem;


              line-height: 1.2;

              &.is-handicap {
                font-weight: bold;
              }
            }
          }

          .score-punish {
            width: 0.12rem;
            height: 0.14rem;
            color: var(--q-color-com-fs-color-8);
            flex-shrink: 0;
            background: var(--q-color-com-bg-color-43);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.1rem;
            border-radius: 0.02rem;
            margin-left: 0.04rem;

            &.yellow {
              background: var(--q-color-com-bg-color-23);
            }

            &.flash {
              animation: 1s text-flash linear infinite normal;
            }
          }

          .serving-party {
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: var(--q-color-page-bg-color-59) !important;
            flex-shrink: 0;
            margin: 0.13rem 0.05rem 0;

            &.simple {
              margin-right: 0.03rem;
            }
          }

          .score {
            height: 0.3rem;
            font-size: 0.14rem;
            display: flex;
            align-items: center;
            position: absolute;
            right: 0.12rem;
            top: 0;

            &.simple {
              right: 0.08rem;
            }
          }
        }

        &.is_match_end {
          height: 0.75rem;
        }

        .result.fav-i-wrap-match {
          width: 0.2rem;
          height: 0.2rem;
          flex-shrink: 0;
          margin: 0.05rem 0 0 0.02rem;

          .favorite-icon {
            width: 0.14rem;
            height: 0.14rem;
            transform: translateY(-0.01rem);

            img {
              width: 100%;
              height: 100%;
            }

            .f-icon {
              display: none;
            }
          }
        }

        .m-result-time {
          min-width: 0.8rem;
          margin-top: 0.08rem;
          padding-left: 0.03rem;
        }
      }

      &.odd {
        height: auto;
      }

      .match-result-score-wrap {
        padding-top: 0.07rem;
      }

      .score-result-wrapper {
        font-size: 0.16rem;

        .score-row {
          height: 0.16rem;

          &:first-child {
            margin-bottom: 0.15rem;
          }
        }
      }

      .go-to-d-detail-w {
        font-size: 0.14rem;
        margin-left: 0.16rem;

        .go-to-i-detail-i {
          width: 0.68rem;
          height: 0.47rem;

          .word {
            margin-right: 0.08rem;
            font-size: 0.12rem;
          }

          .go-to-d-icon {
            width: 0.05rem;
            height: 0.08rem;
            display: block;
            color: var(--q-color-com-fs-color-29);
          }
        }
      }
    }
  }

  /* **************收藏********************** -E*/

  /* **************日期********************** -S*/
  .date-container {
    background-color: var(--q-color-com-bg-color-12);
    width: 100%;
    padding: 0 0.08rem;
    height: 0.34rem;
    display: flex;
    align-items: center;
    margin: 0 auto;
    font-size: 0.12rem;
    justify-content: space-between;

    &.simple {
      height: 0.34rem;
    }

    &.n-s-edition {
      padding-top: 0.03rem;
      height: 0.31rem;
      position: relative;

      &:before {
        top: 0;
        left: 0;
        position: absolute;
        content: ' ';
        display: block;
        width: 100%;
        height: 0.01rem;
        background-color: var(--q-color-com-bg-color-41);
        transform: scaleY(0.5);
      }
    }

    .score-wrapper {
      width: auto;
      font-size: 0.12rem;
      color: var(--q-color-com-fs-color-11);
      line-height: 1;
      white-space: nowrap;
      height: 100%;
      flex-wrap: nowrap;
    }

    .go-container-w {
      width: auto;
      margin-left: 0.06rem;
      height: 100%;
      justify-content: flex-end;
      align-items: center;

      &.favorite {
        width: 0.24rem;
        height: 0.24rem;
        justify-content: center;
        align-items: center;
        margin-left: 0;
      }

      &.no-margin {
        margin-left: 0;
      }

      &.mcount {
        margin-left: 0.08rem;
      }

      .fav-i-wrap-match {
        height: 0.16rem;

        .favorite-icon {
          height: 100%;

          img {
            width: 0.14rem;
            height: 0.14rem;
          }
        }
      }

      .goto-detail {
        .count_span {
          .mc-n {
            width: 0.14rem;
          }
        }
      }
    }

    &.match-indent {
      padding-left: 0;
      position: relative;
    }

    .live-i-b-wrap {
      height: 100%;
      width: auto;
      display: flex;

      .live-icon-btn {
        width: 0.18rem;
        height: 0.14rem;
        margin-left: 0.08rem;
      }
    }

    .l {
      display: flex;
      line-height: 1;
      align-items: center;
      flex-shrink: 0;

      .date-time {
        white-space: nowrap;
        color: var(--q-color-com-fs-color-37);
      }

      .week-mcid {
        margin: 0 -0.02rem 0 0.09rem;

        span {
          height: 0.12rem;
          line-height: 1;
        }
      }
    }
  }

  /* **************日期********************** -E*/
}

/* ********赛事容器相关********** -E*/
.play_name {
  color: var(--q-color-com-fs-color-29);

  max-width: 2rem;
  text-align: right;
}

.result_style {
  margin-left: 0.05rem;
}
</style>


